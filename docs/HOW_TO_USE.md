# 🚀 Guide d'utilisation pratique - Documentation Formelio

Ce guide vous explique comment utiliser efficacement cette documentation dans votre workflow quotidien.

---

## 🎯 Scénarios d'utilisation

### Scénario 1 : Je démarre le projet de zéro

**Étapes recommandées** :

1. **Jour 1 - Compréhension (2-3h)**
   ```
   📖 Lire : README.md
   📖 Lire : 01-getting-started/GETTING_STARTED.md
   📖 Lire : 02-project-management/cahier_des_charges_formelio.md
   ```

2. **Jour 1-2 - Configuration (3-5h)**
   ```
   📋 Suivre : 01-getting-started/GETTING_STARTED.md > Section "Quick Start"
   ⚠️  Lire ABSOLUMENT : 03-development/CLAUDE.md
   📋 Suivre : 02-project-management/GIT_STRATEGY.md > Section "Setup initial"
   ```

3. **Jour 2-5 - Phase 0 (13h)**
   ```
   📋 Task COMMON-01 : Project Setup (4h)
   📋 Task COMMON-02 : Design System (6h)
   📋 Task 03-development/tasks/03-supabase-config.md (3h)
   ```

4. **Semaines 2-4 - Phase 1 (41h)**
   ```
   📋 Suivre : 03-development/tasks/
   📋 Référence : 03-development/CLAUDE.md (toujours)
   📋 Git : 02-project-management/GIT_STRATEGY.md
   ```

---

### Scénario 2 : Je reprends le projet après une pause

**Étapes recommandées** :

1. **Ouvrir une nouvelle conversation Claude**
   ```
   📋 Copier : 01-getting-started/CONTEXT_PROMPT.md
   📋 Coller dans Claude
   📋 Ajouter : "Je veux reprendre le développement sur [feature X]"
   ```

2. **Réviser les règles critiques**
   ```
   ⚠️  Relire : 03-development/CLAUDE.md > Sections critiques
   📋 Vérifier : 02-project-management/GIT_STRATEGY.md > Branche actuelle
   ```

3. **Reprendre le développement**
   ```
   📋 Consulter : 03-development/tasks/[task en cours]
   📋 Suivre : Les acceptance criteria
   📋 Tester : Selon 04-testing/
   ```

---

### Scénario 3 : Je veux implémenter une feature spécifique

**Exemple : Implémenter le système d'authentification (P2-01)**

1. **Préparation**
   ```
   📋 Lire : 03-development/tasks/PHASE2_AND_PHASE3_TASKS.md > Section P2-01
   ⚠️  Vérifier : 03-development/CLAUDE.md > Règles Supabase
   📋 Consulter : 04-testing/TESTING_STRATEGY.md > Authentication tests
   ```

2. **Développement**
   ```
   🔧 Créer branche : feature/phase2-auth
   🔧 Suivre : Les "Technical Implementation" de la task
   🔧 Commit : Selon GIT_STRATEGY.md conventions
   ```

3. **Tests**
   ```
   ✅ Écrire : Tests unitaires (Jest + RTL)
   ✅ Écrire : Tests E2E (Playwright)
   ✅ Suivre : 04-testing/E2E_FIXTURES_HELPERS.md > AuthHelper
   ```

4. **Review & Merge**
   ```
   📋 Vérifier : Acceptance criteria de la task
   📋 Vérifier : Coverage > target
   📋 Merger : develop ← feature/phase2-auth
   ```

---

### Scénario 4 : J'ai besoin de configurer les tests

**Étapes recommandées** :

1. **Compréhension de la stratégie (1h)**
   ```
   📖 Lire : 04-testing/TESTING_RECAP.md (vue d'ensemble)
   📖 Lire : 04-testing/TESTING_STRATEGY.md (détails)
   ```

2. **Setup initial (2-3h)**
   ```
   📋 Suivre : 04-testing/TESTING_INTEGRATION_GUIDE.md > Phase 0
   🔧 Installer : Jest, RTL, Playwright
   🔧 Configurer : jest.config.js, playwright.config.ts
   🔧 Créer : Structure de dossiers
   ```

3. **Premiers tests (1-2h)**
   ```
   📋 Utiliser : 04-testing/E2E_FIXTURES_HELPERS.md > Helpers
   ✅ Écrire : 2 tests smoke
   ✅ Vérifier : npm test fonctionne
   ```

4. **CI/CD (1h)**
   ```
   📋 Suivre : 04-testing/TESTING_INTEGRATION_GUIDE.md > CI/CD
   🔧 Créer : .github/workflows/test.yml
   ✅ Vérifier : Tests passent dans la CI
   ```

---

### Scénario 5 : Je veux comprendre l'architecture Git

**Étapes recommandées** :

1. **Lecture de la stratégie (30min)**
   ```
   📖 Lire : 02-project-management/GIT_STRATEGY.md
   📖 Comprendre : Les 7 branches logiques
   📖 Comprendre : Les conventions de commits
   ```

2. **Setup local (15min)**
   ```
   🔧 git init
   🔧 git checkout -b develop
   🔧 Configurer : Branch protection rules
   ```

3. **Premier workflow (30min)**
   ```
   📋 Suivre : GIT_STRATEGY.md > Phase 0 workflow
   🔧 git checkout -b feature/phase0-setup
   🔧 Développer + commit selon conventions
   🔧 git push origin feature/phase0-setup
   🔧 Créer PR vers develop
   ```

---

## 📚 Documents par ordre d'importance

### 🔴 CRITIQUE - À lire AVANT tout développement

1. **03-development/CLAUDE.md** ⚠️
   - Règles TypeScript strictes
   - Règles Supabase critiques
   - HTML sémantique obligatoire
   - **Ne PAS développer sans avoir lu ce document**

### 🟡 IMPORTANT - À lire au démarrage

2. **README.md** (ce fichier)
   - Vue d'ensemble de la documentation
   - Navigation rapide

3. **01-getting-started/GETTING_STARTED.md**
   - Quick start guide
   - Setup du projet

4. **02-project-management/cahier_des_charges_formelio.md**
   - Spécifications complètes
   - Architecture du projet

5. **02-project-management/GIT_STRATEGY.md**
   - Workflow Git
   - Conventions de commits

### 🟢 UTILE - À consulter selon les besoins

6. **INVENTORY.md**
   - Liste complète des fichiers
   - Descriptions détaillées

7. **03-development/tasks/**
   - Tasks détaillées par feature
   - Code examples

8. **04-testing/**
   - Stratégie de tests
   - Helpers réutilisables

9. **01-getting-started/CONTEXT_PROMPT.md**
   - Pour reprendre le travail
   - Prompt de continuation

---

## 🛠️ Workflow recommandé quotidien

### Matin (début de session)

```bash
# 1. Vérifier où j'en suis
git status
git log --oneline -5

# 2. Consulter la task du jour
# Ouvrir : 03-development/tasks/[ma-task].md

# 3. Réviser les règles si nécessaire
# Ouvrir : 03-development/CLAUDE.md (sections pertinentes)
```

### Pendant le développement

```bash
# 1. Référencer la task
# Avoir ouvert : 03-development/tasks/[ma-task].md

# 2. Suivre les acceptance criteria
# Cocher au fur et à mesure

# 3. Commits réguliers
git add .
git commit -m "type(scope): description"
# Selon 02-project-management/GIT_STRATEGY.md
```

### Soir (fin de session)

```bash
# 1. Vérifier les tests
npm test
npm run test:e2e

# 2. Pusher le travail
git push origin [ma-branche]

# 3. Noter où j'en suis
# Mettre à jour : TASKS_SYNTHESIS.md ou un fichier perso
```

---

## 🎓 Tips & Best Practices

### Tip 1 : Gardez CLAUDE.md ouvert en permanence
```
👉 Ouvrir dans un onglet/fenêtre séparé
👉 Consulter dès qu'un doute sur TypeScript ou Supabase
👉 Ne JAMAIS utiliser any, @ts-ignore, ou @supabase/auth-helpers-nextjs
```

### Tip 2 : Utilisez les checklists
```
👉 Chaque task a une "Completion Checklist"
👉 Cocher au fur et à mesure
👉 Ne pas passer à la task suivante si incomplète
```

### Tip 3 : Tests en même temps que le code
```
👉 Ne pas attendre la fin pour écrire les tests
👉 Suivre 04-testing/TESTING_INTEGRATION_GUIDE.md
👉 Utiliser les helpers de E2E_FIXTURES_HELPERS.md
```

### Tip 4 : Commits atomiques et descriptifs
```
👉 Suivre Conventional Commits (GIT_STRATEGY.md)
👉 Un commit = une modification logique
👉 Message clair : "feat(auth): add login form validation"
```

### Tip 5 : Documentation à jour
```
👉 Si vous modifiez l'architecture, mettre à jour la doc
👉 Si vous ajoutez une feature, documenter dans tasks/
👉 Tenir à jour TASKS_SYNTHESIS.md
```

---

## 🆘 Résolution de problèmes

### Problème : Je ne sais pas par où commencer

**Solution** :
```
1. Lire README.md (ce fichier) > Section "Navigation rapide"
2. Lire 01-getting-started/GETTING_STARTED.md
3. Suivre "Scénario 1" ci-dessus
```

### Problème : J'ai oublié les règles TypeScript/Supabase

**Solution** :
```
1. Ouvrir 03-development/CLAUDE.md
2. Chercher la section concernée (Ctrl+F)
3. Relire les règles critiques
```

### Problème : Je ne sais pas quelle task faire ensuite

**Solution** :
```
1. Consulter 02-project-management/TASKS_SYNTHESIS.md
2. Voir la progression par phase
3. Prendre la prochaine task non commencée de la phase actuelle
```

### Problème : Mes tests ne passent pas

**Solution** :
```
1. Consulter 04-testing/TESTING_INTEGRATION_GUIDE.md > Troubleshooting
2. Vérifier la configuration (jest.config.js, playwright.config.ts)
3. Utiliser les helpers de E2E_FIXTURES_HELPERS.md
```

### Problème : Je ne sais plus où j'en suis dans le projet

**Solution** :
```
1. git status (état actuel)
2. git log --oneline -10 (derniers commits)
3. Consulter 02-project-management/TASKS_SYNTHESIS.md > Progression
```

---

## 📞 Support et ressources

### Documentation interne
- **Vue d'ensemble** : README.md
- **Quick start** : 01-getting-started/GETTING_STARTED.md
- **Règles critiques** : 03-development/CLAUDE.md ⚠️
- **Tasks** : 03-development/tasks/

### Reprendre le travail
- **Prompt de continuation** : 01-getting-started/CONTEXT_PROMPT.md

### Ressources externes
- Next.js : https://nextjs.org/docs
- Supabase : https://supabase.com/docs
- Shadcn UI : https://ui.shadcn.com
- Tailwind : https://tailwindcss.com

---

## ✅ Checklist de démarrage

Avant de commencer à développer, assurez-vous d'avoir :

- [ ] Lu README.md
- [ ] Lu 01-getting-started/GETTING_STARTED.md
- [ ] **Lu 03-development/CLAUDE.md (CRITIQUE)** ⚠️
- [ ] Consulté 02-project-management/cahier_des_charges_formelio.md
- [ ] Compris 02-project-management/GIT_STRATEGY.md
- [ ] Setup Git et GitHub
- [ ] Créé la branche develop
- [ ] Compris la Phase 0 (setup)

---

**Version** : 1.0  
**Date** : Octobre 2025

💙 **Formelio** - Votre temps, notre priorité
