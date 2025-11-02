# 📚 Documentation Formelio

Bienvenue dans la documentation complète du projet Formelio !

**Date de dernière mise à jour** : Octobre 2025  
**Version** : 1.0  
**Statut** : ✅ Complet et prêt pour le développement

---

## 🚨 CRITIQUE - Lire AVANT Développement

### ⚠️ Documents OBLIGATOIRES (30 min)

**À lire dans cet ordre AVANT d'écrire une seule ligne de code** :

1. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** ⚠️ **GARDER OUVERT pendant le coding**
   - Les 5 interdictions absolues
   - Les 5 règles obligatoires
   - Patterns TypeScript & Supabase
   - **Temps de lecture** : 10 min

2. **[CLAUDE.md](../.claude/CLAUDE.md)** ⚠️ **LIRE INTÉGRALEMENT avant de coder**
   - Règles strictes TypeScript (aucun `any`)
   - Règles critiques Supabase (toujours `@supabase/ssr`)
   - HTML sémantique (pas de div soup)
   - **Temps de lecture** : 20 min

3. **[CHECKLIST.md](01-getting-started/CHECKLIST.md)** ⚠️ **SUIVRE ÉTAPE PAR ÉTAPE**
   - Setup complet (Phase 0)
   - Workflow de développement
   - Validation avant commit
   - **Temps de lecture** : Variable selon phase

### 📖 Guides d'Implémentation

**Consulter selon besoin** :

- **[STRIPE_INTEGRATION_GUIDE.md](03-development/STRIPE_INTEGRATION_GUIDE.md)** - Intégration Stripe complète
- **[TESTING_STRATEGY.md](04-testing/TESTING_STRATEGY.md)** - Stratégie de tests (165 tests)
- **[DESIGN_SYSTEM.md](03-development/DESIGN_SYSTEM.md)** - Design system & composants
- **[SUPABASE_AUTH_MIDDLEWARE.md](03-development/SUPABASE_AUTH_MIDDLEWARE.md)** - Auth Supabase
- **[GIT_STRATEGY.md](02-project-management/GIT_STRATEGY.md)** - Workflow Git

### 🆘 En Cas de Problème

**[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Solutions aux erreurs communes :
- Erreurs TypeScript
- Problèmes Supabase Auth
- Erreurs Next.js Build
- Échecs de tests
- Problèmes Stripe
- FAQ complète

---

## 🎯 Navigation rapide

### 🏷️ Navigation par tags
→ **Index thématique** : [TAGS_INDEX.md](TAGS_INDEX.md) - Trouvez rapidement tous les documents par thématique

### Vous débutez sur le projet ?
1. 📖 Lisez d'abord : [01-getting-started/GETTING_STARTED.md](01-getting-started/GETTING_STARTED.md)
2. 📋 Consultez ensuite : [02-project-management/cahier_des_charges_formelio.md](02-project-management/cahier_des_charges_formelio.md)
3. 🚀 Puis explorez : [02-project-management/TASKS_SYNTHESIS.md](02-project-management/TASKS_SYNTHESIS.md)

### Vous voulez développer ?
→ **Règles strictes** : [03-development/CLAUDE.md](03-development/CLAUDE.md)
→ **Design System** : [03-development/DESIGN_SYSTEM.md](03-development/DESIGN_SYSTEM.md)
→ **Tasks détaillées** : [03-development/tasks/](03-development/tasks/)
→ **Stratégie Git** : [02-project-management/GIT_STRATEGY.md](02-project-management/GIT_STRATEGY.md)

### Vous voulez implémenter les tests ?
→ **Stratégie globale** : [04-testing/TESTING_STRATEGY.md](04-testing/TESTING_STRATEGY.md)
→ **Guide d'intégration** : [04-testing/TESTING_INTEGRATION_GUIDE.md](04-testing/TESTING_INTEGRATION_GUIDE.md)
→ **Helpers & Fixtures** : [04-testing/E2E_FIXTURES_HELPERS.md](04-testing/E2E_FIXTURES_HELPERS.md)

---

## 📁 Structure de la documentation

```
docs/
├── README.md (ce fichier)
├── 01-getting-started/          # Démarrage rapide
│   ├── INDEX.md                 # Vue d'ensemble du projet
│   ├── GETTING_STARTED.md       # Quick start guide (9.4 KB)
│   ├── MCP_WORKFLOW.md          # Configuration MCP servers
│   └── CONTEXT_PROMPT.md        # Prompt pour reprendre le travail
│
├── 02-project-management/       # Gestion de projet
│   ├── cahier_des_charges_formelio.md  # CDC complet (21 KB, 14 sections)
│   ├── LIVRABABLES.md           # Synthèse des livrables
│   ├── TASKS_SYNTHESIS.md       # Synthèse des 30 tasks
│   └── GIT_STRATEGY.md          # Stratégie de branches Git
│
├── 03-development/              # Développement
│   ├── CLAUDE.md                # Règles STRICTES de développement
│   └── tasks/                   # Tasks détaillées
│       ├── 01-homepage-layout.md
│       ├── 03-supabase-config.md
│       ├── 03-08-remaining-tasks.md
│       ├── 04-testing-setup.md
│       ├── P1-08-FAVICON-SEO-GUIDE.md
│       └── PHASE2_AND_PHASE3_TASKS.md
│
├── 04-testing/                  # Tests
│   ├── TESTING_STRATEGY.md      # Stratégie complète (165 tests)
│   ├── TESTING_INTEGRATION_GUIDE.md  # Guide d'intégration par phase
│   ├── TESTING_RECAP.md         # Récapitulatif et arborescence
│   └── E2E_FIXTURES_HELPERS.md  # Helpers et fixtures réutilisables
│
└── 05-assets/                   # Assets du projet
    ├── formelio_logo.png        # Logo Formelio
    ├── background_hero_landing.png  # Background hero section
    └── Your_First_Project.pdf   # Documentation supplémentaire
```

---

## 🎨 À propos de Formelio

**Formelio** est un service spécialisé dans les formalités administratives et juridiques complexes destiné aux professionnels du droit français (experts-comptables, avocats, notaires).

### Positionnement unique
- 🎓 Expertise insider des greffes français
- 📋 Spécialisation dans les dossiers rejetés et situations bloquées
- 🔄 Communication directe avec les registres
- ⚖️ Compréhension approfondie des pratiques locales

### Stack technique
- **Frontend** : Next.js 14 (App Router) + TypeScript + Tailwind CSS + Shadcn UI
- **Backend** : Supabase (Auth, Database PostgreSQL, Storage, Realtime)
- **Payments** : Stripe
- **Deployment** : Vercel
- **Boilerplate** : Next-SaaS-Stripe-Starter

---

## 📊 Métriques du projet

### Effort total estimé
- **30 tasks** réparties en 4 phases
- **200 heures** de développement
- **10-14 semaines** de durée totale

| Phase | Tasks | Heures | Semaines |
|-------|-------|--------|----------|
| Phase 0 (Setup) | 3 | 13h | 3-5 jours |
| Phase 1 (Landing) | 8 | 41h | 3-4 semaines |
| Phase 2 (Dashboard) | 12 | 98h | 4-6 semaines |
| Phase 3 (Payment) | 7 | 48h | 2-3 semaines |

### Tests planifiés
- ✅ **100 tests unitaires** (Jest + React Testing Library)
- ✅ **15 tests E2E** (Playwright)
- ✅ **80%+ code coverage** ciblé
- ✅ **CI/CD GitHub Actions** configuré

---

## 🚀 Quick Actions

### Je veux...

**...naviguer par thématique (Architecture, Design, Payments, etc.)**
→ [TAGS_INDEX.md](TAGS_INDEX.md)

**...comprendre le projet en 5 minutes**
→ [01-getting-started/INDEX.md](01-getting-started/INDEX.md)

**...commencer le développement maintenant**
→ [01-getting-started/GETTING_STARTED.md](01-getting-started/GETTING_STARTED.md)

**...voir toutes les tasks et leur statut**
→ [02-project-management/TASKS_SYNTHESIS.md](02-project-management/TASKS_SYNTHESIS.md)

**...connaître les règles de développement**
→ [03-development/CLAUDE.md](03-development/CLAUDE.md) ⚠️ **CRITIQUE**

**...implémenter le design system**
→ [03-development/DESIGN_SYSTEM.md](03-development/DESIGN_SYSTEM.md)

**...intégrer Stripe**
→ [03-development/STRIPE_INTEGRATION_GUIDE.md](03-development/STRIPE_INTEGRATION_GUIDE.md)

**...configurer la stratégie Git**
→ [02-project-management/GIT_STRATEGY.md](02-project-management/GIT_STRATEGY.md)

**...implémenter les tests**
→ [04-testing/TESTING_STRATEGY.md](04-testing/TESTING_STRATEGY.md)

**...reprendre le travail après une pause**
→ [01-getting-started/CONTEXT_PROMPT.md](01-getting-started/CONTEXT_PROMPT.md)

---

## ⚠️ Points critiques à retenir

### TypeScript (voir CLAUDE.md)
- ❌ **JAMAIS** utiliser `any` ou `as any`
- ❌ **JAMAIS** utiliser `@ts-ignore`
- ✅ Types explicites partout
- ✅ Type guards pour validation

### Supabase (voir CLAUDE.md)
- ❌ **JAMAIS** utiliser `@supabase/auth-helpers-nextjs` (DEPRECATED)
- ✅ **TOUJOURS** utiliser `@supabase/ssr`
- ✅ **TOUJOURS** utiliser `getAll()` et `setAll()` pour les cookies

### HTML Sémantique
- ❌ **INTERDICTION** de la "div soup"
- ✅ Utiliser les bonnes balises (`<header>`, `<nav>`, `<main>`, `<article>`, etc.)

### Accessibilité
- ✅ Navigation au clavier
- ✅ Labels ARIA
- ✅ Contraste minimum WCAG AA

---

## 📖 Ressources externes

### Documentation officielle
- **Next.js** : https://nextjs.org/docs
- **Supabase** : https://supabase.com/docs
- **Shadcn UI** : https://ui.shadcn.com
- **Tailwind CSS** : https://tailwindcss.com
- **Stripe** : https://stripe.com/docs

### Outils de développement
- **TypeScript** : https://www.typescriptlang.org/docs
- **Jest** : https://jestjs.io/docs
- **Playwright** : https://playwright.dev/docs
- **React Testing Library** : https://testing-library.com/docs/react-testing-library/intro

### Projets open-source SaaS (références)
- **Dub.co** : https://github.com/dubinc/dub (Next.js 15 + Supabase)
- **Cal.com** : https://github.com/calcom/cal.com (Multi-tenant SaaS)
- **Supastarter** : https://supastarter.dev (Boilerplate Supabase + Stripe)

---

## 🆘 Support

### Documentation interne
Pour toute question sur le projet, consultez d'abord :
1. [INDEX.md](01-getting-started/INDEX.md) - Vue d'ensemble
2. [GETTING_STARTED.md](01-getting-started/GETTING_STARTED.md) - Quick start
3. [cahier_des_charges_formelio.md](02-project-management/cahier_des_charges_formelio.md) - Spécifications complètes

### Reprendre le travail
Si vous reprenez le projet après une pause, utilisez le prompt de continuation :
→ [CONTEXT_PROMPT.md](01-getting-started/CONTEXT_PROMPT.md)

---

## 📝 Changelog & Migration

### Historique complet
📖 **[CHANGELOG.md](CHANGELOG.md)** - Historique chronologique de toutes les mises à jour :
- Refactoring documentation (Octobre 2025)
- Updates Stripe 2025
- Architecture Next.js 15 + Supabase
- Sécurité & RLS
- HTML Sémantique
- Documentation initiale

### Guide de migration
🚀 **[MIGRATION_GUIDE_2025.md](MIGRATION_GUIDE_2025.md)** - Actions concrètes à entreprendre :
- ⚠️ **Priorité CRITIQUE** (11h) : Auth, RLS, Middleware
- ⭐ **Priorité HAUTE** (11h) : RBAC, Customer Portal
- 🟢 **Priorité MOYENNE** (18h) : Multi-Tenant, Factures PDF

**Effort total** : ~40h de mises à jour

---

**Statut global** : ✅ **Ready for development**  
**Prochaine étape** : Initialiser le projet Next.js (Phase 0)

💙 **Formelio** - Votre temps, notre priorité
