// src/lib/validations/auth.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email requis').email('Email invalide'),
  password: z.string().min(8, 'Mot de passe minimum 8 caractères'),
});

export const registerSchema = z
  .object({
    email: z.string().min(1, 'Email requis').email('Email invalide'),
    password: z.string().min(8, 'Mot de passe minimum 8 caractères'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email requis').email('Email invalide'),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Mot de passe minimum 8 caractères'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export const updateProfileSchema = z
  .object({
    email: z.string().min(1, 'Email requis').email('Email invalide').optional(),
    currentPassword: z
      .string()
      .min(8, 'Mot de passe minimum 8 caractères')
      .optional(),
    newPassword: z
      .string()
      .min(8, 'Mot de passe minimum 8 caractères')
      .optional(),
    confirmNewPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // Si newPassword est fourni, currentPassword doit l'être aussi
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      // Si newPassword est fourni, confirmNewPassword doit correspondre
      if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
        return false;
      }
      return true;
    },
    {
      message:
        'Veuillez fournir votre mot de passe actuel et confirmer le nouveau',
      path: ['confirmNewPassword'],
    }
  );

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
