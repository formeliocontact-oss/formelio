# 🏷️ Index par Tags - Documentation Formelio

**Version** : 1.0
**Date** : Octobre 2025
**Objectif** : Navigation rapide par thématique

---

## 📖 Comment utiliser cet index

Cet index vous permet de trouver rapidement tous les documents liés à une thématique spécifique, indépendamment de leur localisation dans l'arborescence.

**Navigation principale** : [README.md](README.md) | [00-START-HERE.md](00-START-HERE.md)

### 🌟 SaaS Architecture References

Projets open-source et boilerplates de référence pour s'inspirer :

| Projet | Stack | Pertinence Formelio | Lien |
|--------|-------|---------------------|------|
| **Dub.co** | Next.js 15 + Supabase + Tailwind + Stripe | ⭐⭐⭐⭐⭐ Architecture moderne, RLS exemplaire, API Edge | [github.com/dubinc/dub](https://github.com/dubinc/dub) |
| **Cal.com** | Next.js + Prisma + tRPC + Stripe | ⭐⭐⭐⭐ Multi-tenant, patterns complexes, monorepo | [github.com/calcom/cal.com](https://github.com/calcom/cal.com) |
| **Supastarter** | Supabase + Next.js + Stripe + Tests | ⭐⭐⭐⭐⭐ Boilerplate complet, très proche de notre stack | [supastarter.dev](https://supastarter.dev) |
| **Nhost Boilerplate** | Nhost + Next.js + GraphQL | ⭐⭐⭐ Alternative Supabase, bonne organisation | [github.com/nhost/nhost-nextjs-boilerplate](https://github.com/nhost/nhost-nextjs-boilerplate) |
| **IndieHackers SaaS** | Supabase + Next.js (REX) | ⭐⭐⭐⭐ Retour d'expérience complet | [indiehackers.com/post/...](https://www.indiehackers.com/post/i-built-a-saas-boilerplate-for-nextjs-and-supabase-ad798d3133) |

**Utilité** : Étudier ces projets pour l'organisation du code, les patterns d'architecture, et les best practices SaaS.

---

## 🏗️ Architecture & Infrastructure

Documents sur l'architecture technique, la configuration et le setup initial.

| Document | Phase | Description |
|----------|-------|-------------|
| [SUPABASE_AUTH_MIDDLEWARE.md](03-development/SUPABASE_AUTH_MIDDLEWARE.md) | 0, 2 | Configuration middleware Supabase avec @supabase/ssr |
| [SUPABASE_RLS_GUIDE.md](03-development/SUPABASE_RLS_GUIDE.md) | 0 | Guide complet Row Level Security |
| [PAYMENTS_ARCHITECTURE.md](03-development/PAYMENTS_ARCHITECTURE.md) | 3 | Architecture des paiements et facturation |
| [03-supabase-config.md](03-development/tasks/03-supabase-config.md) | 0 | Configuration complète Supabase (schéma, RLS, storage) |
| [GIT_STRATEGY.md](02-project-management/GIT_STRATEGY.md) | 0 | Stratégie Git et workflow de branches |

---

## 🎨 Design System & UI/UX

Documentation sur le design, les composants UI et l'identité visuelle.

| Document | Phase | Description |
|----------|-------|-------------|
| [DESIGN_SYSTEM.md](03-development/DESIGN_SYSTEM.md) | 0, 1 | Design system complet Formelio (couleurs, typo, composants) |
| [cahier_des_charges_formelio.md](02-project-management/cahier_des_charges_formelio.md) | - | Section 5 : Design et identité visuelle |
| [CLAUDE.md](03-development/CLAUDE.md) | - | Section 8 : Styling avec Tailwind & Shadcn |
| [01-homepage-layout.md](03-development/tasks/01-homepage-layout.md) | 1 | Layout, navigation et implémentation fonts |
| [P1-08-FAVICON-SEO-GUIDE.md](03-development/tasks/P1-08-FAVICON-SEO-GUIDE.md) | 1 | Favicon, PWA manifest, brand assets |

---

## 💳 Payments & Stripe

Tout ce qui concerne les paiements, Stripe et la facturation.

| Document | Phase | Description |
|----------|-------|-------------|
| [STRIPE_INTEGRATION_GUIDE.md](03-development/STRIPE_INTEGRATION_GUIDE.md) | 3 | Guide d'intégration complet Stripe |
| [PAYMENTS_ARCHITECTURE.md](03-development/PAYMENTS_ARCHITECTURE.md) | 3 | Architecture paiements et génération factures |
| [PHASE2_AND_PHASE3_TASKS.md](03-development/tasks/PHASE2_AND_PHASE3_TASKS.md) | 2, 3 | Tasks P3-01 à P3-07 (paiements) |
| [PHASE2_AND_PHASE3_TASKS_STRIPE_UPDATE.md](03-development/tasks/PHASE2_AND_PHASE3_TASKS_STRIPE_UPDATE.md) | 3 | Mise à jour Stripe 2025 |

---

## 🔐 Authentication & Security

Authentification, sécurité, RLS et gestion des sessions.

| Document | Phase | Description |
|----------|-------|-------------|
| [SUPABASE_AUTH_MIDDLEWARE.md](03-development/SUPABASE_AUTH_MIDDLEWARE.md) | 0, 2 | Middleware auth Supabase (@supabase/ssr) |
| [SUPABASE_RLS_GUIDE.md](03-development/SUPABASE_RLS_GUIDE.md) | 0 | Row Level Security complet |
| [CLAUDE.md](03-development/CLAUDE.md) | - | Section 7 : Règles Supabase & Section 12 : Sécurité |
| [03-supabase-config.md](03-development/tasks/03-supabase-config.md) | 0 | Configuration RLS et policies |

---

## 🧪 Testing & Quality

Stratégie de tests, configuration Jest/Playwright et CI/CD.

| Document | Phase | Description |
|----------|-------|-------------|
| [TESTING_STRATEGY.md](04-testing/TESTING_STRATEGY.md) | 0 | Stratégie complète de tests (165 tests) |
| [TESTING_INTEGRATION_GUIDE.md](04-testing/TESTING_INTEGRATION_GUIDE.md) | 0 | Guide d'intégration étape par étape |
| [TESTING_RECAP.md](04-testing/TESTING_RECAP.md) | 0 | Récapitulatif et arborescence des tests |
| [E2E_FIXTURES_HELPERS.md](04-testing/E2E_FIXTURES_HELPERS.md) | 0 | Fixtures et helpers réutilisables |
| [E2E_TOOL_DECISION.md](04-testing/E2E_TOOL_DECISION.md) | 0 | Choix de l'outil E2E (Playwright) |
| [PLAYWRIGHT_SUPABASE_AUTH.md](04-testing/PLAYWRIGHT_SUPABASE_AUTH.md) | 0 | Tests Playwright avec Supabase Auth |
| [VITEST_GUIDE.md](04-testing/VITEST_GUIDE.md) | 0 | Guide Vitest pour tests unitaires |
| [CI_CD_OPTIMIZATION.md](04-testing/CI_CD_OPTIMIZATION.md) | 0 | Optimisation pipeline CI/CD |
| [04-testing-setup.md](03-development/tasks/04-testing-setup.md) | 0 | Configuration Jest + Playwright |

---

## 📋 Project Management

Gestion de projet, tasks, workflow et planification.

| Document | Phase | Description |
|----------|-------|-------------|
| [cahier_des_charges_formelio.md](02-project-management/cahier_des_charges_formelio.md) | - | Cahier des charges complet (14 sections) |
| [TASKS_SYNTHESIS.md](02-project-management/TASKS_SYNTHESIS.md) | - | Synthèse des 30 tasks (200h) |
| [LIVRABABLES.md](02-project-management/LIVRABABLES.md) | - | Synthèse des livrables |
| [GIT_STRATEGY.md](02-project-management/GIT_STRATEGY.md) | 0 | Stratégie Git (7 branches) |
| [GETTING_STARTED.md](01-getting-started/GETTING_STARTED.md) | - | Guide de démarrage rapide |
| [INDEX.md](01-getting-started/INDEX.md) | - | Point d'entrée principal |
| [MCP_WORKFLOW.md](01-getting-started/MCP_WORKFLOW.md) | - | Workflow avec MCP servers |
| [CONTEXT_PROMPT.md](01-getting-started/CONTEXT_PROMPT.md) | - | Prompt pour reprendre le travail |

---

## 🚀 Development Guidelines

Règles de développement, conventions et best practices.

| Document | Phase | Description |
|----------|-------|-------------|
| [CLAUDE.md](03-development/CLAUDE.md) | - | **CRITIQUE** - Règles strictes de développement |
| [GIT_STRATEGY.md](02-project-management/GIT_STRATEGY.md) | 0 | Conventions Git et workflow |
| [TESTING_STRATEGY.md](04-testing/TESTING_STRATEGY.md) | 0 | Best practices testing |

---

## 📝 Tasks (Détails d'implémentation)

Documents détaillant l'implémentation des tasks spécifiques.

### Phase 0 - Setup
- [03-supabase-config.md](03-development/tasks/03-supabase-config.md) - Configuration Supabase complète
- [04-testing-setup.md](03-development/tasks/04-testing-setup.md) - Setup Jest + Playwright

### Phase 1 - Landing Page
- [01-homepage-layout.md](03-development/tasks/01-homepage-layout.md) - Layout, header, footer
- [03-08-remaining-tasks.md](03-development/tasks/03-08-remaining-tasks.md) - Tasks P1-03 à P1-08
- [P1-08-FAVICON-SEO-GUIDE.md](03-development/tasks/P1-08-FAVICON-SEO-GUIDE.md) - Favicon et SEO

### Phase 2 & 3 - Dashboard & Payments
- [PHASE2_AND_PHASE3_TASKS.md](03-development/tasks/PHASE2_AND_PHASE3_TASKS.md) - 19 tasks P2/P3
- [PHASE2_AND_PHASE3_TASKS_STRIPE_UPDATE.md](03-development/tasks/PHASE2_AND_PHASE3_TASKS_STRIPE_UPDATE.md) - Mise à jour Stripe

---

## 📚 Changelogs & Updates

Historique des mises à jour de la documentation.

| Document | Date | Description |
|----------|------|-------------|
| [CHANGELOG_ARCHITECTURE_2025.md](CHANGELOG_ARCHITECTURE_2025.md) | 2025 | Mises à jour architecture |
| [CHANGELOG_SECURITY_2025.md](CHANGELOG_SECURITY_2025.md) | 2025 | Mises à jour sécurité |
| [CHANGELOG_SEMANTIC_HTML.md](CHANGELOG_SEMANTIC_HTML.md) | 2025 | Mises à jour HTML sémantique |
| [CHANGELOG_STRIPE_2025.md](CHANGELOG_STRIPE_2025.md) | 2025 | Mises à jour Stripe |
| [UPDATES_SUMMARY_2025.md](UPDATES_SUMMARY_2025.md) | 2025 | Résumé des mises à jour |
| [FINAL_UPDATES_SUMMARY_2025.md](FINAL_UPDATES_SUMMARY_2025.md) | 2025 | Résumé final |

---

## 🔍 Navigation rapide par besoin

### Je veux...

**...démarrer le projet**
→ [GETTING_STARTED.md](01-getting-started/GETTING_STARTED.md) + [CLAUDE.md](03-development/CLAUDE.md)

**...implémenter l'authentification**
→ [SUPABASE_AUTH_MIDDLEWARE.md](03-development/SUPABASE_AUTH_MIDDLEWARE.md) + [SUPABASE_RLS_GUIDE.md](03-development/SUPABASE_RLS_GUIDE.md)

**...intégrer Stripe**
→ [STRIPE_INTEGRATION_GUIDE.md](03-development/STRIPE_INTEGRATION_GUIDE.md) + [PAYMENTS_ARCHITECTURE.md](03-development/PAYMENTS_ARCHITECTURE.md)

**...créer le design system**
→ [DESIGN_SYSTEM.md](03-development/DESIGN_SYSTEM.md) + [cahier_des_charges § 5](02-project-management/cahier_des_charges_formelio.md)

**...configurer les tests**
→ [TESTING_INTEGRATION_GUIDE.md](04-testing/TESTING_INTEGRATION_GUIDE.md) + [TESTING_STRATEGY.md](04-testing/TESTING_STRATEGY.md)

**...comprendre le projet**
→ [INDEX.md](01-getting-started/INDEX.md) + [cahier_des_charges_formelio.md](02-project-management/cahier_des_charges_formelio.md)

**...reprendre après une pause**
→ [CONTEXT_PROMPT.md](01-getting-started/CONTEXT_PROMPT.md)

---

## 📊 Statistiques

- **Total documents** : 44 fichiers
- **Catégories** : 8 thématiques principales
- **Coverage** : 100% de la documentation référencée
- **Maintenance** : Mise à jour manuelle (pour l'instant)

---

## 🔄 Maintenance

**Quand mettre à jour cet index :**
- ✅ Création d'un nouveau document
- ✅ Changement de catégorie d'un document
- ✅ Ajout d'une nouvelle thématique
- ✅ Restructuration de la documentation

**Fréquence recommandée** : À chaque ajout/modification majeur

---

**Version** : 1.0
**Dernière mise à jour** : Octobre 2025
**Statut** : ✅ Complet et opérationnel

💙 **Formelio** - Votre temps, notre priorité
