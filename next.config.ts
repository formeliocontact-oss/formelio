import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { withSentryConfig } from '@sentry/nextjs';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
};

// Appliquer les plugins dans l'ordre: nextIntl puis Sentry
export default withSentryConfig(withNextIntl(nextConfig), {
  // Configuration Sentry Webpack Plugin
  silent: true, // Supprime les logs du plugin en build
  org: process.env['SENTRY_ORG'],
  project: process.env['SENTRY_PROJECT'],

  // Automatiquement instrumenter le code
  widenClientFileUpload: true,

  // Configuration des sourcemaps
  sourcemaps: {
    disable: true, // Désactiver les sourcemaps en production
  },
});
