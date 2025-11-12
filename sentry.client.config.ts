// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env['NEXT_PUBLIC_SENTRY_DSN'],

  // Traces sample rate (1.0 = 100% des transactions en dev, réduire en prod)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session Replay
  replaysOnErrorSampleRate: 1.0, // 100% des sessions avec erreurs
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.5,

  // Ignore specific errors
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    'Non-Error promise rejection captured',
    'ChunkLoadError',
  ],

  // Environment
  environment: process.env.NODE_ENV,

  // Release tracking
  release: process.env['NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA'],

  // Debug mode in development
  debug: process.env.NODE_ENV === 'development',

  // Integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})
