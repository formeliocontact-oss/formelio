// app/not-found.tsx
import { Button } from '@/components/ui/button';
import { FileQuestion, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <article className="text-center space-y-6 max-w-md">
        <div className="inline-flex p-4 rounded-full bg-muted">
          <FileQuestion
            className="h-12 w-12 text-muted-foreground"
            aria-hidden="true"
          />
        </div>

        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <h2 className="text-2xl font-semibold">Page introuvable</h2>
          <p className="text-muted-foreground">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
        </header>

        <nav>
          <Button asChild className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" aria-hidden="true" />
              Retour à l&apos;accueil
            </Link>
          </Button>
        </nav>
      </article>
    </main>
  );
}
