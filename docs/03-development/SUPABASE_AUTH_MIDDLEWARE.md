# Guide Middleware Auth Supabase - Formelio

**Version**: 1.0
**Date**: Octobre 2025
**Projet**: Formelio - SSR Authentication avec Supabase

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Pourquoi un middleware auth ?](#pourquoi-un-middleware-auth)
3. [Implémentation complète](#implémentation-complète)
4. [Flow de requête SSR](#flow-de-requête-ssr)
5. [Protected Routes](#protected-routes)
6. [Patterns avancés](#patterns-avancés)
7. [Troubleshooting](#troubleshooting)

---

## Vue d'ensemble

Le **Middleware Auth** est le composant critique qui permet l'authentification **Server-Side Rendering (SSR)** avec Supabase dans Next.js.

### Rôle principal

```
1. Intercepter TOUTES les requêtes HTTP
2. Rafraîchir les tokens auth expirés
3. Mettre à jour les cookies avec nouveaux tokens
4. Permettre aux Server Components d'accéder à auth.getUser()
```

**Sans middleware** : Les tokens expirent, Server Components reçoivent `user = null`, logout inattendu.

**Avec middleware** : Tokens toujours frais, expérience utilisateur fluide.

---

## Pourquoi un middleware auth ?

### Problème : Expiration des tokens JWT

Supabase utilise des **JWT tokens** avec durée de vie limitée :
- **Access Token** : 1 heure (par défaut)
- **Refresh Token** : 7 jours (par défaut)

```typescript
// Sans middleware auth
// t=0: User login → access_token valide
// t=30min: User navigue → access_token valide
// t=65min: User navigue → access_token EXPIRÉ ❌

// Server Component
const { data: { user } } = await supabase.auth.getUser();
// user = null → Logout inattendu !
```

### Solution : Middleware refresh automatique

```typescript
// Avec middleware auth
// t=65min: User navigue
//   → Middleware intercepte
//   → Refresh access_token avec refresh_token
//   → Nouveaux cookies mis à jour
//   → Server Component lit les nouveaux tokens
//   → user = { ... } ✅
```

---

## Implémentation complète

### Structure des fichiers

```
lib/supabase/
├── client.ts       # Browser client (Client Components)
├── server.ts       # Server client (Server Components, API routes)
└── middleware.ts   # Middleware client (Refresh logic)

middleware.ts         # Next.js middleware (root)
```

### 1. Client Supabase pour Middleware

```typescript
// lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // 1. Créer une réponse Next.js initiale
  let supabaseResponse = NextResponse.next({
    request,
  });

  // 2. Créer le client Supabase avec gestion cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Lire tous les cookies de la requête
        getAll() {
          return request.cookies.getAll();
        },

        // Écrire les cookies dans la réponse
        setAll(cookiesToSet) {
          // Mettre à jour la requête (pour downstream handlers)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          // Créer nouvelle réponse avec cookies
          supabaseResponse = NextResponse.next({
            request,
          });

          // Mettre à jour la réponse (pour le browser)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. CRITIQUE : Appeler getUser() pour déclencher le refresh
  // NE PAS exécuter de code entre createServerClient et getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. Optionnel : Protection routes
  // if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/login';
  //   return NextResponse.redirect(url);
  // }

  // 5. Retourner la réponse avec cookies mis à jour
  return supabaseResponse;
}
```

### 2. Middleware Next.js (root)

```typescript
// middleware.ts (à la racine du projet)
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match toutes les routes SAUF :
     * - _next/static (fichiers statiques Next.js)
     * - _next/image (optimisation images)
     * - favicon.ico
     * - Images (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

### 3. Protected Layout Pattern

```typescript
// app/dashboard/layout.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  // ✅ getUser() valide le token (déjà refresh par middleware)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect si non authentifié
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="dashboard-layout">
      <Sidebar user={user} />
      <main>{children}</main>
    </div>
  );
}
```

---

## Flow de requête SSR

### Diagramme complet

```
┌─────────────────────────────────────────────────────────────┐
│  1. USER BROWSER                                            │
│     GET /dashboard/cases                                    │
│     Cookie: sb-access-token=expired_jwt                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  2. NEXT.JS MIDDLEWARE                                      │
│     - Intercepte la requête                                 │
│     - Crée Supabase client (middleware.ts)                  │
│     - Appelle supabase.auth.getUser()                       │
│                                                             │
│     ┌───────────────────────────────────────────────┐      │
│     │ getUser() détecte token expiré                │      │
│     │ → Utilise refresh_token                        │      │
│     │ → Appelle Supabase Auth API                    │      │
│     │ → Reçoit nouveau access_token + refresh_token  │      │
│     │ → Met à jour cookies via setAll()              │      │
│     └───────────────────────────────────────────────┘      │
│                                                             │
│     - Retourne NextResponse avec cookies mis à jour        │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  3. SERVER COMPONENT                                        │
│     app/dashboard/cases/page.tsx                            │
│                                                             │
│     const supabase = createClient(); // server.ts           │
│     const { data: { user } } = await getUser();             │
│     // ✅ user valide (token refresh)                       │
│                                                             │
│     const { data: cases } = await supabase                  │
│       .from('cases')                                        │
│       .select('*');                                         │
│     // ✅ RLS utilise auth.uid() du token refresh           │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  4. RESPONSE TO BROWSER                                     │
│     Set-Cookie: sb-access-token=new_jwt; HttpOnly           │
│     Set-Cookie: sb-refresh-token=new_refresh; HttpOnly      │
│     HTML: <CasesList cases={[...]} />                       │
└─────────────────────────────────────────────────────────────┘
```

### Timeline détaillée

```
T=0ms    : User clique sur lien /dashboard/cases
T=10ms   : Requête HTTP envoyée avec cookies existants
T=20ms   : Middleware intercepte
T=30ms   : createServerClient() initialise le client
T=40ms   : getUser() appelé
T=50ms   : Détection token expiré (exp: 1h passée)
T=60ms   : Appel Supabase Auth API avec refresh_token
T=150ms  : Nouveaux tokens reçus
T=160ms  : Cookies mis à jour via setAll()
T=170ms  : Middleware retourne NextResponse
T=180ms  : Server Component s'exécute
T=190ms  : createClient() lit les NOUVEAUX cookies
T=200ms  : getUser() retourne user valide ✅
T=210ms  : Query Supabase avec RLS (auth.uid() valide)
T=300ms  : HTML généré
T=350ms  : Réponse envoyée au browser
T=360ms  : Browser stocke nouveaux cookies
```

---

## Protected Routes

### Pattern 1 : Protection dans Layout

```typescript
// app/dashboard/layout.tsx
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <>{children}</>;
}
```

**Avantages** :
- ✅ Protège toutes les pages sous /dashboard
- ✅ Un seul point de contrôle
- ✅ Layout partagé (sidebar, header)

**Inconvénients** :
- ❌ Redirect côté serveur (pas instant)

---

### Pattern 2 : Protection dans Middleware

```typescript
// lib/supabase/middleware.ts
export async function updateSession(request: NextRequest) {
  // ... setup supabase ...

  const { data: { user } } = await supabase.auth.getUser();

  // Protection des routes /dashboard
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

**Avantages** :
- ✅ Protection au niveau le plus haut
- ✅ Redirect avant Server Component
- ✅ Peut passer `redirect` param pour retour après login

**Inconvénients** :
- ❌ Complexifie le middleware
- ❌ Moins flexible (toutes routes /dashboard)

---

### Pattern 3 : Protection granulaire par Page

```typescript
// app/dashboard/cases/[id]/page.tsx
export default async function CaseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Vérifier ownership
  const { data: caseData } = await supabase
    .from('cases')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!caseData) {
    notFound();
  }

  if (caseData.user_id !== user.id) {
    redirect('/dashboard/cases'); // Pas son case
  }

  return <CaseDetail case={caseData} />;
}
```

**Avantages** :
- ✅ Contrôle fin (ownership check)
- ✅ Logic métier proche de la page

**Inconvénients** :
- ❌ Duplication si beaucoup de pages
- ❌ Peut oublier des pages

---

### Recommandation Formelio

**Combiner Pattern 1 + 3** :
1. Layout `/dashboard` : Protection auth générale
2. Pages spécifiques : Ownership checks

```typescript
// app/dashboard/layout.tsx
export default async function DashboardLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login'); // ✅ Auth check

  return <>{children}</>;
}

// app/dashboard/cases/[id]/page.tsx
export default async function CaseDetailPage({ params }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // ✅ Ownership check (user déjà validé par layout)
  const { data: caseData } = await supabase
    .from('cases')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user!.id) // user! car layout garantit user
    .single();

  if (!caseData) notFound();

  return <CaseDetail case={caseData} />;
}
```

---

## Patterns avancés

### Redirect avec return URL

```typescript
// lib/supabase/middleware.ts
export async function updateSession(request: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser();

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isAuthRoute = ['/login', '/register'].includes(request.nextUrl.pathname);

  // Non authentifié sur route protégée → redirect login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname); // ✅ Return URL
    return NextResponse.redirect(url);
  }

  // Authentifié sur route auth → redirect dashboard
  if (user && isAuthRoute) {
    const redirect = request.nextUrl.searchParams.get('redirect');
    const url = request.nextUrl.clone();
    url.pathname = redirect || '/dashboard';
    url.searchParams.delete('redirect');
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

### Custom Matcher avancé

```typescript
// middleware.ts
export const config = {
  matcher: [
    // Match toutes les routes API sauf webhooks publics
    '/api/((?!webhooks).*)',

    // Match toutes les pages dashboard
    '/dashboard/:path*',

    // Match les pages auth
    '/(login|register|reset-password)',
  ],
};
```

---

## Troubleshooting

### Problème 1 : "User undefined après login"

**Symptôme** :
```typescript
const { data: { user } } = await supabase.auth.getUser();
console.log(user); // undefined ❌
```

**Causes possibles** :
1. ❌ Middleware pas configuré
2. ❌ Matcher exclut la route
3. ❌ Code exécuté entre `createServerClient` et `getUser()`

**Solution** :
```typescript
// ✅ Vérifier middleware.ts existe
// ✅ Vérifier matcher inclut la route
// ✅ Vérifier aucun code entre create et getUser

const supabase = createServerClient(...);
// ❌ PAS DE CODE ICI
const { data: { user } } = await supabase.auth.getUser();
```

---

### Problème 2 : "Infinite redirect loop"

**Symptôme** :
```
/login → /dashboard → /login → /dashboard → ...
```

**Cause** :
Middleware redirect `/dashboard` → `/login`, mais login redirect vers `/dashboard` alors que pas auth.

**Solution** :
```typescript
// ✅ Vérifier condition redirect
if (!user && isProtectedRoute && !isAuthRoute) {
  // ...
}
```

---

### Problème 3 : "Cookies not updating"

**Symptôme** :
Tokens pas refresh, logout inattendu.

**Cause** :
`setAll()` pas correctement implémenté.

**Solution** :
```typescript
// ✅ Template officiel Supabase
cookies: {
  getAll() {
    return request.cookies.getAll();
  },
  setAll(cookiesToSet) {
    cookiesToSet.forEach(({ name, value }) =>
      request.cookies.set(name, value)
    );
    supabaseResponse = NextResponse.next({ request });
    cookiesToSet.forEach(({ name, value, options }) =>
      supabaseResponse.cookies.set(name, value, options)
    );
  },
},
```

---

### Problème 4 : "CORS errors en dev"

**Symptôme** :
```
Access to fetch at 'https://xxx.supabase.co/auth/v1/token' from origin 'http://localhost:3000' has been blocked by CORS
```

**Cause** :
Supabase URL mal configurée ou CORS Supabase.

**Solution** :
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co # ✅ Sans trailing slash
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...             # ✅ Anon key publique
```

---

## Checklist de validation

### Avant commit

- [ ] ✅ `middleware.ts` à la racine existe
- [ ] ✅ `lib/supabase/middleware.ts` existe avec `updateSession()`
- [ ] ✅ Matcher configuré pour toutes routes nécessaires
- [ ] ✅ Aucun code entre `createServerClient` et `getUser()`
- [ ] ✅ `setAll()` met à jour request ET response cookies
- [ ] ✅ Protected routes redirigent vers `/login`

### Tests manuels

1. **Login → Dashboard** : ✅ Fonctionne
2. **Attendre 65 min → Refresh page** : ✅ Toujours connecté (token refresh)
3. **Accès /dashboard sans auth** : ✅ Redirect /login
4. **Accès /login avec auth** : ✅ Redirect /dashboard

---

## Documentation officielle

📚 **Ressources** :
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side-rendering)
- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Supabase @supabase/ssr](https://github.com/supabase/supabase/tree/master/packages/ssr)

---

**Version** : 1.0
**Dernière mise à jour** : Octobre 2025
**Projet** : Formelio

💙 **Formelio** - Votre temps, notre priorité
