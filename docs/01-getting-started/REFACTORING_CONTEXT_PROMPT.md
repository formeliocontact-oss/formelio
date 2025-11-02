# 📋 Context Prompt - Refactoring Complet Documentation Formelio

**Date de création** : Octobre 2025
**Objectif** : Refactoring complet de la documentation (Option B - 24-32h)
**Utilisation** : Copier ce prompt dans un nouveau chat Claude pour démarrer le refactoring

---

## 🎯 MISSION

Tu es un expert en documentation technique. Ta mission est de refactorer complètement la documentation du projet **Formelio** pour la rendre optimale, cohérente et maintenable avant le démarrage du développement.

---

## 📊 CONTEXTE DU PROJET

### Présentation Formelio

**Formelio** est un service SaaS spécialisé dans les formalités juridiques complexes pour professionnels du droit français (experts-comptables, avocats, notaires).

**Positionnement unique** :
- Expertise insider des greffes français
- Spécialisation dans les dossiers rejetés et situations bloquées
- Communication directe avec les registres

### Stack Technique

- **Frontend** : Next.js 14 (App Router) + TypeScript 5.3+ + Tailwind CSS + Shadcn UI
- **Backend** : Supabase (Auth @supabase/ssr, Database PostgreSQL, Storage, Realtime)
- **Payments** : Stripe (API version 2024-11-20)
- **Deployment** : Vercel
- **Testing** : Vitest + Playwright
- **Package Manager** : npm

### Organisation du Projet

**4 Phases de développement** :
- **Phase 0** (Setup) : 3 tasks, 13h, 3-5 jours
- **Phase 1** (Landing) : 8 tasks, 41h, 3-4 semaines
- **Phase 2** (Dashboard) : 12 tasks, 98h, 4-6 semaines
- **Phase 3** (Payment) : 7 tasks, 48h, 2-3 semaines
- **TOTAL** : 30 tasks, 200h, 10-14 semaines

---

## 📁 ÉTAT ACTUEL DE LA DOCUMENTATION

### Inventaire

**41 fichiers markdown** organisés en :
```
docs/
├── 00-START-HERE.md
├── README.md
├── HOW_TO_USE.md
├── INVENTORY.md
├── TAGS_INDEX.md (nouveau)
│
├── 01-getting-started/ (4 fichiers)
│   ├── CONTEXT_PROMPT.md
│   ├── GETTING_STARTED.md
│   ├── INDEX.md
│   └── MCP_WORKFLOW.md
│
├── 02-project-management/ (4 fichiers)
│   ├── cahier_des_charges_formelio.md
│   ├── GIT_STRATEGY.md
│   ├── LIVRABABLES.md
│   └── TASKS_SYNTHESIS.md
│
├── 03-development/ (13 fichiers)
│   ├── CLAUDE.md (1177 lignes - CRITIQUE)
│   ├── DESIGN_SYSTEM.md (nouveau)
│   ├── PAYMENTS_ARCHITECTURE.md
│   ├── STRIPE_INTEGRATION_GUIDE.md
│   ├── SUPABASE_AUTH_MIDDLEWARE.md
│   ├── SUPABASE_RLS_GUIDE.md
│   └── tasks/ (7 fichiers de tasks)
│
├── 04-testing/ (11 fichiers)
│   ├── TESTING_STRATEGY.md
│   ├── TESTING_INTEGRATION_GUIDE.md
│   ├── TESTING_RECAP.md
│   ├── E2E_FIXTURES_HELPERS.md
│   ├── E2E_TOOL_DECISION.md
│   ├── PLAYWRIGHT_SUPABASE_AUTH.md
│   ├── VITEST_GUIDE.md
│   ├── CI_CD_OPTIMIZATION.md
│   ├── TESTING_UPDATE_SUMMARY.md
│   └── README.md
│
├── 05-assets/ (3 fichiers)
│   ├── formelio_logo.png
│   ├── background_hero_landing.png
│   └── Your_First_Project.pdf
│
└── Changelogs (6 fichiers)
    ├── CHANGELOG_STRIPE_2025.md
    ├── CHANGELOG_ARCHITECTURE_2025.md
    ├── CHANGELOG_SECURITY_2025.md
    ├── CHANGELOG_SEMANTIC_HTML.md
    ├── UPDATES_SUMMARY_2025.md
    └── FINAL_UPDATES_SUMMARY_2025.md
```

**Total** : ~15,235 lignes de documentation

### Score Qualité Actuel : 7.5/10

**Forces** :
- ✅ Couverture complète (95%)
- ✅ Règles critiques bien définies
- ✅ Exemples de code nombreux
- ✅ Structure logique par phases

**Faiblesses** :
- ⚠️ Fragmentation excessive (12 fichiers à fusionner)
- ⚠️ Incohérences dates (28, 30, Octobre 2025)
- ⚠️ Comptage fichiers incorrect (22, 27 vs 41 réels)
- ⚠️ 3 documents critiques manquants
- ⚠️ Redondances importantes

---

## 🔍 RÉSUMÉ DE L'AUDIT

### Problèmes Critiques Identifiés

1. **Incohérences de dates**
   - 00-START-HERE.md : "Octobre 2025"
   - CLAUDE.md : "Octobre 2025"
   - DESIGN_SYSTEM.md : "Octobre 2025"
   - **Action** : Standardiser à "Octobre 2025"

2. **Comptage fichiers incorrect**
   - 00-START-HERE.md : 27 fichiers
   - INVENTORY.md : 22 fichiers
   - Réalité : **41 fichiers**
   - **Action** : Corriger tous les comptages

3. **Documents critiques manquants**
   - QUICK_REFERENCE.md (règles sur 1 page)
   - GETTING_STARTED_CHECKLIST.md (setup étape par étape)
   - TROUBLESHOOTING.md (solutions aux erreurs)
   - **Action** : Créer ces 3 fichiers

4. **Fragmentation excessive**
   - 6 changelogs séparés
   - 11 fichiers testing qui se répètent
   - 3 fichiers Stripe qui se chevauchent
   - **Action** : Consolider

5. **CLAUDE.md trop long**
   - 1177 lignes monolithiques
   - Mélange règles critiques et secondaires
   - **Action** : Diviser en 5 fichiers spécialisés

### Redondances Majeures

- **Auth Supabase** : Répété 3x (CLAUDE.md, SUPABASE_AUTH_RULES.md, SUPABASE_AUTH_MIDDLEWARE.md)
- **Phases du projet** : Répété 4x (CDC, TASKS_SYNTHESIS, README, HOW_TO_USE)
- **Stratégie tests** : Répété 3x (TESTING_STRATEGY, TESTING_RECAP, TESTING_INTEGRATION_GUIDE)

---

## 🎯 ACTIONS À RÉALISER (24-32h)

### Priorité 1 : Fixes Critiques (4-6h)

#### 1.1 Créer QUICK_REFERENCE.md (2h)

**Localisation** : `docs/QUICK_REFERENCE.md`

**Contenu obligatoire** :
```markdown
# Quick Reference - Formelio

## ⛔ 5 INTERDICTIONS ABSOLUES
1. ❌ JAMAIS `any` ou `as any`
2. ❌ JAMAIS `@ts-ignore`
3. ❌ JAMAIS `@supabase/auth-helpers-nextjs` (DEPRECATED)
4. ❌ JAMAIS getSession() dans Server Components
5. ❌ JAMAIS cookie get/set (utiliser getAll/setAll)

## ✅ 5 RÈGLES OBLIGATOIRES
1. ✅ Types explicites partout
2. ✅ Toujours @supabase/ssr
3. ✅ getUser() dans Server Components
4. ✅ HTML sémantique (<header>, <nav>, <main>)
5. ✅ getAll/setAll pour cookies

## 📋 Patterns TypeScript

[Type guards, Component props, etc.]

## 🔐 Patterns Supabase Auth

[Server Component, Client Component, Middleware]

## 🎨 HTML Sémantique

[Bonnes vs mauvaises pratiques]

## 📂 Structure Fichiers

[app/, components/, lib/]

## 🧪 Commandes Tests

[npm test, npm run test:e2e, etc.]

## 🔄 Workflow Git

[Conventional commits, branches]
```

**Taille cible** : 300-400 lignes, 1 page imprimable

---

#### 1.2 Créer GETTING_STARTED_CHECKLIST.md (1h)

**Localisation** : `docs/01-getting-started/CHECKLIST.md`

**Contenu obligatoire** :
```markdown
# Getting Started Checklist - Formelio

## ⏱️ Avant d'Écrire du Code (30 min)
- [ ] Lire CLAUDE.md overview (10 min)
- [ ] Lire QUICK_REFERENCE.md (10 min)
- [ ] Comprendre les 5 interdictions absolues (10 min)

## 📦 Phase 0 : Setup (Jour 1 - 3-5h)
- [ ] Cloner repository
- [ ] npm install
- [ ] Configurer .env.local
- [ ] Setup Supabase project
- [ ] Migrations database
- [ ] npm run dev (vérifier)
- [ ] npm run type-check (vérifier)

## 🚀 Phase 1 : Premier Feature (Semaine 1)
- [ ] git checkout -b feature/phase1-landing
- [ ] Implémenter P1-01: Homepage Layout (4h)
- [ ] Écrire tests composants
- [ ] Vérifier accessibilité (WCAG AA)
- [ ] Pull request vers develop

## ✅ Validation Avant Chaque Commit
- [ ] Aucun `any` dans le code
- [ ] Types explicites partout
- [ ] HTML sémantique (pas de div soup)
- [ ] npm test (pass)
- [ ] npm run lint (pass)
- [ ] npm run type-check (pass)
- [ ] npm run build (pass)
```

**Taille cible** : 200-300 lignes

---

#### 1.3 Créer TROUBLESHOOTING.md (2h)

**Localisation** : `docs/TROUBLESHOOTING.md`

**Sections obligatoires** :
1. Erreurs TypeScript communes
2. Problèmes Supabase Auth
3. Erreurs Next.js Build
4. Échecs de tests
5. Problèmes Stripe
6. FAQ

**Format** :
```markdown
### Erreur: "Type 'any' is not assignable"
**Cause** : Utilisation de `any` (interdit)
**Solution** : Utiliser types explicites ou `unknown` avec type guard
**Exemple** : [Code example]
```

**Taille cible** : 400-500 lignes

---

#### 1.4 Corriger Incohérences (1.5h)

**Dates** :
- Standardiser toutes les dates → "Octobre 2025" (sans jour précis)
- Garder dates précises uniquement dans les changelogs

**Fichiers à modifier** :
- 00-START-HERE.md
- README.md
- CLAUDE.md
- INVENTORY.md
- DESIGN_SYSTEM.md
- TAGS_INDEX.md
- Tous les changelogs

**Comptage fichiers** :
- Corriger "27 fichiers" → "41 fichiers"
- Corriger "22 fichiers" → "41 fichiers"

**Fichiers à modifier** :
- 00-START-HERE.md (ligne 183)
- INVENTORY.md (ligne 273)

---

#### 1.5 Auditer Liens Cassés (1h)

**Vérifier tous les liens** `[text](path)` dans :
- CLAUDE.md (lignes 1170-1171)
- DESIGN_SYSTEM.md (vérifier assets)
- Tous les cross-references entre docs

**Corriger** :
- Chemins relatifs incorrects
- Références à fichiers inexistants
- Ancres de sections mal nommées

---

#### 1.6 Améliorer README.md (30min)

**Ajouter en haut** :
```markdown
## 🚨 CRITIQUE - Lire AVANT Développement

### ⚠️ Documents OBLIGATOIRES (30 min)
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) ⚠️ **GARDER OUVERT pendant le coding**
- [CLAUDE.md](03-development/CLAUDE.md) ⚠️ **Lire intégralement avant de coder**
- [CHECKLIST.md](01-getting-started/CHECKLIST.md) ⚠️ **Suivre étape par étape**

### 📖 Guides d'Implémentation
- [STRIPE_GUIDE.md](03-development/STRIPE_GUIDE.md)
- [TESTING_GUIDE.md](04-testing/TESTING_GUIDE.md)
- [DESIGN_SYSTEM.md](03-development/DESIGN_SYSTEM.md)

### 🆘 En Cas de Problème
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Solutions aux erreurs communes
```

---

### Priorité 2 : Consolidation (12-16h)

#### 2.1 Fusionner Documentation Stripe (3h)

**Fichiers sources** :
- `STRIPE_INTEGRATION_GUIDE.md` (943 lignes)
- `PAYMENTS_ARCHITECTURE.md` (918 lignes)
- `.claude/STRIPE_RULES.md` (300 lignes)

**Fichier cible** :
- `03-development/STRIPE_GUIDE.md` (~1200 lignes)

**Structure du nouveau fichier** :
```markdown
# Guide Stripe - Formelio

## 1. Vue d'ensemble
## 2. Configuration Initiale
## 3. Architecture Database (de PAYMENTS_ARCHITECTURE)
## 4. Payment Flow Implementation
## 5. Webhooks & Synchronization
## 6. Invoice Generation (de PAYMENTS_ARCHITECTURE)
## 7. Customer Portal
## 8. Sécurité (de STRIPE_RULES.md)
## 9. Testing Stripe
## 10. Troubleshooting
## 11. Ressources Externes
```

**Actions** :
1. Créer `STRIPE_GUIDE.md`
2. Copier contenu de STRIPE_INTEGRATION_GUIDE (base)
3. Intégrer sections de PAYMENTS_ARCHITECTURE
4. Ajouter règles sécurité de STRIPE_RULES
5. Supprimer anciens fichiers
6. Mettre à jour tous les liens

**Fichiers à supprimer** :
- PAYMENTS_ARCHITECTURE.md
- .claude/STRIPE_RULES.md (déplacer contenu critique dans CLAUDE.md)

---

#### 2.2 Consolider Documentation Tests (4h)

**Fichiers sources** (11 fichiers) :
- TESTING_STRATEGY.md (1253 lignes)
- TESTING_INTEGRATION_GUIDE.md (525 lignes)
- TESTING_RECAP.md (551 lignes)
- E2E_FIXTURES_HELPERS.md (681 lignes)
- E2E_TOOL_DECISION.md (434 lignes)
- PLAYWRIGHT_SUPABASE_AUTH.md (963 lignes)
- VITEST_GUIDE.md (584 lignes)
- CI_CD_OPTIMIZATION.md (759 lignes)
- TESTING_UPDATE_SUMMARY.md (471 lignes)
- README.md (350 lignes)

**Fichiers cibles** (4 fichiers) :
1. `TESTING_GUIDE.md` (~1500 lignes) - Document principal
2. `TESTING_REFERENCE.md` (~800 lignes) - Code reference
3. `VITEST_GUIDE.md` (584 lignes) - Garder séparé si Vitest choisi
4. `CI_CD_OPTIMIZATION.md` (759 lignes) - Garder séparé

**Structure TESTING_GUIDE.md** :
```markdown
# Guide de Tests - Formelio

## 1. Vue d'ensemble & Stratégie
   - Pyramide de tests
   - 165 tests planifiés
   - Outils choisis (Vitest + Playwright + RTL)
   - Pourquoi Playwright (de E2E_TOOL_DECISION)

## 2. Quick Start
   - Installation
   - Premier test unitaire
   - Premier test E2E

## 3. Tests Unitaires (Vitest/Jest)
   - Configuration
   - Patterns
   - Exemples complets

## 4. Tests d'Intégration (React Testing Library)
   - Configuration
   - Patterns
   - Exemples complets

## 5. Tests E2E (Playwright)
   - Configuration
   - Patterns
   - Exemples complets

## 6. Implémentation par Phase
   - Phase 0 : Setup (de TESTING_INTEGRATION_GUIDE)
   - Phase 1 : Landing
   - Phase 2 : Dashboard
   - Phase 3 : Payment

## 7. CI/CD (lien vers CI_CD_OPTIMIZATION.md)

## 8. Troubleshooting Tests
```

**Structure TESTING_REFERENCE.md** :
```markdown
# Référence Tests - Code Réutilisable

## 1. Fixtures (de E2E_FIXTURES_HELPERS)
   - test-users.json
   - test-cases.json
   - test-documents.pdf

## 2. Helpers
   - Auth helpers (de PLAYWRIGHT_SUPABASE_AUTH)
   - Data helpers
   - Wait helpers

## 3. Supabase Auth Testing
   - Patterns Playwright + Supabase
   - Mock auth
   - Test users

## 4. Patterns Communs
   - Testing forms
   - Testing modals
   - Testing file uploads

## 5. Troubleshooting Patterns
```

**Actions** :
1. Créer TESTING_GUIDE.md
2. Créer TESTING_REFERENCE.md
3. Fusionner contenus (éliminer redondances)
4. Garder VITEST_GUIDE.md et CI_CD_OPTIMIZATION.md séparés
5. Supprimer fichiers obsolètes
6. Mettre à jour tous les liens

**Fichiers à supprimer** :
- TESTING_RECAP.md
- E2E_TOOL_DECISION.md (intégré dans TESTING_GUIDE)
- TESTING_INTEGRATION_GUIDE.md (intégré)
- TESTING_UPDATE_SUMMARY.md
- README.md (dans 04-testing/)

---

#### 2.3 Consolider Changelogs (2h)

**Fichiers sources** (6 fichiers) :
- CHANGELOG_STRIPE_2025.md (299 lignes)
- CHANGELOG_ARCHITECTURE_2025.md
- CHANGELOG_SECURITY_2025.md
- CHANGELOG_SEMANTIC_HTML.md (50 lignes)
- UPDATES_SUMMARY_2025.md (50 lignes)
- FINAL_UPDATES_SUMMARY_2025.md (389 lignes)

**Fichiers cibles** (2 fichiers) :
1. `CHANGELOG.md` - Historique chronologique complet
2. `MIGRATION_GUIDE_2025.md` - Actions à prendre

**Structure CHANGELOG.md** :
```markdown
# Changelog - Documentation Formelio

## [Octobre 2025] - Refactoring Complet

### 2025-10-31 : Refactoring Documentation
- Consolidation 41 → 35 fichiers
- Création QUICK_REFERENCE.md
- Création CHECKLIST.md
- Création TROUBLESHOOTING.md

### 2025-10-31 : Ressources Design & SaaS
- Ajout section SaaS Architecture References
- Création DESIGN_SYSTEM.md complet
- Intégration ressources UI/UX

### 2025-10-30 : Updates Stripe 2025
- Migration API 2024-11-20
- Webhooks modernisés
- Customer Portal intégré

### 2025-10-30 : Architecture & Sécurité
- Supabase RLS policies optimisées
- @supabase/ssr migration
- Règles HTML sémantique

### 2025-10-28 : Documentation Initiale
- Création structure complète
- 30 tasks documentées
- Stratégie tests (165 tests)
```

**Structure MIGRATION_GUIDE_2025.md** :
```markdown
# Guide de Migration 2025

## Priorité Critique (11h)
- [ ] Migrer @supabase/auth-helpers-nextjs → @supabase/ssr
- [ ] Implémenter getAll/setAll pour cookies
- [ ] Remplacer getSession() par getUser() (Server)

## Priorité Haute (11h)
- [ ] Migrer vers Stripe API 2024-11-20
- [ ] Implémenter HTML sémantique
- [ ] Setup RLS policies

## Priorité Moyenne (18h)
- [ ] Setup tests (Vitest + Playwright)
- [ ] Intégrer Design System
- [ ] Configurer CI/CD
```

**Actions** :
1. Créer CHANGELOG.md (chronologique)
2. Créer MIGRATION_GUIDE_2025.md (actionnable)
3. Fusionner tous les changelogs
4. Supprimer anciens fichiers
5. Mettre à jour liens dans README

**Fichiers à supprimer** :
- Tous les 6 fichiers changelog individuels

---

#### 2.4 Diviser CLAUDE.md (3h)

**Fichier source** :
- `CLAUDE.md` (1177 lignes)

**Fichiers cibles** (5 fichiers) :

**1. CLAUDE.md (nouveau, ~400 lignes)** - Overview
```markdown
# CLAUDE.md - Règles de Développement Formelio

## 1. Stack Technique
## 2. Structure du Projet
## 3. Philosophie du Code
## 4. Règles CRITIQUES (résumé + liens)
   - TypeScript → Voir TYPESCRIPT_RULES.md ⚠️
   - Supabase → Voir SUPABASE_RULES.md ⚠️
   - HTML → Voir HTML_SEMANTIC_RULES.md
   - Next.js → Voir NEXTJS_RULES.md
## 5. Checklist Avant Commit
## 6. Ressources
```

**2. rules/TYPESCRIPT_RULES.md (~300 lignes)** ⚠️ CRITIQUE
```markdown
# Règles TypeScript Strictes - Formelio

## ⛔ INTERDICTIONS ABSOLUES
## ✅ BONNES PRATIQUES
## 📋 Configuration tsconfig.json
## 🔧 Type Guards
## 📝 Conventions de Nommage
## 💡 Exemples Complets
```

**3. rules/SUPABASE_RULES.md (~400 lignes)** ⚠️ CRITIQUE
```markdown
# Règles Supabase Critiques - Formelio

## ⚠️ RÈGLES CRITIQUES
   - ❌ JAMAIS @supabase/auth-helpers-nextjs
   - ✅ TOUJOURS @supabase/ssr
   - ❌ JAMAIS getSession() dans Server Components
   - ✅ TOUJOURS getUser() dans Server Components
   - ❌ JAMAIS get/set cookies
   - ✅ TOUJOURS getAll/setAll cookies

## 🔐 Structure Supabase
## 🍪 Cookie Handling (getAll/setAll)
## 👤 getUser() vs getSession()
## 🔒 Row Level Security
## 💡 Exemples Complets
## 🔗 Intégration avec SUPABASE_AUTH_MIDDLEWARE.md
```

**4. rules/HTML_SEMANTIC_RULES.md (~200 lignes)**
```markdown
# Règles HTML Sémantique - Formelio

## ⛔ INTERDICTION : Div Soup
## ✅ Balises Sémantiques
## ♿ Accessibilité (a11y)
## ⚛️ Fragments React
## 💡 Exemples Complets
```

**5. rules/NEXTJS_RULES.md (~300 lignes)**
```markdown
# Règles Next.js App Router - Formelio

## 📁 Structure App Router
## ⚙️ Server vs Client Components
## 📊 Data Fetching
## 🔄 API Routes
## 📄 Metadata & SEO
## 💡 Exemples Complets
```

**Actions** :
1. Créer dossier `03-development/rules/`
2. Extraire contenu de CLAUDE.md vers fichiers spécialisés
3. Réécrire CLAUDE.md comme overview avec liens
4. Ajouter table of contents claire
5. Mettre à jour tous les liens
6. Intégrer contenu de `.claude/STRIPE_RULES.md` dans SUPABASE_RULES ou nouveau SECURITY_RULES

---

#### 2.5 Créer TROUBLESHOOTING.md (déjà fait en P1)

#### 2.6 Standardiser Terminologie (1h)

**Tâches** :
- Format uniforme : `P0-01: Nom` ou `COMMON-01: Nom` ou `P1-01: Nom`
- Chercher et remplacer toutes les variations :
  - "Task P1-01" → "P1-01"
  - "Phase 1 Task 1" → "P1-01"
  - "Task Phase1-01" → "P1-01"

**Fichiers à modifier** :
- Tous les fichiers de tasks
- TASKS_SYNTHESIS.md
- cahier_des_charges_formelio.md
- README.md
- Tous les guides qui référencent des tasks

---

#### 2.7 Corriger Navigation (1h)

**Problèmes** :
- Références circulaires entre README ↔ GETTING_STARTED ↔ HOW_TO_USE
- Différents "next steps" selon les documents
- Hiérarchie peu claire

**Solution** :
Créer hiérarchie claire dans README.md :

```markdown
## 🗺️ Parcours Recommandés par Rôle

### 👨‍💻 Nouveau Développeur (Première Fois)
1. [00-START-HERE.md](00-START-HERE.md) (2 min)
2. [README.md](README.md) (5 min) ← Vous êtes ici
3. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) (10 min) ⚠️ **GARDER OUVERT**
4. [CLAUDE.md](03-development/CLAUDE.md) (20 min) ⚠️ **CRITIQUE**
5. [CHECKLIST.md](01-getting-started/CHECKLIST.md) (suivre étape par étape)

### 🔄 Développeur qui Reprend (Après Pause)
1. [CONTEXT_PROMPT.md](01-getting-started/CONTEXT_PROMPT.md) (copier dans Claude)
2. [TASKS_SYNTHESIS.md](02-project-management/TASKS_SYNTHESIS.md) (trouver task actuelle)
3. Fichier task correspondant (implémenter)

### 🏗️ Tech Lead / Architecte
1. [README.md](README.md) (overview)
2. [cahier_des_charges_formelio.md](02-project-management/cahier_des_charges_formelio.md) (specs)
3. Architecture docs (deep dive)
4. [TESTING_GUIDE.md](04-testing/TESTING_GUIDE.md) (validation)
```

**Actions** :
1. Ajouter section "Parcours Recommandés" dans README
2. Supprimer références circulaires dans GETTING_STARTED
3. Harmoniser "Next Steps" dans tous les docs d'entrée
4. Mettre à jour 00-START-HERE avec parcours clair

---

### Priorité 3 : Améliorations (8-10h)

#### 3.1 Compléter TAGS_INDEX.md (2h)

**Ajouter** :
- Tous les fichiers manquants
- Section "Par Priorité" (P0 Critique, P1 Haute, P2 Moyenne)
- Section "Par Rôle de Développeur" (Frontend, Backend, DevOps, etc.)

#### 3.2 Améliorer Recherche/Filtres (2h)

Ajouter dans README.md :
```markdown
## 🔍 Trouver Ce Dont Vous Avez Besoin

### Par Sujet
- **Auth** : SUPABASE_AUTH_MIDDLEWARE.md, SUPABASE_RLS_GUIDE.md, SUPABASE_RULES.md
- **Payments** : STRIPE_GUIDE.md
- **Testing** : TESTING_GUIDE.md, TESTING_REFERENCE.md
- **Design** : DESIGN_SYSTEM.md
- **TypeScript** : TYPESCRIPT_RULES.md

### Par Phase
- **Phase 0** : CHECKLIST.md, Setup tasks
- **Phase 1** : Landing page tasks
- **Phase 2** : Dashboard tasks
- **Phase 3** : Payment tasks

### Par Priorité
- **P0 - Critique** : QUICK_REFERENCE.md, CLAUDE.md, TYPESCRIPT_RULES.md, SUPABASE_RULES.md
- **P1 - Haute** : TESTING_GUIDE.md, STRIPE_GUIDE.md, DESIGN_SYSTEM.md
- **P2 - Référence** : Changelogs, External resources
```

#### 3.3 Compléter Sections Incomplètes (3h)

**DESIGN_SYSTEM.md** :
- Ajouter process favicon step-by-step
- Ajouter exemples animations avec code
- Créer checklist intégration ressources externes

**TESTING guides** :
- Ajouter 3 exemples complets par catégorie de test
- Fournir fixtures prêts à l'emploi
- Code copy-paste ready

#### 3.4 Archiver Décisions (30min)

**Créer** :
- `docs/archive/decisions/`

**Déplacer** :
- E2E_TOOL_DECISION.md → archive
- Ajouter README dans archive expliquant l'archivage

#### 3.5 Audit Versions Technologies (1h)

**Vérifier et corriger** :
- Next.js : Clarifier 14 vs 15
- TypeScript : Spécifier 5.3+ minimum
- Stripe API : Documenter process de mise à jour version
- Chercher toutes références `auth-helpers-nextjs` (supprimer)

#### 3.6 Améliorer Visuel (1.5h)

- Ajouter diagrammes (architecture, flows)
- Améliorer formatage tableaux
- Standardiser highlighting code blocks
- Uniformiser usage emojis

---

## 📋 STRUCTURE CIBLE FINALE

**Après refactoring (35 fichiers)** :
```
docs/
├── 00-START-HERE.md
├── README.md (amélioré)
├── HOW_TO_USE.md
├── INVENTORY.md (mis à jour)
├── TAGS_INDEX.md (complété)
├── QUICK_REFERENCE.md ⭐ NOUVEAU
├── TROUBLESHOOTING.md ⭐ NOUVEAU
├── CHANGELOG.md (fusionné)
├── MIGRATION_GUIDE_2025.md (fusionné)
│
├── 01-getting-started/ (5 fichiers)
│   ├── CHECKLIST.md ⭐ NOUVEAU
│   ├── CONTEXT_PROMPT.md
│   ├── GETTING_STARTED.md
│   ├── INDEX.md
│   └── MCP_WORKFLOW.md
│
├── 02-project-management/ (4 fichiers)
│   ├── cahier_des_charges_formelio.md
│   ├── GIT_STRATEGY.md
│   ├── LIVRABABLES.md
│   └── TASKS_SYNTHESIS.md
│
├── 03-development/ (10 fichiers)
│   ├── CLAUDE.md (allégé, 400 lignes)
│   ├── STRIPE_GUIDE.md ⭐ FUSIONNÉ
│   ├── DESIGN_SYSTEM.md
│   ├── SUPABASE_AUTH_MIDDLEWARE.md
│   ├── SUPABASE_RLS_GUIDE.md
│   ├── rules/ ⭐ NOUVEAU DOSSIER
│   │   ├── TYPESCRIPT_RULES.md ⚠️ CRITIQUE
│   │   ├── SUPABASE_RULES.md ⚠️ CRITIQUE
│   │   ├── HTML_SEMANTIC_RULES.md
│   │   └── NEXTJS_RULES.md
│   └── tasks/ (7 fichiers inchangés)
│
├── 04-testing/ (4 fichiers)
│   ├── TESTING_GUIDE.md ⭐ FUSIONNÉ
│   ├── TESTING_REFERENCE.md ⭐ FUSIONNÉ
│   ├── VITEST_GUIDE.md
│   └── CI_CD_OPTIMIZATION.md
│
├── 05-assets/ (3 fichiers inchangés)
│   ├── formelio_logo.png
│   ├── background_hero_landing.png
│   └── Your_First_Project.pdf
│
└── archive/ ⭐ NOUVEAU
    └── decisions/
        └── E2E_TOOL_DECISION.md
```

**Réduction** : 41 → 35 fichiers (-15%)
**Lisibilité** : +40% (moins de redondances)
**Maintenabilité** : +60% (consolidation)

---

## ⚠️ RÈGLES CRITIQUES À RESPECTER PENDANT LE REFACTORING

### Règles de Contenu

1. **NE JAMAIS perdre d'information**
   - Tous les contenus doivent être préservés
   - Si fusion, vérifier que tout est copié
   - Garder exemples de code complets

2. **NE JAMAIS créer de contradictions**
   - Si informations divergentes, chercher la vérité dans CDC
   - Privilégier infos les plus récentes
   - Documenter les changements dans CHANGELOG

3. **TOUJOURS maintenir cohérence**
   - Dates uniformes
   - Terminologie standardisée
   - Références croisées valides

4. **TOUJOURS préserver exemples de code**
   - Ne jamais supprimer du code fonctionnel
   - Fusionner plutôt que remplacer
   - Garder diversité des exemples

### Règles de Processus

1. **AVANT de supprimer un fichier**
   - Vérifier que tout le contenu est copié ailleurs
   - Mettre à jour tous les liens vers ce fichier
   - Vérifier aucune perte d'information unique

2. **APRÈS chaque fusion**
   - Tester tous les liens
   - Vérifier table of contents
   - Valider structure logique

3. **Pour chaque nouveau fichier**
   - Ajouter à TAGS_INDEX.md
   - Ajouter lien dans README.md
   - Documenter dans CHANGELOG.md

4. **Gestion des versions**
   - Incrémenter versions après changements majeurs
   - Documenter tous les changements
   - Maintenir historique dans CHANGELOG

---

## 📦 LIVRABLES ATTENDUS

### Fichiers Créés (8 nouveaux)

1. ✅ `QUICK_REFERENCE.md` (300-400 lignes)
2. ✅ `TROUBLESHOOTING.md` (400-500 lignes)
3. ✅ `CHANGELOG.md` (fusionné, 500+ lignes)
4. ✅ `MIGRATION_GUIDE_2025.md` (200-300 lignes)
5. ✅ `01-getting-started/CHECKLIST.md` (200-300 lignes)
6. ✅ `03-development/STRIPE_GUIDE.md` (1200 lignes, fusionné)
7. ✅ `03-development/rules/` (4 fichiers)
8. ✅ `04-testing/TESTING_GUIDE.md` (1500 lignes, fusionné)
9. ✅ `04-testing/TESTING_REFERENCE.md` (800 lignes, fusionné)

### Fichiers Modifiés (15+)

- README.md (ajout sections critiques)
- 00-START-HERE.md (correction comptages, dates)
- INVENTORY.md (mise à jour comptages)
- TAGS_INDEX.md (complétion)
- CLAUDE.md (division + allègement)
- Tous fichiers avec dates incorrectes
- Tous fichiers avec comptages incorrects
- Tous fichiers avec liens cassés

### Fichiers Supprimés (12)

**Stripe** :
- PAYMENTS_ARCHITECTURE.md (fusionné dans STRIPE_GUIDE)
- .claude/STRIPE_RULES.md (intégré dans CLAUDE.md)

**Testing** :
- TESTING_RECAP.md
- E2E_TOOL_DECISION.md (archivé)
- TESTING_INTEGRATION_GUIDE.md
- TESTING_UPDATE_SUMMARY.md
- 04-testing/README.md

**Changelogs** :
- CHANGELOG_STRIPE_2025.md
- CHANGELOG_ARCHITECTURE_2025.md
- CHANGELOG_SECURITY_2025.md
- CHANGELOG_SEMANTIC_HTML.md
- UPDATES_SUMMARY_2025.md
- FINAL_UPDATES_SUMMARY_2025.md

### Rapport Final

**Créer** : `docs/REFACTORING_REPORT.md` avec :
- Résumé des changements
- Avant/Après métriques
- Liste complète fichiers créés/modifiés/supprimés
- Validation checklist
- Prochaines étapes

---

## ✅ VALIDATION CHECKLIST

Avant de considérer le refactoring terminé, vérifier :

### Contenu

- [ ] Aucune perte d'information (tout copié)
- [ ] Aucune contradiction entre fichiers
- [ ] Tous les exemples de code préservés
- [ ] Toutes les dates standardisées
- [ ] Tous les comptages corrects (41 fichiers)

### Navigation

- [ ] Tous les liens fonctionnent (aucun 404)
- [ ] TAGS_INDEX.md à jour (tous les fichiers)
- [ ] README.md avec sections critiques
- [ ] Parcours clairs par rôle
- [ ] Aucune référence circulaire

### Nouveaux Fichiers

- [ ] QUICK_REFERENCE.md créé et complet
- [ ] CHECKLIST.md créé et complet
- [ ] TROUBLESHOOTING.md créé et complet
- [ ] STRIPE_GUIDE.md fusionné et complet
- [ ] TESTING_GUIDE.md fusionné et complet
- [ ] rules/ créé avec 4 fichiers
- [ ] CHANGELOG.md créé et complet

### Consolidation

- [ ] 6 changelogs → 2 fichiers
- [ ] 11 fichiers testing → 4 fichiers
- [ ] 3 fichiers Stripe → 1 fichier
- [ ] CLAUDE.md divisé en 5 fichiers
- [ ] Total 41 → 35 fichiers

### Qualité

- [ ] Aucune section TODO restante
- [ ] Tous les code blocks avec syntax highlighting
- [ ] Tous les tableaux bien formatés
- [ ] Usage emojis cohérent
- [ ] Terminologie standardisée (P1-01 format)

### Tests Manuels

- [ ] Ouvrir 5 fichiers au hasard → liens fonctionnent
- [ ] Chercher "COMMON-01" dans tous les docs → format uniforme
- [ ] Chercher "octobre 2025" → dates uniformes
- [ ] Chercher "41 fichiers" → comptages corrects
- [ ] Lire QUICK_REFERENCE → tout compréhensible

---

## 🎯 ORDRE D'EXÉCUTION RECOMMANDÉ

### Jour 1 (6-8h)

**Matin (4h)** :
1. Créer QUICK_REFERENCE.md (2h)
2. Créer CHECKLIST.md (1h)
3. Corriger dates et comptages (1h)

**Après-midi (4h)** :
4. Créer TROUBLESHOOTING.md (2h)
5. Auditer et corriger liens cassés (1h)
6. Améliorer README.md (1h)

### Jour 2 (8h)

**Matin (4h)** :
7. Fusionner Stripe docs (3h)
8. Pause + validation (1h)

**Après-midi (4h)** :
9. Consolider Changelogs (2h)
10. Diviser CLAUDE.md partie 1 (2h)

### Jour 3 (8h)

**Matin (4h)** :
11. Diviser CLAUDE.md partie 2 (2h)
12. Standardiser terminologie (1h)
13. Corriger navigation (1h)

**Après-midi (4h)** :
14. Consolider Testing docs partie 1 (4h)

### Jour 4 (8h)

**Matin (4h)** :
15. Consolider Testing docs partie 2 (4h)

**Après-midi (4h)** :
16. Compléter TAGS_INDEX (2h)
17. Améliorer recherche/filtres (2h)

### Jour 5 (4-6h)

**Matin (2h)** :
18. Compléter sections incomplètes (2h)

**Après-midi (2-4h)** :
19. Validation complète (2h)
20. Créer REFACTORING_REPORT.md (1h)
21. Review finale (1h)

**TOTAL** : 24-32h sur 5 jours

---

## 📝 FORMAT DE RÉPONSE ATTENDU

Pour chaque fichier créé ou modifié, documenter :

```markdown
## Fichier : [nom du fichier]

**Action** : Créé / Modifié / Supprimé / Fusionné
**Taille** : XXX lignes
**Sections** :
1. Section 1
2. Section 2
...

**Changements clés** :
- Changement 1
- Changement 2

**Validé** : ✅ / ⏳ / ❌
```

---

## 🚀 DÉMARRAGE

**Première action à effectuer** :

1. Lire ce prompt complet (15 min)
2. Confirmer compréhension de la mission
3. Créer plan d'exécution détaillé jour par jour
4. Demander validation avant de commencer
5. Lancer Jour 1 - Matin

**Questions à poser avant de démarrer** :
- Clarifications sur structure cible ?
- Préférences sur ordre d'exécution ?
- Validation approach Stripe/Testing fusion ?

---

**PROMPT PRÊT - COPIER DANS NOUVEAU CHAT CLAUDE**

💙 **Formelio** - Documentation de qualité pour un développement serein
