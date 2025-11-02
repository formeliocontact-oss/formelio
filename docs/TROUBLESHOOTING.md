# Troubleshooting Guide - Formelio

**Version**: 1.0
**Date**: Octobre 2025
**Usage**: Solutions aux erreurs communes

---

## 📋 Table des Matières

1. [Erreurs TypeScript](#erreurs-typescript)
2. [Problèmes Supabase Auth](#problèmes-supabase-auth)
3. [Erreurs Next.js Build](#erreurs-nextjs-build)
4. [Échecs de Tests](#échecs-de-tests)
5. [Problèmes Stripe](#problèmes-stripe)
6. [Erreurs de Développement](#erreurs-de-développement)
7. [FAQ](#faq)

---

## Erreurs TypeScript

### Erreur: `Type 'any' is not assignable to type...`

**Cause**: Utilisation de `any` (interdit dans le projet)

**Solution**:
```typescript
// ❌ MAUVAIS
const data: any = await fetchData();

// ✅ BON - Utiliser types explicites
interface UserData {
  id: string;
  email: string;
  name: string | null;
}

const data: UserData = await fetchData();

// ✅ BON - Si type inconnu, utiliser unknown avec type guard
const data: unknown = await fetchData();
if (isUserData(data)) {
  console.log(data.email); // Type-safe
}

function isUserData(data: unknown): data is UserData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'email' in data
  );
}
```

---

### Erreur: `Property 'xxx' does not exist on type 'unknown'`

**Cause**: Variable typée `unknown` sans validation

**Solution**:
```typescript
// ❌ MAUVAIS
const data: unknown = await fetch('/api/data');
console.log(data.name); // Erreur!

// ✅ BON - Type guard
function isValidData(data: unknown): data is { name: string } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    typeof (data as { name: string }).name === 'string'
  );
}

const data: unknown = await fetch('/api/data');
if (isValidData(data)) {
  console.log(data.name); // OK
}
```

---

### Erreur: `Argument of type 'X' is not assignable to parameter of type 'never'`

**Cause**: Type inference échoue, souvent avec tableaux vides ou useState

**Solution**:
```typescript
// ❌ MAUVAIS
const [items, setItems] = useState([]);
setItems([{ id: 1, name: 'Test' }]); // Erreur!

// ✅ BON - Type explicite
const [items, setItems] = useState<{ id: number; name: string }[]>([]);
setItems([{ id: 1, name: 'Test' }]); // OK
```

---

### Erreur: `Cannot find module '@/...' or its corresponding type declarations`

**Cause**: Path alias non configuré correctement

**Solution**:

1. Vérifier `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

2. Redémarrer VS Code: `Ctrl+Shift+P` → `Reload Window`

3. Si persistant, nettoyer cache:
```bash
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

---

### Erreur: `Type 'xxx' has no properties in common with type 'IntrinsicAttributes'`

**Cause**: Props du composant mal typées

**Solution**:
```typescript
// ❌ MAUVAIS
export function Button(props: { label: string; onClick: () => void }) {
  return <button onClick={props.onClick}>{props.label}</button>;
}

// ✅ BON - Interface explicite
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

---

## Problèmes Supabase Auth

### Erreur: `Invalid Supabase URL`

**Cause**: `.env.local` mal configuré ou absent

**Solution**:

1. Vérifier `.env.local` existe:
```bash
ls -la .env.local
```

2. Vérifier les variables:
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Vérifier les URLs dans Supabase Dashboard → Settings → API

4. Redémarrer le serveur dev:
```bash
npm run dev
```

---

### Erreur: `Auth session missing!` ou `401 Unauthorized`

**Cause**: Session expirée ou cookies non gérés correctement

**Solution**:

**Vérifier l'implémentation Supabase**:

1. Dans Server Component, utiliser `getUser()`:
```typescript
// ✅ BON - Server Component
const { data: { user } } = await supabase.auth.getUser();
```

2. Dans Client Component, utiliser `getSession()`:
```typescript
// ✅ BON - Client Component
'use client'

useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
  });
}, []);
```

3. Vérifier middleware est configuré:
```typescript
// middleware.ts
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

---

### Erreur: `createMiddlewareClient is not a function`

**Cause**: Utilisation du package deprecated `@supabase/auth-helpers-nextjs`

**Solution**:

1. Désinstaller le package deprecated:
```bash
npm uninstall @supabase/auth-helpers-nextjs
```

2. Installer `@supabase/ssr`:
```bash
npm install @supabase/ssr
```

3. Mettre à jour les imports:
```typescript
// ❌ MAUVAIS
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// ✅ BON
import { createServerClient } from '@supabase/ssr';
```

4. Mettre à jour l'implémentation (voir [QUICK_REFERENCE.md](QUICK_REFERENCE.md))

---

### Erreur: `Cookies can only be modified in a Server Action or Route Handler`

**Cause**: Tentative de modification de cookies dans Server Component

**Solution**:

**Option 1**: Utiliser Server Action:
```typescript
// app/actions.ts
'use server'

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
```

**Option 2**: Utiliser API Route:
```typescript
// app/api/auth/signout/route.ts
export async function POST() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect('/login');
}
```

---

### Erreur: `Row Level Security policy violation`

**Cause**: RLS activé mais policies mal configurées

**Solution**:

1. Vérifier RLS est activé:
```sql
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
```

2. Vérifier policies existent:
```sql
-- Pour SELECT
CREATE POLICY "Users can view their own cases"
ON cases FOR SELECT
USING (auth.uid() = user_id);

-- Pour INSERT
CREATE POLICY "Users can insert their own cases"
ON cases FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Pour UPDATE
CREATE POLICY "Users can update their own cases"
ON cases FOR UPDATE
USING (auth.uid() = user_id);

-- Pour DELETE
CREATE POLICY "Users can delete their own cases"
ON cases FOR DELETE
USING (auth.uid() = user_id);
```

3. Tester dans Supabase Dashboard → SQL Editor

4. Si problème persiste, vérifier authentification:
```typescript
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user); // Doit être défini
```

---

## Erreurs Next.js Build

### Erreur: `Module not found: Can't resolve 'xxx'`

**Cause**: Import incorrect ou module manquant

**Solution**:

1. Vérifier l'import:
```typescript
// ❌ MAUVAIS
import { Button } from 'components/ui/button';

// ✅ BON
import { Button } from '@/components/ui/button';
```

2. Vérifier le fichier existe:
```bash
ls -la src/components/ui/button.tsx
```

3. Vérifier package installé:
```bash
npm list <package-name>
npm install <package-name>
```

4. Clean build:
```bash
rm -rf .next
npm run build
```

---

### Erreur: `Error: Text content does not match server-rendered HTML`

**Cause**: Hydration mismatch entre serveur et client

**Solution**:

1. Vérifier aucun rendu conditionnel basé sur browser APIs dans Server Components:
```typescript
// ❌ MAUVAIS - Server Component
export default function Page() {
  const isMobile = window.innerWidth < 768; // window undefined!
  return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
}

// ✅ BON - Client Component
'use client'

export default function Page() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
}
```

2. Utiliser `suppressHydrationWarning` si nécessaire:
```tsx
<time suppressHydrationWarning>
  {new Date().toLocaleString()}
</time>
```

---

### Erreur: `You're importing a component that needs useState/useEffect...`

**Cause**: Client Component importé dans Server Component sans `'use client'`

**Solution**:

Ajouter `'use client'` en haut du fichier:
```typescript
// components/user-profile.tsx
'use client' // ⚠️ Obligatoire si utilise hooks

import { useState } from 'react';

export function UserProfile() {
  const [name, setName] = useState('');
  // ...
}
```

---

### Erreur: `Dynamic server usage: cookies`

**Cause**: Utilisation de cookies dans un composant qui devrait être statique

**Solution**:

1. Marquer la route comme dynamique:
```typescript
// app/dashboard/page.tsx
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();
  // ...
}
```

2. Ou utiliser revalidation:
```typescript
export const revalidate = 0; // Revalidate chaque requête
```

---

## Échecs de Tests

### Erreur: `ReferenceError: fetch is not defined`

**Cause**: Node.js < 18 ou fetch non polyfillé

**Solution**:

1. Vérifier version Node.js:
```bash
node -v # Doit être >= 18.0.0
```

2. Ou installer polyfill:
```bash
npm install whatwg-fetch
```

```typescript
// vitest.setup.ts
import 'whatwg-fetch';
```

---

### Erreur: `Cannot find module 'next/navigation'` dans tests

**Cause**: Next.js modules ne sont pas mockés

**Solution**:

Mocker `next/navigation` dans setup:
```typescript
// vitest.setup.ts
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '/dashboard',
}));
```

---

### Erreur: Tests Supabase échouent avec `TypeError: supabase.from is not a function`

**Cause**: Client Supabase non mocké correctement

**Solution**:

Mocker Supabase client:
```typescript
// __tests__/mocks/supabase.ts
export const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: {}, error: null }),
  })),
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: { id: '123', email: 'test@example.com' } },
      error: null
    }),
    getSession: vi.fn().mockResolvedValue({
      data: { session: null },
      error: null
    }),
  },
};

// Dans test
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabaseClient
}));
```

---

### Erreur: Tests E2E Playwright échouent avec timeout

**Cause**: Éléments lents à charger ou sélecteurs incorrects

**Solution**:

1. Augmenter timeout:
```typescript
// playwright.config.ts
export default defineConfig({
  timeout: 30000, // 30 secondes
  expect: {
    timeout: 5000,
  },
});
```

2. Utiliser waitFor:
```typescript
// Au lieu de
await page.click('button');

// Utiliser
await page.waitForSelector('button', { state: 'visible' });
await page.click('button');
```

3. Utiliser meilleurs sélecteurs:
```typescript
// ❌ MAUVAIS
await page.click('.btn-submit');

// ✅ BON
await page.getByRole('button', { name: 'Submit' }).click();
```

---

## Problèmes Stripe

### Erreur: `No API key provided`

**Cause**: Clé Stripe non configurée dans `.env.local`

**Solution**:

1. Ajouter dans `.env.local`:
```bash
STRIPE_SECRET_KEY=sk_test_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
```

2. Vérifier les clés dans Stripe Dashboard → Developers → API Keys

3. Redémarrer serveur dev:
```bash
npm run dev
```

---

### Erreur: `Invalid API Key provided`

**Cause**: Mauvaise clé ou clé pour mauvais environnement

**Solution**:

1. Vérifier environnement:
   - `sk_test_...` pour développement
   - `sk_live_...` pour production

2. Régénérer clé si compromise:
   - Stripe Dashboard → Developers → API Keys → Reveal test key

3. S'assurer d'utiliser la clé secrète côté serveur uniquement:
```typescript
// ❌ MAUVAIS - Client Component
'use client'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ✅ BON - API Route
// app/api/payment/route.ts
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
```

---

### Erreur: `Resource missing` ou `No such customer`

**Cause**: ID Stripe invalide ou ressource supprimée

**Solution**:

1. Vérifier ID format:
```typescript
// Les IDs Stripe ont préfixes spécifiques
// cus_xxx pour customers
// sub_xxx pour subscriptions
// pm_xxx pour payment methods
// pi_xxx pour payment intents

// ✅ Validation
if (!customerId.startsWith('cus_')) {
  throw new Error('Invalid customer ID');
}
```

2. Vérifier ressource existe dans Stripe Dashboard

3. Gérer erreurs gracieusement:
```typescript
try {
  const customer = await stripe.customers.retrieve(customerId);
} catch (error) {
  if (error.code === 'resource_missing') {
    // Créer nouveau customer
    const newCustomer = await stripe.customers.create({...});
  }
}
```

---

### Erreur: Webhook signature verification fails

**Cause**: Webhook secret incorrect ou signature invalide

**Solution**:

1. Obtenir webhook secret:
   - Stripe Dashboard → Developers → Webhooks
   - Copier "Signing secret"

2. Ajouter dans `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

3. Vérifier implémentation:
```typescript
// app/api/webhooks/stripe/route.ts
const sig = headers().get('stripe-signature');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

let event;
try {
  event = stripe.webhooks.constructEvent(
    await request.text(),
    sig!,
    webhookSecret
  );
} catch (err) {
  console.error('Webhook signature verification failed:', err.message);
  return NextResponse.json(
    { error: 'Invalid signature' },
    { status: 400 }
  );
}
```

---

## Erreurs de Développement

### Erreur: `EADDRINUSE: address already in use :::3000`

**Cause**: Port 3000 déjà utilisé par un autre process

**Solution**:

**Option 1**: Tuer le process sur le port:
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Option 2**: Utiliser un autre port:
```bash
PORT=3001 npm run dev
```

---

### Erreur: `ENOSPC: System limit for number of file watchers reached`

**Cause**: Limite de watchers système atteinte (Linux)

**Solution**:

Augmenter la limite:
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

### Erreur: `Module build failed: UnhandledSchemeError: Reading from "node:..." is not handled by plugins`

**Cause**: Plugin ou configuration Webpack/Vite incorrecte

**Solution**:

1. Clean install:
```bash
rm -rf node_modules package-lock.json
npm install
```

2. Vérifier versions compatibles dans `package.json`

3. Redémarrer serveur dev

---

## FAQ

### Q: Comment déboguer une erreur TypeScript complexe?

**R**: Approche pas à pas:

1. Lire l'erreur complètement (en partant du bas)
2. Identifier le fichier et ligne exacte
3. Isoler le code problématique
4. Vérifier types des variables une par une:
```typescript
type Check1 = typeof variable1; // Hover pour voir type
type Check2 = typeof variable2;
```
5. Utiliser `satisfies` pour contraindre sans changer type:
```typescript
const config = {
  apiUrl: 'https://api.com',
  timeout: 5000
} satisfies Config;
```

---

### Q: Comment résoudre "cannot read property 'xxx' of undefined"?

**R**: Utiliser optional chaining et nullish coalescing:

```typescript
// ❌ MAUVAIS
const name = user.profile.name; // Error si user ou profile undefined

// ✅ BON
const name = user?.profile?.name ?? 'Unknown';
```

Ou vérifier explicitement:
```typescript
if (user && user.profile && user.profile.name) {
  console.log(user.profile.name);
}
```

---

### Q: Comment gérer les erreurs asynchrones correctement?

**R**: Toujours utiliser try/catch avec async/await:

```typescript
// ❌ MAUVAIS
async function fetchData() {
  const data = await fetch('/api/data');
  return data.json();
}

// ✅ BON
async function fetchData() {
  try {
    const response = await fetch('/api/data');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Fetch error:', error);
    return { data: null, error: error.message };
  }
}
```

---

### Q: Mon composant re-render trop souvent, comment optimiser?

**R**: Utiliser useMemo, useCallback et React.memo:

```typescript
// 1. Mémoiser valeurs calculées
const filteredItems = useMemo(
  () => items.filter(i => i.active),
  [items]
);

// 2. Mémoiser callbacks
const handleClick = useCallback(
  () => {
    doSomething(id);
  },
  [id]
);

// 3. Mémoiser composants
const MemoizedComponent = React.memo(MyComponent);
```

---

### Q: Comment debugger Supabase RLS policies?

**R**:

1. Tester dans SQL Editor avec `auth.uid()`:
```sql
-- Simuler un user_id
SELECT * FROM cases WHERE user_id = 'xxx';

-- Tester policy
SELECT * FROM cases WHERE user_id = (SELECT auth.uid());
```

2. Vérifier user authentifié:
```typescript
const { data: { user } } = await supabase.auth.getUser();
console.log('Authenticated user:', user?.id);
```

3. Désactiver temporairement RLS pour tester:
```sql
ALTER TABLE cases DISABLE ROW LEVEL SECURITY;
-- Tester
-- TOUJOURS réactiver après!
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
```

---

### Q: Comment résoudre les conflits de merge Git?

**R**:

1. Identifier fichiers en conflit:
```bash
git status
```

2. Ouvrir fichier, chercher les markers:
```
<<<<<<< HEAD
// Votre code
=======
// Code de la branche à merger
>>>>>>> branch-name
```

3. Résoudre manuellement en gardant le bon code

4. Marquer comme résolu:
```bash
git add <fichier>
```

5. Compléter le merge:
```bash
git commit
```

---

### Q: Tests passent localement mais échouent en CI/CD?

**R**: Causes communes:

1. **Variables d'environnement manquantes**:
   - Vérifier secrets CI/CD configurés

2. **Différences de timezone**:
```typescript
// ❌ MAUVAIS
expect(date).toBe('2025-01-01');

// ✅ BON
expect(date).toMatch(/2025-01-01/);
```

3. **Timeouts trop courts**:
```typescript
// playwright.config.ts
timeout: process.env.CI ? 60000 : 30000
```

4. **Dépendances système manquantes**:
```yaml
# .github/workflows/test.yml
- name: Install Playwright browsers
  run: npx playwright install --with-deps
```

---

## 🔗 Ressources Supplémentaires

### Documentation
- [Next.js Error Messages](https://nextjs.org/docs/messages)
- [Supabase Error Codes](https://supabase.com/docs/guides/platform/troubleshooting)
- [Stripe Error Handling](https://stripe.com/docs/error-handling)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)

### Outils de Debug
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Next.js DevTools](https://nextjs.org/docs/app/building-your-application/optimizing/testing#developer-tools)
- [Supabase Studio](https://supabase.com/docs/guides/platform/studio)

### Projet
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Règles critiques
- [CHECKLIST.md](01-getting-started/CHECKLIST.md) - Setup guide
- [CLAUDE.md](../.claude/CLAUDE.md) - Documentation complète

---

**Version**: 1.0
**Dernière mise à jour**: Octobre 2025
**Projet**: Formelio - Service de formalités juridiques

**⚠️ Si votre erreur n'est pas listée ici, consulter les docs officielles ou demander sur le channel équipe**
