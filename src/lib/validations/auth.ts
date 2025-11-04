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

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
