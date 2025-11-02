# 🧪 Testing Guide - Formelio

**Version**: 2.0
**Date**: Octobre 2025
**Status**: ✅ Complete

---

## 📋 Table des matières

1. [Introduction](#introduction)
2. [Quick Start](#quick-start)
3. [Stack de tests](#stack-de-tests)
4. [Tests unitaires (Jest + RTL)](#tests-unitaires-jest--rtl)
5. [Tests E2E (Playwright)](#tests-e2e-playwright)
6. [Les 5 features critiques](#les-5-features-critiques)
7. [Configuration complète](#configuration-complète)
8. [Structure des dossiers](#structure-des-dossiers)
9. [Scripts NPM](#scripts-npm)
10. [Best Practices](#best-practices)
11. [Checklists par phase](#checklists-par-phase)
12. [Roadmap d'implémentation](#roadmap-dimplémentation)
13. [CI/CD Integration](#cicd-integration)
14. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## 🎯 Introduction

### Vue d'ensemble

Cette documentation complète couvre toute la stratégie de tests du projet Formelio, de l'installation initiale jusqu'aux optimisations avancées.

**Objectifs des tests** :
- ✅ **Qualité** : Détecter les bugs avant la production
- ✅ **Confiance** : Déployer en production sans crainte
- ✅ **Documentation** : Les tests documentent le comportement
- ✅ **Refactoring** : Modifier le code sans régression

### Pyramide de tests Formelio

```
         /\
        /  \     E2E (15 tests - 5 features critiques)
       /----\    Playwright
      /      \
     /--------\  Integration (50 tests)
    /          \ React Testing Library
   /------------\
  /--------------\ Unit Tests (100 tests)
 /                \ Jest
/------------------\
```

**Répartition** :
- **Unit Tests** : 100 tests (60%)
- **Integration** : 50 tests (30%)
- **E2E** : 15 tests (10%)

**Total** : 165 tests

### Pourquoi Playwright pour E2E ?

✅ **Décision** : Playwright (pas Cypress)

**Raisons** :
1. **Performance** : 87% plus rapide (3 min vs 24 min sur 3 browsers)
2. **Safari natif** : Critique pour 20-30% clients Mac
3. **Coût** : -$78/mois vs Cypress Dashboard
4. **Parallélisation gratuite**
5. **API moderne** : async/await natif

**Score** : Playwright 4.6/5 vs Cypress 4.1/5

---

## 🚀 Quick Start

### Installation (15 min)

```bash
# 1. Installer Jest + React Testing Library
npm install -D jest @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event jest-environment-jsdom \
  @testing-library/react-hooks ts-jest @types/jest

# 2. Installer Playwright
npm install -D @playwright/test
npx playwright install

# 3. Créer les fichiers de configuration
touch jest.config.js jest.setup.js playwright.config.ts

# 4. Créer la structure de dossiers
mkdir -p __tests__/{lib,hooks,components}
mkdir -p e2e/{fixtures,helpers,setup}

# 5. Premier test smoke
cat > __tests__/smoke.test.ts << 'EOF'
describe('Smoke Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});
EOF

# 6. Lancer le test
npm test
```

### Configuration rapide

Voir la section [Configuration complète](#configuration-complète) pour tous les fichiers de config.

### Premier test unitaire

```typescript
// __tests__/lib/utils/format-date.test.ts
import { formatDate } from '@/lib/utils/format-date';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2025-10-01');
    expect(formatDate(date)).toBe('1 oct. 2025');
  });
});
```

### Premier test E2E

```typescript
// e2e/landing.spec.ts
import { test, expect } from '@playwright/test';

test('landing page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Formelio');
});
```

---

## 🛠️ Stack de tests

### Technologies

| Type | Outil | Version | Rôle |
|------|-------|---------|------|
| **Unit Tests** | Jest | 29.7+ | Test runner |
| **React Testing** | React Testing Library | 14.1+ | Tests composants |
| **E2E Tests** | Playwright | 1.40+ | Tests end-to-end |
| **Backend** | Supabase | Latest | Auth + Database |
| **CI/CD** | GitHub Actions | - | Automatisation |

### Pourquoi Jest (pas Vitest) ?

✅ **Décision** : Jest pour l'instant

**Raisons** :
- Next.js support excellent avec `next/jest`
- Maturité (10+ ans)
- Community énorme
- Équipe déjà formée

**Réévaluation** : Q3 2025 si Vitest devient standard Next.js

---

## 🔬 Tests unitaires (Jest + RTL)

### Configuration Jest

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

```javascript
// jest.setup.js
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
}));

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signIn: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(),
      insert: jest.fn(),
    })),
  })),
}));
```

### Exemples de tests unitaires

#### 1. Test d'une fonction utilitaire

```typescript
// lib/utils/__tests__/format-status.test.ts
import { formatCaseStatus } from '../format-status';

describe('formatCaseStatus', () => {
  it('should format pending status', () => {
    expect(formatCaseStatus('pending')).toBe('En attente');
  });

  it('should format in_progress status', () => {
    expect(formatCaseStatus('in_progress')).toBe('En cours');
  });

  it('should return unknown for invalid status', () => {
    expect(formatCaseStatus('invalid')).toBe('Inconnu');
  });
});
```

#### 2. Test d'un custom hook

```typescript
// hooks/__tests__/use-case-list.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useCaseList } from '../use-case-list';
import { createClient } from '@/lib/supabase/client';

jest.mock('@/lib/supabase/client');

describe('useCaseList', () => {
  it('should fetch cases on mount', async () => {
    const mockCases = [
      { id: '1', title: 'Case 1' },
      { id: '2', title: 'Case 2' },
    ];

    (createClient as jest.Mock).mockReturnValue({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({
            data: mockCases,
            error: null
          })),
        })),
      })),
    });

    const { result } = renderHook(() => useCaseList());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cases).toEqual(mockCases);
  });
});
```

#### 3. Test d'un composant React

```typescript
// components/__tests__/case-card.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CaseCard } from '../case-card';

describe('CaseCard', () => {
  const mockCase = {
    id: '1',
    title: 'Constitution SARL',
    status: 'pending' as const,
    created_at: '2025-10-01T10:00:00Z',
  };

  it('should render case information', () => {
    render(<CaseCard case={mockCase} />);

    expect(screen.getByText('Constitution SARL')).toBeInTheDocument();
    expect(screen.getByText('En attente')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<CaseCard case={mockCase} onClick={handleClick} />);

    await user.click(screen.getByRole('article'));

    expect(handleClick).toHaveBeenCalledWith('1');
  });
});
```

---

## 🎭 Tests E2E (Playwright)

### Configuration Playwright

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html'],
    ['list'],
  ],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
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

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### ⚡ Authentification programmatique

**Problème** : Login via UI = 10s par test, tests flaky

**Solution** : Injecter directement la session Supabase

```typescript
// tests/utils/auth.ts
import { createClient } from '@supabase/supabase-js';

export async function createTestSession(
  email: string = process.env.TEST_USER_EMAIL!,
  password: string = process.env.TEST_USER_PASSWORD!
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(`Auth failed: ${error.message}`);

  return {
    accessToken: data.session!.access_token,
    refreshToken: data.session!.refresh_token,
    user: data.user,
  };
}
```

```typescript
// tests/fixtures/authenticated-page.ts
import { test as base } from '@playwright/test';
import { createTestSession } from '../utils/auth';

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    const session = await createTestSession();

    // Injecter cookies Supabase
    await page.context().addCookies([
      {
        name: 'sb-127-auth-token',
        value: session.accessToken,
        domain: '127.0.0.1',
        path: '/',
      },
    ]);

    await use(page);
  },
});
```

**Utilisation** :

```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '../fixtures/authenticated-page';

test('user can view their cases', async ({ authenticatedPage }) => {
  // Déjà authentifié ! (0.5s au lieu de 10s)
  await authenticatedPage.goto('/dashboard');

  await expect(authenticatedPage.locator('h1')).toContainText('Mes dossiers');
});
```

**Gain** : **95% plus rapide** (0.5s vs 10s)

Pour le guide complet, voir [PLAYWRIGHT_SUPABASE_AUTH.md](./PLAYWRIGHT_SUPABASE_AUTH.md)

---

## 🎯 Les 5 features critiques

Ces 5 features couvrent 80% des parcours utilisateurs critiques.

### 1. ✅ Authentication (4 tests)

```typescript
// e2e/01-authentication.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should signup with valid credentials', async ({ page }) => {
    await page.goto('/register');

    await page.fill('[name="email"]', 'test@formelio.fr');
    await page.fill('[name="password"]', 'SecureP@ss123');
    await page.fill('[name="confirm_password"]', 'SecureP@ss123');
    await page.check('[name="accept_terms"]');

    await page.click('[type="submit"]');

    await page.waitForURL('/dashboard');
    await expect(page.locator('text=Bienvenue')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'existing@formelio.fr');
    await page.fill('[name="password"]', 'ExistingP@ss123');
    await page.click('[type="submit"]');

    await page.waitForURL('/dashboard');
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@formelio.fr');
    await page.fill('[name="password"]', 'SecureP@ss123');
    await page.click('[type="submit"]');

    // Logout
    await page.click('[aria-label="Menu utilisateur"]');
    await page.click('text=Déconnexion');

    await page.waitForURL('/');
  });

  test('should reset password', async ({ page }) => {
    await page.goto('/reset-password');

    await page.fill('[name="email"]', 'test@formelio.fr');
    await page.click('[type="submit"]');

    await expect(page.locator('text=Email envoyé')).toBeVisible();
  });
});
```

### 2. 📄 Document Upload (3 tests)

```typescript
// e2e/02-document-upload.spec.ts
import { test, expect } from '../fixtures/authenticated-page';
import path from 'path';

test.describe('Document Upload', () => {
  test('should upload a PDF document', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/cases/1');

    await authenticatedPage.click('button:has-text("Ajouter un document")');

    const filePath = path.join(__dirname, 'fixtures', 'test-document.pdf');
    const [fileChooser] = await Promise.all([
      authenticatedPage.waitForEvent('filechooser'),
      authenticatedPage.click('button:has-text("Choisir un fichier")'),
    ]);
    await fileChooser.setFiles(filePath);

    await authenticatedPage.fill('[name="document_name"]', 'Statuts SARL');
    await authenticatedPage.click('[type="submit"]');

    await expect(authenticatedPage.locator('text=Document envoyé')).toBeVisible();
  });

  test('should reject non-PDF files', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/cases/1');
    await authenticatedPage.click('button:has-text("Ajouter un document")');

    const filePath = path.join(__dirname, 'fixtures', 'image.jpg');
    const [fileChooser] = await Promise.all([
      authenticatedPage.waitForEvent('filechooser'),
      authenticatedPage.click('button:has-text("Choisir un fichier")'),
    ]);
    await fileChooser.setFiles(filePath);

    await expect(
      authenticatedPage.locator('text=Seuls les PDF sont acceptés')
    ).toBeVisible();
  });

  test('should download document', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/cases/1');

    const [download] = await Promise.all([
      authenticatedPage.waitForEvent('download'),
      authenticatedPage.click('[data-testid="document-download"]'),
    ]);

    expect(download.suggestedFilename()).toContain('.pdf');
  });
});
```

### 3. 💳 Payment (3 tests)

```typescript
// e2e/03-payment.spec.ts
import { test, expect } from '../fixtures/authenticated-page';

test.describe('Payment Flow', () => {
  test('should complete payment successfully', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/services/deblocage-dossier');
    await authenticatedPage.click('button:has-text("Commander")');

    await authenticatedPage.waitForURL(/\/checkout\//);

    // Fill billing info
    await authenticatedPage.fill('[name="billing_name"]', 'Jean Dupont');
    await authenticatedPage.fill('[name="billing_address"]', '123 rue de la Paix');

    // Stripe iframe
    const stripeFrame = authenticatedPage.frameLocator('iframe[name^="__privateStripeFrame"]');
    await stripeFrame.locator('[name="cardnumber"]').fill('4242424242424242');
    await stripeFrame.locator('[name="exp-date"]').fill('12/30');
    await stripeFrame.locator('[name="cvc"]').fill('123');

    await authenticatedPage.click('[type="submit"]:has-text("Payer")');

    await authenticatedPage.waitForURL('/payment/success');
    await expect(authenticatedPage.locator('text=Paiement réussi')).toBeVisible();
  });

  test('should handle declined payment', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/checkout/123');

    const stripeFrame = authenticatedPage.frameLocator('iframe[name^="__privateStripeFrame"]');
    await stripeFrame.locator('[name="cardnumber"]').fill('4000000000000002');
    await stripeFrame.locator('[name="exp-date"]').fill('12/30');
    await stripeFrame.locator('[name="cvc"]').fill('123');

    await authenticatedPage.click('[type="submit"]');

    await expect(authenticatedPage.locator('text=Carte refusée')).toBeVisible();
  });

  test('should display invoice after payment', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/invoices');

    await authenticatedPage.click('[data-testid="invoice-item"]:first-child');

    await expect(authenticatedPage.locator('text=Facture')).toBeVisible();

    const [download] = await Promise.all([
      authenticatedPage.waitForEvent('download'),
      authenticatedPage.click('button:has-text("Télécharger PDF")'),
    ]);

    expect(download.suggestedFilename()).toContain('facture');
  });
});
```

### 4. 💬 Chat System (2 tests)

```typescript
// e2e/04-chat-system.spec.ts
import { test, expect } from '../fixtures/authenticated-page';

test.describe('Chat System', () => {
  test('should send a message', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/cases/1');
    await authenticatedPage.click('button:has-text("Messages")');

    const message = 'Bonjour, j\'ai une question';
    await authenticatedPage.fill('textarea[placeholder*="message"]', message);
    await authenticatedPage.click('button:has-text("Envoyer")');

    await expect(authenticatedPage.locator(`text=${message}`)).toBeVisible();
  });

  test('should receive real-time messages', async ({ authenticatedPage, context }) => {
    await authenticatedPage.goto('/dashboard/cases/1');
    await authenticatedPage.click('button:has-text("Messages")');

    // Simulate admin sending message
    const adminPage = await context.newPage();
    await adminPage.goto('/admin/cases/1');
    await adminPage.fill('textarea', 'Réponse de l\'admin');
    await adminPage.click('button:has-text("Envoyer")');

    // User should see message in real-time
    await expect(
      authenticatedPage.locator('text=Réponse de l\'admin')
    ).toBeVisible({ timeout: 5000 });
  });
});
```

### 5. 🏠 Dashboard Navigation (3 tests)

```typescript
// e2e/05-dashboard-navigation.spec.ts
import { test, expect } from '../fixtures/authenticated-page';

test.describe('Dashboard', () => {
  test('should protect routes from unauthenticated access', async ({ page }) => {
    await page.goto('/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should navigate through main sections', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard');

    // Cases
    await authenticatedPage.click('nav a:has-text("Mes dossiers")');
    await expect(authenticatedPage).toHaveURL('/dashboard/cases');

    // Documents
    await authenticatedPage.click('nav a:has-text("Documents")');
    await expect(authenticatedPage).toHaveURL('/dashboard/documents');

    // Profile
    await authenticatedPage.click('[aria-label="Menu utilisateur"]');
    await authenticatedPage.click('text=Mon profil');
    await expect(authenticatedPage).toHaveURL('/dashboard/profile');
  });

  test('should create new case', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard');

    await authenticatedPage.click('button:has-text("Nouveau dossier")');

    await authenticatedPage.fill('[name="title"]', 'Constitution SAS');
    await authenticatedPage.fill('[name="description"]', 'Création SAS');
    await authenticatedPage.selectOption('[name="type"]', 'creation');

    await authenticatedPage.click('[type="submit"]');

    await expect(authenticatedPage).toHaveURL(/\/dashboard\/cases\/[a-z0-9-]+/);
  });
});
```

---

## ⚙️ Configuration complète

### Variables d'environnement

```bash
# .env.test
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# Service Role Key (tests uniquement !)
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Test user
TEST_USER_EMAIL=test@formelio.fr
TEST_USER_PASSWORD=TestPassword123!
```

### .gitignore

```gitignore
# Testing
/coverage
/.nyc_output
/test-results
/playwright-report
/playwright/.cache
.env.test
```

---

## 📁 Structure des dossiers

```
formelio/
├── __tests__/                      # Tests unitaires
│   ├── lib/
│   │   ├── utils/
│   │   │   ├── format-date.test.ts
│   │   │   └── format-status.test.ts
│   │   └── supabase/
│   │       └── queries.test.ts
│   ├── hooks/
│   │   ├── use-auth.test.ts
│   │   └── use-case-list.test.ts
│   └── components/
│       ├── case-card.test.tsx
│       └── case-form.test.tsx
│
├── e2e/                            # Tests E2E
│   ├── fixtures/
│   │   ├── test-document.pdf
│   │   └── test-image.jpg
│   ├── helpers/
│   │   └── auth.helper.ts
│   ├── 01-authentication.spec.ts
│   ├── 02-document-upload.spec.ts
│   ├── 03-payment.spec.ts
│   ├── 04-chat-system.spec.ts
│   └── 05-dashboard-navigation.spec.ts
│
├── coverage/                       # Rapports coverage
├── test-results/                   # Résultats Playwright
├── playwright-report/              # Rapports HTML
│
├── jest.config.js
├── jest.setup.js
└── playwright.config.ts
```

---

## 📦 Scripts NPM

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2",

    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:chrome": "playwright test --project=chromium",
    "test:e2e:ci": "playwright test --reporter=github",

    "test:all": "npm run test && npm run test:e2e"
  }
}
```

---

## ✅ Best Practices

### Tests unitaires

1. **AAA Pattern** (Arrange-Act-Assert)
```typescript
it('should format date correctly', () => {
  // Arrange
  const date = new Date('2025-10-01');

  // Act
  const result = formatDate(date);

  // Assert
  expect(result).toBe('1 oct. 2025');
});
```

2. **Noms descriptifs**
```typescript
// ✅ Bon
it('should display error when email is invalid', () => {});

// ❌ Mauvais
it('test email', () => {});
```

3. **Isolation des tests**
```typescript
beforeEach(() => {
  jest.clearAllMocks();
});
```

### Tests E2E

1. **data-testid pour stabilité**
```tsx
<button data-testid="submit-button">Envoyer</button>

// Dans le test
await page.click('[data-testid="submit-button"]');
```

2. **Attendre les états (pas timeouts fixes)**
```typescript
// ✅ Bon
await expect(page.locator('text=Success')).toBeVisible();

// ❌ Mauvais
await page.waitForTimeout(5000);
```

3. **Cleanup après tests**
```typescript
test.afterEach(async () => {
  await cleanupTestData();
});
```

---

## 📋 Checklists par phase

### Phase 0 : Setup (1 jour)
- [ ] Installer Jest + RTL
- [ ] Installer Playwright
- [ ] Créer jest.config.js
- [ ] Créer playwright.config.ts
- [ ] Créer structure dossiers
- [ ] Premier smoke test
- [ ] Configurer scripts npm

### Phase 1 : Landing Page (2-3 jours)
- [ ] 25 tests unitaires (utils, composants)
- [ ] 2 tests E2E (navigation, contact)
- [ ] Coverage > 70%
- [ ] CI/CD configuré

### Phase 2 : Dashboard (1-2 semaines)
- [ ] 40 tests unitaires (hooks, composants)
- [ ] 10 tests E2E (auth, upload, chat, navigation)
- [ ] Coverage > 75%
- [ ] Auth programmatique implémentée

### Phase 3 : Payment (5-7 jours)
- [ ] 35 tests unitaires (payment, invoices)
- [ ] 5 tests E2E (payment flow complet)
- [ ] Coverage > 80%
- [ ] 165 tests total

---

## 🗺️ Roadmap d'implémentation

### Semaine 1 : Setup + Auth programmatique
**Effort** : 1-2 jours

1. Setup Jest + Playwright (4h)
2. Auth programmatique (4h)
   - Créer `tests/utils/auth.ts`
   - Créer fixture `authenticatedPage`
   - Tester sur 5 tests E2E

**Gain attendu** : -95% temps auth (10s → 0.5s)

### Semaine 2-3 : Tests E2E critiques
**Effort** : 1-2 semaines

- Authentication (4 tests) - 4h
- Document Upload (3 tests) - 3h
- Payment (3 tests) - 4h
- Chat (2 tests) - 2h
- Dashboard (3 tests) - 2h

**Total** : 15 tests E2E

### Semaine 4-5 : Tests unitaires
**Effort** : 2 semaines

- Utils (20 tests) - 2 jours
- Hooks (20 tests) - 3 jours
- Components (60 tests) - 5 jours

**Total** : 100 tests unitaires

### Semaine 6 : Optimisation CI/CD
**Effort** : 3 jours

- Build Once pattern (1 jour)
- Tests parallèles (1 jour)
- Vercel Preview (0.5 jour)
- Monitoring (0.5 jour)

**Gain attendu** : -67% temps CI (18 min → 6 min)

---

## 🔄 CI/CD Integration

### GitHub Actions workflow

```yaml
# .github/workflows/ci-optimized.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm run build

      - uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: |
            .next/
            node_modules/

  unit-tests:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v3
        with:
          name: build-artifacts

      - run: npm run test:ci

      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  e2e-tests:
    needs: build
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v3
        with:
          name: build-artifacts

      - uses: supabase/setup-cli@v1
      - run: npx supabase start

      - run: npx playwright install --with-deps ${{ matrix.browser }}
      - run: npx playwright test --project=${{ matrix.browser }}

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report-${{ matrix.browser }}
          path: playwright-report/
```

**Optimisations** :
- Build Once, Test Everywhere
- Tests parallèles (3 browsers)
- Artifacts upload/download
- Cache npm

**Résultat** : 18 min → 6 min (-67%)

Pour le guide complet, voir [CI_CD_OPTIMIZATION.md](./CI_CD_OPTIMIZATION.md)

---

## ❓ FAQ & Troubleshooting

### Questions fréquentes

**Q : Où mettre les tests ?**
- Unit tests : `__tests__/` ou `*.test.ts` à côté du fichier
- E2E tests : `e2e/` à la racine

**Q : Comment lancer les tests ?**
```bash
npm run test              # Unit tests (watch)
npm run test:coverage     # Unit + coverage
npm run test:e2e          # E2E tests
npm run test:e2e:ui       # E2E UI mode
```

**Q : Tests E2E échouent en local ?**
1. Vérifier Supabase : `npx supabase status`
2. Vérifier `.env.test` existe
3. Voir [PLAYWRIGHT_SUPABASE_AUTH.md](./PLAYWRIGHT_SUPABASE_AUTH.md) - Troubleshooting

**Q : Comment tester Stripe ?**
- Cartes test : `4242424242424242` (success), `4000000000000002` (declined)
- Stripe CLI : `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

**Q : Tests trop lents ?**
1. Implémenter auth programmatique (-95% temps)
2. Paralléliser avec `fullyParallel: true`
3. Voir [CI_CD_OPTIMIZATION.md](./CI_CD_OPTIMIZATION.md)

### Troubleshooting

#### Erreur : "Session not found"
```bash
# Démarrer Supabase local
npx supabase start

# Créer utilisateur de test
npx supabase db reset
```

#### Erreur : "Cookies not persisted"
Vérifier `httpOnly: false` dans les cookies Supabase.

#### Tests flaky en CI
1. Augmenter `timeout` dans playwright.config.ts
2. Activer `retries: 2` en CI
3. Utiliser `waitForLoadState('networkidle')`

---

## 📚 Ressources

### Documentation externe
- **Jest** : https://jestjs.io/
- **React Testing Library** : https://testing-library.com/react
- **Playwright** : https://playwright.dev/
- **Supabase Testing** : https://supabase.com/docs/guides/testing

### Guides spécialisés (Formelio)
- [PLAYWRIGHT_SUPABASE_AUTH.md](./PLAYWRIGHT_SUPABASE_AUTH.md) - Auth programmatique
- [CI_CD_OPTIMIZATION.md](./CI_CD_OPTIMIZATION.md) - Optimisation CI/CD
- [TESTING_REFERENCE.md](./TESTING_REFERENCE.md) - Référence rapide
- [VITEST_GUIDE.md](./VITEST_GUIDE.md) - Alternative Jest

---

## 📊 Métriques de succès

### Coverage targets

| Phase | Unit | Integration | E2E | Coverage |
|-------|------|-------------|-----|----------|
| Phase 1 | 70% | N/A | 0% | 70% |
| Phase 2 | 75% | 70% | 60% | 72% |
| Phase 3 | 80% | 75% | 80% | **78%** ✅ |

### Performance targets

| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|--------------|
| **CI/CD time** | 18 min | 6 min | **-67%** ⚡ |
| **E2E suite** | 12 min | 3 min | **-75%** ⚡ |
| **Auth/test** | 10s | 0.5s | **-95%** ⚡ |
| **Flaky rate** | 10% | 2% | **-80%** ✅ |

### Cost savings

| Poste | Avant | Après | Économies |
|-------|-------|-------|-----------|
| CI/CD | $50/mois | $17/mois | **-$396/an** 💰 |

---

## ✅ Checklist complète

### Setup initial
- [ ] Lire ce guide (TESTING_GUIDE.md)
- [ ] Installer Jest + RTL
- [ ] Installer Playwright
- [ ] Créer fichiers config
- [ ] Premier smoke test

### Phase 1
- [ ] 25 tests unitaires
- [ ] 2 tests E2E
- [ ] Coverage > 70%
- [ ] CI configuré

### Phase 2
- [ ] Auth programmatique implémentée
- [ ] 15 tests E2E critiques
- [ ] 65 tests unitaires (total cumulé)
- [ ] Coverage > 75%

### Phase 3
- [ ] 100 tests unitaires (total)
- [ ] 15 tests E2E (total)
- [ ] Coverage > 80%
- [ ] CI optimisé (-67% temps)

---

**Version** : 2.0
**Date** : Octobre 2025
**Équipe** : Formelio
**Status** : ✅ Complete

💙 **Formelio** - Votre temps, notre priorité
