'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from '@/lib/validations/auth';
import { resetPasswordRequest } from '../actions';
import { useSafeAction } from '@/hooks/use-safe-action';

export default function ForgotPasswordPage() {
  const { execute, loading } = useSafeAction({
    showToast: false, // On gère le toast manuellement pour ce cas
    onSuccess: () => {
      toast.success(
        'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.'
      );
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    const formData = new FormData();
    formData.append('email', data.email);

    await execute(resetPasswordRequest, formData);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Mot de passe oublié</CardTitle>
          <CardDescription>
            Entrez votre email pour recevoir un lien de réinitialisation
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                {...register('email')}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Envoi...' : 'Envoyer le lien'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Retour à la{' '}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                connexion
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
