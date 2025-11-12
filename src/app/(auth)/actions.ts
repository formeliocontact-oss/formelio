'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { loginSchema } from '@/lib/validations/auth';
import {
  AuthenticationError,
  ValidationError,
  SupabaseError,
} from '@/lib/errors/error-types';

export async function login(formData: FormData) {
  const supabase = await createClient();

  // Validate input with Zod
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    const fields: Record<string, string[]> = {};
    Object.entries(validatedFields.error.flatten().fieldErrors).forEach(
      ([key, value]) => {
        fields[key] = value || [];
      }
    );

    throw new ValidationError('Données invalides', fields);
  }

  const { email, password } = validatedFields.data;

  // Use getUser() not getSession() (P0 rule)
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Map Supabase auth errors to meaningful messages
    if (error.message.includes('Invalid login credentials')) {
      throw new AuthenticationError('Email ou mot de passe incorrect');
    }

    if (error.message.includes('Email not confirmed')) {
      throw new AuthenticationError(
        'Veuillez confirmer votre email avant de vous connecter'
      );
    }

    if (error.message.includes('rate limit')) {
      throw new AuthenticationError(
        'Trop de tentatives. Veuillez réessayer dans quelques minutes.'
      );
    }

    // Generic Supabase error
    throw new SupabaseError(error.message);
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Basic validation
  if (!email || !password) {
    throw new ValidationError('Email et mot de passe requis');
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env['NEXT_PUBLIC_APP_URL']}/auth/confirm`,
    },
  });

  if (error) {
    // Map Supabase signup errors
    if (error.message.includes('already registered')) {
      throw new AuthenticationError('Cet email est déjà utilisé');
    }

    if (error.message.includes('Password should be')) {
      throw new ValidationError(
        'Le mot de passe doit contenir au moins 6 caractères'
      );
    }

    if (error.message.includes('invalid email')) {
      throw new ValidationError("Format d'email invalide");
    }

    throw new SupabaseError(error.message);
  }

  return {
    success:
      'Inscription réussie ! Vérifiez votre email pour confirmer votre compte.',
  };
}

export async function signout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new SupabaseError('Erreur lors de la déconnexion');
  }

  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function resetPasswordRequest(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;

  if (!email) {
    throw new ValidationError('Email requis');
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env['NEXT_PUBLIC_APP_URL']}/reset-password`,
  });

  if (error) {
    // Ne pas révéler si l'email existe ou non (sécurité)
    console.error('Reset password error:', error);
  }

  return {
    success:
      'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.',
  };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const password = formData.get('password') as string;

  if (!password) {
    throw new ValidationError('Mot de passe requis');
  }

  if (password.length < 8) {
    throw new ValidationError('Mot de passe minimum 8 caractères');
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    if (error.message.includes('same as the old password')) {
      throw new ValidationError(
        "Le nouveau mot de passe doit être différent de l'ancien"
      );
    }
    throw new SupabaseError('Erreur lors de la mise à jour du mot de passe');
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;

  // Vérifier que l'utilisateur est connecté
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new AuthenticationError('Vous devez être connecté');
  }

  // Si changement de mot de passe, vérifier l'ancien
  if (newPassword && currentPassword) {
    // Re-authentifier avec le mot de passe actuel
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

    if (signInError) {
      throw new AuthenticationError('Mot de passe actuel incorrect');
    }

    // Mettre à jour le mot de passe
    const { error: passwordError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (passwordError) {
      if (passwordError.message.includes('same as the old password')) {
        throw new ValidationError(
          "Le nouveau mot de passe doit être différent de l'ancien"
        );
      }
      throw new SupabaseError('Erreur lors de la mise à jour du mot de passe');
    }
  }

  // Mettre à jour l'email si fourni
  if (email && email !== user.email) {
    const { error: emailError } = await supabase.auth.updateUser({
      email,
    });

    if (emailError) {
      throw new SupabaseError("Erreur lors de la mise à jour de l'email");
    }

    return {
      success:
        'Profil mis à jour. Un email de confirmation a été envoyé à votre nouvelle adresse.',
    };
  }

  return {
    success: 'Profil mis à jour avec succès',
  };
}
