# ðŸ”„ CONTEXT PROMPT - Formelio Project Continuation

**Date**: Octobre 2025  
**Purpose**: Reprendre le dÃ©veloppement du projet Formelio aprÃ¨s cette session  
**Status**: Documentation complÃ¨te, prÃªt pour dÃ©veloppement

---

## ðŸ“‹ PROMPT Ã€ COPIER POUR LE PROCHAIN CHAT

```
Bonjour Claude,

Je travaille sur le projet Formelio, une plateforme web de formalitÃ©s juridiques pour professionnels du droit franÃ§ais.

## Contexte du projet

Formelio est un service spÃ©cialisÃ© dans les formalitÃ©s administratives et juridiques COMPLEXES, destinÃ© aux professionnels du droit (experts-comptables, avocats, notaires). Le positionnement unique : expertise insider des greffes franÃ§ais (fondateur diplÃ´mÃ© en droit de l'UniversitÃ© de Montpellier + expÃ©rience au greffe du tribunal de commerce). On se concentre sur les dossiers rejetÃ©s et les situations bloquÃ©es que les autres services ne peuvent pas traiter.

## Stack technique

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Shadcn UI
- **Backend**: Supabase (Auth, Database PostgreSQL, Storage, Realtime)
- **Payments**: Stripe
- **Deployment**: Vercel
- **Boilerplate**: Next-SaaS-Stripe-Starter

## Ce qui a Ã©tÃ© fait

### Documentation complÃ¨te crÃ©Ã©e
J'ai accÃ¨s aux documents suivants dans mon projet Claude :

1. **INDEX.md** - Point d'entrÃ©e de toute la documentation
2. **GETTING_STARTED.md** - Guide de dÃ©marrage (9.4 KB)
3. **cahier_des_charges_formelio.md** - CDC complet (21 KB, 14 sections)
4. **CLAUDE.md** - RÃ¨gles de dÃ©veloppement STRICTES (TypeScript, HTML sÃ©mantique, Supabase, etc.)
5. **MCP_WORKFLOW.md** - Configuration MCP servers (Context7, GitHub, TaskFlow)
6. **LIVRABABLES.md** - Vue d'ensemble des livrables

### Tasks et stratÃ©gie Git

J'ai documentÃ© **30 tasks** (200h) rÃ©parties en 4 phases :
- **Phase 0**: Setup (3 tasks, 13h)
- **Phase 1**: Landing Page (8 tasks, 41h)
- **Phase 2**: Dashboard & Auth (12 tasks, 98h)
- **Phase 3**: Payment (7 tasks, 48h)

J'ai crÃ©Ã© une **stratÃ©gie Git avec 7 branches logiques** (au lieu de 30) :
```
main (production)
  â””â”€â”€ develop (intÃ©gration)
       â”œâ”€â”€ feature/phase0-setup          (3 tasks, 13h)
       â”œâ”€â”€ feature/phase1-landing        (8 tasks, 41h)
       â”œâ”€â”€ feature/phase2-auth           (3 tasks, 22h)
       â”œâ”€â”€ feature/phase2-dashboard      (7 tasks, 58h)
       â”œâ”€â”€ feature/phase2-chat           (2 tasks, 22h)
       â””â”€â”€ feature/phase3-payment        (7 tasks, 48h)
```

### Fichiers crÃ©Ã©s dans /outputs/

Les fichiers suivants ont Ã©tÃ© crÃ©Ã©s et sont disponibles :

1. **GIT_STRATEGY.md** (complet)
   - StratÃ©gie de branches par ensembles logiques
   - Workflow dÃ©taillÃ© pour chaque phase
   - Conventions de commits (Conventional Commits)
   - Protection des branches
   - Tagging et releases

2. **tasks/common/03-supabase-config.md**
   - Task COMMON-03 complÃ¨te
   - SchÃ©ma SQL complet (tables, RLS, indexes, functions, triggers)
   - Configuration Storage buckets
   - GÃ©nÃ©ration types TypeScript

3. **tasks/phase1-landing/01-homepage-layout.md**
   - Task P1-01 complÃ¨te
   - Header, Footer, Navigation responsive
   - Code TypeScript complet

4. **tasks/phase1-landing/03-08-remaining-tasks.md**
   - Tasks P1-03 Ã  P1-08 (format condensÃ© mais complet)
   - Services, Process, About, Contact, Legal, SEO

5. **tasks/PHASE2_AND_PHASE3_TASKS.md**
   - Toutes les tasks Phase 2 (P2-02 Ã  P2-12)
   - Toutes les tasks Phase 3 (P3-01 Ã  P3-07)
   - Code examples pour chaque task

6. **TASKS_SYNTHESIS.md**
   - SynthÃ¨se complÃ¨te du projet
   - Plan d'action semaine par semaine
   - Statistiques et mÃ©triques
   - Next steps

## Ã‰tat actuel

- âœ… Documentation complÃ¨te (CDC, tasks, Git strategy)
- âœ… 30 tasks documentÃ©es avec code
- âœ… StratÃ©gie Git dÃ©finie (7 branches)
- âœ… RÃ¨gles de dev strictes (CLAUDE.md)
- â³ Projet Next.js pas encore initialisÃ©
- â³ Repository Git pas encore crÃ©Ã©
- â³ DÃ©veloppement pas encore commencÃ©

## Ce que je veux faire maintenant

[INDIQUER ICI CE QUE TU VEUX FAIRE]

Options possibles :
- Commencer Phase 0 (setup du projet)
- CrÃ©er le repository Git
- GÃ©nÃ©rer les issues GitHub
- RÃ©viser une task spÃ©cifique
- Clarifier un point technique
- Autre : [prÃ©ciser]

## Contraintes CRITIQUES Ã  respecter

### TypeScript (CLAUDE.md)
- âŒ JAMAIS utiliser `any` ou `as any`
- âŒ JAMAIS utiliser `@ts-ignore`
- âœ… Types explicites partout
- âœ… Type guards pour validation

### HTML SÃ©mantique
- âŒ INTERDICTION de la "div soup"
- âœ… Utiliser les bonnes balises (<header>, <nav>, <main>, <article>, etc.)
- âœ… AccessibilitÃ© (ARIA, navigation clavier)

### Supabase
- âŒ JAMAIS utiliser `@supabase/auth-helpers-nextjs` (DEPRECATED)
- âœ… TOUJOURS utiliser `@supabase/ssr`
- âœ… CRITIQUE : cookies.getAll() et cookies.setAll() (pas get/set individuels)

### Architecture
- âœ… Composants < 300 lignes (sinon diviser)
- âœ… Pas de duplication (hooks rÃ©utilisables)
- âœ… Server Components par dÃ©faut, Client Components uniquement si nÃ©cessaire

## Informations importantes

### Brand Guidelines Formelio
- **Logo** : Double chevron >> + "FORMELIO"
- **Tagline** : "Votre temps, notre prioritÃ©"
- **Couleurs** : Bleu primaire (#2E5F7E), Bleu clair (#4A90B5)
- **Fonts** : Poppins (headings) + Inter (body)

### Positionnement unique
- Expertise insider des greffes (ancien du greffe RCS)
- Connaissance des divergences RNE/RCS/INSEE
- Focus sur les cas complexes et dossiers rejetÃ©s
- Pas de compÃ©tition sur le volume, mais sur l'expertise

### RGPD
âš ï¸ CRITIQUE : DonnÃ©es juridiques sensibles
- HÃ©bergement EU uniquement
- RLS strict sur toutes les tables
- Consentement explicite
- Chiffrement au repos

Merci de m'aider Ã  continuer le dÃ©veloppement de Formelio !
```

---

## ðŸ“ NOTES POUR LA PROCHAINE SESSION

### Si tu veux commencer le dÃ©veloppement :

1. **Phase 0 - Setup** (3-5 jours)
   ```bash
   # Initialiser le projet
   npx create-next-app@latest formelio --typescript --tailwind --app
   
   # CrÃ©er branche
   git checkout -b feature/phase0-setup
   
   # Suivre les tasks COMMON-01, 02, 03
   ```

2. **Consulter les documents** :
   - Lire `GIT_STRATEGY.md` pour le workflow
   - Lire `tasks/common/03-supabase-config.md` pour Supabase
   - Lire `CLAUDE.md` pour les rÃ¨gles strictes

3. **Setup Supabase** :
   - CrÃ©er projet sur supabase.com (rÃ©gion EU)
   - Copier les API keys
   - Appliquer le schÃ©ma SQL de `03-supabase-config.md`
   - GÃ©nÃ©rer les types TypeScript

### Si tu veux rÃ©viser/ajuster :

1. **Consulter** `TASKS_SYNTHESIS.md` pour vue d'ensemble
2. **Modifier** les tasks si nÃ©cessaire
3. **Ajuster** la stratÃ©gie Git si besoin

### Si tu veux gÃ©nÃ©rer les issues GitHub :

1. **Setup GitHub CLI** : `brew install gh && gh auth login`
2. **CrÃ©er repo** : `gh repo create formelio --private`
3. **Script** : Utiliser `scripts/generate-github-issues.js` (si crÃ©Ã©)

---

## ðŸ”— Liens rapides vers documentation

Tous ces fichiers sont dans le projet Claude :

- ðŸ“– **Point d'entrÃ©e** : `INDEX.md`
- ðŸš€ **DÃ©marrage** : `GETTING_STARTED.md`
- ðŸ“‹ **Cahier des charges** : `cahier_des_charges_formelio.md`
- ðŸ’» **RÃ¨gles de dev** : `CLAUDE.md`
- ðŸŒ¿ **StratÃ©gie Git** : Fichier crÃ©Ã© dans `/outputs/GIT_STRATEGY.md`
- âœ… **Tasks complÃ¨tes** : Fichiers crÃ©Ã©s dans `/outputs/tasks/`
- ðŸ“Š **SynthÃ¨se** : Fichier crÃ©Ã© dans `/outputs/TASKS_SYNTHESIS.md`

---

## ðŸŽ¯ Checklist de reprise

Avant de continuer, vÃ©rifie que tu as accÃ¨s Ã  :

- [ ] INDEX.md (dans le projet)
- [ ] GETTING_STARTED.md (dans le projet)
- [ ] cahier_des_charges_formelio.md (dans le projet)
- [ ] CLAUDE.md (dans le projet)
- [ ] GIT_STRATEGY.md (dans /outputs/)
- [ ] Tasks Phase 0, 1, 2, 3 (dans /outputs/tasks/)
- [ ] TASKS_SYNTHESIS.md (dans /outputs/)

Si tu n'as pas accÃ¨s Ã  certains fichiers, demande-moi de les rÃ©gÃ©nÃ©rer.

---

## ðŸ’¡ Questions frÃ©quentes pour la reprise

**Q: Quelle task commencer en premier ?**  
R: COMMON-01 (Project Setup) dans la branche `feature/phase0-setup`

**Q: Le projet Next.js existe dÃ©jÃ  ?**  
R: Non, pas encore initialisÃ©. Suivre COMMON-01 pour crÃ©er.

**Q: Supabase est configurÃ© ?**  
R: Non, Ã  faire dans COMMON-03. SchÃ©ma SQL complet fourni.

**Q: Les branches Git existent ?**  
R: Non, repository pas encore crÃ©Ã©. Voir GIT_STRATEGY.md pour setup.

**Q: Je peux modifier les tasks ?**  
R: Oui, c'est une base. Ajuste selon tes besoins rÃ©els lors du dev.

**Q: Combien de temps pour Phase 0 ?**  
R: 3-5 jours (13h estimÃ©es pour les 3 tasks)

**Q: Quelle est la premiÃ¨re release ?**  
R: v1.0.0 aprÃ¨s Phase 1 (Landing Page complÃ¨te)

---

## ðŸ“ž Support

Si besoin de clarifications, demande Ã  voir :
- Un fichier spÃ©cifique de la doc
- Une task en dÃ©tail
- Une explication sur la stratÃ©gie Git
- Des prÃ©cisions sur le stack technique

---

**Version**: 1.0  
**CrÃ©Ã© le**: Octobre 2025  
**Purpose**: Context prompt pour reprise du projet  
**Status**: âœ… Ready to use

ðŸ’™ **Formelio** - Votre temps, notre prioritÃ©
