'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from '@/lib/validations/auth';
import { updateProfile } from '../(auth)/actions';
import { useSafeAction } from '@/hooks/use-safe-action';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const { execute, loading: actionLoading } = useSafeAction({
    showToast: false,
    onSuccess: () => {
      toast.success('Profil mis à jour avec succès');
      reset();
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push('/login');
        return;
      }

      setUserEmail(user.email || '');
      setValue('email', user.email || '');
      setLoading(false);
    }

    loadUser();
  }, [router, setValue]);

  const onSubmit = async (data: UpdateProfileInput) => {
    const formData = new FormData();

    if (data.email) formData.append('email', data.email);
    if (data.currentPassword)
      formData.append('currentPassword', data.currentPassword);
    if (data.newPassword) formData.append('newPassword', data.newPassword);

    await execute(updateProfile, formData);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Formelio</h1>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Retour au tableau de bord
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres du profil</CardTitle>
            <CardDescription>
              Gérez vos informations personnelles et votre sécurité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Section Email */}
              <section className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Email</h3>
                  <p className="text-sm text-muted-foreground">
                    Votre adresse email actuelle : {userEmail}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Nouvelle adresse email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={userEmail}
                    {...register('email')}
                    aria-invalid={errors.email ? 'true' : 'false'}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Un email de confirmation sera envoyé à la nouvelle adresse
                  </p>
                </div>
              </section>

              <Separator />

              {/* Section Mot de passe */}
              <section className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Mot de passe</h3>
                  <p className="text-sm text-muted-foreground">
                    Changez votre mot de passe pour sécuriser votre compte
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    {...register('currentPassword')}
                    aria-invalid={errors.currentPassword ? 'true' : 'false'}
                  />
                  {errors.currentPassword && (
                    <p className="text-sm text-destructive">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    {...register('newPassword')}
                    aria-invalid={errors.newPassword ? 'true' : 'false'}
                  />
                  {errors.newPassword && (
                    <p className="text-sm text-destructive">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">
                    Confirmer le nouveau mot de passe
                  </Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    placeholder="••••••••"
                    {...register('confirmNewPassword')}
                    aria-invalid={errors.confirmNewPassword ? 'true' : 'false'}
                  />
                  {errors.confirmNewPassword && (
                    <p className="text-sm text-destructive">
                      {errors.confirmNewPassword.message}
                    </p>
                  )}
                </div>
              </section>

              <div className="flex justify-end">
                <Button type="submit" disabled={actionLoading}>
                  {actionLoading
                    ? 'Enregistrement...'
                    : 'Enregistrer les modifications'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
