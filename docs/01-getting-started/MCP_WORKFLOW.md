# MCP Workflow Configuration

Ce fichier dÃ©finit le workflow d'intÃ©gration avec les Model Context Protocol (MCP) servers pour automatiser la gestion des tasks et l'intÃ©gration avec GitHub.

## ðŸ”„ Workflow Overview

```mermaid
graph TD
    A[Cahier des charges] --> B[Context7 MCP]
    B --> C[GÃ©nÃ©ration tasks structurÃ©es]
    C --> D[Sauvegarde /tasks/]
    D --> E{Review humain}
    E -->|ValidÃ©| F[Git commit]
    E -->|Modifications| C
    F --> G[GitHub MCP]
    G --> H[CrÃ©ation issues GitHub]
    H --> I[Project/TaskFlow MCP]
    I --> J[Organisation sprints/milestones]
```

## âš™ï¸ Configuration des MCP Servers

### 1. Context7 (Analyse & GÃ©nÃ©ration)

**Purpose**: Analyse le cahier des charges et gÃ©nÃ¨re les tasks hiÃ©rarchisÃ©es

**Configuration** (`~/.config/claude/context7.json`):
```json
{
  "server": "context7",
  "enabled": true,
  "config": {
    "documents_path": "./project-docs",
    "tasks_output_path": "./tasks",
    "task_template": "detailed",
    "auto_dependencies": true,
    "estimation_method": "planning_poker"
  }
}
```

**Usage**:
```
@context7 analyze cahier_des_charges_formelio.md
@context7 generate-tasks --phase 1 --output ./tasks/phase1-landing/
```

### 2. Filesystem (Sauvegarde locale)

**Purpose**: GÃ¨re la lecture/Ã©criture des fichiers de tasks

**Configuration** (`~/.config/claude/filesystem.json`):
```json
{
  "server": "filesystem",
  "enabled": true,
  "config": {
    "root_path": "./",
    "allowed_paths": [
      "./tasks/**/*.md",
      "./docs/**/*",
      "./scripts/**/*"
    ],
    "watch_changes": true
  }
}
```

**Usage**:
```
@filesystem write ./tasks/phase1-landing/03-about-page.md [content]
@filesystem read ./tasks/README.md
@filesystem watch ./tasks/ --on-change trigger-review
```

### 3. GitHub (IntÃ©gration Issues & PRs)

**Purpose**: CrÃ©e et gÃ¨re les issues GitHub Ã  partir des tasks

**Configuration** (`~/.config/claude/github.json`):
```json
{
  "server": "github",
  "enabled": true,
  "config": {
    "owner": "your-org",
    "repo": "formelio",
    "auth_token_env": "GITHUB_TOKEN",
    "auto_labels": true,
    "auto_milestones": true,
    "issue_template": "task",
    "pr_template": "feature"
  }
}
```

**Usage**:
```
@github create-issues --from ./tasks/ --dry-run
@github create-issues --from ./tasks/phase1-landing/ --milestone "Phase 1"
@github update-issue [issue-number] --status "In Progress"
```

### 4. Project/TaskFlow (Organisation)

**Purpose**: Organise les issues en sprints, milestones et manage le backlog

**Configuration** (`~/.config/claude/taskflow.json`):
```json
{
  "server": "taskflow",
  "enabled": true,
  "config": {
    "project_id": "formelio",
    "sprint_duration": "2w",
    "velocity_tracking": true,
    "auto_assign": false,
    "workflow_states": [
      "Backlog",
      "Ready",
      "In Progress",
      "Review",
      "Testing",
      "Done"
    ]
  }
}
```

**Usage**:
```
@taskflow create-sprint --name "Sprint 1" --duration 2w --start-date 2025-11-01
@taskflow assign-to-sprint --issues P1-01,P1-02,P1-03 --sprint 1
@taskflow set-priority --issue P1-02 --priority P0
@taskflow generate-burndown --sprint current
```

---

## ðŸ“‹ Ã‰tapes du Workflow

### Phase 1: Analyse & GÃ©nÃ©ration

```bash
# 1. Analyse du cahier des charges
@context7 analyze ./cahier_des_charges_formelio.md --output-format structured

# 2. GÃ©nÃ©ration des tasks
@context7 generate-tasks \
  --source ./cahier_des_charges_formelio.md \
  --output ./tasks/ \
  --phases 0,1,2,3 \
  --template detailed

# 3. VÃ©rification de la structure
@filesystem list ./tasks/ --recursive --format tree
```

### Phase 2: Review & Validation

```bash
# 1. Review humain des tasks gÃ©nÃ©rÃ©es
# Ouvrir et valider chaque fichier .md dans /tasks/

# 2. Ajustements si nÃ©cessaire
@filesystem edit ./tasks/phase1-landing/02-homepage-hero.md
# Modifier les acceptance criteria, effort, etc.

# 3. Commit des tasks validÃ©es
git add tasks/
git commit -m "feat: add structured tasks for all phases"
git push origin main
```

### Phase 3: CrÃ©ation des Issues GitHub

```bash
# 1. Dry run pour vÃ©rifier
@github create-issues \
  --from ./tasks/ \
  --dry-run \
  --log ./scripts/github-issues-preview.log

# 2. CrÃ©er les issues pour Phase 0 et 1 (prioritÃ© haute)
@github create-issues \
  --from ./tasks/common/ \
  --from ./tasks/phase1-landing/ \
  --milestone "MVP Launch" \
  --auto-labels

# 3. VÃ©rifier les issues crÃ©Ã©es
@github list-issues --milestone "MVP Launch" --format table
```

### Phase 4: Organisation en Sprints

```bash
# 1. CrÃ©er les sprints
@taskflow create-sprint --name "Sprint 1: Setup" --duration 1w
@taskflow create-sprint --name "Sprint 2-3: Landing Page" --duration 2w

# 2. Assigner les tasks aux sprints
@taskflow assign-to-sprint \
  --issues COMMON-01,COMMON-02,COMMON-03 \
  --sprint 1

@taskflow assign-to-sprint \
  --issues P1-01,P1-02,P1-03,P1-04 \
  --sprint 2

# 3. DÃ©finir les prioritÃ©s
@taskflow set-priority --issues COMMON-* --priority P0
@taskflow set-priority --issues P1-02,P1-05 --priority P0

# 4. GÃ©nÃ©rer le board Kanban
@taskflow generate-board --sprint current --format github-projects
```

---

## ðŸ¤– Automatisation avec CI/CD

### GitHub Actions Workflow

**.github/workflows/tasks-sync.yml**:
```yaml
name: Tasks Sync

on:
  push:
    paths:
      - 'tasks/**/*.md'
  workflow_dispatch:

jobs:
  sync-issues:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install GitHub CLI
        run: |
          curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
          sudo apt update
          sudo apt install gh
      
      - name: Authenticate GitHub CLI
        run: echo "${{ secrets.GITHUB_TOKEN }}" | gh auth login --with-token
      
      - name: Generate GitHub Issues
        env:
          GITHUB_REPO_OWNER: ${{ github.repository_owner }}
          GITHUB_REPO_NAME: ${{ github.event.repository.name }}
        run: node scripts/generate-github-issues.js
      
      - name: Update Project Board
        run: |
          # Script custom pour update le board
          node scripts/update-project-board.js
```

---

## ðŸ“Š Templates de Tasks

### Template Standard

Tous les fichiers de tasks suivent ce format:

```markdown
# [TASK_ID] - [Task Title]

**ID** : [TASK_ID]
**Phase** : [0-3]
**Priority** : [P0-P3]
**Effort** : [X heures]
**Status** : ðŸ”´ TODO

---

## ðŸ“‹ Description
[Description dÃ©taillÃ©e de la task]

## ðŸŽ¯ Objectifs
1. Objectif 1
2. Objectif 2

## âœ… Acceptance Criteria
- [ ] CritÃ¨re 1
- [ ] CritÃ¨re 2

## ðŸ”§ Technical Implementation
[Code snippets, architecture, etc.]

## ðŸ”— Dependencies
### Prerequisite
- [Dependencies]

### Bloquant pour
- [Blocked tasks]

## ðŸ§ª Testing
[Test strategy]

## ðŸ“š Resources
[Links and references]

## âš ï¸ Potential Issues
[Known risks]

## ðŸ‘¤ Assignee
[Team member]

## ðŸ Completion Checklist
- [ ] Item 1
- [ ] Item 2
```

---

## ðŸ”§ Scripts Utilitaires

### GÃ©nÃ©ration d'issues GitHub
```bash
# GÃ©nÃ©rer toutes les issues
npm run generate:issues

# Dry run
DRY_RUN=true npm run generate:issues

# GÃ©nÃ©rer seulement Phase 1
npm run generate:issues:phase1
```

### Mise Ã  jour du statut
```bash
# Update task status
npm run task:update P1-02 --status "In Progress"

# Sync avec GitHub
npm run task:sync
```

### GÃ©nÃ©ration de rapports
```bash
# Sprint burndown
npm run report:burndown --sprint current

# Velocity chart
npm run report:velocity --sprints 1,2,3

# Progress dashboard
npm run report:progress --phase 1
```

---

## ðŸŽ¯ Best Practices

### 1. Review Process
- Toujours review les tasks gÃ©nÃ©rÃ©es avant commit
- Valider les estimations d'effort
- VÃ©rifier les dÃ©pendances

### 2. Issue Management
- CrÃ©er les issues phase par phase
- Ne pas crÃ©er toutes les issues d'un coup
- Update le statut rÃ©guliÃ¨rement

### 3. Sprint Planning
- Sprint duration: 1-2 semaines
- CapacitÃ©: ~40h par dev par sprint
- Buffer: 20% pour imprÃ©vus

### 4. Dependencies
- Toujours lister les dependencies
- Blocker les issues non-ready
- Communiquer les blocages

---

## ðŸ“ž Support

**Questions sur le workflow MCP** : [tech-lead@formelio.fr]  
**Issues GitHub** : [github.com/formelio/project/issues]  
**Documentation** : [/docs/mcp-workflow.md]

---

**Version** : 1.0  
**Last updated** : Octobre 2025
