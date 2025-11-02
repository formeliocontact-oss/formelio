# CI/CD Optimization Guide - Formelio

**Version**: 1.0
**Date**: Octobre 2025
**Priorité**: 🟡 HAUTE

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Problèmes des CI/CD classiques](#problèmes-des-cicd-classiques)
3. [Pattern "Build Once, Test Everywhere"](#pattern-build-once-test-everywhere)
4. [Tests parallèles](#tests-parallèles)
5. [Integration Vercel Preview](#integration-vercel-preview)
6. [Caching strategies](#caching-strategies)
7. [Optimisations avancées](#optimisations-avancées)
8. [Monitoring et métriques](#monitoring-et-métriques)

---

## 🎯 Vue d'ensemble

### Objectifs d'optimisation CI/CD

1. **Réduire le temps d'exécution** : Passer de 15-20 min à < 5 min
2. **Économiser les ressources GitHub Actions** : Réduire les coûts
3. **Feedback rapide** : Développeurs avertis plus vite des erreurs
4. **Fiabilité** : Tests moins flaky, plus reproductibles

### Métriques cibles

| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|--------------|
| **Temps total CI** | 18 min | 6 min | -67% |
| **Build time** | 4 min | 3 min | -25% (cache) |
| **Unit tests** | 2 min | 1.5 min | -25% |
| **E2E tests** | 12 min | 3 min | -75% (parallel + auth) |
| **Minutes Actions/mois** | 1200 | 400 | -67% |

---

## ⚠️ Problèmes des CI/CD classiques

### Anti-pattern #1 : Rebuild à chaque job

```yaml
# ❌ MAUVAIS : Build répété 3 fois
jobs:
  unit-tests:
    steps:
      - run: npm ci
      - run: npm run build  # Build #1
      - run: npm test

  integration-tests:
    steps:
      - run: npm ci
      - run: npm run build  # Build #2 (inutile !)
      - run: npm test:integration

  e2e-tests:
    steps:
      - run: npm ci
      - run: npm run build  # Build #3 (inutile !)
      - run: npm test:e2e
```

**Problème** :
- Build identique exécuté 3 fois
- Gaspillage de 8-12 minutes
- Risque de builds légèrement différents

### Anti-pattern #2 : Tests séquentiels

```yaml
# ❌ MAUVAIS : Tests en série (20 min total)
jobs:
  tests:
    steps:
      - run: npm test              # 2 min
      - run: npm test:integration  # 3 min
      - run: npm test:e2e          # 15 min
```

**Problème** :
- Temps total = somme de tous les tests
- Pas de parallélisation
- Feedback très lent

### Anti-pattern #3 : Auth UI dans E2E

```typescript
// ❌ MAUVAIS : Login via UI à chaque test
test('feature A', async ({ page }) => {
  await loginViaUI(page); // 10s
  // ...
});

test('feature B', async ({ page }) => {
  await loginViaUI(page); // 10s
  // ...
});
```

**Problème** :
- 50 tests × 10s = 8.3 minutes perdues
- Tests flaky (timeouts UI)

---

## 🏗️ Pattern "Build Once, Test Everywhere"

### Principe

1. **Build une seule fois** au début
2. **Sauvegarder les artifacts** (.next/, node_modules/, etc.)
3. **Distribuer aux jobs de tests** via `upload-artifact`/`download-artifact`
4. **Tous les tests utilisent le même build**

### Implémentation

```yaml
# .github/workflows/ci-optimized.yml
name: Optimized CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # ============================================
  # JOB 1: BUILD (unique)
  # ============================================
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Next.js
        run: npm run build

      # ✅ Sauvegarder le build
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: |
            .next/
            node_modules/
            package.json
            package-lock.json
          retention-days: 1

  # ============================================
  # JOB 2: UNIT TESTS (parallèle avec build)
  # ============================================
  unit-tests:
    name: Unit Tests
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      # ✅ Télécharger le build
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts

      - name: Run unit tests
        run: npm run test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  # ============================================
  # JOB 3: INTEGRATION TESTS (parallèle avec unit)
  # ============================================
  integration-tests:
    name: Integration Tests
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts

      # Setup Supabase local
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1

      - name: Start Supabase
        run: npx supabase start

      - name: Run integration tests
        run: npm run test:integration

  # ============================================
  # JOB 4: E2E TESTS (parallèle avec unit/integration)
  # ============================================
  e2e-tests:
    name: E2E Tests
    needs: build
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts

      # Setup Playwright
      - name: Install Playwright browsers
        run: npx playwright install --with-deps ${{ matrix.browser }}

      # Setup Supabase local
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1

      - name: Start Supabase
        run: npx supabase start

      # Create test environment
      - name: Create .env.test
        run: |
          echo "NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321" >> .env.test
          echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=${{ secrets.SUPABASE_ANON_KEY }}" >> .env.test
          echo "SUPABASE_SERVICE_ROLE_KEY=${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" >> .env.test

      - name: Run E2E tests
        run: npx playwright test --project=${{ matrix.browser }}
        env:
          PLAYWRIGHT_BASE_URL: http://localhost:3000

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report-${{ matrix.browser }}
          path: playwright-report/
          retention-days: 7
```

### Timeline optimisé

```
┌────────────────────────────────────┐
│ Build (3 min)                      │
└──────────────┬─────────────────────┘
               │
    ┌──────────┼──────────┬─────────────┐
    │          │          │             │
    ▼          ▼          ▼             ▼
┌───────┐  ┌────────┐  ┌────────┐  ┌────────┐
│ Unit  │  │ Integ  │  │ E2E-Ch │  │ E2E-FF │
│ 1.5m  │  │ 2 min  │  │ 3 min  │  │ 3 min  │
└───────┘  └────────┘  └────────┘  └────────┘

Total: 3 min (build) + 3 min (longest test) = 6 min
Au lieu de: 3 + 1.5 + 2 + 3 + 3 = 12.5 min
```

---

## ⚡ Tests parallèles

### Matrix strategy pour E2E

```yaml
# Exécuter tests E2E sur plusieurs browsers en parallèle
e2e-tests:
  strategy:
    matrix:
      browser: [chromium, firefox, webkit]
      shard: [1, 2, 3, 4]
  steps:
    - name: Run E2E tests (shard ${{ matrix.shard }})
      run: npx playwright test --shard=${{ matrix.shard }}/${{ strategy.job-total }}
```

**Avantages** :
- 12 jobs parallèles (3 browsers × 4 shards)
- Temps divisé par 4-12
- Meilleure couverture cross-browser

### Sharding Playwright

```typescript
// playwright.config.ts
export default defineConfig({
  // Activer le sharding
  workers: process.env.CI ? 1 : undefined,

  // Optimiser la parallélisation
  fullyParallel: true,

  // Retry flaky tests
  retries: process.env.CI ? 2 : 0,
});
```

### Unit tests parallèles

```json
// package.json
{
  "scripts": {
    "test:ci": "jest --ci --maxWorkers=4 --coverage"
  }
}
```

---

## 🔗 Integration Vercel Preview

### Workflow E2E sur Preview

```yaml
# .github/workflows/e2e-vercel-preview.yml
name: E2E on Vercel Preview

on:
  pull_request:
    branches: [main, develop]

jobs:
  e2e-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # ✅ Attendre Vercel Preview
      - name: Wait for Vercel Preview
        uses: patrickedqvist/wait-for-vercel-preview@v1.3.1
        id: vercel-preview
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          max_timeout: 300

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      # ✅ Tests sur l'URL Vercel Preview
      - name: Run E2E tests on Vercel
        run: npx playwright test
        env:
          PLAYWRIGHT_BASE_URL: ${{ steps.vercel-preview.outputs.url }}

      - name: Comment PR with results
        if: always()
        uses: daun/playwright-report-comment@v3
        with:
          report-url: ${{ steps.vercel-preview.outputs.url }}/playwright-report
```

### Avantages Vercel Preview

1. **Environnement réel** : Identique à la production
2. **Pas de build local** : Vercel a déjà buildé
3. **Tests isolés** : Chaque PR a sa preview
4. **Edge functions** : Testées en conditions réelles

### Configuration Playwright multi-env

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
  },

  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined // Pas de serveur local si URL externe
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
      },
});
```

---

## 💾 Caching strategies

### 1. Cache npm dependencies

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm' # ✅ Cache automatique de node_modules
```

**Gain** : 30-60s par job

### 2. Cache Next.js build

```yaml
- name: Cache Next.js build
  uses: actions/cache@v3
  with:
    path: |
      ${{ github.workspace }}/.next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx') }}
    restore-keys: |
      ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-
      ${{ runner.os }}-nextjs-
```

**Gain** : 1-2 min sur le build

### 3. Cache Playwright browsers

```yaml
- name: Cache Playwright browsers
  uses: actions/cache@v3
  with:
    path: ~/.cache/ms-playwright
    key: ${{ runner.os }}-playwright-${{ hashFiles('**/package-lock.json') }}

- name: Install Playwright browsers
  run: npx playwright install --with-deps
  if: steps.cache-playwright.outputs.cache-hit != 'true'
```

**Gain** : 2-3 min par job E2E

### 4. Cache Supabase CLI

```yaml
- name: Cache Supabase CLI
  uses: actions/cache@v3
  with:
    path: ~/.supabase
    key: ${{ runner.os }}-supabase-cli-${{ hashFiles('**/supabase/config.toml') }}
```

**Gain** : 30-60s par job utilisant Supabase

### Cache global optimisé

```yaml
- name: Cache all dependencies
  uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      ~/.cache/ms-playwright
      ~/.supabase
      .next/cache
    key: formelio-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      formelio-${{ runner.os }}-
```

---

## 🚀 Optimisations avancées

### 1. Fail fast strategy

```yaml
jobs:
  tests:
    strategy:
      fail-fast: true # Arrêter tous les jobs si un échoue
      matrix:
        test-suite: [unit, integration, e2e]
```

**Avantages** :
- Feedback immédiat sur les erreurs
- Économie de ressources si échec précoce

### 2. Conditional jobs

```yaml
jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  e2e-tests:
    # ✅ E2E uniquement si unit tests passent
    needs: unit-tests
    if: success()
    runs-on: ubuntu-latest
    steps:
      - run: npm test:e2e

  deploy:
    # ✅ Deploy uniquement si tous les tests passent
    needs: [unit-tests, integration-tests, e2e-tests]
    if: github.ref == 'refs/heads/main' && success()
    runs-on: ubuntu-latest
    steps:
      - run: vercel deploy --prod
```

### 3. Path filtering

```yaml
on:
  push:
    paths:
      - 'app/**'
      - 'components/**'
      - 'lib/**'
      - 'package.json'
      - 'package-lock.json'
      # ✅ Ne pas déclencher si seulement docs modifiés
      - '!docs/**'
      - '!*.md'
```

### 4. Concurrency limits

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true # ✅ Annuler les runs précédents si nouveau push
```

### 5. Timeout protection

```yaml
jobs:
  tests:
    timeout-minutes: 15 # ✅ Fail si > 15 min (éviter les jobs bloqués)
    steps:
      - run: npm test
        timeout-minutes: 5 # ✅ Timeout par step
```

---

## 📊 Monitoring et métriques

### 1. GitHub Actions metrics

```yaml
- name: Report CI metrics
  if: always()
  run: |
    echo "::notice::Build time: ${{ job.duration }} seconds"
    echo "::notice::Tests passed: ${{ steps.test.outcome }}"
```

### 2. Test results summary

```yaml
- name: Test Summary
  uses: test-summary/action@v2
  with:
    paths: |
      coverage/junit.xml
      playwright-report/results.json
  if: always()
```

### 3. Performance tracking

```yaml
- name: Track CI performance
  uses: benchmark-action/github-action-benchmark@v1
  with:
    tool: 'customSmallerIsBetter'
    output-file-path: ci-metrics.json
    gh-pages-branch: gh-pages
    auto-push: true
```

### 4. Slack notifications

```yaml
- name: Notify Slack on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'CI failed on ${{ github.ref }}'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 5. Dashboard CI

```yaml
- name: Update CI dashboard
  if: always()
  run: |
    curl -X POST https://status.formelio.fr/api/ci \
      -H "Content-Type: application/json" \
      -d '{
        "workflow": "${{ github.workflow }}",
        "status": "${{ job.status }}",
        "duration": "${{ job.duration }}",
        "commit": "${{ github.sha }}"
      }'
```

---

## 📈 Comparaison avant/après

### Workflow classique (avant)

```
Total: 18 min

┌──────────────────────────────────┐
│ Build + Unit tests (5 min)      │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Integration tests (3 min)       │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ E2E tests (10 min)               │
└──────────────────────────────────┘
```

### Workflow optimisé (après)

```
Total: 6 min

┌──────────────────────────────────┐
│ Build (3 min)                    │
└────┬─────────┬─────────┬─────────┘
     │         │         │
     ▼         ▼         ▼
  ┌─────┐  ┌─────┐  ┌─────────┐
  │Unit │  │Integ│  │E2E (3m) │
  │1.5m │  │ 2m  │  │         │
  └─────┘  └─────┘  └─────────┘
```

### Gains mesurables

| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|--------------|
| **Temps total** | 18 min | 6 min | **-67%** |
| **Feedback time** | 18 min | 6 min | **-67%** |
| **Minutes Actions/PR** | 18 min | 6 min | **-67%** |
| **Coût mensuel** | ~$50 | ~$17 | **-66%** |
| **Flaky tests** | 10% | 2% | **-80%** |

---

## 🎯 Checklist d'optimisation

### Phase 1 : Optimisations rapides (1-2h)

- [ ] Activer cache npm (`cache: 'npm'`)
- [ ] Ajouter `fail-fast: true`
- [ ] Configurer `timeout-minutes`
- [ ] Activer `cancel-in-progress: true`
- [ ] Ajouter path filtering pour docs

### Phase 2 : Build Once pattern (2-3h)

- [ ] Créer job `build` unique
- [ ] Configurer `upload-artifact`
- [ ] Configurer `download-artifact` dans jobs tests
- [ ] Paralléliser unit/integration/E2E

### Phase 3 : Auth programmatique (2-4h)

- [ ] Créer fixture `authenticatedPage`
- [ ] Implémenter `createTestSession()`
- [ ] Migrer tests E2E pour utiliser fixture
- [ ] Supprimer login UI des tests métier

### Phase 4 : Vercel Preview (1-2h)

- [ ] Ajouter workflow `e2e-vercel-preview.yml`
- [ ] Configurer `wait-for-vercel-preview`
- [ ] Tester sur preview URL
- [ ] Ajouter PR comments avec résultats

### Phase 5 : Sharding & Advanced (2-3h)

- [ ] Configurer matrix strategy pour E2E
- [ ] Activer Playwright sharding
- [ ] Cacher Playwright browsers
- [ ] Configurer monitoring/metrics

---

## 📚 Ressources

- [GitHub Actions: Caching dependencies](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
- [Playwright: Sharding tests](https://playwright.dev/docs/test-sharding)
- [Vercel: Preview Deployments](https://vercel.com/docs/concepts/deployments/preview-deployments)
- [Next.js: CI Build Caching](https://nextjs.org/docs/pages/building-your-application/deploying/ci-build-caching)

---

**Version** : 1.0
**Dernière mise à jour** : Octobre 2025
**Auteur** : Équipe Formelio
**Statut** : ✅ Production Ready
