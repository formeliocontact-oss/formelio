# Guide de Migration 2025 - Formelio

**Version** : 1.0
**Date** : Octobre 2025
**Objectif** : Implémenter toutes les mises à jour critiques identifiées

---

## 📋 Vue d'ensemble

Ce guide liste **toutes les actions concrètes** à entreprendre pour migrer vers les meilleures pratiques 2025 identifiées dans :
- Stripe (4 ressources analysées)
- Architecture Next.js + Supabase (5 ressources)
- Sécurité & RLS (4 ressources)

**Effort total estimé** : ~40h
- ⚠️ **Critique** : 11h (immédiat)
- ⭐ **Haute** : 11h (Phase 1-2)
- 🟢 **Moyenne** : 18h (Phase 2-3)

---

## ⚠️ Priorité CRITIQUE (11h)

**Timing** : À faire **AVANT Phase 1** ou **pendant Phase 1**

### 1. Lecture Obligatoire (1.5h)

**Quand** : IMMÉDIAT (avant d'écrire du code)

**Actions** :
- [ ] **Lire `.claude/SUPABASE_AUTH_RULES.md`** (15 min)
  - Comprendre getUser() vs getSession()
  - Mémoriser matrice de décision
  - Voir patterns Server/Client Components

- [ ] **Lire `docs/03-development/SUPABASE_AUTH_MIDDLEWARE.md`** (20 min)
  - Comprendre flow SSR
  - Voir implémentation complète updateSession()
  - Anticiper problèmes (troubleshooting)

- [ ] **Lire `docs/03-development/SUPABASE_RLS_GUIDE.md`** (30 min)
  - 6 techniques d'optimisation
  - NULL check obligatoire
  - Security Definer Functions

- [ ] **Lire `.claude/STRIPE_RULES.md`** (10 min)
  - Règles de sécurité critiques
  - Interdictions absolues
  - Checklist avant commit

- [ ] **Lire `docs/QUICK_REFERENCE.md`** (10 min)
  - Garder ouvert pendant le coding
  - Référence rapide règles

- [ ] **Lire `docs/TROUBLESHOOTING.md`** (15 min)
  - Solutions aux erreurs communes
  - Patterns de résolution

---

### 2. Audit getUser() vs getSession() (2h)

**Quand** : IMMÉDIAT

**Contexte** :
`getSession()` en Server Components est une **faille de sécurité critique** (cookie non validé, forgeable).

**Actions** :

#### 2.1 Rechercher tous les usages (30 min)

```bash
# Chercher getSession() dans app/ (Server Components)
cd c:\Users\Oms\Desktop\formeliosaas
grep -r "getSession()" app/ --include="*.ts" --include="*.tsx"

# Chercher getSession() dans toute la codebase
grep -r "getSession()" . --include="*.ts" --include="*.tsx" --exclude-dir=node_modules
```

#### 2.2 Analyser chaque occurrence (30 min)

Pour chaque fichier trouvé, déterminer :
- [ ] Est-ce un Server Component ? (`app/` sans `'use client'`)
- [ ] Est-ce une API Route ? (`app/api/`)
- [ ] Est-ce un Server Action ? (`'use server'`)
- [ ] Est-ce un Client Component ? (`'use client'`)

#### 2.3 Remplacer les usages dangereux (1h)

**Si Server Component, API Route, ou Server Action** :

```typescript
// ❌ AVANT (DANGEREUX)
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  redirect('/login');
}
const userId = session.user.id;

// ✅ APRÈS (SÉCURISÉ)
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  redirect('/login');
}
const userId = user.id;
```

**Si Client Component** :
- ✅ Garder `getSession()` (OK côté client)

**Checklist** :
- [ ] Tous les Server Components utilisent `getUser()`
- [ ] Tous les API Routes utilisent `getUser()`
- [ ] Tous les Server Actions utilisent `getUser()`
- [ ] Aucun `getSession()` dans `app/` (sauf Client Components)

---

### 3. Implémenter Middleware Auth SSR (2h)

**Quand** : Phase 1 (Setup)

**Contexte** :
Sans middleware, les tokens Supabase expirent après 60min et les users sont déconnectés.

**Actions** :

#### 3.1 Créer `lib/supabase/middleware.ts` (45 min)

```typescript
// lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // CRITICAL: Ne pas exécuter de code entre createServerClient et getUser
  const { data: { user } } = await supabase.auth.getUser();

  // Optionnel : Protected routes
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/register') &&
    !request.nextUrl.pathname.startsWith('/api') &&
    request.nextUrl.pathname.startsWith('/dashboard')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

#### 3.2 Créer `middleware.ts` à la racine (15 min)

```typescript
// middleware.ts (root)
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

#### 3.3 Tester le refresh (30 min)

**Option 1 : Attendre 65 minutes**
- [ ] Login
- [ ] Attendre 65 min (token expire à 60 min)
- [ ] Naviguer vers une page protégée
- [ ] ✅ Pas de redirect vers login (token refresh auto)

**Option 2 : Forcer expiration (dev)**
- [ ] Login
- [ ] Dans DevTools → Application → Cookies
- [ ] Supprimer `sb-access-token`
- [ ] Naviguer vers page protégée
- [ ] ⚠️ Redirect vers login (normal)

**Option 3 : Logs**
```typescript
// Ajouter logs temporaires dans middleware.ts
const { data: { user } } = await supabase.auth.getUser();
console.log('[Middleware] User:', user?.email || 'Not authenticated');
```

**Checklist** :
- [ ] Middleware créé et configuré
- [ ] Refresh automatique fonctionne
- [ ] Protected routes redirect vers `/login`
- [ ] Pas de loops infinis (vérifier matcher)

---

### 4. Audit RLS Policies - NULL Checks (2h)

**Quand** : Phase 1 (Setup)

**Contexte** :
RLS sans NULL check permet aux users non authentifiés d'accéder aux données (faille critique).

**Actions** :

#### 4.1 Lister toutes les policies (30 min)

```sql
-- Dans Supabase SQL Editor
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

#### 4.2 Analyser chaque policy (1h)

Pour chaque policy, vérifier :
- [ ] Contient `auth.uid() IS NOT NULL` ?
- [ ] OU contient wrapper `(SELECT auth.uid()) IS NOT NULL` ?

**Exemple dangereux** :
```sql
-- ❌ DANGER : Si user non auth, auth.uid() = null
CREATE POLICY "users_select" ON cases
FOR SELECT USING (auth.uid() = user_id);
-- null = 'uuid' → false → requête passe quand même !
```

**Correction** :
```sql
-- ✅ SÉCURISÉ
CREATE POLICY "users_select_safe" ON cases
FOR SELECT USING (
  auth.uid() IS NOT NULL AND
  auth.uid() = user_id
);
```

#### 4.3 Corriger les policies (30 min)

Pour chaque policy sans NULL check :

```sql
-- 1. Supprimer l'ancienne policy
DROP POLICY IF EXISTS "users_select" ON cases;

-- 2. Recréer avec NULL check
CREATE POLICY "users_select_safe" ON cases
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL AND
  auth.uid() = user_id
);
```

**Checklist** :
- [ ] Toutes les policies ont NULL check
- [ ] Toutes les policies spécifient `TO authenticated` (optim)
- [ ] Tests : user non auth ne peut rien lire

---

### 5. Créer Indexes RLS (1h)

**Quand** : Phase 1 (Setup)

**Contexte** :
Sans index sur colonnes RLS, les queries sont **99.94% plus lentes** (scan full table).

**Actions** :

#### 5.1 Identifier colonnes RLS (15 min)

Lister toutes les colonnes utilisées dans RLS policies :
- `user_id`
- `account_id` (si multi-tenant)
- `team_id` (si multi-tenant)
- etc.

#### 5.2 Créer indexes (15 min)

```sql
-- Index sur user_id (presque toujours nécessaire)
CREATE INDEX IF NOT EXISTS idx_cases_user_id ON cases(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- Index sur account_id (si multi-tenant)
CREATE INDEX IF NOT EXISTS idx_cases_account_id ON cases(account_id);
CREATE INDEX IF NOT EXISTS idx_documents_account_id ON documents(account_id);

-- Index composite (si policy utilise 2 colonnes)
CREATE INDEX IF NOT EXISTS idx_cases_user_account ON cases(user_id, account_id);
```

#### 5.3 Tester performance (30 min)

```sql
-- Test avant/après sur table avec 10k lignes
EXPLAIN ANALYZE
SELECT * FROM cases WHERE user_id = 'some-uuid';

-- Vérifier dans résultat :
-- "Index Scan using idx_cases_user_id" ✅
-- "Seq Scan on cases" ❌ (pas bon)
```

**Checklist** :
- [ ] Index créé sur toutes colonnes RLS
- [ ] EXPLAIN ANALYZE confirme usage index
- [ ] Query time < 100ms avec 10k lignes

---

### 6. Optimiser RLS Policies (4h)

**Quand** : Phase 1 (Setup)

**Contexte** :
RLS non optimisé = gains de **94-99%** possibles avec techniques simples.

**Actions** :

#### 6.1 Wrapper auth.uid() (2h)

**Avant** (lent) :
```sql
CREATE POLICY "policy" ON cases
FOR SELECT USING (auth.uid() = user_id);
```

**Après** (95% plus rapide) :
```sql
CREATE POLICY "policy_optimized" ON cases
FOR SELECT USING ((SELECT auth.uid()) = user_id);
```

**Pourquoi** : `(SELECT auth.uid())` est évalué **une seule fois**, puis caché.

**Actions** :
- [ ] Identifier toutes policies avec `auth.uid()`
- [ ] Remplacer par `(SELECT auth.uid())`
- [ ] Tester avec EXPLAIN ANALYZE

#### 6.2 Spécifier role (1h)

**Avant** :
```sql
CREATE POLICY "policy" ON cases
FOR SELECT USING (...);
-- S'applique à tous roles (anonymous, authenticated, service_role)
```

**Après** (99.78% plus rapide) :
```sql
CREATE POLICY "policy" ON cases
FOR SELECT
TO authenticated  -- Spécifier le role
USING (...);
```

**Actions** :
- [ ] Ajouter `TO authenticated` sur toutes policies user-specific
- [ ] Garder `TO public` uniquement si vraiment besoin (rare)

#### 6.3 Filtres explicites client (30 min)

**Pattern** : Toujours filtrer côté client même si RLS actif.

```typescript
// ❌ AVANT : RLS filtre, mais scan full table
const { data } = await supabase.from('cases').select('*');

// ✅ APRÈS : Filtre explicite + RLS (94.74% plus rapide)
const { data } = await supabase
  .from('cases')
  .select('*')
  .eq('user_id', userId);  // Utilise l'index !
```

**Actions** :
- [ ] Auditer toutes les queries Supabase
- [ ] Ajouter `.eq('user_id', userId)` partout
- [ ] Même si RLS filtre déjà (double sécurité + performance)

#### 6.4 Valider performance (30 min)

```sql
-- Test sur table avec 10k lignes
EXPLAIN ANALYZE
SELECT * FROM cases WHERE user_id = 'uuid';

-- Temps attendus :
-- ✅ < 5ms avec index + wrapper + role
-- ⚠️ 50-100ms sans optimisations
-- ❌ > 500ms sans index (scan full)
```

**Checklist** :
- [ ] Toutes policies avec wrapper `(SELECT auth.uid())`
- [ ] Toutes policies spécifient `TO authenticated`
- [ ] Toutes queries client avec filtres explicites
- [ ] Performance < 100ms sur tables 10k lignes

---

## ⭐ Priorité HAUTE (11h)

**Timing** : Phase 1-2

### 7. Configuration Password Policy (1h)

**Quand** : Phase 1 (Setup)

**Actions** :

#### 7.1 Dashboard Supabase (15 min)

1. Aller dans **Authentication** → **Policies**
2. Configurer :
   - **Minimum password length** : 12 (au lieu de 6)
   - **Password strength** : Fair (au lieu de Weak)
3. Sauvegarder

#### 7.2 Tester (15 min)

- [ ] Essayer de créer user avec password 6 caractères
- [ ] ❌ Devrait échouer
- [ ] Essayer avec 12 caractères
- [ ] ✅ Devrait réussir

#### 7.3 Breached Passwords Check (30 min - optionnel)

Intégrer API HaveIBeenPwned :

```typescript
// lib/auth/password-validation.ts
export async function isPasswordBreached(password: string): Promise<boolean> {
  const hash = await sha1(password);
  const prefix = hash.substring(0, 5);
  const suffix = hash.substring(5);

  const response = await fetch(
    `https://api.pwnedpasswords.com/range/${prefix}`
  );
  const data = await response.text();

  return data.includes(suffix.toUpperCase());
}

// Utilisation dans signup
if (await isPasswordBreached(password)) {
  return { error: 'Ce mot de passe a été compromis, choisissez-en un autre' };
}
```

**Checklist** :
- [ ] Password min 12 caractères
- [ ] Breached passwords check (optionnel)
- [ ] Messages d'erreur clairs

---

### 8. JWT Custom Claims RBAC (6h)

**Quand** : Phase 2 (Dashboard)

**Contexte** :
Gérer roles (client, admin, super-admin) via `app_metadata` JWT.

**Actions** :

#### 8.1 Définir roles (30 min)

```typescript
// types/roles.ts
export type UserRole = 'client' | 'admin' | 'super-admin';

export const ROLE_PERMISSIONS = {
  client: ['read:own_cases', 'create:cases', 'update:own_cases'],
  admin: ['read:all_cases', 'create:cases', 'update:all_cases', 'delete:cases'],
  'super-admin': ['*'], // Tous droits
} as const;
```

#### 8.2 Créer fonction assign role (1h)

```typescript
// app/api/admin/assign-role/route.ts
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const { userId, role } = await request.json();

  // Utiliser service_role key
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Server-side only
  );

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    {
      app_metadata: { role },
    }
  );

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
```

#### 8.3 RLS policies basées sur role (2h)

```sql
-- Policy admin : accès à tous les cases
CREATE POLICY "admins_full_access" ON cases
FOR ALL
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'super-admin'
);

-- Policy client : accès uniquement à ses cases
CREATE POLICY "clients_own_access" ON cases
FOR SELECT
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'client'
  AND auth.uid() = user_id
);
```

#### 8.4 UI admin gérer roles (2h)

```typescript
// app/dashboard/admin/users/page.tsx
'use client'

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);

  async function handleRoleChange(userId: string, newRole: UserRole) {
    const res = await fetch('/api/admin/assign-role', {
      method: 'POST',
      body: JSON.stringify({ userId, role: newRole }),
    });

    if (res.ok) {
      toast.success('Role mis à jour');
      // Refresh users list
    }
  }

  return (
    <div>
      <h1>Gestion des utilisateurs</h1>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.app_metadata?.role || 'client'}
                  onChange={(e) =>
                    handleRoleChange(user.id, e.target.value as UserRole)
                  }
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

#### 8.5 Helper vérifier role (30 min)

```typescript
// lib/auth/check-role.ts
import { createClient } from '@/lib/supabase/server';

export async function checkUserRole(
  allowedRoles: UserRole[]
): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const userRole = user.app_metadata?.role as UserRole;
  return allowedRoles.includes(userRole);
}

// Utilisation dans Server Component
export default async function AdminPage() {
  const isAdmin = await checkUserRole(['admin', 'super-admin']);

  if (!isAdmin) {
    redirect('/dashboard');
  }

  return <div>Admin panel</div>;
}
```

**Checklist** :
- [ ] Roles définis (client, admin, super-admin)
- [ ] Fonction assign role créée (API route)
- [ ] RLS policies basées sur role
- [ ] UI admin pour gérer roles
- [ ] Helper checkUserRole()

---

### 9. Customer Portal Stripe (4h)

**Quand** : Phase 3 (Paiement)

**Contexte** :
Permettre aux users de gérer leurs paiements, factures, moyens de paiement (self-service).

**Actions** :

#### 9.1 Configuration Dashboard Stripe (30 min)

1. Aller dans **Settings** → **Customer Portal**
2. Activer :
   - ✅ Invoice history (télécharger factures)
   - ✅ Payment methods (ajouter/supprimer cartes)
   - ✅ Subscription management (si abonnements)
3. Branding :
   - Logo Formelio
   - Couleurs primaires (#2E5F7E)
4. Sauvegarder

#### 9.2 API Route create-portal-session (1h)

```typescript
// app/api/stripe/create-portal-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20',
});

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Récupérer stripe_customer_id depuis profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json(
      { error: 'No Stripe customer found' },
      { status: 400 }
    );
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/billing`,
  });

  return NextResponse.json({ url: session.url });
}
```

#### 9.3 UI bouton "Gérer mes paiements" (1h)

```typescript
// app/dashboard/billing/page.tsx
'use client'

import { Button } from '@/components/ui/button';

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

  async function handleManagePayments() {
    setLoading(true);

    const res = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
    });

    const { url } = await res.json();

    if (url) {
      window.location.href = url; // Redirect vers Stripe Portal
    }

    setLoading(false);
  }

  return (
    <div>
      <h1>Facturation</h1>
      <p>Gérez vos moyens de paiement et téléchargez vos factures.</p>

      <Button onClick={handleManagePayments} disabled={loading}>
        {loading ? 'Chargement...' : 'Gérer mes paiements'}
      </Button>
    </div>
  );
}
```

#### 9.4 Tester (1.5h)

- [ ] Créer customer Stripe (via payment ou manuellement)
- [ ] Cliquer bouton "Gérer mes paiements"
- [ ] ✅ Redirect vers Stripe Customer Portal
- [ ] ✅ Logo et couleurs Formelio affichés
- [ ] ✅ Factures téléchargeables
- [ ] ✅ Moyens de paiement modifiables
- [ ] ✅ Return URL ramène vers `/dashboard/billing`

**Checklist** :
- [ ] Customer Portal configuré dans Stripe Dashboard
- [ ] API route `/api/stripe/create-portal-session`
- [ ] Bouton UI "Gérer mes paiements"
- [ ] Tests complets

---

## 🟢 Priorité MOYENNE (18h)

**Timing** : Phase 2-3

### 10. Multi-Tenant RLS Architecture (8h)

**Quand** : Phase 2+ (si multi-organisation)

**Contexte** :
Permettre aux users d'appartenir à plusieurs organisations (ex: cabinets d'avocats).

**Actions** :

#### 10.1 Créer tables (1h)

```sql
-- Table accounts (organisations)
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('personal', 'team')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table account_members (users ↔ accounts)
CREATE TABLE account_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'member')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, account_id)
);

-- Indexes
CREATE INDEX idx_account_members_user ON account_members(user_id);
CREATE INDEX idx_account_members_account ON account_members(account_id);
```

#### 10.2 RLS policies account-centric (2h)

```sql
-- Policy: Members peuvent voir cases de leur account
CREATE POLICY "account_members_select_cases" ON cases
FOR SELECT
TO authenticated
USING (
  account_id IN (
    SELECT account_id
    FROM account_members
    WHERE user_id = auth.uid()
  )
);

-- Policy: Owners/Admins peuvent créer cases
CREATE POLICY "account_owners_insert_cases" ON cases
FOR INSERT
TO authenticated
WITH CHECK (
  account_id IN (
    SELECT account_id
    FROM account_members
    WHERE user_id = auth.uid()
    AND role IN ('owner', 'admin')
  )
);
```

#### 10.3 UI sélection organisation (3h)

```typescript
// components/account-switcher.tsx
'use client'

export function AccountSwitcher() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentAccountId, setCurrentAccountId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch accounts du user
    async function loadAccounts() {
      const { data } = await supabase
        .from('account_members')
        .select('account_id, accounts(*)')
        .eq('user_id', userId);

      setAccounts(data?.map((m) => m.accounts) || []);
    }
    loadAccounts();
  }, []);

  function handleSwitch(accountId: string) {
    setCurrentAccountId(accountId);
    // Sauvegarder dans localStorage ou cookie
    localStorage.setItem('current_account_id', accountId);
    // Refresh data
    window.location.reload();
  }

  return (
    <select value={currentAccountId || ''} onChange={(e) => handleSwitch(e.target.value)}>
      {accounts.map((account) => (
        <option key={account.id} value={account.id}>
          {account.name}
        </option>
      ))}
    </select>
  );
}
```

#### 10.4 Filtrer queries par account (1h)

```typescript
// Récupérer account_id actif
const accountId = localStorage.getItem('current_account_id');

// Toutes les queries filtrées par account_id
const { data: cases } = await supabase
  .from('cases')
  .select('*')
  .eq('account_id', accountId);
```

#### 10.5 Tester (1h)

- [ ] Créer 2 accounts
- [ ] Ajouter user aux 2 accounts
- [ ] Switcher entre accounts
- [ ] ✅ Voir uniquement cases de l'account actif
- [ ] ✅ Permissions respectées (owner vs member)

**Checklist** :
- [ ] Tables `accounts` + `account_members` créées
- [ ] RLS policies account-centric
- [ ] UI sélection organisation
- [ ] Queries filtrées par account_id

---

### 11. Génération Factures PDF (6h)

**Quand** : Phase 3 (Paiement)

**Actions** :

#### 11.1 Installer dépendances (15 min)

```bash
npm install @react-pdf/renderer
npm install --save-dev @types/react-pdf
```

#### 11.2 Template PDF (2h)

```typescript
// lib/pdf/invoice-template.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  // ... autres styles
});

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  items: Array<{ description: string; amount: number }>;
  total: number;
}

export function InvoiceTemplate({ data }: { data: InvoiceData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Facture {data.invoiceNumber}</Text>
          <Text>Date: {data.date}</Text>
        </View>

        <View>
          <Text>Client: {data.clientName}</Text>
        </View>

        <View>
          {data.items.map((item, i) => (
            <View key={i}>
              <Text>{item.description}</Text>
              <Text>{item.amount}€</Text>
            </View>
          ))}
        </View>

        <View>
          <Text>Total: {data.total}€</Text>
        </View>
      </Page>
    </Document>
  );
}
```

#### 11.3 API Route génération (2h)

```typescript
// app/api/invoices/[id]/pdf/route.ts
import { renderToStream } from '@react-pdf/renderer';
import { InvoiceTemplate } from '@/lib/pdf/invoice-template';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Récupérer invoice
  const { data: invoice } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (!invoice) {
    return new Response('Not found', { status: 404 });
  }

  // Générer PDF
  const stream = await renderToStream(
    <InvoiceTemplate data={invoice} />
  );

  return new Response(stream as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="facture-${invoice.number}.pdf"`,
    },
  });
}
```

#### 11.4 Bouton télécharger (1h)

```typescript
// components/invoice-download-button.tsx
'use client'

export function InvoiceDownloadButton({ invoiceId }: { invoiceId: string }) {
  async function handleDownload() {
    const res = await fetch(`/api/invoices/${invoiceId}/pdf`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facture-${invoiceId}.pdf`;
    a.click();
  }

  return (
    <Button onClick={handleDownload}>
      Télécharger PDF
    </Button>
  );
}
```

#### 11.5 Tester (1h)

- [ ] Créer invoice dans DB
- [ ] Cliquer "Télécharger PDF"
- [ ] ✅ PDF généré et téléchargé
- [ ] ✅ Contenu correct (numéro, date, montant)
- [ ] ✅ Logo Formelio affiché

**Checklist** :
- [ ] Template PDF créé
- [ ] API route génération
- [ ] Bouton télécharger
- [ ] Tests complets

---

### 12. Apple Pay & Google Pay (2h)

**Quand** : Phase 3 (Paiement)

**Actions** :

#### 12.1 Configuration Stripe (30 min)

Dans Stripe Dashboard :
1. **Settings** → **Payment Methods**
2. Activer :
   - ✅ Apple Pay
   - ✅ Google Pay
3. Configurer domaines (pour Apple Pay) :
   - Ajouter `yourdomain.com`
   - Télécharger fichier verification
   - Placer dans `public/.well-known/apple-developer-merchantid-domain-association`

#### 12.2 Modifier Checkout Session (30 min)

```typescript
// app/api/stripe/create-checkout-session/route.ts
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card', 'apple_pay', 'google_pay'], // Ajouter
  line_items: [
    {
      price_data: {
        currency: 'eur',
        product_data: {
          name: 'Formalité complexe',
        },
        unit_amount: 15000, // 150€
      },
      quantity: 1,
    },
  ],
  mode: 'payment',
  success_url: `${baseUrl}/dashboard/cases?success=true`,
  cancel_url: `${baseUrl}/dashboard/cases?canceled=true`,
});
```

#### 12.3 Tester (1h)

**Apple Pay** :
- [ ] Ouvrir page payment sur iPhone Safari
- [ ] ✅ Bouton "Apple Pay" visible
- [ ] ✅ Paiement fonctionne

**Google Pay** :
- [ ] Ouvrir page payment sur Android Chrome
- [ ] ✅ Bouton "Google Pay" visible
- [ ] ✅ Paiement fonctionne

**Desktop** :
- [ ] Ouvrir page payment sur Chrome macOS/Windows
- [ ] ✅ Boutons visibles si wallet configuré
- [ ] ✅ Fallback sur carte si pas de wallet

**Checklist** :
- [ ] Payment methods activés dans Stripe
- [ ] Domaine Apple Pay vérifié
- [ ] Checkout Session modifié
- [ ] Tests Apple Pay + Google Pay

---

### 13. MFA Enforcement (2h)

**Quand** : Phase 3+ (optionnel)

**Contexte** :
Forcer MFA pour opérations sensibles (remboursements, suppressions).

**Actions** :

#### 13.1 RLS policy avec aal2 (30 min)

```sql
-- Policy: Remboursements nécessitent MFA
CREATE POLICY "refunds_require_mfa" ON transactions
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() ->> 'aal') = 'aal2'  -- Assurance Level 2 (MFA)
  AND auth.uid() = user_id
  AND type = 'refund'
);
```

#### 13.2 UI MFA setup (1h)

```typescript
// app/dashboard/security/page.tsx
'use client'

export default function SecurityPage() {
  const [mfaEnabled, setMfaEnabled] = useState(false);

  async function handleEnrollMFA() {
    const supabase = createClient();

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
    });

    if (data) {
      // Afficher QR code
      const qrCodeUrl = data.totp.qr_code;
      // User scanne avec Google Authenticator
    }
  }

  return (
    <div>
      <h1>Sécurité</h1>
      {!mfaEnabled ? (
        <Button onClick={handleEnrollMFA}>
          Activer l'authentification à deux facteurs
        </Button>
      ) : (
        <p>✅ MFA activé</p>
      )}
    </div>
  );
}
```

#### 13.3 Tester (30 min)

- [ ] Activer MFA sur un compte
- [ ] Tenter remboursement sans MFA
- [ ] ❌ Devrait échouer (RLS policy)
- [ ] Login avec MFA
- [ ] Tenter remboursement avec MFA
- [ ] ✅ Devrait réussir

**Checklist** :
- [ ] RLS policy avec `aal2`
- [ ] UI MFA setup
- [ ] Tests avec/sans MFA

---

## 📊 Récapitulatif par Phase

### Phase 0 : Lecture & Audit (Immédiat)

**Durée** : 3-4h

| Action | Effort | Priorité |
|--------|--------|----------|
| Lecture obligatoire | 1.5h | ⚠️ CRITIQUE |
| Audit getSession() | 2h | ⚠️ CRITIQUE |

**Checklist** :
- [ ] Tous docs critiques lus
- [ ] Tous usages getSession() identifiés

---

### Phase 1 : Setup & Sécurité (Semaines 1-5)

**Durée** : ~11h critiques

| Action | Effort | Priorité |
|--------|--------|----------|
| Middleware Auth | 2h | ⚠️ CRITIQUE |
| Audit RLS NULL checks | 2h | ⚠️ CRITIQUE |
| Créer indexes RLS | 1h | ⚠️ CRITIQUE |
| Optimiser RLS policies | 4h | ⚠️ CRITIQUE |
| Configuration password policy | 1h | ⭐ HAUTE |
| Configuration Supabase | 1h | ⭐ HAUTE |

**Checklist** :
- [ ] Middleware Auth implémenté et testé
- [ ] Toutes RLS policies avec NULL check
- [ ] Indexes créés sur colonnes RLS
- [ ] RLS optimisé (wrapper, role, filtres)
- [ ] Password policy configurée (min 12)

---

### Phase 2 : Dashboard & RBAC (Semaines 6-11)

**Durée** : ~11h hautes

| Action | Effort | Priorité |
|--------|--------|----------|
| JWT Custom Claims RBAC | 6h | ⭐ HAUTE |
| Customer Portal Stripe | 4h | ⭐ HAUTE |
| Multi-Tenant RLS | 8h | 🟢 MOYENNE |

**Checklist** :
- [ ] Roles définis et assignables
- [ ] RLS policies basées sur roles
- [ ] UI admin gérer roles
- [ ] Customer Portal configuré
- [ ] Multi-Tenant (si applicable)

---

### Phase 3 : Paiement & Facturation (Semaines 12-14)

**Durée** : ~18h moyennes

| Action | Effort | Priorité |
|--------|--------|----------|
| Génération factures PDF | 6h | 🟢 MOYENNE |
| Apple Pay & Google Pay | 2h | 🟢 MOYENNE |
| MFA Enforcement | 2h | 🟢 MOYENNE |
| Stripe Integration complète | 8h | Suivre STRIPE_INTEGRATION_GUIDE.md |

**Checklist** :
- [ ] Factures PDF générées
- [ ] Apple/Google Pay activés
- [ ] MFA enforcement (optionnel)
- [ ] Stripe integration complète

---

## ✅ Checklist Finale

### Documentation

- [ ] Tous docs critiques lus (1.5h)
- [ ] QUICK_REFERENCE.md imprimé et à portée de main
- [ ] TROUBLESHOOTING.md consulté en cas d'erreur

### Sécurité

- [ ] Aucun `getSession()` en Server Components
- [ ] Middleware Auth implémenté
- [ ] Toutes RLS policies avec NULL check
- [ ] Indexes RLS créés
- [ ] RLS policies optimisées
- [ ] Password policy 12+ caractères
- [ ] JWT Custom Claims RBAC (Phase 2)

### Stripe

- [ ] Customer Portal configuré
- [ ] Apple/Google Pay activés
- [ ] Factures PDF générées
- [ ] Webhooks sécurisés (validation signature)

### Performance

- [ ] RLS optimisé (gains 95%+)
- [ ] Indexes sur toutes colonnes RLS
- [ ] Queries < 100ms sur tables 10k lignes

### Tests

- [ ] Middleware Auth testé (refresh tokens)
- [ ] RLS policies testées (user non auth)
- [ ] Customer Portal testé
- [ ] Génération PDF testée
- [ ] Apple/Google Pay testés

---

## 📞 Support

Pour toute question :
1. **Consulter** : [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. **Vérifier** : [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
3. **Approfondir** : Guides dans `docs/03-development/`

---

**Version** : 1.0
**Dernière mise à jour** : Octobre 2025
**Effort total** : ~40h (11h critique + 11h haute + 18h moyenne)

💙 **Formelio** - Votre temps, notre priorité
