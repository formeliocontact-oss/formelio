# Error Handling Guide - Formelio

**Version**: 1.0
**Date**: Novembre 2025
**Statut**: ✅ Système implémenté et opérationnel

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Patterns d'utilisation](#patterns-dutilisation)
3. [Types d'erreurs disponibles](#types-derreurs-disponibles)
4. [Hook useSafeAction](#hook-usesafeaction)
5. [Debugging & Troubleshooting](#debugging--troubleshooting)
6. [Best Practices](#best-practices)
7. [Migration depuis l'ancien code](#migration-depuis-lancien-code)

---

## Vue d'ensemble

### Architecture du système

```
lib/errors/
├── error-types.ts       # 18 types d'erreurs custom
├── error-handler.ts     # Handler centralisé
└── error-logger.ts      # Logger avec Sentry

hooks/
└── use-safe-action.ts   # Hook pour actions async

app/
├── error.tsx            # Error boundary
├── global-error.tsx     # Global error boundary
└── not-found.tsx        # Page 404
```

### Principe de base

**❌ Ancien système** : Retourner des objets error
```typescript
const result = await someAction()
if (result.error) {
  // Handle error manually
}
```

**✅ Nouveau système** : Throw des erreurs typées
```typescript
try {
  await someAction()
} catch (error) {
  // Handled automatically by ErrorHandler
}
```

---

## Patterns d'utilisation

### 1. Server Actions (Next.js)

**Pattern recommandé** : Throw des erreurs custom

```typescript
// src/app/(auth)/actions.ts
import { AuthenticationError, ValidationError } from '@/lib/errors/error-types'

export async function login(formData: FormData) {
  // 1. Validation
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    const fields: Record<string, string[]> = {}
    Object.entries(validatedFields.error.flatten().fieldErrors).forEach(([key, value]) => {
      fields[key] = value || []
    })
    throw new ValidationError('Données invalides', fields)
  }

  // 2. Appel API avec gestion d'erreur
  const { error } = await supabase.auth.signInWithPassword({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  })

  if (error) {
    // Mapper les erreurs Supabase vers des messages FR user-friendly
    if (error.message.includes('Invalid login credentials')) {
      throw new AuthenticationError('Email ou mot de passe incorrect')
    }
    if (error.message.includes('Email not confirmed')) {
      throw new AuthenticationError('Veuillez confirmer votre email avant de vous connecter')
    }
    throw new SupabaseError(error.message)
  }

  // 3. Succès - redirect
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
```

**Points clés** :
- Throw des erreurs typées (AuthenticationError, ValidationError, etc.)
- Messages en français et user-friendly
- Pas besoin de try/catch dans l'action (géré par le client)
- Utiliser `redirect()` après succès (throw automatique)

---

### 2. Client Components avec useSafeAction

**Pattern recommandé** : Hook useSafeAction pour gérer automatiquement les erreurs

```typescript
// src/app/(auth)/login/page.tsx
'use client'

import { useSafeAction } from '@/hooks/use-safe-action'
import { login } from '../actions'

export default function LoginPage() {
  const { execute, loading } = useSafeAction({ showToast: true })

  const onSubmit = async (data: LoginInput) => {
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)

    // useSafeAction gère automatiquement les erreurs
    await execute(login, formData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Pas besoin de state pour l'erreur */}
      <Button type="submit" disabled={loading}>
        Se connecter
      </Button>
    </form>
  )
}
```

**Avec callbacks personnalisés** :

```typescript
const { execute, loading, error } = useSafeAction({
  showToast: true,
  onSuccess: () => {
    toast.success('Action réussie !')
    router.push('/dashboard')
  },
  onError: (errorMessage) => {
    // Logique custom en cas d'erreur
    console.error('Custom error handling:', errorMessage)
  },
})
```

**Sans toast automatique** (afficher l'erreur manuellement) :

```typescript
const { execute, loading, error } = useSafeAction({ showToast: false })

// Afficher l'erreur dans le formulaire
{error && <p className="text-error text-sm">{error}</p>}
```

---

### 3. Services (Business Logic)

**Pattern recommandé** : Try/catch avec erreurs custom

```typescript
// lib/services/case-service.ts
import { createClient } from '@/lib/supabase/server'
import { CaseNotFoundError, SupabaseError } from '@/lib/errors/error-types'

export class CaseService {
  private supabase = createClient()

  async getCaseById(id: string): Promise<Case> {
    try {
      const { data, error } = await this.supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw new SupabaseError(error.message)
      }

      if (!data) {
        throw new CaseNotFoundError(id)
      }

      return data
    } catch (error) {
      // Re-throw les erreurs custom
      if (error instanceof CaseNotFoundError || error instanceof SupabaseError) {
        throw error
      }

      // Wrapper les erreurs inconnues
      throw new SupabaseError('Erreur lors de la récupération du dossier')
    }
  }

  async createCase(input: CaseInput): Promise<Case> {
    try {
      const { data, error } = await this.supabase
        .from('cases')
        .insert(input)
        .select()
        .single()

      if (error) {
        // Détecter les erreurs de contrainte unique
        if (error.code === '23505') {
          throw new DuplicateCaseError(input.reference)
        }
        throw new SupabaseError(error.message)
      }

      return data
    } catch (error) {
      if (error instanceof DuplicateCaseError || error instanceof SupabaseError) {
        throw error
      }
      throw new SupabaseError('Erreur lors de la création du dossier')
    }
  }
}
```

---

### 4. API Routes (Next.js)

**Pattern recommandé** : Try/catch + NextResponse avec status codes

```typescript
// app/api/cases/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ErrorHandler } from '@/lib/errors/error-handler'
import { caseService } from '@/lib/services/case-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const caseData = await caseService.getCaseById(params.id)

    return NextResponse.json({ data: caseData })
  } catch (error) {
    const errorInfo = ErrorHandler.handle(error, {
      route: `/api/cases/${params.id}`,
      action: 'get_case',
    })

    return NextResponse.json(
      { error: errorInfo.message, code: errorInfo.code },
      { status: errorInfo.statusCode }
    )
  }
}
```

---

## Types d'erreurs disponibles

### 1. Erreurs d'authentification

```typescript
import {
  AuthenticationError,
  AuthorizationError,
  SessionExpiredError,
} from '@/lib/errors/error-types'

// Authentification requise (401)
throw new AuthenticationError('Vous devez être connecté')

// Accès refusé (403)
throw new AuthorizationError('Accès refusé à cette ressource')

// Session expirée (401)
throw new SessionExpiredError()
```

**Quand utiliser** :
- `AuthenticationError` : Login invalide, token manquant
- `AuthorizationError` : Permissions insuffisantes
- `SessionExpiredError` : JWT expiré, refresh token invalide

---

### 2. Erreurs de validation

```typescript
import { ValidationError, InvalidInputError } from '@/lib/errors/error-types'

// Validation multi-champs (400)
throw new ValidationError('Données invalides', {
  email: ['Format email invalide'],
  password: ['Minimum 8 caractères requis'],
})

// Validation simple (400)
throw new InvalidInputError('email', 'Format invalide')
```

**Quand utiliser** :
- `ValidationError` : Erreurs Zod, validation de formulaire
- `InvalidInputError` : Validation simple d'un champ

---

### 3. Erreurs Supabase

```typescript
import {
  SupabaseError,
  DatabaseConnectionError,
  RowLevelSecurityError,
} from '@/lib/errors/error-types'

// Erreur Supabase générique (500)
throw new SupabaseError('Erreur de base de données')

// Connexion perdue (503)
throw new DatabaseConnectionError()

// RLS violation (403)
throw new RowLevelSecurityError('dossiers')
```

**Quand utiliser** :
- `SupabaseError` : Erreurs Postgres génériques
- `DatabaseConnectionError` : Timeout, connexion perdue
- `RowLevelSecurityError` : Policy violation détectée

---

### 4. Erreurs de paiement

```typescript
import {
  PaymentError,
  PaymentDeclinedError,
  InsufficientFundsError,
} from '@/lib/errors/error-types'

// Erreur Stripe générique (402)
throw new PaymentError('Erreur de paiement', 'card_error', 'declined')

// Paiement refusé (402)
throw new PaymentDeclinedError('Carte expirée')

// Fonds insuffisants (402)
throw new InsufficientFundsError()
```

**Quand utiliser** :
- `PaymentError` : Erreurs Stripe génériques
- `PaymentDeclinedError` : Carte refusée par la banque
- `InsufficientFundsError` : Solde insuffisant

---

### 5. Erreurs de documents

```typescript
import {
  DocumentError,
  FileUploadError,
  FileSizeExceededError,
  UnsupportedFileTypeError,
} from '@/lib/errors/error-types'

// Document error générique (500)
throw new DocumentError('Erreur lors du traitement du document', 'doc-123')

// Upload failed (500)
throw new FileUploadError('contrat.pdf', 'Taille trop grande')

// Taille dépassée (400)
throw new FileSizeExceededError(10 * 1024 * 1024) // 10MB

// Type non supporté (400)
throw new UnsupportedFileTypeError('application/exe')
```

**Quand utiliser** :
- `FileUploadError` : Échec upload vers Supabase Storage
- `FileSizeExceededError` : Fichier trop volumineux
- `UnsupportedFileTypeError` : Extension non autorisée

---

### 6. Erreurs réseau

```typescript
import { NetworkError, TimeoutError } from '@/lib/errors/error-types'

// Réseau indisponible (503)
throw new NetworkError('Impossible de contacter le serveur')

// Timeout (504)
throw new TimeoutError('upload de fichier')
```

**Quand utiliser** :
- `NetworkError` : Fetch failed, pas de connexion
- `TimeoutError` : Opération trop longue

---

### 7. Erreurs métier

```typescript
import {
  CaseNotFoundError,
  DuplicateCaseError,
  OrganizationQuotaExceededError,
} from '@/lib/errors/error-types'

// Ressource introuvable (404)
throw new CaseNotFoundError('case-123')

// Conflit (409)
throw new DuplicateCaseError('REF-2025-001')

// Quota atteint (429)
throw new OrganizationQuotaExceededError('dossiers actifs')
```

**Quand utiliser** :
- `CaseNotFoundError` : Dossier inexistant
- `DuplicateCaseError` : Référence déjà utilisée
- `OrganizationQuotaExceededError` : Limite plan atteinte

---

## Hook useSafeAction

### Signature complète

```typescript
interface UseSafeActionOptions {
  onSuccess?: () => void           // Callback après succès
  onError?: (error: string) => void // Callback après erreur
  showToast?: boolean              // Afficher toast automatique (default: true)
}

function useSafeAction<T extends (...args: any[]) => Promise<any>>(
  options?: UseSafeActionOptions
): {
  execute: (action: T, ...args: Parameters<T>) => Promise<Awaited<ReturnType<T>> | null>
  loading: boolean
  error: string | null
  reset: () => void
}
```

### Exemples avancés

**Avec gestion du résultat** :

```typescript
const { execute, loading } = useSafeAction()

const handleSubmit = async (data: FormData) => {
  const result = await execute(createCase, data)

  if (result) {
    // Succès - result contient les données retournées
    router.push(`/cases/${result.id}`)
  }
  // Si result === null, une erreur s'est produite (déjà affichée via toast)
}
```

**Avec reset manuel** :

```typescript
const { execute, loading, error, reset } = useSafeAction({ showToast: false })

// Afficher l'erreur manuellement
{error && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}

// Reset l'erreur au changement de formulaire
<Input onChange={() => reset()} />
```

**Avec loading state global** :

```typescript
const { execute, loading } = useSafeAction()

return (
  <form>
    <Input disabled={loading} />
    <Button type="submit" disabled={loading}>
      {loading ? <Loader className="animate-spin" /> : 'Soumettre'}
    </Button>
  </form>
)
```

---

## Debugging & Troubleshooting

### Logs en développement

En mode développement, toutes les erreurs sont loggées dans la console :

```
🔴 Error Log
Error: Email ou mot de passe incorrect
Context: { route: '/login', action: 'login_attempt' }
Stack: AuthenticationError: Email ou mot de passe incorrect
    at login (actions.ts:23)
```

### Sentry en production

En production, les erreurs sont envoyées à Sentry avec contexte enrichi :

```typescript
// Variables d'environnement requises
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ORG=formelio
SENTRY_PROJECT=formelio-saas
SENTRY_AUTH_TOKEN=sntrys_xxx
```

**Voir les erreurs dans Sentry** :
1. Dashboard Sentry → Issues
2. Filtrer par `route`, `action`, `organization`
3. Voir contexte utilisateur, metadata, stack trace

### Erreurs communes

#### 1. "Error was caught by ErrorBoundary but no error message shown"

**Cause** : L'erreur n'est pas une AppError et n'est pas reconnue par ErrorHandler

**Solution** :
```typescript
// ❌ Mauvais
throw new Error('Something went wrong')

// ✅ Bon
throw new SupabaseError('Something went wrong')
```

#### 2. "Toast not showing on error"

**Cause** : Toaster component non ajouté dans layout

**Solution** :
```typescript
// app/layout.tsx
import { Toaster } from 'sonner'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}
```

#### 3. "useSafeAction not catching Server Action errors"

**Cause** : Server Action retourne un objet au lieu de throw

**Solution** :
```typescript
// ❌ Mauvais
export async function action() {
  return { error: 'Something went wrong' }
}

// ✅ Bon
export async function action() {
  throw new ValidationError('Something went wrong')
}
```

#### 4. "Sentry not logging errors in production"

**Vérifier** :
- Variables d'env présentes : `console.log(process.env.NEXT_PUBLIC_SENTRY_DSN)`
- Sentry.init() appelé : Vérifier `sentry.client.config.ts`
- DSN valide : Tester manuellement `Sentry.captureException(new Error('test'))`

---

## Best Practices

### 1. Choisir le bon type d'erreur

**Règle** : Utiliser le type le plus spécifique possible

```typescript
// ❌ Trop générique
throw new Error('Login failed')

// ⚠️ Mieux mais pas assez précis
throw new SupabaseError('Invalid credentials')

// ✅ Parfait
throw new AuthenticationError('Email ou mot de passe incorrect')
```

### 2. Messages en français et user-friendly

```typescript
// ❌ Message technique
throw new ValidationError('email must match /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/')

// ✅ Message user-friendly
throw new ValidationError('Format email invalide', {
  email: ['Veuillez saisir une adresse email valide'],
})
```

### 3. Ne jamais exposer les détails système

```typescript
// ❌ Expose le code SQL
throw new SupabaseError(`Query failed: SELECT * FROM cases WHERE id = '${id}'`)

// ✅ Message générique
throw new SupabaseError('Erreur lors de la récupération du dossier')
```

### 4. Utiliser metadata pour le debugging

```typescript
throw new DocumentError('Upload échoué', 'doc-123')
// Metadata automatiquement ajoutée: { documentId: 'doc-123' }
// Visible dans Sentry pour debugging
```

### 5. Wrapper les erreurs externes

```typescript
try {
  await stripe.paymentIntents.create({ ... })
} catch (err) {
  if (err instanceof Stripe.errors.StripeCardError) {
    throw new PaymentDeclinedError(err.decline_code)
  }
  throw new PaymentError('Erreur de paiement')
}
```

### 6. Logger le contexte important

```typescript
// Dans un Server Action
import { ErrorHandler } from '@/lib/errors/error-handler'

try {
  await processCase(caseId)
} catch (error) {
  ErrorHandler.handle(error, {
    userId: user.id,
    organizationId: org.id,
    route: '/cases/process',
    action: 'process_case',
    metadata: { caseId, step: 'validation' },
  })
  throw error // Re-throw pour le client
}
```

---

## Migration depuis l'ancien code

### Pattern 1 : Server Actions

**Avant** :
```typescript
export async function login(formData: FormData) {
  const { error } = await supabase.auth.signInWithPassword({ ... })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
```

**Après** :
```typescript
export async function login(formData: FormData) {
  const { error } = await supabase.auth.signInWithPassword({ ... })

  if (error) {
    throw new AuthenticationError('Email ou mot de passe incorrect')
  }

  redirect('/dashboard') // Pas besoin de return
}
```

### Pattern 2 : Client Components

**Avant** :
```typescript
const [serverError, setServerError] = useState<string | null>(null)

const onSubmit = async (data: FormData) => {
  const result = await login(data)

  if (result.error) {
    setServerError(result.error)
  } else {
    toast.success('Connexion réussie')
  }
}

{serverError && <p className="text-error">{serverError}</p>}
```

**Après** :
```typescript
const { execute, loading } = useSafeAction({ showToast: true })

const onSubmit = async (data: FormData) => {
  await execute(login, data)
  // Erreur gérée automatiquement via toast
}
```

### Pattern 3 : Services

**Avant** :
```typescript
async getCaseById(id: string): Promise<Case | null> {
  const { data, error } = await supabase.from('cases').select('*').eq('id', id).single()
  if (error) return null
  return data
}
```

**Après** :
```typescript
async getCaseById(id: string): Promise<Case> {
  const { data, error } = await supabase.from('cases').select('*').eq('id', id).single()

  if (error) {
    throw new SupabaseError(error.message)
  }

  if (!data) {
    throw new CaseNotFoundError(id)
  }

  return data
}
```

---

## 📚 Ressources

### Fichiers du système

- [lib/errors/error-types.ts](../../src/lib/errors/error-types.ts) - Types d'erreurs
- [lib/errors/error-handler.ts](../../src/lib/errors/error-handler.ts) - Handler centralisé
- [lib/errors/error-logger.ts](../../src/lib/errors/error-logger.ts) - Logger Sentry
- [hooks/use-safe-action.ts](../../src/hooks/use-safe-action.ts) - Hook pour async actions

### Documentation

- [Task d'implémentation](tasks/04-error-handling-system.md) - Détails techniques complets
- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [Sentry Next.js SDK](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

---

**Version** : 1.0
**Dernière mise à jour** : Novembre 2025
**Statut** : ✅ Documentation complète

💙 **Formelio** - Votre temps, notre priorité
