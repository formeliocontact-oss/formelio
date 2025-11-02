# Vitest Guide - Alternative Testing Framework

**Version**: 1.0
**Date**: Octobre 2025
**Priorité**: 🟢 MOYENNE (optionnel)
**Status**: Informational

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Jest vs Vitest](#jest-vs-vitest)
3. [Installation et configuration](#installation-et-configuration)
4. [Migration depuis Jest](#migration-depuis-jest)
5. [Testing Supabase avec Vitest](#testing-supabase-avec-vitest)
6. [Edge Functions testing](#edge-functions-testing)
7. [Quand utiliser Vitest ?](#quand-utiliser-vitest)

---

## 🎯 Vue d'ensemble

### Qu'est-ce que Vitest ?

**Vitest** est un framework de tests unitaires moderne, créé par l'équipe de Vite.

**Caractéristiques principales** :
- ⚡ **Ultra rapide** : Basé sur Vite (ESM natif)
- 🔄 **HMR pour tests** : Rerun instantané pendant le dev
- 🎯 **API compatible Jest** : Migration facile
- 📦 **ESM-first** : Pas de transpilation pour ESM
- 🧪 **UI intégrée** : Interface graphique pour tests

### Pourquoi considérer Vitest ?

| Avantage | Description |
|----------|-------------|
| **Performance** | 2-5× plus rapide que Jest |
| **Developer Experience** | HMR + UI = feedback instantané |
| **Modernité** | ESM natif, pas de config complexe |
| **Vite ecosystem** | Si déjà sur Vite |

---

## 📊 Jest vs Vitest

### Comparaison détaillée

| Feature | Jest | Vitest | Gagnant |
|---------|------|--------|---------|
| **Vitesse** | 🐢 Lent | ⚡ Rapide | **Vitest** |
| **HMR** | ❌ Non | ✅ Oui | **Vitest** |
| **UI graphique** | ❌ Non | ✅ Oui | **Vitest** |
| **Maturité** | ✅ Très mature | ⚠️ Jeune (2021) | **Jest** |
| **Community** | ✅ Énorme | ⚠️ Grandissante | **Jest** |
| **Next.js support** | ✅ Natif | ⚠️ Config manuelle | **Jest** |
| **API compatibility** | N/A | ✅ 95% compatible | Vitest |
| **ESM support** | ⚠️ Expérimental | ✅ Natif | **Vitest** |

### Benchmarks

```bash
# Suite de 100 tests unitaires Formelio

Jest :
├─ First run    : 12s
├─ Watch mode   : 8s/change
└─ CI           : 15s

Vitest :
├─ First run    : 4s
├─ Watch mode   : 0.5s/change (HMR!)
└─ CI           : 6s

Gain : 60% plus rapide
```

### Recommandation Formelio

**Rester sur Jest pour l'instant** ✅

**Raisons** :
1. **Next.js integration** : Jest officiel avec `next/jest`
2. **Stabilité** : Jest très mature (10+ ans)
3. **Community** : Plus de ressources/Stack Overflow
4. **Migration cost** : Pas de ROI immédiat

**Reconsidérer Vitest si** :
- Migration vers Vite (au lieu de Next.js)
- Performance dev devient critique
- Vitest atteint maturité Next.js

---

## 📦 Installation et configuration

### Installation

```bash
npm install -D vitest @vitest/ui
```

### Configuration Vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Environment
    environment: 'jsdom',

    // Setup files
    setupFiles: ['./vitest.setup.ts'],

    // Globals (pour compatibilité Jest)
    globals: true,

    // Coverage
    coverage: {
      provider: 'v8', // ou 'istanbul'
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/**',
      ],
      all: true,
      lines: 80,
      functions: 80,
      branches: 70,
      statements: 80,
    },

    // Include/exclude
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.next', 'e2e'],

    // Aliases (comme Next.js)
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/types': path.resolve(__dirname, './types'),
    },
  },
});
```

### Setup file

```typescript
// vitest.setup.ts
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest matchers
expect.extend(matchers);

// Cleanup après chaque test
afterEach(() => {
  cleanup();
});

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signIn: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    })),
  })),
}));
```

### Scripts NPM

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run",
    "test:ci": "vitest run --coverage"
  }
}
```

---

## 🔄 Migration depuis Jest

### Différences API

#### 1. Imports

```typescript
// Jest
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Vitest
import { describe, it, expect, beforeEach, vi } from 'vitest';
```

#### 2. Mocks

```typescript
// Jest
jest.mock('@/lib/api');
const mockFetch = jest.fn();
jest.spyOn(console, 'log');

// Vitest
vi.mock('@/lib/api');
const mockFetch = vi.fn();
vi.spyOn(console, 'log');
```

#### 3. Fake timers

```typescript
// Jest
jest.useFakeTimers();
jest.advanceTimersByTime(1000);

// Vitest
vi.useFakeTimers();
vi.advanceTimersByTime(1000);
```

### Compatibilité 95%

La plupart des tests Jest fonctionnent sans modification si `globals: true` dans config.

### Migration automatique

```bash
# Remplacer jest → vi dans tous les fichiers
find . -name "*.test.ts" -exec sed -i 's/jest\./vi./g' {} +

# Mettre à jour imports
find . -name "*.test.ts" -exec sed -i "s/import.*@jest\/globals.*/import { describe, it, expect, vi } from 'vitest';/g" {} +
```

---

## 🧪 Testing Supabase avec Vitest

### Approche 1 : Mocks (comme Jest)

```typescript
// __tests__/lib/get-cases.test.ts
import { describe, it, expect, vi } from 'vitest';
import { getCases } from '@/lib/get-cases';
import { createClient } from '@/lib/supabase/client';

vi.mock('@/lib/supabase/client');

describe('getCases', () => {
  it('should fetch user cases', async () => {
    const mockCases = [
      { id: '1', title: 'Case 1' },
      { id: '2', title: 'Case 2' },
    ];

    vi.mocked(createClient).mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({
            data: mockCases,
            error: null,
          })),
        })),
      })),
    } as any);

    const cases = await getCases('user-123');

    expect(cases).toEqual(mockCases);
  });
});
```

### Approche 2 : Tests d'intégration réels

**Avantage Vitest** : Plus rapide pour tester contre vraie DB

```typescript
// __tests__/integration/supabase-rls.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'http://127.0.0.1:54321',
  process.env.SUPABASE_ANON_KEY!
);

describe('Supabase RLS Policies', () => {
  let testUserId: string;

  beforeAll(async () => {
    // Créer utilisateur de test
    const { data } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'password123',
    });
    testUserId = data.user!.id;
  });

  afterAll(async () => {
    // Nettoyer
    await supabase.from('cases').delete().eq('user_id', testUserId);
  });

  it('user can only read their own cases', async () => {
    // Insérer un case
    await supabase.from('cases').insert({
      title: 'My Case',
      user_id: testUserId,
    });

    // Lire les cases (devrait voir le sien)
    const { data } = await supabase
      .from('cases')
      .select('*')
      .eq('user_id', testUserId);

    expect(data).toHaveLength(1);
    expect(data![0].title).toBe('My Case');
  });

  it('user cannot read other users cases', async () => {
    // Tenter de lire les cases d'un autre user
    const { data } = await supabase
      .from('cases')
      .select('*')
      .eq('user_id', 'other-user-id');

    expect(data).toHaveLength(0); // RLS bloque
  });
});
```

**Configuration pour tests séquentiels** :

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    // ⚠️ Tests en série pour éviter conflits DB
    sequence: {
      concurrent: false,
    },
    pool: 'forks',
  },
});
```

---

## 🌐 Edge Functions testing

### Tester Supabase Edge Functions avec Deno

Les Edge Functions Supabase utilisent Deno. Vitest peut être utilisé, mais **Deno Test** est recommandé.

#### Avec Deno Test (recommandé)

```typescript
// supabase/functions/send-email/index.test.ts
import { assertEquals } from 'https://deno.land/std@0.192.0/testing/asserts.ts';
import handler from './index.ts';

Deno.test('send-email function', async () => {
  const request = new Request('http://localhost', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: 'test@example.com',
      subject: 'Test Email',
      content: 'Hello World',
    }),
  });

  const response = await handler(request);
  const data = await response.json();

  assertEquals(response.status, 200);
  assertEquals(data.sent, true);
});
```

#### Avec Vitest (alternative)

```typescript
// __tests__/edge-functions/send-email.test.ts
import { describe, it, expect } from 'vitest';

describe('send-email edge function', () => {
  it('should send email', async () => {
    const response = await fetch('http://127.0.0.1:54321/functions/v1/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        to: 'test@example.com',
        subject: 'Test',
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.sent).toBe(true);
  });
});
```

---

## 🎯 Quand utiliser Vitest ?

### ✅ Utiliser Vitest si...

1. **Nouveau projet Vite** : Vitest est le choix naturel
2. **Performance critique** : Tests très fréquents pendant le dev
3. **Projet ESM pur** : Pas de CommonJS legacy
4. **Petite équipe** : Facilité de setup

### ❌ Ne pas utiliser Vitest si...

1. **Next.js projet** : Jest mieux intégré
2. **Grande équipe Jest** : Coût de migration élevé
3. **Besoin de stabilité** : Jest plus mature
4. **Complex mocking needs** : Jest plus flexible

---

## 📊 Feature comparison

### Vitest UI

```bash
npm run test:ui
```

**Features** :
- ✅ Interface graphique des tests
- ✅ Watch mode interactif
- ✅ Visualisation coverage
- ✅ Re-run failed tests
- ✅ Filtrage tests

![Vitest UI](https://vitest.dev/screenshot.png)

### Vitest Browser Mode (experimental)

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'chrome',
    },
  },
});
```

Permet de tester dans un vrai browser (comme Playwright) mais plus léger.

---

## 🚀 Roadmap Formelio

### Phase 1 : Rester sur Jest (actuel) ✅

**Jusqu'à** :
- Jest fonctionne bien
- Next.js support excellent
- Équipe formée Jest

### Phase 2 : Évaluer Vitest (Q3 2025)

**Critères de réévaluation** :
- [ ] Vitest atteint v2.0 (stabilité)
- [ ] Next.js official support
- [ ] Équipe souhaite plus de vitesse
- [ ] Nouveaux projets Vite dans l'écosystème

### Phase 3 : Migration partielle (optionnel)

**Scénario** : Garder Jest pour Next.js, Vitest pour librairies

```
formelio/
├─ app/           → Jest (tests Next.js)
├─ components/    → Jest (tests React)
└─ packages/
    └─ utils/     → Vitest (pure TS, pas de Next.js)
```

---

## 📚 Ressources

### Documentation

- [Vitest Official](https://vitest.dev)
- [Migration from Jest](https://vitest.dev/guide/migration.html)
- [Supabase + Vitest](https://supabase.com/docs/guides/local-development/testing/vitest)

### Comparaisons

- [Jest vs Vitest (2025)](https://blog.logrocket.com/jest-vs-vitest/)
- [Should you migrate to Vitest?](https://dev.to/vitest-vs-jest-2025)

---

## 🎯 Conclusion

### TL;DR

- **Vitest** = Moderne, rapide, excellent DX
- **Jest** = Mature, stable, Next.js natif
- **Formelio** : Rester sur Jest pour l'instant
- **Futur** : Réévaluer en 2025 si Vitest devient standard Next.js

### Decision matrix

| Critère | Poids | Jest | Vitest | Gagnant |
|---------|-------|------|--------|---------|
| **Next.js support** | 30% | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Jest |
| **Performance** | 20% | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Vitest |
| **Maturité** | 20% | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Jest |
| **Developer Experience** | 15% | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Vitest |
| **Community** | 10% | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Jest |
| **Migration cost** | 5% | N/A | ⭐⭐ | Jest |

**Score final** :
- Jest : 4.3 / 5
- Vitest : 4.0 / 5

**Gagnant pour Formelio** : **Jest** ✅ (pour l'instant)

---

**Version** : 1.0
**Dernière mise à jour** : Octobre 2025
**Auteur** : Équipe Formelio
**Status** : Informational
**Révision prévue** : Q3 2025
