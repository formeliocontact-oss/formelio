# Formelio SaaS

Une plateforme SaaS juridique moderne pour la gestion de dossiers, construite avec Next.js, TypeScript, et Supabase.

## 🚀 Technologies

### Core Stack

- **Next.js 15.0.0** - Framework React avec App Router
- **React 19.0.0** - Dernière version avec hooks améliorés
- **TypeScript 5.x** - Typage strict pour une meilleure maintenabilité
- **Supabase SSR** - Backend-as-a-Service avec Row Level Security
- **Tailwind CSS 4.1.16** - Utility-first CSS framework

### UI & Forms

- **Shadcn UI** - Components accessibles et customisables
- **React Hook Form** - Gestion de formulaires performante
- **Zod** - Validation de schémas TypeScript-first

### Testing & Quality

- **Vitest** - Tests unitaires rapides
- **Cypress** - Tests E2E
- **Storybook** - Documentation interactive des components
- **ESLint** - Linting du code
- **Prettier** - Formatage automatique

### Internationalization

- **next-intl** - i18n intégré (FR par défaut, prêt pour multi-langue)

## ⚠️ Note Importante: Tailwind CSS v4

Ce projet utilise **Tailwind CSS v4** avec le plugin bridge `@tailwindcss/postcss` pour assurer la compatibilité pendant la transition de l'écosystème.

**Configuration actuelle:**

- ✅ Package: `tailwindcss@4.1.16`
- ✅ Bridge: `@tailwindcss/postcss`
- ✅ Syntaxe: Directives v3 (`@tailwind`) dans globals.css
- ✅ Compatibilité: Shadcn UI + Next.js 15

**Pas de syntaxe pure v4** (encore):

- ❌ Pas de `@import "tailwindcss"`
- ❌ Pas de `@theme`, `@plugin`, `@custom-variant`
- ❌ Pas de `tw-animate-css`

📖 **Documentation détaillée**: [.claude/TAILWIND_V4_COMPATIBILITY.md](.claude/TAILWIND_V4_COMPATIBILITY.md)

## Démarrage

### Installation des dépendances

```bash
npm install
```

### Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

### Build de production

```bash
npm run build
npm start
```

## Structure du projet

```
formeliosaas/
├── src/
│   └── app/
│       ├── layout.tsx      # Layout principal
│       ├── page.tsx        # Page d'accueil
│       └── globals.css     # Styles globaux
├── public/                 # Fichiers statiques
├── next.config.ts          # Configuration Next.js
├── tsconfig.json           # Configuration TypeScript
├── tailwind.config.ts      # Configuration Tailwind
└── package.json            # Dépendances du projet
```

## 📜 Scripts Disponibles

### Développement

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Crée un build de production
- `npm start` - Lance le serveur de production

### Quality & Testing

- `npm run lint` - Vérifie le code avec ESLint
- `npm run type-check` - Vérifie les types TypeScript
- `npm run format` - Formate le code avec Prettier
- `npm run format:check` - Vérifie le formatage
- `npm run test` - Lance les tests unitaires (Vitest)
- `npm run test:ui` - Interface UI pour Vitest
- `npm run test:e2e` - Tests E2E interactifs (Cypress)
- `npm run test:e2e:headless` - Tests E2E en CLI

### Documentation

- `npm run storybook` - Lance Storybook sur http://localhost:6006
- `npm run build-storybook` - Build Storybook pour production

## 📁 Structure du Projet

```
formeliosaas/
├── .claude/                         # Documentation projet et règles
│   ├── CLAUDE.md                   # Règles principales
│   ├── CLAUDE-decisions.md         # Décisions architecturales
│   ├── CLAUDE-patterns.md          # Patterns établis
│   ├── TAILWIND_V4_COMPATIBILITY.md # Doc Tailwind v4
│   └── rules/                      # Règles détaillées
├── .husky/                         # Git hooks (pre-commit)
├── .storybook/                     # Config Storybook
├── cypress/                        # Tests E2E
│   └── e2e/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx             # Layout racine avec i18n
│   │   ├── page.tsx               # Page d'accueil
│   │   └── globals.css            # Styles Tailwind
│   ├── components/
│   │   ├── features/              # Components métier
│   │   ├── forms/                 # Formulaires (react-hook-form)
│   │   ├── layouts/               # Layouts réutilisables
│   │   └── ui/                    # Shadcn UI components
│   ├── hooks/                      # Custom React hooks
│   ├── i18n/
│   │   ├── messages/
│   │   │   └── fr.json            # Traductions FR
│   │   └── request.ts             # Config next-intl
│   ├── lib/
│   │   ├── api/                   # API clients
│   │   ├── constants/             # Constantes
│   │   ├── env.ts                 # Variables d'environnement
│   │   ├── services/              # Business logic
│   │   ├── supabase/              # Supabase clients
│   │   │   ├── client.ts         # Browser client
│   │   │   ├── server.ts         # Server client
│   │   │   └── middleware.ts     # Session refresh
│   │   ├── utils/                 # Utilitaires
│   │   ├── utils.ts               # cn() helper
│   │   └── validations/           # Schémas Zod
│   ├── stories/                    # Stories Storybook
│   └── types/
│       └── supabase.ts            # Types Supabase générés
├── test/                           # Setup tests
├── .env.example                    # Variables d'env template
├── .env.local                      # Variables d'env locales (gitignored)
├── middleware.ts                   # Middleware Supabase
├── next.config.ts                  # Config Next.js + next-intl
├── postcss.config.mjs             # @tailwindcss/postcss
├── tsconfig.json                   # TypeScript strict mode
└── vitest.config.ts               # Config Vitest
```

## 🔧 Configuration

### Variables d'Environnement

Copiez `.env.example` vers `.env.local` et remplissez les valeurs:

```bash
cp .env.example .env.local
```

**Requis pour Supabase:**

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase Setup

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Récupérez l'URL et l'anon key dans Project Settings > API
3. Ajoutez-les dans `.env.local`
4. Configurez Row Level Security (RLS) sur vos tables

## 📖 Documentation

### Règles du Projet

- **[.claude/CLAUDE.md](.claude/CLAUDE.md)** - Règles principales (LIRE EN PREMIER)
- **[.claude/CLAUDE-decisions.md](.claude/CLAUDE-decisions.md)** - Décisions architecturales documentées
- **[.claude/CLAUDE-patterns.md](.claude/CLAUDE-patterns.md)** - Patterns de code établis

### Règles Détaillées

- **[.claude/rules/ARCHITECTURE_RULES.md](.claude/rules/ARCHITECTURE_RULES.md)** - Anti-duplication, structure
- **[.claude/rules/TYPESCRIPT_RULES.md](.claude/rules/TYPESCRIPT_RULES.md)** - TypeScript strict
- **[.claude/rules/SUPABASE_RULES.md](.claude/rules/SUPABASE_RULES.md)** - Patterns Supabase SSR
- **[.claude/rules/HTML_SEMANTIC_RULES.md](.claude/rules/HTML_SEMANTIC_RULES.md)** - HTML sémantique
- **[.claude/rules/NEXTJS_RULES.md](.claude/rules/NEXTJS_RULES.md)** - Server vs Client Components

### Spécifique

- **[.claude/TAILWIND_V4_COMPATIBILITY.md](.claude/TAILWIND_V4_COMPATIBILITY.md)** - Explications Tailwind v4

## Contribuer

Ce projet est lié au dépôt GitHub: https://github.com/formeliocontact-oss/formelio.git
