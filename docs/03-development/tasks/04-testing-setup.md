# COMMON-04 - Testing Setup & Configuration

**ID**: COMMON-04  
**Phase**: 0 (Setup)  
**Priority**: P1 (Haute)  
**Effort**: 4 heures  
**Status**: ðŸ”´ TODO  
**Branch**: `feature/phase0-setup`

---

## ðŸ“‹ Description

Mettre en place l'infrastructure complÃ¨te de tests pour Formelio : tests unitaires avec Jest + React Testing Library, tests E2E avec Playwright MCP, configuration CI/CD, et crÃ©ation des fixtures/helpers rÃ©utilisables.

**Cette task est optionnelle pour le MVP** mais fortement recommandÃ©e pour garantir la qualitÃ© et faciliter les Ã©volutions futures.

---

## ðŸŽ¯ Objectifs

1. Installer et configurer Jest + React Testing Library
2. Installer et configurer Playwright pour tests E2E
3. CrÃ©er la structure de dossiers de tests
4. ImplÃ©menter les helpers rÃ©utilisables (Auth, Data, Wait)
5. CrÃ©er les fixtures de test (users, cases, documents)
6. Configurer le CI/CD (GitHub Actions)
7. Ã‰crire le premier test smoke
8. Documenter la stratÃ©gie de tests

---

## âœ… Acceptance Criteria

### Configuration
- [ ] Jest installÃ© et configurÃ© (`jest.config.js`, `jest.setup.js`)
- [ ] Playwright installÃ© et configurÃ© (`playwright.config.ts`)
- [ ] Structure de dossiers crÃ©Ã©e (`__tests__/`, `e2e/`)
- [ ] Scripts npm ajoutÃ©s au `package.json`
- [ ] `.gitignore` mis Ã  jour

### Helpers & Fixtures
- [ ] `AuthHelper` implÃ©mentÃ© (login, signup, logout)
- [ ] `DataHelper` implÃ©mentÃ© (create/delete test data)
- [ ] `WaitHelper` implÃ©mentÃ© (wait for loading, toast, etc.)
- [ ] Fixtures JSON crÃ©Ã©es (test-users.json, test-cases.json)
- [ ] PDFs de test gÃ©nÃ©rÃ©s (valid, large, invalid)

### Tests
- [ ] Premier test smoke qui passe (`__tests__/smoke.test.ts`)
- [ ] Commande `npm test` fonctionne
- [ ] Commande `npm run test:e2e` fonctionne
- [ ] Coverage report gÃ©nÃ©rÃ©

### CI/CD
- [ ] GitHub Actions workflow crÃ©Ã© (`.github/workflows/tests.yml`)
- [ ] Tests s'exÃ©cutent sur chaque PR
- [ ] Coverage uploadÃ© vers Codecov (optionnel)

### Documentation
- [ ] README tests crÃ©Ã© avec exemples d'usage
- [ ] StratÃ©gie de tests documentÃ©e

---

## ðŸ”§ Technical Implementation

### 1. Installation des dÃ©pendances

```bash
# Tests unitaires
npm install -D jest @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event jest-environment-jsdom \
  @testing-library/react-hooks ts-jest @types/jest

# Tests E2E
npm install -D @playwright/test
npx playwright install

# GÃ©nÃ©ration de PDFs de test
npm install -D pdf-lib
```

### 2. Configuration Jest

```typescript
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
    '!**/.next/**',
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
  ],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/e2e/'],
};

module.exports = createJestConfig(customJestConfig);
```

```typescript
// jest.setup.js
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signIn: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
  })),
}));

jest.setTimeout(10000);
```

### 3. Configuration Playwright

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

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
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 4. Structure de dossiers

```bash
# CrÃ©er la structure complÃ¨te
mkdir -p __tests__/{lib/utils,hooks,components/ui}
mkdir -p e2e/{fixtures,helpers,setup}
mkdir -p .github/workflows
mkdir -p scripts
```

### 5. Helpers rÃ©utilisables

```typescript
// e2e/helpers/auth.helper.ts
import { Page } from '@playwright/test';
import testUsers from '../fixtures/test-users.json';

export class AuthHelper {
  constructor(private page: Page) {}

  async login(userType: 'validUser' | 'adminUser' = 'validUser') {
    const user = testUsers[userType];
    await this.page.goto('/login');
    await this.page.fill('input[name="email"]', user.email);
    await this.page.fill('input[name="password"]', user.password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForURL('/dashboard');
  }

  async logout() {
    await this.page.click('button[aria-label="Menu utilisateur"]');
    await this.page.click('text=DÃ©connexion');
    await this.page.waitForURL('/');
  }
}
```

```typescript
// e2e/helpers/wait.helper.ts
import { Page, expect } from '@playwright/test';

export class WaitHelper {
  constructor(private page: Page) {}

  async waitForLoading() {
    await this.page.waitForSelector('[data-testid="loading-spinner"]', {
      state: 'hidden',
      timeout: 10000,
    });
  }

  async waitForToast(text: string) {
    await expect(
      this.page.locator(`[role="status"]:has-text("${text}")`)
    ).toBeVisible({ timeout: 5000 });
  }

  async waitForNavigation(url: string | RegExp) {
    await this.page.waitForURL(url, {
      timeout: 10000,
      waitUntil: 'networkidle',
    });
  }
}
```

### 6. Fixtures

```json
// e2e/fixtures/test-users.json
{
  "validUser": {
    "email": "test@formelio.fr",
    "password": "SecureP@ss123",
    "full_name": "Jean Dupont",
    "company": "Dupont & AssociÃ©s"
  },
  "adminUser": {
    "email": "admin@formelio.fr",
    "password": "AdminP@ss123",
    "full_name": "Marie Martin",
    "role": "admin"
  }
}
```

```json
// e2e/fixtures/test-cases.json
{
  "constitutionSARL": {
    "title": "Constitution SARL",
    "description": "CrÃ©ation d'une SARL avec 2 associÃ©s",
    "type": "creation",
    "status": "pending"
  }
}
```

### 7. Premier test smoke

```typescript
// __tests__/smoke.test.ts
describe('Smoke Test', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true);
  });

  it('should add numbers correctly', () => {
    expect(1 + 1).toBe(2);
  });
});
```

### 8. Scripts NPM

```json
// package.json (extrait)
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:ci": "playwright test --reporter=github",
    
    "test:all": "npm run test && npm run test:e2e",
    
    "generate:test-pdfs": "ts-node scripts/generate-test-pdfs.ts"
  }
}
```

### 9. GitHub Actions CI/CD

```yaml
# .github/workflows/tests.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e:ci
        env:
          PLAYWRIGHT_BASE_URL: http://localhost:3000
      
      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### 10. .gitignore

```gitignore
# Testing
/coverage
/.nyc_output
/test-results
/playwright-report
/playwright/.cache
/playwright/.auth
```

### 11. Documentation README

```markdown
# ðŸ§ª Tests - Formelio

## Quick Start

### Tests unitaires
\`\`\`bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
\`\`\`

### Tests E2E
\`\`\`bash
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # UI mode
npm run test:e2e:debug   # Debug mode
\`\`\`

## Structure

- `__tests__/` - Tests unitaires (Jest + RTL)
- `e2e/` - Tests E2E (Playwright)
- `e2e/helpers/` - Helpers rÃ©utilisables
- `e2e/fixtures/` - DonnÃ©es de test

## StratÃ©gie

Voir les documents dans `/outputs/`:
- `TESTING_STRATEGY.md` - StratÃ©gie complÃ¨te
- `TESTING_INTEGRATION_GUIDE.md` - Guide d'intÃ©gration
- `E2E_FIXTURES_HELPERS.md` - Fixtures et helpers

## Coverage Targets

- Phase 1: 70%
- Phase 2: 75%
- Phase 3: 80%
```

---

## ðŸ“¦ Dependencies

### Prerequisite
- âœ… COMMON-01: Project Setup (Next.js initialisÃ©)
- âœ… Node.js 18+ installÃ©
- âœ… Git configurÃ©

### Bloquant pour
- â³ P1-01: Homepage Layout (tests composants)
- â³ P2-01: Auth System (tests E2E auth)
- â³ Toutes les tasks suivantes qui nÃ©cessitent des tests

---

## ðŸ§ª Testing

### Validation de la configuration

```bash
# 1. VÃ©rifier Jest
npm test
# Devrait afficher: Tests: 2 passed, 2 total

# 2. VÃ©rifier coverage
npm run test:coverage
# Devrait gÃ©nÃ©rer un rapport dans coverage/

# 3. VÃ©rifier Playwright
npx playwright test --list
# Devrait lister 0 tests (normal, pas encore de tests E2E)

# 4. Ouvrir UI Playwright
npm run test:e2e:ui
# Devrait ouvrir l'interface Playwright
```

### Test du CI/CD

```bash
# 1. CrÃ©er une PR
git checkout -b test/ci-setup
git add .
git commit -m "test(ci): validate GitHub Actions"
git push origin test/ci-setup

# 2. CrÃ©er la PR sur GitHub
# 3. VÃ©rifier que les checks passent
```

---

## ðŸ› Troubleshooting

### Jest ne trouve pas les modules

```bash
# Solution: VÃ©rifier moduleNameMapper dans jest.config.js
# VÃ©rifier que les alias correspondent Ã  tsconfig.json
```

### Playwright ne dÃ©marre pas

```bash
# RÃ©installer les navigateurs
npx playwright install --with-deps
```

### Tests timeout

```bash
# Augmenter le timeout dans jest.setup.js
jest.setTimeout(30000); // 30 secondes
```

---

## ðŸ“š Resources

### Documentation complÃ¨te
- **TESTING_STRATEGY.md** - StratÃ©gie de tests dÃ©taillÃ©e avec 165 tests
- **TESTING_INTEGRATION_GUIDE.md** - Guide d'intÃ©gration par phase
- **E2E_FIXTURES_HELPERS.md** - Helpers et fixtures rÃ©utilisables
- **TESTING_RECAP.md** - RÃ©capitulatif et arborescence complÃ¨te

### Documentation externe
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Next.js Testing](https://nextjs.org/docs/testing)

### Exemples
- Voir `outputs/TESTING_STRATEGY.md` pour exemples complets
- 5 features critiques testÃ©es en E2E
- 100 tests unitaires planifiÃ©s

---

## âš ï¸ Potential Issues

### Issue 1: Conflits avec Next.js 14

**SymptÃ´me**: Erreurs lors de l'import de composants Server Components

**Solution**:
```typescript
// Utiliser dynamic import pour les composants avec 'use client'
const Component = dynamic(() => import('./component'), { ssr: false });
```

### Issue 2: Mocks Supabase complexes

**SymptÃ´me**: Tests qui Ã©chouent Ã  cause de Supabase

**Solution**:
```typescript
// CrÃ©er des mocks rÃ©utilisables
// __tests__/__mocks__/supabase.ts
export const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn().mockResolvedValue({ data: [], error: null }),
  })),
};
```

### Issue 3: Tests E2E lents

**SymptÃ´me**: Tests E2E prennent >5 minutes

**Solution**:
```typescript
// Utiliser storageState pour Ã©viter les logins rÃ©pÃ©tÃ©s
// Voir global-setup.ts dans E2E_FIXTURES_HELPERS.md
```

---

## âœ… Completion Checklist

### Configuration
- [ ] Jest configurÃ© et fonctionne
- [ ] Playwright configurÃ© et fonctionne
- [ ] Structure de dossiers crÃ©Ã©e
- [ ] Scripts npm ajoutÃ©s
- [ ] .gitignore mis Ã  jour

### Code
- [ ] Helpers implÃ©mentÃ©s (Auth, Wait, Data)
- [ ] Fixtures crÃ©Ã©es (users, cases)
- [ ] Premier test smoke passe
- [ ] CI/CD configurÃ©

### Documentation
- [ ] README tests crÃ©Ã©
- [ ] StratÃ©gie documentÃ©e dans outputs/
- [ ] Exemples d'usage fournis

### Validation
- [ ] `npm test` fonctionne
- [ ] `npm run test:coverage` gÃ©nÃ¨re rapport
- [ ] `npm run test:e2e` fonctionne
- [ ] CI passe sur PR

---

## ðŸ“Š Effort Breakdown

| TÃ¢che | Temps estimÃ© |
|-------|--------------|
| Installation dÃ©pendances | 15 min |
| Configuration Jest | 30 min |
| Configuration Playwright | 30 min |
| CrÃ©ation structure | 15 min |
| ImplÃ©mentation helpers | 1h |
| CrÃ©ation fixtures | 30 min |
| Premier test smoke | 15 min |
| Configuration CI/CD | 45 min |
| Documentation | 30 min |
| **Total** | **~4h** |

---

## ðŸŽ¯ Success Metrics

- âœ… Tests unitaires: 2 tests passent (smoke tests)
- âœ… Coverage: Configuration OK (seuil dÃ©fini)
- âœ… E2E: Playwright configurÃ© et prÃªt
- âœ… CI/CD: Pipeline fonctionne sur PR
- âœ… Documentation: README complet avec exemples

---

**Version**: 1.0  
**CrÃ©Ã© le**: Octobre 2025  
**Status**: âœ… Ready to implement

ðŸ’™ **Formelio** - Votre temps, notre prioritÃ©
