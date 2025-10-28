# Formelio SaaS

Une plateforme de formation en ligne moderne construite avec Next.js et TypeScript.

## Technologies

- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique pour JavaScript
- **Tailwind CSS** - Framework CSS utility-first
- **ESLint** - Linting et formatage du code

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

## Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Crée un build de production
- `npm start` - Lance le serveur de production
- `npm run lint` - Vérifie le code avec ESLint

## Contribuer

Ce projet est lié au dépôt GitHub: https://github.com/formeliocontact-oss/formelio.git
