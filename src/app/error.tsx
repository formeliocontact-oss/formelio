// app/error.tsx
'use client';

import { useEffect } from 'react';
import { ErrorHandler } from '@/lib/errors/error-handler';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log l'erreur via notre système centralisé
    ErrorHandler.handle(error, {
      route:
        typeof window !== 'undefined' ? window.location.pathname : undefined,
      action: 'component_render',
    });
  }, [error]);

  const errorInfo = ErrorHandler.handle(error);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/10">
      <Card className="max-w-md w-full p-8 space-y-6">
        {/* Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-destructive/10 shrink-0">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">
              Une erreur est survenue
            </h2>
            <p className="text-sm text-muted-foreground">
              Nous nous excusons pour ce désagrément
            </p>
          </div>
        </div>

        {/* Error message */}
        <div className="p-4 rounded-lg bg-muted/50 border">
          <p className="text-sm">{errorInfo.message}</p>
        </div>

        {/* Error code (dev only) */}
        {process.env.NODE_ENV === 'development' && errorInfo.code && (
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer hover:text-foreground">
              Détails techniques
            </summary>
            <div className="mt-2 p-2 bg-muted rounded font-mono">
              <div>Code: {errorInfo.code}</div>
              <div>Status: {errorInfo.statusCode}</div>
              {error.digest && <div>Digest: {error.digest}</div>}
            </div>
          </details>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={reset} className="flex-1 gap-2">
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/')}
            className="flex-1 gap-2"
          >
            <Home className="h-4 w-4" />
            Accueil
          </Button>
        </div>

        {/* Support info */}
        <p className="text-xs text-center text-muted-foreground">
          Si le problème persiste, contactez-nous à{' '}
          <a
            href="mailto:support@formelio.fr"
            className="underline hover:text-foreground"
          >
            support@formelio.fr
          </a>
        </p>
      </Card>
    </div>
  );
}
