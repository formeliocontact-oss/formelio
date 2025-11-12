import { z } from 'zod';

export const contactFormSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z
    .string()
    .regex(/^0[1-9][0-9]{8}$/, 'Téléphone invalide (format: 0612345678)'),
  profession: z.enum(['expert-comptable', 'avocat', 'notaire', 'autre']),
  problemType: z.enum(['rejected', 'complex', 'question', 'other']),
  message: z.string().min(20, 'Message trop court (minimum 20 caractères)'),
  file: z.instanceof(File).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
