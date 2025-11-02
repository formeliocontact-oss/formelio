# Getting Started Checklist - Formelio

**Version**: 1.0
**Date**: Octobre 2025
**Usage**: Guide étape par étape pour démarrer le développement

---

## 📖 Table des Matières

1. [Avant d'Écrire du Code (30 min)](#avant-décrire-du-code-30-min)
2. [Phase 0: Setup (Jour 1 - 3-5h)](#phase-0-setup-jour-1---3-5h)
3. [Phase 1: Premier Feature (Semaine 1)](#phase-1-premier-feature-semaine-1)
4. [Validation Avant Chaque Commit](#validation-avant-chaque-commit)
5. [Troubleshooting Setup](#troubleshooting-setup)

---

## ⏱️ Avant d'Écrire du Code (30 min)

### Documentation Critique (30 min)

- [ ] **Lire [QUICK_REFERENCE.md](../QUICK_REFERENCE.md)** (10 min)
  - Les 5 interdictions absolues
  - Les 5 règles obligatoires
  - Patterns TypeScript et Supabase
  - **⚠️ GARDER OUVERT pendant le coding**

- [ ] **Lire [CLAUDE.md](../../.claude/CLAUDE.md) - Overview** (10 min)
  - Stack technique
  - Structure du projet
  - Philosophie du code
  - Ne pas lire en détail maintenant, juste l'overview

- [ ] **Comprendre les règles critiques** (10 min)
  - ❌ JAMAIS `any` ou `as any`
  - ❌ JAMAIS `@ts-ignore`
  - ❌ JAMAIS `@supabase/auth-helpers-nextjs`
  - ✅ TOUJOURS `@supabase/ssr`
  - ✅ TOUJOURS `getUser()` dans Server Components
  - ✅ TOUJOURS `getAll/setAll` pour cookies

---

## 📦 Phase 0: Setup (Jour 1 - 3-5h)

### Étape 1: Clone & Installation (30 min)

- [ ] **Cloner le repository**
  ```bash
  git clone <repository-url> formelio
  cd formelio
  ```

- [ ] **Installer les dépendances**
  ```bash
  npm install
  ```
  - ⏱️ Temps estimé: 5-10 min
  - ⚠️ Si erreurs, voir [Troubleshooting](#troubleshooting-setup)

- [ ] **Vérifier les versions**
  ```bash
  node -v          # v18.0.0 ou supérieur
  npm -v           # v9.0.0 ou supérieur
  ```

### Étape 2: Configuration Environnement (45 min)

- [ ] **Créer `.env.local`**
  ```bash
  cp .env.example .env.local
  ```

- [ ] **Configurer Supabase**

  **Option A: Nouveau projet Supabase (30 min)**
  - [ ] Aller sur [supabase.com](https://supabase.com)
  - [ ] Créer un nouveau projet
  - [ ] Copier `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] Copier `anon/public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] (Optionnel) Copier `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

  **Option B: Projet Supabase existant (5 min)**
  - [ ] Récupérer les credentials depuis Supabase Dashboard
  - [ ] Copier dans `.env.local`

- [ ] **Variables d'environnement minimales**
  ```bash
  # .env.local
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

  # Optionnel (Phase 3 - Payments)
  # STRIPE_SECRET_KEY=sk_test_...
  # NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
  ```

### Étape 3: Database Migrations (45 min)

- [ ] **Installer Supabase CLI** (si pas déjà fait)
  ```bash
  npm install -g supabase
  ```

- [ ] **Se connecter à Supabase**
  ```bash
  supabase login
  supabase link --project-ref <project-ref>
  ```

- [ ] **Appliquer les migrations**
  ```bash
  supabase db push
  ```
  - ⏱️ Temps estimé: 5-10 min
  - ✅ Vérifie que les tables sont créées dans Supabase Dashboard

- [ ] **Vérifier les tables créées**
  - [ ] `users` (via Supabase Auth)
  - [ ] `cases`
  - [ ] `documents`
  - [ ] `case_updates`
  - [ ] `payments` (si Phase 3)

- [ ] **Activer Row Level Security (RLS)**
  - Vérifier dans Supabase Dashboard > Authentication > Policies
  - Toutes les tables doivent avoir RLS activé
  - Les policies de base doivent être en place

### Étape 4: Vérification Développement (30 min)

- [ ] **Démarrer le serveur de développement**
  ```bash
  npm run dev
  ```
  - ✅ Le serveur démarre sur http://localhost:3000
  - ✅ Aucune erreur TypeScript dans le terminal
  - ✅ La page s'affiche (même si basique)

- [ ] **Vérifier TypeScript**
  ```bash
  npm run type-check
  ```
  - ✅ Aucune erreur TypeScript
  - ⚠️ Si erreurs, les corriger avant de continuer

- [ ] **Vérifier ESLint**
  ```bash
  npm run lint
  ```
  - ✅ Aucune erreur de linting
  - ⚠️ Corriger les erreurs critiques

- [ ] **Build de test**
  ```bash
  npm run build
  ```
  - ✅ Le build réussit
  - ⏱️ Temps estimé: 1-3 min

### Étape 5: Configuration Git (30 min)

- [ ] **Configurer Git Flow**
  ```bash
  # Créer la branche develop si pas existe
  git checkout -b develop
  git push -u origin develop
  ```

- [ ] **Configurer les branches protégées** (GitHub/GitLab)
  - [ ] `main` → protected, require PR
  - [ ] `develop` → protected, require PR
  - [ ] Branch naming: `feature/`, `fix/`, `hotfix/`

- [ ] **Premier commit de setup (si modifications)**
  ```bash
  git add .env.local.example  # Ne jamais commit .env.local !
  git commit -m "chore(setup): configure development environment"
  git push
  ```

### Étape 6: Tests Setup (30 min)

- [ ] **Vérifier configuration Vitest**
  ```bash
  npm test
  ```
  - ✅ Les tests s'exécutent (même si aucun test encore)

- [ ] **Vérifier configuration Playwright**
  ```bash
  npx playwright install
  npm run test:e2e
  ```
  - ✅ Playwright est installé
  - ⚠️ Les tests E2E peuvent échouer si pas encore de tests

---

## 🚀 Phase 1: Premier Feature (Semaine 1)

### Préparation (30 min)

- [ ] **Relire la documentation pertinente**
  - [ ] [CLAUDE.md](../../.claude/CLAUDE.md) section pertinente
  - [ ] [QUICK_REFERENCE.md](../QUICK_REFERENCE.md) toujours ouvert
  - [ ] Task file correspondante (ex: `P1-01-homepage-layout.md`)

- [ ] **Comprendre la task**
  - [ ] Lire la description complète
  - [ ] Identifier les composants à créer
  - [ ] Identifier les dépendances (packages, APIs)
  - [ ] Estimer le temps réel vs temps planifié

### Développement (Exemple: P1-01 Homepage Layout - 4h)

- [ ] **Créer une branche feature**
  ```bash
  git checkout develop
  git pull
  git checkout -b feature/P1-01-homepage-layout
  ```

- [ ] **Implémenter le feature**
  - [ ] Créer les composants nécessaires
  - [ ] Respecter la structure définie dans CLAUDE.md
  - [ ] HTML sémantique (pas de div soup)
  - [ ] Types TypeScript explicites partout
  - [ ] Aucun `any` ou `as any`

- [ ] **Tester localement**
  ```bash
  npm run dev
  # Tester manuellement dans le navigateur
  ```

- [ ] **Écrire les tests**

  **Tests unitaires (composants)**:
  ```bash
  # Créer le fichier test
  touch components/__tests__/homepage-hero.test.tsx

  # Implémenter les tests
  npm test -- homepage-hero
  ```

  **Tests E2E (si applicable)**:
  ```bash
  # Créer le fichier E2E
  touch tests/e2e/homepage.spec.ts

  # Implémenter les tests E2E
  npm run test:e2e -- homepage
  ```

- [ ] **Vérifier l'accessibilité (WCAG AA)**
  - [ ] Tous les inputs ont des labels
  - [ ] Tous les boutons ont aria-label si nécessaire
  - [ ] Navigation au clavier fonctionne
  - [ ] Contraste des couleurs suffisant
  - [ ] Utiliser Lighthouse ou axe DevTools

### Validation Pré-Commit (15 min)

- [ ] **Validation complète** (voir [section dédiée](#validation-avant-chaque-commit))

### Pull Request (30 min)

- [ ] **Commit avec message conventionnel**
  ```bash
  git add .
  git commit -m "feat(landing): implement homepage hero section

  - Create HeroSection component with semantic HTML
  - Add responsive design for mobile/tablet/desktop
  - Implement CTA buttons with proper accessibility
  - Add unit tests for HeroSection component
  - Add E2E test for homepage navigation

  Relates to P1-01"
  ```

- [ ] **Push vers origin**
  ```bash
  git push -u origin feature/P1-01-homepage-layout
  ```

- [ ] **Créer Pull Request**
  - [ ] Titre: `feat(landing): P1-01 Homepage Hero Section`
  - [ ] Description complète:
    ```markdown
    ## Description
    Implementation of P1-01: Homepage Hero Section

    ## Changes
    - Created HeroSection component
    - Added responsive layout
    - Implemented accessibility features

    ## Testing
    - [ ] Unit tests pass
    - [ ] E2E tests pass
    - [ ] Manual testing done
    - [ ] Accessibility verified

    ## Checklist
    - [ ] No `any` or `as any`
    - [ ] HTML semantic
    - [ ] Types explicit
    - [ ] Tests written
    - [ ] Build succeeds
    ```
  - [ ] Assigner reviewer (si applicable)
  - [ ] Labels: `feature`, `phase-1`

- [ ] **Attendre review et merger vers develop**

---

## ✅ Validation Avant Chaque Commit

### Checklist Rapide (5 min)

- [ ] **Code Quality**
  - [ ] ✅ Aucun `any` ou `as any` dans le code
  - [ ] ✅ Aucun `@ts-ignore`
  - [ ] ✅ Tous les types sont explicites
  - [ ] ✅ Aucune importation de `@supabase/auth-helpers-nextjs`

- [ ] **HTML Sémantique**
  - [ ] ✅ Pas de div soup (divs imbriquées inutiles)
  - [ ] ✅ Balises sémantiques utilisées (`<header>`, `<nav>`, `<main>`, etc.)
  - [ ] ✅ Buttons pour actions, `<a>` pour navigation
  - [ ] ✅ Forms avec labels appropriés

- [ ] **Architecture**
  - [ ] ✅ Aucun fichier > 300 lignes
  - [ ] ✅ Aucun doublon de code (vérifier hooks customs)
  - [ ] ✅ Composants avec responsabilité unique
  - [ ] ✅ Hooks réutilisables pour logique partagée

### Commandes de Validation (10 min)

Exécuter dans l'ordre :

```bash
# 1. Type checking (2 min)
npm run type-check
# ✅ Doit passer sans erreur

# 2. Linting (2 min)
npm run lint
# ✅ Doit passer sans erreur

# 3. Tests unitaires (3 min)
npm test
# ✅ Tous les tests doivent passer

# 4. Build (3 min)
npm run build
# ✅ Le build doit réussir

# Optionnel: Tests E2E si feature touche UI critique
npm run test:e2e
```

### Si une Validation Échoue

**Type-check échoue**:
- Lire l'erreur TypeScript attentivement
- Vérifier qu'aucun `any` n'a été utilisé
- Ajouter types explicites manquants
- Consulter [TROUBLESHOOTING.md](../TROUBLESHOOTING.md)

**Lint échoue**:
- Corriger les erreurs de style
- Vérifier imports non utilisés
- Formatter le code : `npm run lint -- --fix`

**Tests échouent**:
- Lire les erreurs de tests
- Vérifier mocks Supabase si applicable
- Déboguer avec `npm test -- --watch`

**Build échoue**:
- Vérifier erreurs de compilation
- Vérifier imports/exports corrects
- Nettoyer cache : `rm -rf .next && npm run build`

---

## 🔧 Troubleshooting Setup

### Problème: npm install échoue

**Erreur**: `ERESOLVE unable to resolve dependency tree`

**Solution**:
```bash
# Option 1: Force resolution
npm install --legacy-peer-deps

# Option 2: Clean install
rm -rf node_modules package-lock.json
npm install
```

---

### Problème: Supabase connection fails

**Erreur**: `Invalid Supabase URL` ou `401 Unauthorized`

**Solution**:
1. Vérifier `.env.local` est présent
2. Vérifier les variables commencent par `NEXT_PUBLIC_`
3. Vérifier les URLs dans Supabase Dashboard
4. Redémarrer le serveur dev : `npm run dev`

---

### Problème: TypeScript errors sur Supabase

**Erreur**: `Property 'from' does not exist on type...`

**Solution**:
```bash
# Générer les types Supabase
npx supabase gen types typescript --project-id <project-id> > types/supabase.ts

# Ou depuis local
supabase gen types typescript --local > types/supabase.ts
```

---

### Problème: Build échoue avec "Module not found"

**Erreur**: `Module not found: Can't resolve '@/...'`

**Solution**:
1. Vérifier `tsconfig.json` a les paths configurés:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```
2. Redémarrer VS Code
3. Clean build: `rm -rf .next && npm run build`

---

### Problème: Tests ne trouvent pas les modules

**Erreur**: `Cannot find module '@/components/...'`

**Solution**:
Vérifier `vitest.config.ts` a les alias configurés:
```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

---

## 📚 Prochaines Étapes

### Après Setup Complet

1. **Familiarisation avec le codebase** (2-3h)
   - [ ] Explorer la structure `app/` et comprendre App Router
   - [ ] Examiner les composants Shadcn UI disponibles
   - [ ] Lire les schémas de validation Zod existants

2. **Première tâche de développement**
   - [ ] Aller dans [TASKS_SYNTHESIS.md](../../02-project-management/TASKS_SYNTHESIS.md)
   - [ ] Identifier la prochaine task à faire
   - [ ] Lire le fichier task détaillé (ex: `tasks/P1-01-homepage-layout.md`)
   - [ ] Suivre le workflow de développement ci-dessus

3. **Amélioration continue**
   - [ ] Lire progressivement [CLAUDE.md](../../.claude/CLAUDE.md) en détail
   - [ ] Consulter [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) en cas de blocage
   - [ ] Référer à [QUICK_REFERENCE.md](../QUICK_REFERENCE.md) régulièrement

---

## 🎯 Résumé Temps Estimés

| Phase | Durée | Description |
|-------|-------|-------------|
| Documentation | 30 min | Lecture docs critiques |
| Clone & Install | 30 min | Setup local initial |
| Configuration Env | 45 min | Supabase + .env |
| Database Migrations | 45 min | Setup DB + RLS |
| Vérification Dev | 30 min | Tests locaux |
| Configuration Git | 30 min | Branches + premier commit |
| Tests Setup | 30 min | Vitest + Playwright |
| **TOTAL Phase 0** | **4h** | Setup complet |
| Premier Feature | 4-8h | Selon complexité |
| **TOTAL Jour 1** | **8-12h** | Setup + premier feature |

---

## 💡 Conseils Pratiques

### Pendant le Développement

1. **Toujours avoir QUICK_REFERENCE.md ouvert**
   - Dans un second moniteur
   - Ou dans un split screen VS Code

2. **Commiter fréquemment**
   - Après chaque fonctionnalité complète
   - Messages de commit descriptifs
   - Ne pas accumuler trop de changements

3. **Tester en continu**
   - Tester dans le navigateur après chaque changement
   - Lancer `npm test` régulièrement
   - Ne pas attendre la fin pour tester

4. **Demander de l'aide si bloqué > 30 min**
   - Consulter TROUBLESHOOTING.md
   - Chercher dans la doc Supabase/Next.js
   - Demander sur le channel équipe

### Bonnes Pratiques

- ✅ Lire la task complète avant de commencer
- ✅ Faire des pauses régulières (Pomodoro: 25 min travail, 5 min pause)
- ✅ Documenter les décisions techniques importantes
- ✅ Reviewer son propre code avant PR
- ✅ Tester l'accessibilité avec screen reader

---

## 🔗 Ressources

### Documentation Projet
- [QUICK_REFERENCE.md](../QUICK_REFERENCE.md) - Règles sur 1 page ⚠️
- [CLAUDE.md](../../.claude/CLAUDE.md) - Règles complètes
- [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) - Solutions erreurs
- [TASKS_SYNTHESIS.md](../../02-project-management/TASKS_SYNTHESIS.md) - Liste tasks

### Documentation Externe
- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Auth with SSR](https://supabase.com/docs/guides/auth/server-side)
- [Shadcn UI Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Version**: 1.0
**Dernière mise à jour**: Octobre 2025
**Projet**: Formelio - Service de formalités juridiques

**⚠️ SUIVRE CETTE CHECKLIST ÉTAPE PAR ÉTAPE**
