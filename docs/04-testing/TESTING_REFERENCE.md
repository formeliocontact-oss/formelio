# 📚 Testing Reference - Formelio

**Version**: 2.0
**Date**: Octobre 2025
**Type**: Quick Reference

---

## 📋 Table des matières

1. [Quick Reference](#quick-reference)
2. [Helpers disponibles](#helpers-disponibles)
3. [Fixtures & Setup](#fixtures--setup)
4. [Configuration complète](#configuration-complète)
5. [Patterns courants](#patterns-courants)
6. [Commandes utiles](#commandes-utiles)
7. [Troubleshooting rapide](#troubleshooting-rapide)
8. [Snippets réutilisables](#snippets-réutilisables)

---

## ⚡ Quick Reference

### Commandes essentielles

```bash
# Tests unitaires
npm test                    # Watch mode
npm run test:coverage       # Avec coverage
npm run test:ci             # CI mode

# Tests E2E
npm run test:e2e            # Tous les tests
npm run test:e2e:ui         # UI mode
npm run test:e2e:debug      # Debug mode
npm run test:e2e:chrome     # Chrome seulement

# Supabase local
npx supabase start          # Démarrer
npx supabase status         # Vérifier
npx supabase stop           # Arrêter
```

### Patterns rapides

```typescript
// Test unitaire simple
describe('Component', () => {
  it('should render', () => {
    render(<Component />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});

// Test E2E avec auth
test('feature', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/dashboard');
  await expect(authenticatedPage.locator('h1')).toContainText('Dashboard');
});

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({ data: [], error: null })),
    })),
  })),
}));
```

---

## 🛠️ Helpers disponibles

### 1. AuthHelper (Playwright)

Gestion de l'authentification dans les tests E2E.

```typescript
// e2e/helpers/auth.helper.ts
import { Page } from '@playwright/test';
import testUsers from '../fixtures/test-users.json';

export class AuthHelper {
  constructor(private page: Page) {}

  /**
   * Login avec un utilisateur de test
   */
  async login(userType: 'validUser' | 'adminUser' = 'validUser') {
    const user = testUsers[userType];

    await this.page.goto('/login');
    await this.page.fill('input[name="email"]', user.email);
    await this.page.fill('input[name="password"]', user.password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForURL('/dashboard');
  }

  /**
   * Signup avec un nouvel utilisateur
   */
  async signup() {
    const user = testUsers.newUser;
    const timestamp = Date.now();

    await this.page.goto('/register');

    await this.page.fill('input[name="email"]', `test-${timestamp}@formelio.fr`);
    await this.page.fill('input[name="password"]', user.password);
    await this.page.fill('input[name="confirm_password"]', user.password);
    await this.page.fill('input[name="full_name"]', user.full_name);
    await this.page.check('input[type="checkbox"][name="accept_terms"]');

    await this.page.click('button[type="submit"]');
    await this.page.waitForURL('/dashboard');

    return { email: `test-${timestamp}@formelio.fr`, password: user.password };
  }

  /**
   * Logout
   */
  async logout() {
    await this.page.click('button[aria-label="Menu utilisateur"]');
    await this.page.click('text=Déconnexion');
    await this.page.waitForURL('/');
  }

  /**
   * Vérifier que l'utilisateur est authentifié
   */
  async isAuthenticated(): Promise<boolean> {
    await this.page.goto('/dashboard');
    return this.page.url().includes('/dashboard');
  }
}
```

**Utilisation** :

```typescript
import { test } from '@playwright/test';
import { AuthHelper } from './helpers/auth.helper';

test('user flow', async ({ page }) => {
  const authHelper = new AuthHelper(page);

  await authHelper.login('validUser');
  // Test...
  await authHelper.logout();
});
```

---

### 2. DataHelper (Playwright)

Gestion des données de test (création, suppression).

```typescript
// e2e/helpers/data.helper.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export class DataHelper {
  /**
   * Créer un dossier de test
   */
  static async createTestCase(userId: string, caseData: any) {
    const { data, error } = await supabase
      .from('cases')
      .insert({
        user_id: userId,
        title: caseData.title,
        description: caseData.description,
        type: caseData.type,
        status: caseData.status || 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Supprimer un dossier de test
   */
  static async deleteTestCase(caseId: string) {
    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', caseId);

    if (error) throw error;
  }

  /**
   * Créer un utilisateur de test
   */
  static async createTestUser(email: string, password: string) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Supprimer un utilisateur de test
   */
  static async deleteTestUser(userId: string) {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw error;
  }

  /**
   * Nettoyer tous les dossiers de test
   */
  static async cleanupTestCases() {
    const { error } = await supabase
      .from('cases')
      .delete()
      .like('title', '%Test%');

    if (error) console.error('Cleanup failed:', error);
  }

  /**
   * Obtenir l'ID utilisateur depuis l'email
   */
  static async getUserIdByEmail(email: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (error) return null;
    return data?.id || null;
  }
}
```

**Utilisation** :

```typescript
import { test } from '@playwright/test';
import { DataHelper } from './helpers/data.helper';

test.beforeEach(async () => {
  const userId = await DataHelper.getUserIdByEmail('test@formelio.fr');
  const testCase = await DataHelper.createTestCase(userId!, {
    title: 'Test Case',
    description: 'Description',
    type: 'rejected',
  });
});

test.afterEach(async () => {
  await DataHelper.cleanupTestCases();
});
```

---

### 3. WaitHelper (Playwright)

Helpers pour attendre les états UI.

```typescript
// e2e/helpers/wait.helper.ts
import { Page, expect } from '@playwright/test';

export class WaitHelper {
  constructor(private page: Page) {}

  /**
   * Attendre que le loading disparaisse
   */
  async waitForLoading() {
    await this.page.waitForSelector('[data-testid="loading-spinner"]', {
      state: 'hidden',
      timeout: 10000,
    });
  }

  /**
   * Attendre qu'un toast apparaisse
   */
  async waitForToast(text: string) {
    await expect(
      this.page.locator(`[role="status"]:has-text("${text}")`)
    ).toBeVisible({ timeout: 5000 });
  }

  /**
   * Attendre qu'un toast de succès apparaisse
   */
  async waitForSuccessToast() {
    await this.page.waitForSelector('[data-testid="toast-success"]', {
      timeout: 5000,
    });
  }

  /**
   * Attendre qu'un toast d'erreur apparaisse
   */
  async waitForErrorToast() {
    await this.page.waitForSelector('[data-testid="toast-error"]', {
      timeout: 5000,
    });
  }

  /**
   * Attendre la navigation complète
   */
  async waitForNavigation(url: string | RegExp) {
    await this.page.waitForURL(url, {
      timeout: 10000,
      waitUntil: 'networkidle',
    });
  }

  /**
   * Attendre qu'un élément soit cliquable
   */
  async waitForClickable(selector: string) {
    await this.page.waitForSelector(selector, {
      state: 'visible',
      timeout: 5000,
    });
  }

  /**
   * Attendre la fin d'une requête API
   */
  async waitForApiResponse(urlPattern: string | RegExp) {
    await this.page.waitForResponse(
      (response) => {
        const url = response.url();
        if (typeof urlPattern === 'string') {
          return url.includes(urlPattern);
        }
        return urlPattern.test(url);
      },
      { timeout: 10000 }
    );
  }

  /**
   * Attendre le chargement complet de la page
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }
}
```

**Utilisation** :

```typescript
import { test } from '@playwright/test';
import { WaitHelper } from './helpers/wait.helper';

test('payment flow', async ({ page }) => {
  const waitHelper = new WaitHelper(page);

  await page.click('button:has-text("Payer")');
  await waitHelper.waitForLoading();
  await waitHelper.waitForSuccessToast();
  await waitHelper.waitForNavigation('/payment/success');
});
```

---

## 🎬 Fixtures & Setup

### Fixture authenticatedPage (Playwright)

```typescript
// tests/fixtures/authenticated-page.ts
import { test as base, type Page } from '@playwright/test';
import { createTestSession, getSupabaseCookieNames, getSupabaseCookieDomain } from '../utils/auth';

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

    // 3. Injecter les cookies
    await page.context().addCookies([
      {
        name: cookieNames.accessToken,
        value: session.accessToken,
        domain: domain,
        path: '/',
        httpOnly: false,
        secure: domain !== '127.0.0.1',
        sameSite: 'Lax',
      },
      {
        name: cookieNames.refreshToken,
        value: session.refreshToken,
        domain: domain,
        path: '/',
        httpOnly: false,
        secure: domain !== '127.0.0.1',
        sameSite: 'Lax',
      },
    ]);

    await use(page);

    // Cleanup
    await page.context().clearCookies();
  },
});

export { expect } from '@playwright/test';
```

### Global Setup (Playwright)

```typescript
// e2e/setup/global-setup.ts
import { chromium, FullConfig } from '@playwright/test';
import { DataHelper } from '../helpers/data.helper';
import testUsers from '../fixtures/test-users.json';

async function globalSetup(config: FullConfig) {
  console.log('🌱 Seeding test database...');

  // Créer les utilisateurs de test
  try {
    await DataHelper.createTestUser(
      testUsers.validUser.email,
      testUsers.validUser.password
    );
    console.log('✅ Valid user created');

    await DataHelper.createTestUser(
      testUsers.adminUser.email,
      testUsers.adminUser.password
    );
    console.log('✅ Admin user created');
  } catch (error) {
    console.log('⚠️  Users might already exist, skipping...');
  }

  // Créer session authentifiée
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000');
  await page.click('text=Connexion');
  await page.fill('input[name="email"]', testUsers.validUser.email);
  await page.fill('input[name="password"]', testUsers.validUser.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');

  await page.context().storageState({ path: 'playwright/.auth/user.json' });

  await browser.close();

  console.log('✅ Global setup complete');
}

export default globalSetup;
```

### Global Teardown (Playwright)

```typescript
// e2e/setup/global-teardown.ts
import { FullConfig } from '@playwright/test';
import { DataHelper } from '../helpers/data.helper';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Cleaning up test data...');

  await DataHelper.cleanupTestCases();

  console.log('✅ Global teardown complete');
}

export default globalTeardown;
```

---

## ⚙️ Configuration complète

### jest.config.js (complet)

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
  },

  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
  ],

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  testMatch: [
    '**/__tests__/**/*.(test|spec).[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/e2e/',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

### playwright.config.ts (complet)

```typescript
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
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
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  // Global setup/teardown
  globalSetup: require.resolve('./e2e/setup/global-setup.ts'),
  globalTeardown: require.resolve('./e2e/setup/global-teardown.ts'),
});
```

### .env.test (template)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ⚠️ Service Role Key (tests locaux uniquement)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Test users
TEST_USER_EMAIL=test@formelio.fr
TEST_USER_PASSWORD=TestPassword123!
TEST_USER_ID=00000000-0000-0000-0000-000000000001

# Playwright
PLAYWRIGHT_BASE_URL=http://localhost:3000
```

---

## 🎨 Patterns courants

### Mock Supabase queries

```typescript
// Pattern 1 : Mock simple
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    })),
  })),
}));

// Pattern 2 : Mock avec données custom
const mockSupabase = {
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({
        data: [{ id: '1', title: 'Test' }],
        error: null,
      }),
    }),
  }),
};

(createClient as jest.Mock).mockReturnValue(mockSupabase);
```

### Mock Next.js Router

```typescript
// jest.setup.js
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Dans un test spécifique
import { useRouter } from 'next/navigation';

it('should navigate on click', () => {
  const mockPush = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

  // Test...
  expect(mockPush).toHaveBeenCalledWith('/dashboard');
});
```

### Tester un Server Action

```typescript
// app/actions/__tests__/create-case.test.ts
import { createCase } from '../create-case';
import { createClient } from '@/lib/supabase/server';

jest.mock('@/lib/supabase/server');

describe('createCase server action', () => {
  it('should create a new case', async () => {
    const mockInsert = jest.fn().mockResolvedValue({
      data: { id: '123' },
      error: null,
    });

    (createClient as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue({
        insert: mockInsert,
      }),
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'user-123' } },
        }),
      },
    });

    const formData = new FormData();
    formData.append('title', 'New Case');
    formData.append('description', 'Description');

    const result = await createCase(formData);

    expect(result.success).toBe(true);
    expect(mockInsert).toHaveBeenCalledWith({
      title: 'New Case',
      description: 'Description',
      user_id: 'user-123',
      status: 'pending',
    });
  });
});
```

### Tester avec Context Provider

```typescript
// Test wrapper avec providers
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/components/theme-provider';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
};

// Utilisation
it('should render with theme', () => {
  renderWithProviders(<Component />);
  // Test...
});
```

---

## 🔧 Commandes utiles

### Tests

```bash
# Unit tests
npm test                          # Watch mode
npm run test:coverage             # Coverage report
npm run test:ci                   # CI mode (no watch)
npm test -- --testNamePattern="Component"  # Run specific test

# E2E tests
npm run test:e2e                  # All E2E tests
npm run test:e2e:ui               # UI mode
npm run test:e2e:debug            # Debug mode
npm run test:e2e:headed           # Show browser
npm run test:e2e:chrome           # Chrome only
npx playwright test --grep="authentication"  # Specific test

# Coverage
npm run test:coverage             # Generate coverage
open coverage/lcov-report/index.html  # View report

# Playwright report
npx playwright show-report        # View last run
```

### Supabase

```bash
# Local dev
npx supabase start                # Start local DB
npx supabase status               # Check status
npx supabase stop                 # Stop
npx supabase db reset             # Reset DB

# Migrations
npx supabase migration new create_cases_table
npx supabase db push              # Apply migrations
```

### Debugging

```bash
# Jest debug
node --inspect-brk node_modules/.bin/jest --runInBand test.ts

# Playwright debug
npx playwright test --debug       # Debug mode
npx playwright test --headed      # Show browser
npx playwright codegen http://localhost:3000  # Record test

# View trace
npx playwright show-trace trace.zip
```

---

## 🆘 Troubleshooting rapide

### Problème : Tests E2E échouent

```bash
# 1. Vérifier Supabase
npx supabase status

# 2. Vérifier .env.test
cat .env.test

# 3. Re-créer utilisateurs de test
npx supabase db reset

# 4. Voir les logs Playwright
npx playwright test --headed --reporter=list
```

### Problème : "Session not found"

```typescript
// Vérifier auth.ts
export async function createTestSession() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!  // ⚠️ Service key requis
  );
  // ...
}
```

### Problème : Cookies non persistés

```typescript
// Vérifier httpOnly: false
await page.context().addCookies([
  {
    name: 'sb-127-auth-token',
    value: accessToken,
    domain: '127.0.0.1',  // Pas 'localhost'
    path: '/',
    httpOnly: false,      // ✅ CRITIQUE
    sameSite: 'Lax',      // Pas 'Strict'
  },
]);
```

### Problème : Tests flaky

```typescript
// 1. Augmenter timeouts
await page.waitForSelector('text=Success', { timeout: 10000 });

// 2. Attendre networkidle
await page.waitForLoadState('networkidle');

// 3. Utiliser expect avec retry
await expect(page.locator('text=Success')).toBeVisible({ timeout: 5000 });

// 4. Activer retry en CI
// playwright.config.ts
retries: process.env.CI ? 2 : 0
```

---

## 💾 Snippets réutilisables

### Snippet 1 : Test unitaire complet

```typescript
// __tests__/components/button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

describe('Button', () => {
  it('should render children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should apply variant classes', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-500');
  });
});
```

### Snippet 2 : Test E2E avec setup/teardown

```typescript
// e2e/cases.spec.ts
import { test, expect } from '../fixtures/authenticated-page';
import { DataHelper } from '../helpers/data.helper';

test.describe('Cases Management', () => {
  let testCaseId: string;
  let userId: string;

  test.beforeEach(async () => {
    userId = await DataHelper.getUserIdByEmail('test@formelio.fr')!;
    const testCase = await DataHelper.createTestCase(userId, {
      title: 'Test Case',
      description: 'Description',
      type: 'rejected',
    });
    testCaseId = testCase.id;
  });

  test.afterEach(async () => {
    if (testCaseId) {
      await DataHelper.deleteTestCase(testCaseId);
    }
  });

  test('should display case details', async ({ authenticatedPage }) => {
    await authenticatedPage.goto(`/dashboard/cases/${testCaseId}`);

    await expect(authenticatedPage.locator('h1')).toContainText('Test Case');
    await expect(authenticatedPage.locator('text=Description')).toBeVisible();
  });

  test('should update case status', async ({ authenticatedPage }) => {
    await authenticatedPage.goto(`/dashboard/cases/${testCaseId}`);

    await authenticatedPage.click('[data-testid="change-status"]');
    await authenticatedPage.click('text=In Progress');

    await expect(authenticatedPage.locator('text=Status updated')).toBeVisible();
  });
});
```

### Snippet 3 : Mock API complet

```typescript
// __tests__/lib/api/cases.test.ts
import { getCases, createCase, updateCase, deleteCase } from '../cases';
import { createClient } from '@/lib/supabase/client';

jest.mock('@/lib/supabase/client');

describe('Cases API', () => {
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn(),
    };
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCases', () => {
    it('should fetch cases for user', async () => {
      const mockCases = [{ id: '1', title: 'Case 1' }];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: mockCases,
            error: null,
          }),
        }),
      });

      const result = await getCases('user-123');

      expect(result).toEqual(mockCases);
      expect(mockSupabase.from).toHaveBeenCalledWith('cases');
    });

    it('should throw error on failure', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: new Error('DB error'),
          }),
        }),
      });

      await expect(getCases('user-123')).rejects.toThrow('DB error');
    });
  });

  describe('createCase', () => {
    it('should create a new case', async () => {
      const newCase = { title: 'New Case', description: 'Desc' };

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({
          data: { id: '123', ...newCase },
          error: null,
        }),
      });

      const result = await createCase('user-123', newCase);

      expect(result).toEqual({ id: '123', ...newCase });
    });
  });
});
```

---

## 📚 Ressources

### Documentation interne Formelio

- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Guide complet
- [PLAYWRIGHT_SUPABASE_AUTH.md](./PLAYWRIGHT_SUPABASE_AUTH.md) - Auth programmatique
- [CI_CD_OPTIMIZATION.md](./CI_CD_OPTIMIZATION.md) - Optimisation CI/CD
- [VITEST_GUIDE.md](./VITEST_GUIDE.md) - Alternative Jest

### Documentation externe

- **Jest** : https://jestjs.io/
- **React Testing Library** : https://testing-library.com/react
- **Playwright** : https://playwright.dev/
- **Supabase Testing** : https://supabase.com/docs/guides/testing

---

## ✅ Checklist rapide

### Avant de commencer un test

- [ ] Identifier le type de test (unit, integration, E2E)
- [ ] Lire les exemples similaires dans la codebase
- [ ] Vérifier si des helpers existent déjà
- [ ] Préparer les données de test (fixtures)

### Pendant l'écriture

- [ ] Utiliser des noms descriptifs
- [ ] Suivre le pattern AAA (Arrange-Act-Assert)
- [ ] Ajouter data-testid si nécessaire
- [ ] Mocker uniquement les dépendances externes

### Après l'écriture

- [ ] Vérifier que le test passe
- [ ] Vérifier que le test échoue si on casse le code
- [ ] Vérifier le coverage
- [ ] Commit avec message descriptif

---

**Version** : 2.0
**Date** : Octobre 2025
**Type** : Quick Reference
**Équipe** : Formelio

💙 **Formelio** - Votre temps, notre priorité
