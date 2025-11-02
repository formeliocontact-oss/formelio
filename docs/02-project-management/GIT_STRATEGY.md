# ðŸŒ¿ Git Strategy - Formelio

**Version**: 1.0  
**Date**: Octobre 2025  
**Principe**: Branches par ensembles logiques, dev rapide, merges frÃ©quents

---

## ðŸŽ¯ Philosophie

- âœ… **Branches par ENSEMBLE LOGIQUE** (phase/module), pas par task individuelle
- âœ… **Merges frÃ©quents** vers `develop` pour intÃ©gration continue
- âœ… **Dev rapide** : plusieurs tasks dans la mÃªme branche si cohÃ©rentes
- âŒ **Ã‰viter** : branches plÃ©thoriques, branches longue durÃ©e, branches par micro-feature

---

## ðŸ“Š Structure des branches

```
main (production)
  â””â”€â”€ develop (intÃ©gration)
       â”œâ”€â”€ feature/phase0-setup
       â”œâ”€â”€ feature/phase1-landing
       â”œâ”€â”€ feature/phase2-auth
       â”œâ”€â”€ feature/phase2-dashboard
       â”œâ”€â”€ feature/phase2-chat
       â””â”€â”€ feature/phase3-payment
```

---

## ðŸŒ³ Branches principales

### 1. `main` - Production
- **Protection**: Obligatoire
- **Merge**: Uniquement depuis `develop` via PR
- **Deploy**: Auto-deploy vers Vercel production
- **Tags**: Chaque merge = version tag (v1.0.0, v1.1.0)

### 2. `develop` - IntÃ©gration continue
- **Base**: Toutes les features mergent ici
- **Protection**: Obligatoire (review + CI pass)
- **Deploy**: Auto-deploy vers Vercel preview
- **Merge vers main**: Ã€ la fin de chaque phase validÃ©e

---

## ðŸ”€ Branches de features (ensembles logiques)

### Phase 0 : Setup & Foundation

#### `feature/phase0-setup`
**DurÃ©e**: 3-5 jours  
**Tasks incluses**:
- COMMON-01: Project Setup
- COMMON-02: Design System
- COMMON-03: Supabase Config

**Workflow**:
```bash
git checkout develop
git pull
git checkout -b feature/phase0-setup

# DÃ©velopper les 3 tasks
git add .
git commit -m "feat(setup): initialize project structure"
git commit -m "feat(design): configure Shadcn UI & Tailwind"
git commit -m "feat(supabase): setup database and RLS"

git push origin feature/phase0-setup
# PR vers develop
```

**Merge**: DÃ¨s que les 3 tasks sont terminÃ©es et testÃ©es

---

### Phase 1 : Landing Page

#### `feature/phase1-landing`
**DurÃ©e**: 2-3 semaines  
**Tasks incluses** (8 tasks):
- P1-01: Homepage Layout & Navigation
- P1-02: Homepage Hero
- P1-03: Services Section
- P1-04: Process & CTA
- P1-05: About Page
- P1-06: Contact Page
- P1-07: Legal Pages
- P1-08: SEO & Performance

**Workflow**:
```bash
git checkout develop
git checkout -b feature/phase1-landing

# Commits groupÃ©s par section logique
git commit -m "feat(landing): add homepage layout and navigation"
git commit -m "feat(landing): implement hero section with CTA"
git commit -m "feat(landing): add services and process sections"
git commit -m "feat(landing): create about and contact pages"
git commit -m "feat(landing): add legal pages (mentions, CGU, RGPD)"
git commit -m "feat(landing): optimize SEO and performance"

git push origin feature/phase1-landing
# PR vers develop
```

**StratÃ©gie de merge**:
- Merge intermÃ©diaire possible aprÃ¨s homepage complÃ¨te (tasks 1-4)
- Merge final aprÃ¨s toutes les pages (tasks 5-8)

---

### Phase 2 : Dashboard & Auth (3 branches)

La Phase 2 est divisÃ©e en 3 ensembles logiques car c'est la plus grosse (12 tasks, 98h) :

#### `feature/phase2-auth`
**DurÃ©e**: 1 semaine  
**Tasks incluses**:
- P2-01: Auth System (login, register, reset password)
- P2-10: User Profile & Settings
- P2-12: Email Notifications (partie auth)

**Workflow**:
```bash
git checkout develop
git checkout -b feature/phase2-auth

git commit -m "feat(auth): implement Supabase authentication"
git commit -m "feat(auth): add user profile and settings pages"
git commit -m "feat(auth): setup email notifications for auth events"

git push origin feature/phase2-auth
# PR vers develop (MERGE DÃˆS VALIDATION)
```

#### `feature/phase2-dashboard`
**DurÃ©e**: 2-3 semaines  
**Tasks incluses**:
- P2-02: Dashboard Layout & Navigation
- P2-03: Cases List & Filters
- P2-04: Case Detail Page
- P2-05: Document Upload
- P2-06: Document Viewer & Management
- P2-09: Notifications System
- P2-11: Admin Dashboard

**Workflow**:
```bash
git checkout develop
git checkout -b feature/phase2-dashboard

# Grouper par module fonctionnel
git commit -m "feat(dashboard): add layout and navigation"
git commit -m "feat(dashboard): implement cases list with filters"
git commit -m "feat(dashboard): create case detail page"
git commit -m "feat(dashboard): add document upload and viewer"
git commit -m "feat(dashboard): implement notifications system"
git commit -m "feat(dashboard): create admin interface"

git push origin feature/phase2-dashboard
# PR vers develop
```

#### `feature/phase2-chat`
**DurÃ©e**: 1 semaine  
**Tasks incluses**:
- P2-07: Chat System - UI Components
- P2-08: Chat System - Realtime Integration

**Workflow**:
```bash
git checkout develop
git checkout -b feature/phase2-chat

git commit -m "feat(chat): create chat UI components"
git commit -m "feat(chat): integrate Supabase Realtime"
git commit -m "feat(chat): add file attachments in chat"

git push origin feature/phase2-chat
# PR vers develop
```

**Ordre de dÃ©veloppement Phase 2**:
1. `phase2-auth` â†’ Merge âœ…
2. `phase2-dashboard` (en parallÃ¨le si Ã©quipe > 1 dev) â†’ Merge âœ…
3. `phase2-chat` (dÃ©pend de dashboard) â†’ Merge âœ…

---

### Phase 3 : Payment & Billing

#### `feature/phase3-payment`
**DurÃ©e**: 2-3 semaines  
**Tasks incluses** (7 tasks):
- P3-01: Stripe Integration & Setup
- P3-02: Payment Flow & Checkout
- P3-03: Invoice Generation
- P3-04: Transaction History
- P3-05: Subscription Management
- P3-06: Webhooks & Payment Events
- P3-07: Financial Dashboard

**Workflow**:
```bash
git checkout develop
git checkout -b feature/phase3-payment

# Grouper par flux mÃ©tier
git commit -m "feat(payment): setup Stripe integration"
git commit -m "feat(payment): implement checkout flow"
git commit -m "feat(payment): add invoice generation and history"
git commit -m "feat(payment): configure webhooks and events"
git commit -m "feat(payment): create financial dashboard"

git push origin feature/phase3-payment
# PR vers develop
```

---

## ðŸ“ Convention de commits

Suivre **Conventional Commits** :

```bash
# Features
git commit -m "feat(scope): description"

# Fixes
git commit -m "fix(scope): description"

# Docs
git commit -m "docs: update README"

# Style/Formatting
git commit -m "style: format code with prettier"

# Refactoring
git commit -m "refactor(auth): simplify user validation"

# Tests
git commit -m "test(dashboard): add cases list tests"

# Chores
git commit -m "chore: update dependencies"
```

**Scopes principaux**:
- `setup`, `design`, `supabase`
- `landing`, `homepage`, `about`, `contact`, `legal`
- `auth`, `dashboard`, `chat`, `documents`, `notifications`
- `payment`, `invoices`, `stripe`

---

## ðŸ”„ Workflow de dÃ©veloppement

### DÃ©marrer une nouvelle feature

```bash
# 1. Toujours partir de develop Ã  jour
git checkout develop
git pull origin develop

# 2. CrÃ©er la branche feature
git checkout -b feature/phase1-landing

# 3. DÃ©velopper
# ... code ...

# 4. Commit rÃ©guliÃ¨rement
git add .
git commit -m "feat(landing): add hero section"

# 5. Pousser rÃ©guliÃ¨rement
git push origin feature/phase1-landing
```

### Merger une feature terminÃ©e

```bash
# 1. Rebaser sur develop (si divergence)
git checkout feature/phase1-landing
git pull origin develop --rebase

# 2. RÃ©soudre les conflits si nÃ©cessaire
# ... fix conflicts ...
git add .
git rebase --continue

# 3. Pousser
git push origin feature/phase1-landing --force-with-lease

# 4. CrÃ©er une Pull Request sur GitHub
# Via l'interface GitHub ou CLI :
gh pr create --base develop --head feature/phase1-landing \
  --title "feat: Phase 1 Landing Page" \
  --body "Implements all 8 tasks of Phase 1..."

# 5. Review + CI validation

# 6. Merge (squash ou merge commit selon prÃ©fÃ©rence)
gh pr merge --squash

# 7. Supprimer la branche locale et distante
git checkout develop
git pull
git branch -d feature/phase1-landing
git push origin --delete feature/phase1-landing
```

---

## ðŸš¦ Rules & Best Practices

### Protection des branches

#### `main`
- âœ… Require pull request reviews (min 1)
- âœ… Require status checks to pass (CI)
- âœ… Require branches to be up to date
- âœ… Include administrators
- âŒ No direct push

#### `develop`
- âœ… Require pull request reviews (min 1)
- âœ… Require status checks to pass
- âš ï¸ Allow bypass for hotfixes (emergency only)

### Merge strategy

**Option recommandÃ©e : Squash and merge**
- âœ… Historique propre sur `develop`
- âœ… Un commit = une feature complÃ¨te
- âœ… Facile de revert une feature entiÃ¨re

**Alternative : Merge commit**
- âœ… PrÃ©serve l'historique dÃ©taillÃ©
- âŒ Plus verbeux

**Ã€ Ã©viter : Rebase and merge**
- âŒ Perd l'info de la PR
- âŒ Complique les recherches

---

## ðŸ·ï¸ Tagging & Releases

### Versioning (Semantic Versioning)

```
v1.0.0 = MAJOR.MINOR.PATCH
```

- **MAJOR**: Breaking changes (rare)
- **MINOR**: Nouvelles features (fin de phase)
- **PATCH**: Bug fixes

### CrÃ©ation de tags

```bash
# AprÃ¨s merge d'une phase vers main
git checkout main
git pull

# Phase 1 terminÃ©e
git tag -a v1.0.0 -m "Release: Phase 1 - Landing Page"
git push origin v1.0.0

# Phase 2 terminÃ©e
git tag -a v1.1.0 -m "Release: Phase 2 - Dashboard & Auth"
git push origin v1.1.0

# Phase 3 terminÃ©e
git tag -a v1.2.0 -m "Release: Phase 3 - Payment & Billing"
git push origin v1.2.0

# Hotfix
git tag -a v1.2.1 -m "Hotfix: Critical auth bug"
git push origin v1.2.1
```

---

## ðŸ”¥ Hotfixes (urgence)

### Processus hotfix

```bash
# 1. CrÃ©er branche depuis main
git checkout main
git pull
git checkout -b hotfix/critical-auth-bug

# 2. Fix rapide
git commit -m "fix(auth): resolve session expiration issue"

# 3. Merger vers main ET develop
git checkout main
git merge hotfix/critical-auth-bug
git push origin main

git checkout develop
git merge hotfix/critical-auth-bug
git push origin develop

# 4. Tag
git tag -a v1.0.1 -m "Hotfix: Auth session bug"
git push origin v1.0.1

# 5. Cleanup
git branch -d hotfix/critical-auth-bug
```

---

## ðŸ“Š Exemple de timeline Git

```
Week 1-2: Phase 0
  develop â† feature/phase0-setup (merge) â†’ deploy preview

Week 3-5: Phase 1
  develop â† feature/phase1-landing (merge) â†’ deploy preview
  main â† develop (merge) â†’ v1.0.0 â†’ deploy production

Week 6-8: Phase 2
  develop â† feature/phase2-auth (merge)
  develop â† feature/phase2-dashboard (merge)
  develop â† feature/phase2-chat (merge)
  main â† develop (merge) â†’ v1.1.0 â†’ deploy production

Week 9-11: Phase 3
  develop â† feature/phase3-payment (merge)
  main â† develop (merge) â†’ v1.2.0 â†’ deploy production
```

---

## ðŸ›¡ï¸ SÃ©curitÃ© & Secrets

### Ne JAMAIS commiter

```bash
# âŒ Fichiers Ã  ignorer (.gitignore)
.env
.env.local
.env.*.local
*.key
*.pem
node_modules/
.DS_Store
.vercel
```

### GÃ©rer les secrets

```bash
# âœ… Utiliser variables d'environnement
# Vercel: via UI
# Local: .env.local (gitignored)

# âœ… Exemple .env.example (commitable)
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

---

## ðŸ“‹ Checklist avant merge

### Pull Request Template

CrÃ©er `.github/PULL_REQUEST_TEMPLATE.md` :

```markdown
## Description
Brief description of changes

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Tasks completed
- [ ] Task ID-01: Description
- [ ] Task ID-02: Description

## Testing
- [ ] Local testing completed
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No console errors

## Checklist
- [ ] Code follows CLAUDE.md rules
- [ ] No `any` types
- [ ] Semantic HTML used
- [ ] Components < 300 lines
- [ ] Responsive design tested
- [ ] Accessibility checked
- [ ] Documentation updated

## Screenshots (if UI changes)
[Add screenshots]

## Related Issues
Closes #123
```

---

## ðŸŽ¯ RÃ©sumÃ© de la stratÃ©gie

| Phase | Branche(s) | DurÃ©e | Merge vers develop |
|-------|-----------|-------|-------------------|
| **Phase 0** | `feature/phase0-setup` | 3-5 jours | 1x (fin setup) |
| **Phase 1** | `feature/phase1-landing` | 2-3 sem | 1-2x (mid + fin) |
| **Phase 2** | `feature/phase2-auth`<br>`feature/phase2-dashboard`<br>`feature/phase2-chat` | 4-6 sem | 3x (1 par branche) |
| **Phase 3** | `feature/phase3-payment` | 2-3 sem | 1x (fin payment) |

**Total branches features**: ~6-7 (au lieu de 30 si 1 branche/task)

**Avantages**:
- âœ… Historique Git propre et lisible
- âœ… Reviews plus significatives (ensemble cohÃ©rent)
- âœ… Merges moins frÃ©quents = moins de conflits
- âœ… Deploy previews par ensemble logique
- âœ… Rollback facile (par phase/module)

---

## ðŸ“ž Support

**Questions Git/Workflow**: tech-lead@formelio.fr  
**Documentation**: [Git Documentation](https://git-scm.com/doc)  
**GitHub CLI**: [GitHub CLI](https://cli.github.com/)

---

**Version**: 1.0  
**DerniÃ¨re mise Ã  jour**: Octobre 2025  
**Projet**: Formelio
