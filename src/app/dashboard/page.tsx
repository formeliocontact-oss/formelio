import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { signout } from '../(auth)/actions';

export default async function DashboardPage() {
  const supabase = await createClient();

  // P0 Rule: Use getUser() not getSession() on server
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Formelio</h1>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <a href="/profile">Mon profil</a>
            </Button>
            <form action={signout}>
              <Button variant="outline" type="submit">
                Se déconnecter
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Tableau de bord</h2>
          <p className="mt-2 text-gray-600">
            Bienvenue sur votre espace Formelio
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Profil utilisateur</CardTitle>
              <CardDescription>Vos informations de compte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Email:
                </span>
                <p className="text-gray-900">{data.user.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  ID Utilisateur:
                </span>
                <p className="font-mono text-sm text-gray-900">
                  {data.user.id}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Créé le:
                </span>
                <p className="text-gray-900">
                  {new Date(data.user.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dossiers</CardTitle>
              <CardDescription>Vos dossiers juridiques</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Aucun dossier pour le moment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Vos documents récents</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Aucun document pour le moment</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
