import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { contactFormSchema } from '@/lib/validations/contact';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    // Valider les données
    const validated = contactFormSchema.parse(data);

    // TODO: Intégrer Resend pour email transactionnel
    // TODO: Sauvegarder dans la base de données

    console.log('Contact form submission:', {
      name: `${validated.firstName} ${validated.lastName}`,
      email: validated.email,
      profession: validated.profession,
      problemType: validated.problemType,
    });

    return NextResponse.json({
      success: true,
      message: 'Message envoyé avec succès',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du formulaire' },
      { status: 500 }
    );
  }
}
