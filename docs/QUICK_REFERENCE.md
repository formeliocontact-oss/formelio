# Quick Reference - Formelio

**Version**: 1.0
**Date**: Octobre 2025
**Usage**: GARDER OUVERT pendant le développement

---

## ⛔ 5 INTERDICTIONS ABSOLUES

### 1. ❌ JAMAIS `any` ou `as any`
```typescript
// ❌ INTERDIT
const data: any = fetchData();
const value = someValue as any;
```

### 2. ❌ JAMAIS `@ts-ignore`
```typescript
// ❌ INTERDIT
// @ts-ignore
const result = unsafeOperation();
```

### 3. ❌ JAMAIS `@supabase/auth-helpers-nextjs` (DEPRECATED)
```typescript
// ❌ INTERDIT
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
```

### 4. ❌ JAMAIS getSession() dans Server Components
```typescript
// ❌ INTERDIT - getSession() est pour le client
const { data: { session } } = await supabase.auth.getSession();
```

### 5. ❌ JAMAIS cookie get/set (utiliser getAll/setAll)
```typescript
// ❌ INTERDIT - BREAKS APP
cookies: {
  get(name) { return cookieStore.get(name) },
  set(name, value) { cookieStore.set(name, value) }
}
```

---

## ✅ 5 RÈGLES OBLIGATOIRES

### 1. ✅ Types explicites partout
```typescript
// ✅ BON
interface UserData {
  id: string;
  email: string;
  name: string | null;
}

function processUser(user: UserData): string {
  return user.email;
}
```

### 2. ✅ Toujours @supabase/ssr
```typescript
// ✅ BON
import { createServerClient } from '@supabase/ssr';
import { createBrowserClient } from '@supabase/ssr';
```

### 3. ✅ getUser() dans Server Components
```typescript
// ✅ BON - Server Component
const { data: { user } } = await supabase.auth.getUser();
```

### 4. ✅ HTML sémantique
```tsx
// ✅ BON
<header>
  <nav>
    <button onClick={handleClick}>Action</button>
  </nav>
</header>
<main>
  <article>Content</article>
</main>
<footer>Footer</footer>
```

### 5. ✅ getAll/setAll pour cookies
```typescript
// ✅ BON
cookies: {
  getAll() {
    return cookieStore.getAll();
  },
  setAll(cookiesToSet) {
    cookiesToSet.forEach(({ name, value, options }) =>
      cookieStore.set(name, value, options)
    );
  }
}
```

---

## 📋 Patterns TypeScript

### Type Guards
```typescript
function isUserData(data: unknown): data is UserData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'email' in data &&
    typeof (data as UserData).id === 'string' &&
    typeof (data as UserData).email === 'string'
  );
}

// Usage
const data: unknown = await fetchData();
if (isUserData(data)) {
  console.log(data.email); // Type-safe
}
```

### Component Props
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false
}: ButtonProps) {
  // Implementation
}
```

### Constantes avec `as const`
```typescript
const STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
} as const;

type Status = typeof STATUS[keyof typeof STATUS];
```

---

## 🔐 Patterns Supabase Auth

### Server Component (getUser)
```typescript
// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = createClient();

  // ✅ getUser() dans Server Component
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <Dashboard user={user} />;
}
```

### Client Component (getSession)
```typescript
// components/user-profile.tsx
'use client'

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export function UserProfile() {
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    // ✅ getSession() OK dans Client Component
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  return <div>{user?.email}</div>;
}
```

### Middleware (updateSession)
```typescript
// middleware.ts
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
```

### Supabase Client Setup

**lib/supabase/client.ts** (Browser):
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**lib/supabase/server.ts** (Server):
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component - ignore set cookies
          }
        },
      },
    }
  );
}
```

---

## 🎨 HTML Sémantique

### Balises à Privilégier

| Élément | Usage | ❌ Au lieu de |
|---------|-------|---------------|
| `<header>` | En-tête de page/section | `<div className="header">` |
| `<nav>` | Navigation principale | `<div className="nav">` |
| `<main>` | Contenu principal | `<div className="main">` |
| `<article>` | Contenu autonome | `<div className="article">` |
| `<section>` | Section thématique | `<div className="section">` |
| `<aside>` | Contenu tangentiel | `<div className="sidebar">` |
| `<footer>` | Pied de page | `<div className="footer">` |
| `<button>` | Action cliquable | `<div onClick={}>` |
| `<a>` | Lien de navigation | `<div onClick={}>` |
| `<form>` | Formulaire | `<div>` avec inputs |

### Exemple Complet
```tsx
// ❌ MAUVAIS - Div Soup
<div className="container">
  <div className="header">
    <div className="title">Titre</div>
    <div className="nav">
      <div onClick={handleClick}>Action</div>
    </div>
  </div>
  <div className="content">
    <div className="article">Contenu</div>
  </div>
</div>

// ✅ BON - HTML Sémantique
<div className="page-wrapper">
  <header>
    <h1>Titre</h1>
    <nav>
      <button onClick={handleClick} type="button">
        Action
      </button>
    </nav>
  </header>
  <main>
    <article>
      <p>Contenu</p>
    </article>
  </main>
  <footer>
    <p>Footer content</p>
  </footer>
</div>
```

---

## 📂 Structure Fichiers

```
formelio/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Grouped routes (login, register)
│   ├── (marketing)/              # Public pages (landing, about)
│   ├── dashboard/                # Protected routes
│   ├── api/                      # API routes
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                       # Shadcn UI components
│   ├── forms/                    # Form components
│   ├── layouts/                  # Layout components
│   └── features/                 # Feature-specific components
├── lib/
│   ├── supabase/                 # Supabase utilities
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── utils/                    # Helper functions
│   ├── validations/              # Zod schemas
│   └── constants.ts
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript types & interfaces
├── public/                       # Static assets
└── tests/                        # Test files
```

### Conventions de Nommage
- **Dossiers**: kebab-case (`user-profile/`)
- **Composants**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase avec `use` (`useUserUpdate.ts`)
- **Utilities**: camelCase (`formatDate.ts`)

---

## 🧪 Commandes Tests

### Tests Unitaires (Vitest)
```bash
npm test                    # Run all tests
npm test -- user-card       # Run specific test
npm test -- --watch         # Watch mode
npm test -- --coverage      # With coverage
```

### Tests E2E (Playwright)
```bash
npm run test:e2e            # Run E2E tests
npm run test:e2e -- --ui    # Interactive mode
npm run test:e2e -- --debug # Debug mode
```

### Validation Build
```bash
npm run type-check          # TypeScript validation
npm run lint                # ESLint
npm run build               # Next.js build
```

---

## 🔄 Workflow Git

### Branches
```bash
main                        # Production
develop                     # Development
feature/P1-01-homepage      # Feature branches
hotfix/auth-bug             # Hotfix branches
```

### Conventional Commits
```bash
# Format: <type>(<scope>): <description>

feat(auth): add login page
fix(dashboard): resolve case list loading issue
docs(readme): update setup instructions
test(cases): add unit tests for CaseCard
refactor(components): extract UserAvatar component
```

### Commit Types
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation uniquement
- `style`: Formatage (pas de changement de code)
- `refactor`: Refactoring sans changement fonctionnel
- `test`: Ajout ou modification de tests
- `chore`: Maintenance (deps, config)

---

## ⚙️ Next.js App Router

### Server vs Client Components

**Par défaut: Server Component** (pas de `'use client'`)

```typescript
// ✅ Server Component - Par défaut
export default async function Page() {
  const supabase = createClient();
  const { data } = await supabase.from('cases').select('*');
  return <CaseList cases={data} />;
}
```

**Client Component** - UNIQUEMENT si besoin de:
```typescript
'use client' // ⚠️ Ajouter uniquement si nécessaire

// Nécessaire pour:
// - useState, useEffect, etc.
// - Event handlers (onClick, onChange)
// - Browser APIs (window, localStorage)
// - Context Providers/Consumers
```

### Files Spéciaux Next.js
- `page.tsx` - Route page
- `layout.tsx` - Shared layout
- `loading.tsx` - Loading UI
- `error.tsx` - Error UI
- `not-found.tsx` - 404 page
- `route.ts` - API endpoint

---

## 🎯 Checklist Avant Commit

- [ ] ✅ Aucun `any` ou `as any`
- [ ] ✅ Tous les types sont explicites
- [ ] ✅ HTML sémantique (pas de div soup)
- [ ] ✅ Aucun fichier > 300 lignes
- [ ] ✅ Pas de doublons de code
- [ ] ✅ `npm test` passe
- [ ] ✅ `npm run lint` passe
- [ ] ✅ `npm run type-check` passe
- [ ] ✅ `npm run build` réussit

---

## 🔗 Ressources Rapides

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Shadcn UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

### Projet
- [CLAUDE.md](../.claude/CLAUDE.md) - Règles complètes (LIRE EN ENTIER)
- [CHECKLIST.md](01-getting-started/CHECKLIST.md) - Setup étape par étape
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Solutions aux erreurs
- [Cahier des Charges](02-project-management/cahier_des_charges_formelio.md)

---

**⚠️ GARDER CE DOCUMENT OUVERT PENDANT LE CODING**

**Version**: 1.0
**Dernière mise à jour**: Octobre 2025
**Projet**: Formelio - Service de formalités juridiques
