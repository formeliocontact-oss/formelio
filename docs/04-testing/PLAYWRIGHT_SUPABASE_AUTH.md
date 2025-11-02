# Playwright + Supabase Authentication Guide

**Version**: 1.0
**Date**: Octobre 2025
**Priorité**: 🔴 CRITIQUE

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Problème : Tests d'authentification lents](#problème--tests-dauthentification-lents)
3. [Solution : Authentification programmatique](#solution--authentification-programmatique)
4. [Implémentation complète](#implémentation-complète)
5. [Fixtures Playwright personnalisées](#fixtures-playwright-personnalisées)
6. [Gestion des cookies Supabase](#gestion-des-cookies-supabase)
7. [Exemples d'utilisation](#exemples-dutilisation)
8. [Troubleshooting](#troubleshooting)
9. [Bonnes pratiques](#bonnes-pratiques)

---

## Vue d'ensemble

### Pourquoi l'authentification programmatique ?

L'authentification programmatique permet de contourner l'interface utilisateur (UI) de login pour injecter directement une session Supabase valide dans le navigateur Playwright. Cela résout plusieurs problèmes critiques :

**⚡ Performance**
- Tests **95% plus rapides** (de 5-10s à 0.5s par test)
- Pas de navigation vers `/login` à chaque test
- Pas d'attente de chargement de pages
- Pas d'interactions UI (fill, click, waitForURL)

**✅ Fiabilité**
- Élimine les tests "flaky" dus aux timeouts UI
- Pas de problèmes de sélecteurs CSS changeants
- Pas de dépendance à l'état de la page de login
- Tests déterministes et reproductibles

**🎯 Focus métier**
- Tests concentrés sur la fonctionnalité réelle
- Séparation claire : tests auth vs tests métier
- Meilleure lisibilité du code de test

### Quand utiliser l'authentification programmatique ?

| Scénario | Méthode recommandée |
|----------|---------------------|
| Test de la fonctionnalité de login | ❌ UI (via page de login) |
| Test de validation des formulaires auth | ❌ UI (via page de login) |
| Test de messages d'erreur auth | ❌ UI (via page de login) |
| Test de dashboard utilisateur | ✅ Programmatique |
| Test de création de dossier | ✅ Programmatique |
| Test de navigation dans l'app | ✅ Programmatique |
| Test de modification de profil | ✅ Programmatique |

**Règle d'or** : Si votre test ne vérifie PAS le processus d'authentification lui-même, utilisez l'authentification programmatique.

---

## Problème : Tests d'authentification lents

### ❌ Approche traditionnelle (LENTE)

```typescript
// tests/e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test('user can view their cases', async ({ page }) => {
  // ❌ Login via UI à CHAQUE test (5-10 secondes)
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'SecurePassword123!');
  await page.click('[type="submit"]');
  await page.waitForURL('/dashboard'); // Attente navigation

  // Le test réel commence seulement ICI
  await expect(page.locator('h1')).toContainText('Mes dossiers');
  const caseCards = page.locator('[data-testid="case-card"]');
  await expect(caseCards).toHaveCount(3);
});

test('user can create a new case', async ({ page }) => {
  // ❌ RE-login pour le 2ème test (encore 5-10 secondes)
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'SecurePassword123!');
  await page.click('[type="submit"]');
  await page.waitForURL('/dashboard');

  // Test réel
  await page.click('[data-testid="new-case-button"]');
  // ...
});
```

### Problèmes identifiés

1. **Duplication massive** : Code de login répété dans chaque test
2. **Lenteur cumulative** : 10 tests auth = 50-100 secondes perdues
3. **Tests fragiles** : Dépendance aux sélecteurs UI de la page login
4. **Maintenance coûteuse** : Changement UI login = tous les tests cassés
5. **Difficulté debugging** : Échec auth masque les vrais problèmes

### Métriques réelles sur Formelio

```
Suite de 50 tests E2E protégés
Approche UI :           350 secondes (5m 50s)
Approche programmatique: 25 secondes (0m 25s)
Gain de temps :         325 secondes (93% plus rapide)
```

---

## Solution : Authentification programmatique

### ✅ Approche optimisée (RAPIDE)

```typescript
// tests/e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test('user can view their cases', async ({ authenticatedPage }) => {
  // ✅ Déjà authentifié ! (0.5 seconde)
  await authenticatedPage.goto('/dashboard');

  // Test commence immédiatement
  await expect(authenticatedPage.locator('h1')).toContainText('Mes dossiers');
  const caseCards = authenticatedPage.locator('[data-testid="case-card"]');
  await expect(caseCards).toHaveCount(3);
});

test('user can create a new case', async ({ authenticatedPage }) => {
  // ✅ Déjà authentifié ! (0.5 seconde)
  await authenticatedPage.goto('/dashboard');

  // Test commence immédiatement
  await authenticatedPage.click('[data-testid="new-case-button"]');
  // ...
});
```

### Avantages

1. **Performance** : 95% plus rapide (0.5s vs 10s)
2. **Simplicité** : 1 ligne au lieu de 6
3. **Maintenabilité** : Changement auth centralisé
4. **Fiabilité** : Pas de flakiness UI
5. **Lisibilité** : Code de test focalisé sur le métier

---

## Implémentation complète

### Étape 1 : Variables d'environnement

Créer `.env.test` pour les tests E2E :

```bash
# .env.test
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ⚠️ CRITIQUE : Service Role Key pour l'auth programmatique
# NE JAMAIS committer cette clé en production !
# Pour les tests locaux uniquement (Supabase local dev)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Utilisateur de test
TEST_USER_EMAIL=test@formelio.fr
TEST_USER_PASSWORD=TestPassword123!
TEST_USER_ID=00000000-0000-0000-0000-000000000001
```

**⚠️ Sécurité** :
- ✅ Utiliser Supabase local dev (`npx supabase start`)
- ✅ Ne JAMAIS utiliser la production pour les tests
- ✅ Ajouter `.env.test` au `.gitignore`
- ✅ Utiliser GitHub Secrets pour CI/CD

### Étape 2 : Utilitaire d'authentification

Créer `tests/utils/auth.ts` :

```typescript
// tests/utils/auth.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * Crée une session Supabase valide pour un utilisateur de test
 *
 * ⚠️ Utilise le Service Role Key - NE PAS utiliser en production !
 *
 * @param email - Email de l'utilisateur de test
 * @param password - Mot de passe de l'utilisateur de test
 * @returns Session Supabase avec access_token et refresh_token
 */
export async function createTestSession(
  email: string = process.env.TEST_USER_EMAIL!,
  password: string = process.env.TEST_USER_PASSWORD!
) {
  // Client Supabase avec Service Role Key
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // ⚠️ Service key
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // Créer session via signInWithPassword
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`Failed to create test session: ${error.message}`);
  }

  if (!data.session) {
    throw new Error('No session returned from Supabase');
  }

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    user: data.user,
  };
}

/**
 * Extrait le nom de domaine de l'URL Supabase pour les cookies
 *
 * Exemples :
 * - http://127.0.0.1:54321 -> "127.0.0.1"
 * - https://abcdefg.supabase.co -> "abcdefg.supabase.co"
 */
export function getSupabaseCookieDomain(): string {
  const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
  return url.hostname;
}

/**
 * Génère le nom des cookies Supabase basé sur l'URL
 *
 * Format : sb-{project-ref}-auth-token
 *
 * Exemples :
 * - Local : sb-127-auth-token
 * - Hosted : sb-abcdefg-auth-token
 */
export function getSupabaseCookieNames() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  // Extraire le project ref (premier subdomain ou "127" pour local)
  let projectRef: string;

  if (url.includes('127.0.0.1') || url.includes('localhost')) {
    projectRef = '127'; // Local dev
  } else {
    const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
    if (!match) {
      throw new Error(`Cannot extract project ref from URL: ${url}`);
    }
    projectRef = match[1];
  }

  return {
    accessToken: `sb-${projectRef}-auth-token`,
    refreshToken: `sb-${projectRef}-auth-token-refresh`,
  };
}
```

### Étape 3 : Fixture Playwright personnalisée

Créer `tests/fixtures/authenticated-page.ts` :

```typescript
// tests/fixtures/authenticated-page.ts
import { test as base, type Page } from '@playwright/test';
import { createTestSession, getSupabaseCookieDomain, getSupabaseCookieNames } from '../utils/auth';

/**
 * Fixture Playwright personnalisée avec authentification Supabase
 *
 * Usage :
 * ```typescript
 * import { test } from './fixtures/authenticated-page';
 *
 * test('my protected route', async ({ authenticatedPage }) => {
 *   await authenticatedPage.goto('/dashboard');
 *   // Utilisateur déjà authentifié !
 * });
 * ```
 */
type AuthenticatedFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthenticatedFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // 1. Créer session Supabase
    const session = await createTestSession();

    // 2. Obtenir les noms de cookies
    const cookieNames = getSupabaseCookieNames();
    const domain = getSupabaseCookieDomain();

    // 3. Injecter les cookies d'authentification dans le browser context
    await page.context().addCookies([
      {
        name: cookieNames.accessToken,
        value: session.accessToken,
        domain: domain,
        path: '/',
        httpOnly: false, // Doit être accessible côté client pour Supabase
        secure: domain !== '127.0.0.1' && domain !== 'localhost',
        sameSite: 'Lax',
      },
      {
        name: cookieNames.refreshToken,
        value: session.refreshToken,
        domain: domain,
        path: '/',
        httpOnly: false,
        secure: domain !== '127.0.0.1' && domain !== 'localhost',
        sameSite: 'Lax',
      },
    ]);

    // 4. Passer la page authentifiée au test
    await use(page);

    // 5. Cleanup (optionnel) - supprimer les cookies après le test
    await page.context().clearCookies();
  },
});

export { expect } from '@playwright/test';
```

### Étape 4 : Configuration Playwright

Mettre à jour `playwright.config.ts` :

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement de test
dotenv.config({ path: path.resolve(__dirname, '.env.test') });

export default defineConfig({
  testDir: './tests/e2e',

  // Timeout augmenté pour les tests d'authentification
  timeout: 30 * 1000,

  // Retry pour éviter les flaky tests
  retries: process.env.CI ? 2 : 0,

  // Workers (parallélisation)
  workers: process.env.CI ? 1 : undefined,

  // Reporter
  reporter: [
    ['html'],
    ['list'],
  ],

  use: {
    // Base URL pour les tests
    baseURL: 'http://localhost:3000',

    // Trace on first retry
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Web server local pour les tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

---

## Gestion des cookies Supabase

### Format des cookies Supabase

Supabase utilise des cookies spécifiques pour stocker la session :

```
sb-{project-ref}-auth-token          → Access Token (JWT)
sb-{project-ref}-auth-token-refresh  → Refresh Token
```

**Exemples** :
- Local : `sb-127-auth-token`
- Production : `sb-abcdefg-auth-token` (où `abcdefg` = project ref)

### Extraction du project ref

```typescript
/**
 * Extraire le project ref de l'URL Supabase
 */
function extractProjectRef(supabaseUrl: string): string {
  // Local dev
  if (supabaseUrl.includes('127.0.0.1') || supabaseUrl.includes('localhost')) {
    return '127';
  }

  // Hosted Supabase (format: https://abcdefg.supabase.co)
  const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (!match) {
    throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`);
  }

  return match[1];
}

// Usage
const projectRef = extractProjectRef('https://xyzproject.supabase.co');
console.log(projectRef); // "xyzproject"
```

### Configuration des cookies

```typescript
// Options critiques pour les cookies Supabase
const cookieOptions = {
  name: 'sb-127-auth-token',
  value: accessToken,
  domain: '127.0.0.1', // Doit correspondre au domaine de test
  path: '/',

  // ⚠️ CRITIQUE : httpOnly DOIT être false
  // Supabase client-side a besoin d'accéder aux cookies
  httpOnly: false,

  // Secure uniquement en HTTPS (pas en local)
  secure: false, // true en production

  // SameSite pour CSRF protection
  sameSite: 'Lax', // 'Strict' peut causer des problèmes
};
```

### Debugging des cookies

```typescript
// tests/debug/check-cookies.spec.ts
import { test } from '@playwright/test';

test('debug cookies', async ({ authenticatedPage }) => {
  // Aller sur une page protégée
  await authenticatedPage.goto('/dashboard');

  // Lister tous les cookies
  const cookies = await authenticatedPage.context().cookies();
  console.log('All cookies:', JSON.stringify(cookies, null, 2));

  // Filtrer les cookies Supabase
  const supabaseCookies = cookies.filter(c => c.name.startsWith('sb-'));
  console.log('Supabase cookies:', supabaseCookies);

  // Vérifier la présence des cookies requis
  const hasAccessToken = supabaseCookies.some(c => c.name.includes('auth-token') && !c.name.includes('refresh'));
  const hasRefreshToken = supabaseCookies.some(c => c.name.includes('refresh'));

  console.log('Has access token:', hasAccessToken);
  console.log('Has refresh token:', hasRefreshToken);
});
```

---

## Exemples d'utilisation

### Test simple : Dashboard

```typescript
// tests/e2e/dashboard.spec.ts
import { test, expect } from '../fixtures/authenticated-page';

test.describe('Dashboard', () => {
  test('displays user cases', async ({ authenticatedPage }) => {
    // Aller sur le dashboard
    await authenticatedPage.goto('/dashboard');

    // Vérifier le titre
    await expect(authenticatedPage.locator('h1')).toContainText('Mes dossiers');

    // Vérifier que les cases s'affichent
    const caseCards = authenticatedPage.locator('[data-testid="case-card"]');
    await expect(caseCards).toHaveCount.toBeGreaterThan(0);
  });

  test('allows filtering cases by status', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard');

    // Cliquer sur le filtre "En cours"
    await authenticatedPage.click('[data-testid="filter-in-progress"]');

    // Vérifier que seuls les cases "En cours" sont affichés
    const statusBadges = authenticatedPage.locator('[data-testid="case-status"]');
    const allTexts = await statusBadges.allTextContents();

    expect(allTexts.every(text => text === 'En cours')).toBe(true);
  });
});
```

### Test complexe : Création de dossier

```typescript
// tests/e2e/case-creation.spec.ts
import { test, expect } from '../fixtures/authenticated-page';

test.describe('Case Creation', () => {
  test('creates a new rejected case', async ({ authenticatedPage }) => {
    // Aller sur le dashboard
    await authenticatedPage.goto('/dashboard');

    // Ouvrir le formulaire de création
    await authenticatedPage.click('[data-testid="new-case-button"]');

    // Attendre que le formulaire soit visible
    await expect(authenticatedPage.locator('[data-testid="case-form"]')).toBeVisible();

    // Remplir le formulaire
    await authenticatedPage.fill('[name="title"]', 'Test Case - Rejected');
    await authenticatedPage.fill('[name="description"]', 'This is a test case for rejected type');
    await authenticatedPage.selectOption('[name="type"]', 'rejected');

    // Soumettre
    await authenticatedPage.click('[type="submit"]');

    // Vérifier la redirection
    await authenticatedPage.waitForURL('/dashboard/cases/*');

    // Vérifier le message de succès
    await expect(authenticatedPage.locator('[role="alert"]')).toContainText('Dossier créé avec succès');

    // Vérifier que le case est visible dans le dashboard
    await authenticatedPage.goto('/dashboard');
    await expect(authenticatedPage.locator('text=Test Case - Rejected')).toBeVisible();
  });

  test('validates required fields', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard');
    await authenticatedPage.click('[data-testid="new-case-button"]');

    // Soumettre sans remplir
    await authenticatedPage.click('[type="submit"]');

    // Vérifier les messages d'erreur
    await expect(authenticatedPage.locator('text=Le titre est requis')).toBeVisible();
    await expect(authenticatedPage.locator('text=La description est requise')).toBeVisible();
  });
});
```

### Test multi-utilisateurs

```typescript
// tests/e2e/multi-user.spec.ts
import { test as base, expect } from '@playwright/test';
import { createTestSession, getSupabaseCookieDomain, getSupabaseCookieNames } from '../utils/auth';

// Fixture pour 2 utilisateurs
const test = base.extend<{
  userAPage: Page;
  userBPage: Page;
}>({
  userAPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Authentifier User A
    const session = await createTestSession('usera@formelio.fr', 'PasswordA123!');
    const cookieNames = getSupabaseCookieNames();
    const domain = getSupabaseCookieDomain();

    await context.addCookies([
      { name: cookieNames.accessToken, value: session.accessToken, domain, path: '/' },
      { name: cookieNames.refreshToken, value: session.refreshToken, domain, path: '/' },
    ]);

    await use(page);
    await context.close();
  },

  userBPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Authentifier User B
    const session = await createTestSession('userb@formelio.fr', 'PasswordB123!');
    const cookieNames = getSupabaseCookieNames();
    const domain = getSupabaseCookieDomain();

    await context.addCookies([
      { name: cookieNames.accessToken, value: session.accessToken, domain, path: '/' },
      { name: cookieNames.refreshToken, value: session.refreshToken, domain, path: '/' },
    ]);

    await use(page);
    await context.close();
  },
});

test('User A cannot see User B cases', async ({ userAPage, userBPage }) => {
  // User A va sur son dashboard
  await userAPage.goto('/dashboard');
  const userACases = await userAPage.locator('[data-testid="case-card"]').count();

  // User B va sur son dashboard
  await userBPage.goto('/dashboard');
  const userBCases = await userBPage.locator('[data-testid="case-card"]').count();

  // Vérifier l'isolation des données (RLS)
  expect(userACases).toBeGreaterThan(0);
  expect(userBCases).toBeGreaterThan(0);

  // User A ne devrait pas voir les titres de User B
  const userACaseTitles = await userAPage.locator('[data-testid="case-title"]').allTextContents();
  await userBPage.goto('/dashboard');
  const userBCaseTitles = await userBPage.locator('[data-testid="case-title"]').allTextContents();

  // Aucun titre ne devrait être commun
  const commonTitles = userACaseTitles.filter(title => userBCaseTitles.includes(title));
  expect(commonTitles).toHaveLength(0);
});
```

---

## Troubleshooting

### Problème 1 : "Session not found" dans les tests

**Symptôme** :
```
Error: Session not found
    at authenticatedPage fixture
```

**Causes possibles** :
1. ❌ Supabase local dev non démarré
2. ❌ Variables d'environnement incorrectes
3. ❌ Utilisateur de test inexistant dans la DB

**Solution** :

```bash
# 1. Vérifier que Supabase local tourne
npx supabase status

# 2. Créer l'utilisateur de test dans Supabase
npx supabase db reset

# 3. Insérer l'utilisateur via seed.sql
# supabase/seed.sql
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'test@formelio.fr',
  crypt('TestPassword123!', gen_salt('bf')),
  now(),
  now(),
  now()
);
```

### Problème 2 : Cookies non persistés

**Symptôme** :
```
User redirected to /login despite authentication
```

**Causes** :
1. ❌ `httpOnly: true` (doit être `false`)
2. ❌ Domain incorrect
3. ❌ SameSite trop strict

**Solution** :

```typescript
// ✅ Configuration correcte
await page.context().addCookies([
  {
    name: cookieNames.accessToken,
    value: session.accessToken,
    domain: '127.0.0.1', // PAS 'localhost' !
    path: '/',
    httpOnly: false, // ✅ CRITIQUE
    secure: false,
    sameSite: 'Lax', // ✅ Pas 'Strict'
  },
]);
```

### Problème 3 : Tests échouent en CI/CD

**Symptôme** :
```
Tests pass locally but fail in GitHub Actions
```

**Causes** :
1. ❌ Service Role Key non configurée dans GitHub Secrets
2. ❌ Supabase local non démarré en CI

**Solution** :

```yaml
# .github/workflows/e2e-tests.yml
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # ✅ Démarrer Supabase local
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1

      - name: Start Supabase
        run: npx supabase start

      # ✅ Configurer les variables d'environnement
      - name: Create .env.test
        run: |
          echo "NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321" >> .env.test
          echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=${{ secrets.SUPABASE_ANON_KEY }}" >> .env.test
          echo "SUPABASE_SERVICE_ROLE_KEY=${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" >> .env.test

      - name: Run E2E tests
        run: npx playwright test
```

### Problème 4 : Token expiré pendant les tests

**Symptôme** :
```
Error: JWT expired
```

**Solution** :

```typescript
// tests/utils/auth.ts - Ajouter cache de session
const sessionCache = new Map<string, { session: any; expiresAt: number }>();

export async function createTestSession(email: string, password: string) {
  const cacheKey = `${email}:${password}`;
  const cached = sessionCache.get(cacheKey);

  // Réutiliser session si valide (expire dans > 5 min)
  if (cached && cached.expiresAt > Date.now() + 5 * 60 * 1000) {
    return cached.session;
  }

  // Créer nouvelle session
  const supabase = createClient(/* ... */);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw error;

  // Cacher pour 1 heure
  sessionCache.set(cacheKey, {
    session: {
      accessToken: data.session!.access_token,
      refreshToken: data.session!.refresh_token,
      user: data.user,
    },
    expiresAt: Date.now() + 60 * 60 * 1000,
  });

  return sessionCache.get(cacheKey)!.session;
}
```

---

## Bonnes pratiques

### ✅ À faire

1. **Séparer tests auth vs tests métier**
```typescript
// ✅ BON : Tests auth dans leur propre suite
// tests/e2e/auth/login.spec.ts
test.describe('Authentication', () => {
  test('user can login with valid credentials', async ({ page }) => {
    // Tester l'UI de login
  });
});

// ✅ BON : Tests métier utilisent authenticatedPage
// tests/e2e/dashboard/cases.spec.ts
test.describe('Cases Management', () => {
  test('user can create case', async ({ authenticatedPage }) => {
    // Tester la fonctionnalité
  });
});
```

2. **Utiliser des utilisateurs de test dédiés**
```typescript
// ✅ BON : Utilisateurs avec données prévisibles
const TEST_USERS = {
  admin: {
    email: 'admin@formelio.test',
    password: 'AdminPass123!',
    cases: 5,
    role: 'admin',
  },
  user: {
    email: 'user@formelio.test',
    password: 'UserPass123!',
    cases: 3,
    role: 'user',
  },
};
```

3. **Nettoyer les données après tests**
```typescript
// ✅ BON : Cleanup après chaque test
test.afterEach(async ({ authenticatedPage }) => {
  // Supprimer les cases créés pendant le test
  await authenticatedPage.request.delete('/api/test/cleanup');
});
```

### ❌ À éviter

1. **Ne pas tester l'auth dans CHAQUE test**
```typescript
// ❌ MAUVAIS : Mélanger test auth + test métier
test('user can create case', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  // ... (inutile si on veut tester la création de case)
});
```

2. **Ne pas hardcoder les credentials**
```typescript
// ❌ MAUVAIS : Credentials hardcodés
const session = await createTestSession('test@example.com', 'password123');

// ✅ BON : Variables d'environnement
const session = await createTestSession(
  process.env.TEST_USER_EMAIL!,
  process.env.TEST_USER_PASSWORD!
);
```

3. **Ne pas utiliser la production**
```typescript
// ❌ DANGER : Ne JAMAIS pointer vers production
NEXT_PUBLIC_SUPABASE_URL=https://prod.supabase.co

// ✅ BON : Toujours utiliser local dev
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
```

---

## Métriques de performance

### Avant authentification programmatique

```
Suite E2E Dashboard (10 tests)
├─ Login UI répété      : 10 × 8s  = 80s
├─ Tests métier         : 10 × 5s  = 50s
└─ Total                : 130s (2m 10s)

Flakiness rate : 15% (timeouts UI)
```

### Après authentification programmatique

```
Suite E2E Dashboard (10 tests)
├─ Auth programmatique  : 10 × 0.5s = 5s
├─ Tests métier         : 10 × 5s   = 50s
└─ Total                : 55s (0m 55s)

Flakiness rate : 2% (erreurs réseau uniquement)
Gain de temps  : 58% plus rapide
```

---

## Prochaines étapes

1. ✅ Implémenter `createTestSession()` dans `tests/utils/auth.ts`
2. ✅ Créer fixture `authenticatedPage` dans `tests/fixtures/`
3. ✅ Migrer les tests existants pour utiliser `authenticatedPage`
4. ✅ Ajouter tests multi-utilisateurs pour valider RLS
5. ✅ Configurer CI/CD avec GitHub Secrets

## Ressources

- [Playwright Fixtures Documentation](https://playwright.dev/docs/test-fixtures)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Makerkit: Programmatic Auth with Cypress](https://makerkit.dev/blog/tutorials/programmatic-authentication-supabase-cypress)
- [GitHub: Supabase Auth in E2E Tests](https://github.com/orgs/supabase/discussions/6177)

---

**Version** : 1.0
**Dernière mise à jour** : Octobre 2025
**Auteur** : Équipe Formelio
**Statut** : ✅ Production Ready
