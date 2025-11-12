// app/global-error.tsx
'use client';

import { useEffect } from 'react';
import { ErrorHandler } from '@/lib/errors/error-handler';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    ErrorHandler.handle(error, {
      route: 'global-error',
      action: 'global_error_boundary',
    });
  }, [error]);

  return (
    <html>
      <body>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
            Une erreur critique est survenue
          </h1>
          <p style={{ marginBottom: '24px', color: '#666' }}>
            Nous sommes désolés pour ce désagrément.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '12px 24px',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
