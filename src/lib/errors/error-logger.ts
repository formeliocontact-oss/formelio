// lib/errors/error-logger.ts
import * as Sentry from '@sentry/nextjs';
import { isAppError, isOperationalError } from './error-types';
import type { ErrorContext } from './error-handler';

/**
 * Logger centralisé pour les erreurs
 * - En développement: logs console
 * - En production: envoi vers Sentry
 */
export function logError(error: unknown, context?: ErrorContext): void {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Log console en développement
  if (isDevelopment) {
    console.group('🔴 Error Log');
    console.error('Error:', error);
    if (context) {
      console.info('Context:', context);
    }
    if (error instanceof Error) {
      console.error('Stack:', error.stack);
    }
    console.groupEnd();
    return;
  }

  // Envoi vers Sentry en production
  logToSentry(error, context);
}

/**
 * Envoie l'erreur vers Sentry avec contexte enrichi
 */
function logToSentry(error: unknown, context?: ErrorContext): void {
  Sentry.withScope((scope) => {
    // User context
    if (context?.userId) {
      scope.setUser({ id: context.userId });
    }

    // Tags pour filtrage dans Sentry
    if (context?.organizationId) {
      scope.setTag('organization', context.organizationId);
    }

    if (context?.route) {
      scope.setTag('route', context.route);
    }

    if (context?.action) {
      scope.setTag('action', context.action);
    }

    // Déterminer la sévérité
    const level = getSeverityLevel(error);
    scope.setLevel(level);

    // Metadata additionnelle
    if (context?.metadata) {
      scope.setContext('metadata', context.metadata);
    }

    // Enrichir avec les détails de l'erreur custom
    if (isAppError(error)) {
      scope.setContext('appError', {
        code: error.code,
        statusCode: error.statusCode,
        isOperational: error.isOperational,
        metadata: error.metadata,
      });
    }

    // Capturer l'exception
    Sentry.captureException(error);
  });
}

/**
 * Détermine le niveau de sévérité pour Sentry
 */
function getSeverityLevel(error: unknown): Sentry.SeverityLevel {
  // Erreurs non-opérationnelles = critical (bugs système)
  if (!isOperationalError(error)) {
    return 'fatal';
  }

  // Erreurs opérationnelles selon code HTTP
  if (isAppError(error)) {
    if (error.statusCode >= 500) return 'error';
    if (error.statusCode >= 400) return 'warning';
    return 'info';
  }

  return 'error';
}

/**
 * Log une info (non-erreur) dans Sentry
 */
export function logInfo(
  message: string,
  context?: Record<string, unknown>
): void {
  if (process.env.NODE_ENV === 'development') {
    console.info('ℹ️', message, context);
    return;
  }

  Sentry.captureMessage(message, {
    level: 'info',
    contexts: context ? { info: context } : undefined,
  });
}
