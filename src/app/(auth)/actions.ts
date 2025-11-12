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
