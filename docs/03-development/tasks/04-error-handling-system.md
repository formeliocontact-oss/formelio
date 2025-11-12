# COMMON-04 - Error Handling System

**ID**: COMMON-04
**Phase**: 0 (Setup)
**Priority**: P0 (Critique)
**Effort**: 4 heures
**Status**: 🔴 TODO
**Branch**: `feature/phase0-setup`

---

## 📋 Description

Mettre en place un système de gestion d'erreurs centralisé et robuste pour l'ensemble de l'application Formelio. Ce système inclut des error boundaries React, des types d'erreurs custom, un handler centralisé, un logger intégré avec Sentry, et des hooks pour les actions asynchrones. Essentiel pour une plateforme légale où aucune erreur ne doit faire perdre des documents.

---

## 🎯 Objectifs

1. Créer une hiérarchie de types d'erreurs custom et typés
2. Implémenter un error handler centralisé
3. Configurer Sentry pour le monitoring en production
4. Créer des error boundaries Next.js réutilisables
5. Développer un hook `useSafeAction` pour les actions async
6. Documenter les patterns de gestion d'erreurs

---

## ✅ Acceptance Criteria

- [ ] Types d'erreurs custom créés (`error-types.ts`)
- [ ] Error handler centralisé implémenté (`error-handler.ts`)
- [ ] Logger configuré avec Sentry (`error-logger.ts`)
- [ ] Error boundary racine (`app/error.tsx`)
- [ ] Global error boundary (`app/global-error.tsx`)
- [ ] Page 404 custom (`app/not-found.tsx`)
- [ ] Hook `useSafeAction` fonctionnel
- [ ] Toasts d'erreurs intégrés avec Sonner
- [ ] Sentry configuré et testé
- [ ] Documentation des patterns d'erreurs

---

## 🔧 Technical Implementation

### 1. Installation des dépendances

```bash
# Installer Sentry et Sonner (toasts)
npm install @sentry/nextjs sonner

# Configurer Sentry avec le wizard
npx @sentry/wizard@latest -i nextjs
```

### 2. Types d'erreurs custom

Créer `lib/errors/error-types.ts` :

```typescript
// lib/errors/error-types.ts

/**
 * Classe de base pour toutes les erreurs applicatives
 * Permet de distinguer les erreurs opérationnelles des erreurs système
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true,
    public metadata?: Record<string, unknown>
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      metadata: this.metadata,
    }
  }
}

// ============================================================================
// ERREURS D'AUTHENTIFICATION
// ============================================================================

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentification requise') {
    super(message, 'AUTH_REQUIRED', 401)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Accès refusé') {
    super(message, 'FORBIDDEN', 403)
  }
}

export class SessionExpiredError extends AppError {
  constructor() {
    super('Votre session a expiré. Veuillez vous reconnecter.', 'SESSION_EXPIRED', 401)
  }
}

// ============================================================================
// ERREURS DE VALIDATION
// ============================================================================

export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields?: Record<string, string[]>
  ) {
    super(message, 'VALIDATION_ERROR', 400, true, { fields })
  }
}

export class InvalidInputError extends AppError {
  constructor(field: string, reason: string) {
    super(`${field}: ${reason}`, 'INVALID_INPUT', 400)
  }
}

// ============================================================================
// ERREURS SUPABASE
// ============================================================================

export class SupabaseError extends AppError {
  constructor(
    message: string,
    public originalError?: unknown,
    public query?: string
  ) {
    super(message, 'SUPABASE_ERROR', 500, true, { originalError, query })
  }
}

export class DatabaseConnectionError extends AppError {
  constructor() {
    super(
      'Impossible de se connecter à la base de données. Veuillez réessayer.',
      'DB_CONNECTION_ERROR',
      503
    )
  }
}

export class RowLevelSecurityError extends AppError {
  constructor(resource: string) {
    super(
      `Vous n'avez pas les permissions pour accéder à ${resource}.`,
      'RLS_ERROR',
      403
    )
  }
}

// ============================================================================
// ERREURS DE PAIEMENT
// ============================================================================

export class PaymentError extends AppError {
  constructor(
    message: string,
    public stripeErrorCode?: string,
    public stripeErrorType?: string
  ) {
    super(message, 'PAYMENT_ERROR', 402, true, { stripeErrorCode, stripeErrorType })
  }
}

export class PaymentDeclinedError extends PaymentError {
  constructor(reason?: string) {
    super(
      reason ? `Paiement refusé: ${reason}` : 'Votre paiement a été refusé.',
      'card_declined',
      'card_error'
    )
  }
}

export class InsufficientFundsError extends PaymentError {
  constructor() {
    super('Fonds insuffisants sur votre carte.', 'insufficient_funds', 'card_error')
  }
}

// ============================================================================
// ERREURS DE DOCUMENTS
// ============================================================================

export class DocumentError extends AppError {
  constructor(message: string, public documentId?: string) {
    super(message, 'DOCUMENT_ERROR', 500, true, { documentId })
  }
}

export class FileUploadError extends DocumentError {
  constructor(filename: string, reason: string) {
    super(`Échec du téléchargement de ${filename}: ${reason}`)
  }
}

export class FileSizeExceededError extends DocumentError {
  constructor(maxSize: number) {
    super(
      `La taille du fichier dépasse la limite autorisée de ${maxSize / 1024 / 1024}MB.`,
      undefined
    )
  }
}

export class UnsupportedFileTypeError extends DocumentError {
  constructor(fileType: string) {
    super(`Type de fichier non supporté: ${fileType}`)
  }
}

// ============================================================================
// ERREURS RÉSEAU
// ============================================================================

export class NetworkError extends AppError {
  constructor(message: string = 'Erreur réseau. Vérifiez votre connexion.') {
    super(message, 'NETWORK_ERROR', 503)
  }
}

export class TimeoutError extends AppError {
  constructor(operation: string) {
    super(`Délai d'attente dépassé pour: ${operation}`, 'TIMEOUT_ERROR', 504)
  }
}

// ============================================================================
// ERREURS MÉTIER
// ============================================================================

export class CaseNotFoundError extends AppError {
  constructor(caseId: string) {
    super(`Dossier non trouvé: ${caseId}`, 'CASE_NOT_FOUND', 404)
  }
}

export class DuplicateCaseError extends AppError {
  constructor(reference: string) {
    super(`Un dossier avec la référence ${reference} existe déjà.`, 'DUPLICATE_CASE', 409)
  }
}

export class OrganizationQuotaExceededError extends AppError {
  constructor(quota: string) {
    super(
      `Votre quota ${quota} est atteint. Contactez-nous pour augmenter votre limite.`,
      'QUOTA_EXCEEDED',
      429
    )
  }
}

// ============================================================================
// HELPERS
// ============================================================================

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function isOperationalError(error: unknown): boolean {
  if (isAppError(error)) {
    return error.isOperational
  }
  return false
}
```

### 3. Error Handler centralisé

Créer `lib/errors/error-handler.ts` :

```typescript
// lib/errors/error-handler.ts
import {
  AppError,
  isAppError,
  SupabaseError,
  NetworkError,
  AuthenticationError,
  ValidationError,
} from './error-types'
import { logError } from './error-logger'

export interface ErrorContext {
  userId?: string
  organizationId?: string
  route?: string
  action?: string
  metadata?: Record<string, unknown>
}

export interface ErrorResponse {
  message: string
  code: string
  statusCode: number
  fields?: Record<string, string[]>
  metadata?: Record<string, unknown>
}

/**
 * Handler centralisé pour toutes les erreurs de l'application
 * Transforme les erreurs en réponses cohérentes pour l'utilisateur
 */
export class ErrorHandler {
  /**
   * Point d'entrée principal pour gérer une erreur
   */
  static handle(error: unknown, context?: ErrorContext): ErrorResponse {
    // Log l'erreur (Sentry en prod, console en dev)
    logError(error, context)

    // Erreur opérationnelle connue (AppError)
    if (isAppError(error)) {
      return {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        fields: error instanceof ValidationError ? error.fields : undefined,
        metadata: error.metadata,
      }
    }

    // Erreur Supabase
    if (this.isSupabaseError(error)) {
      return this.handleSupabaseError(error)
    }

    // Erreur réseau (fetch failed)
    if (this.isNetworkError(error)) {
      return this.handleNetworkError()
    }

    // Erreur Zod (validation)
    if (this.isZodError(error)) {
      return this.handleZodError(error)
    }

    // Erreur inconnue - ne pas exposer les détails à l'utilisateur
    console.error('🔴 Unexpected error:', error)
    return {
      message: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    }
  }

  /**
   * Gère les erreurs Supabase spécifiques
   */
  private static handleSupabaseError(error: any): ErrorResponse {
    // Mapper les codes PostgreSQL communs
    const postgresErrorMap: Record<string, string> = {
      '23505': 'Cette entrée existe déjà.',
      '23503': 'Élément lié introuvable.',
      '23502': 'Champ obligatoire manquant.',
      '42501': 'Permissions insuffisantes.',
      '42P01': 'Table non trouvée.',
      '08006': 'Connexion à la base de données perdue.',
    }

    // Mapper les codes Supabase/PostgREST
    const supabaseErrorMap: Record<string, string> = {
      'PGRST301': 'Authentification requise.',
      'PGRST204': 'Aucun résultat trouvé.',
      '23514': 'Valeur non autorisée.',
    }

    const code = error.code || error.error_code
    const message =
      postgresErrorMap[code] ||
      supabaseErrorMap[code] ||
      error.message ||
      'Erreur de base de données.'

    // RLS policy violation
    if (code === '42501' || message.includes('policy')) {
      return {
        message: 'Accès refusé à cette ressource.',
        code: 'RLS_ERROR',
        statusCode: 403,
      }
    }

    return {
      message,
      code: 'SUPABASE_ERROR',
      statusCode: 500,
      metadata: {
        hint: error.hint,
        details: error.details,
      },
    }
  }

  /**
   * Gère les erreurs réseau
   */
  private static handleNetworkError(): ErrorResponse {
    return {
      message: 'Erreur réseau. Vérifiez votre connexion internet.',
      code: 'NETWORK_ERROR',
      statusCode: 503,
    }
  }

  /**
   * Gère les erreurs de validation Zod
   */
  private static handleZodError(error: any): ErrorResponse {
    const fields: Record<string, string[]> = {}

    error.errors?.forEach((err: any) => {
      const path = err.path.join('.')
      if (!fields[path]) {
        fields[path] = []
      }
      fields[path].push(err.message)
    })

    return {
      message: 'Données invalides.',
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      fields,
    }
  }

  // ============================================================================
  // TYPE GUARDS
  // ============================================================================

  private static isSupabaseError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      ('code' in error || 'error_code' in error || 'hint' in error)
    )
  }

  private static isNetworkError(error: unknown): boolean {
    if (error instanceof TypeError) {
      return (
        error.message.includes('fetch') ||
        error.message.includes('network') ||
        error.message.includes('Failed to fetch')
      )
    }
    return false
  }

  private static isZodError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'errors' in error &&
      Array.isArray((error as any).errors)
    )
  }
}
```

### 4. Logger avec Sentry

Créer `lib/errors/error-logger.ts` :

```typescript
// lib/errors/error-logger.ts
import * as Sentry from '@sentry/nextjs'
import { isAppError, isOperationalError } from './error-types'
import type { ErrorContext } from './error-handler'

/**
 * Logger centralisé pour les erreurs
 * - En développement: logs console
 * - En production: envoi vers Sentry
 */
export function logError(error: unknown, context?: ErrorContext): void {
  const isDevelopment = process.env.NODE_ENV === 'development'

  // Log console en développement
  if (isDevelopment) {
    console.group('🔴 Error Log')
    console.error('Error:', error)
    if (context) {
      console.info('Context:', context)
    }
    if (error instanceof Error) {
      console.error('Stack:', error.stack)
    }
    console.groupEnd()
    return
  }

  // Envoi vers Sentry en production
  logToSentry(error, context)
}

/**
 * Envoie l'erreur vers Sentry avec contexte enrichi
 */
function logToSentry(error: unknown, context?: ErrorContext): void {
  Sentry.withScope((scope) => {
    // User context
    if (context?.userId) {
      scope.setUser({ id: context.userId })
    }

    // Tags pour filtrage dans Sentry
    if (context?.organizationId) {
      scope.setTag('organization', context.organizationId)
    }

    if (context?.route) {
      scope.setTag('route', context.route)
    }

    if (context?.action) {
      scope.setTag('action', context.action)
    }

    // Déterminer la sévérité
    const level = getSeverityLevel(error)
    scope.setLevel(level)

    // Metadata additionnelle
    if (context?.metadata) {
      scope.setContext('metadata', context.metadata)
    }

    // Enrichir avec les détails de l'erreur custom
    if (isAppError(error)) {
      scope.setContext('appError', {
        code: error.code,
        statusCode: error.statusCode,
        isOperational: error.isOperational,
        metadata: error.metadata,
      })
    }

    // Capturer l'exception
    Sentry.captureException(error)
  })
}

/**
 * Détermine le niveau de sévérité pour Sentry
 */
function getSeverityLevel(error: unknown): Sentry.SeverityLevel {
  // Erreurs non-opérationnelles = critical (bugs système)
  if (!isOperationalError(error)) {
    return 'fatal'
  }

  // Erreurs opérationnelles selon code HTTP
  if (isAppError(error)) {
    if (error.statusCode >= 500) return 'error'
    if (error.statusCode >= 400) return 'warning'
    return 'info'
  }

  return 'error'
}

/**
 * Log une info (non-erreur) dans Sentry
 */
export function logInfo(message: string, context?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'development') {
    console.info('ℹ️', message, context)
    return
  }

  Sentry.captureMessage(message, {
    level: 'info',
    contexts: context ? { info: context } : undefined,
  })
}
```

### 5. Error Boundaries Next.js

Créer `app/error.tsx` :

```typescript
// app/error.tsx
'use client'

import { useEffect } from 'react'
import { ErrorHandler } from '@/lib/errors/error-handler'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log l'erreur via notre système centralisé
    ErrorHandler.handle(error, {
      route: typeof window !== 'undefined' ? window.location.pathname : undefined,
      action: 'component_render',
    })
  }, [error])

  const errorInfo = ErrorHandler.handle(error)

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
          <a href="mailto:support@formelio.fr" className="underline hover:text-foreground">
            support@formelio.fr
          </a>
        </p>
      </Card>
    </div>
  )
}
```

Créer `app/global-error.tsx` :

```typescript
// app/global-error.tsx
'use client'

import { useEffect } from 'react'
import { ErrorHandler } from '@/lib/errors/error-handler'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    ErrorHandler.handle(error, {
      route: 'global-error',
      action: 'global_error_boundary',
    })
  }, [error])

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
  )
}
```

Créer `app/not-found.tsx` :

```typescript
// app/not-found.tsx
import { Button } from '@/components/ui/button'
import { FileQuestion, Home } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="inline-flex p-4 rounded-full bg-muted">
          <FileQuestion className="h-12 w-12 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <h2 className="text-2xl font-semibold">Page introuvable</h2>
          <p className="text-muted-foreground">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <Button asChild className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </Button>
      </div>
    </div>
  )
}
```

### 6. Hook pour actions asynchrones

Créer `hooks/use-safe-action.ts` :

```typescript
// hooks/use-safe-action.ts
'use client'

import { useState, useCallback } from 'react'
import { ErrorHandler } from '@/lib/errors/error-handler'
import { toast } from 'sonner'

interface UseSafeActionOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
  showToast?: boolean
}

/**
 * Hook pour exécuter des actions asynchrones avec gestion d'erreurs automatique
 *
 * @example
 * const { execute, loading, error } = useSafeAction()
 *
 * const handleSubmit = async (data) => {
 *   const result = await execute(createCase, data)
 *   if (result) {
 *     router.push(`/cases/${result.id}`)
 *   }
 * }
 */
export function useSafeAction<T extends (...args: any[]) => Promise<any>>(
  options: UseSafeActionOptions = {}
) {
  const { onSuccess, onError, showToast = true } = options

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(
    async (
      action: T,
      ...args: Parameters<T>
    ): Promise<Awaited<ReturnType<T>> | null> => {
      setLoading(true)
      setError(null)

      try {
        const result = await action(...args)

        if (onSuccess) {
          onSuccess()
        }

        return result
      } catch (err) {
        const errorInfo = ErrorHandler.handle(err as Error, {
          action: action.name || 'anonymous_action',
        })

        setError(errorInfo.message)

        if (showToast) {
          toast.error(errorInfo.message, {
            description: errorInfo.code !== 'INTERNAL_ERROR' ? `Code: ${errorInfo.code}` : undefined,
          })
        }

        if (onError) {
          onError(errorInfo.message)
        }

        return null
      } finally {
        setLoading(false)
      }
    },
    [onSuccess, onError, showToast]
  )

  const reset = useCallback(() => {
    setError(null)
  }, [])

  return { execute, loading, error, reset }
}
```

### 7. Configuration Sentry

Créer `sentry.client.config.ts` (généré par le wizard):

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Traces sample rate
  tracesSampleRate: 1.0,

  // Session Replay
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  // Ignore specific errors
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
  ],

  // Environment
  environment: process.env.NODE_ENV,

  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
})
```

Créer `sentry.server.config.ts` :

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
})
```

Ajouter `.env.local` :

```bash
# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

---

## 🔗 Dependencies

- **Prerequisite**:
  - COMMON-01 (Project Setup) ✅
  - COMMON-02 (Design System) ✅

- **Blocks**:
  - Aucune tâche bloquée directement, mais améliore toutes les tâches futures

---

## 🧪 Testing Strategy

### Tests manuels

```typescript
// Test 1: Error boundary capture
function TestError() {
  throw new Error('Test error boundary')
  return null
}

// Test 2: Async error with hook
const { execute } = useSafeAction()
await execute(async () => {
  throw new ValidationError('Test validation')
})

// Test 3: Supabase error
await supabase.from('cases').select('*').eq('id', 'invalid-uuid')

// Test 4: Network error
await fetch('https://invalid-domain-that-does-not-exist.com')
```

### Tests Sentry

```bash
# Tester l'envoi vers Sentry
npx @sentry/wizard@latest --integration nextjs
# Puis déclencher une erreur pour vérifier l'envoi
```

---

## 📚 Resources

- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Sentry Next.js SDK](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Error Handling Best Practices](https://nodejs.org/en/docs/guides/nodejs-error-handling/)

---

## ⚠️ Potential Issues

### 1. Sentry rate limiting
**Problème**: Trop d'événements envoyés
**Solution**: Configurer `beforeSend` pour filtrer les erreurs non-critiques

### 2. Error boundary pas déclenchée
**Problème**: Erreur dans event handler non capturée
**Solution**: Utiliser `useSafeAction` ou try/catch manuel

### 3. Messages d'erreur trop techniques
**Problème**: Stack trace exposée à l'utilisateur
**Solution**: ErrorHandler masque les détails en production

### 4. Erreurs Supabase non catchées
**Problème**: RLS violations silencieuses
**Solution**: Toujours vérifier `error` dans les réponses Supabase

---

## ✅ Completion Checklist

- [ ] Créer `lib/errors/error-types.ts`
- [ ] Créer `lib/errors/error-handler.ts`
- [ ] Créer `lib/errors/error-logger.ts`
- [ ] Créer `app/error.tsx`
- [ ] Créer `app/global-error.tsx`
- [ ] Créer `app/not-found.tsx`
- [ ] Créer `hooks/use-safe-action.ts`
- [ ] Installer et configurer Sentry
- [ ] Tester chaque type d'erreur
- [ ] Vérifier envoi Sentry en staging
- [ ] Documenter patterns dans CLAUDE.md
- [ ] Commit: `feat(setup): add centralized error handling system`

---

**Durée estimée**: 4 heures
**Priorité**: P0 (Critique - avant Phase 1)
**Impact**: Améliore la robustesse et la maintenabilité de toute l'application
