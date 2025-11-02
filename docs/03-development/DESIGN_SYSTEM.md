# Design System - Formelio

**Version** : 1.0
**Date** : Octobre 2025
**Projet** : Formelio - Service de formalités juridiques

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Identité de marque](#identité-de-marque)
3. [Système de couleurs](#système-de-couleurs)
4. [Typographie](#typographie)
5. [Spacing & Sizing](#spacing--sizing)
6. [Composants UI](#composants-ui)
7. [Responsive Breakpoints](#responsive-breakpoints)
8. [Animations](#animations)
9. [Accessibilité](#accessibilité)
10. [Implémentation Tailwind](#implémentation-tailwind)
11. [Ressources externes](#ressources-externes)

---

## Vue d'ensemble

Ce document centralise toutes les ressources du design system Formelio pour assurer une cohérence visuelle dans toute l'application.

### Stack Design

- **Framework CSS** : Tailwind CSS 3.4+
- **Composants** : Shadcn UI (React components)
- **Fonts** : Google Fonts (Poppins + Inter)
- **Icons** : Lucide React
- **Dark Mode** : Support natif Tailwind

### Principes de design

1. **Professionnel mais accessible** : Design épuré pour des experts
2. **Rassurant** : Couleurs et formes qui inspirent confiance
3. **Efficient** : Interface claire et rapide à utiliser
4. **Moderne** : Technologies et patterns actuels

---

## Identité de marque

### Logo

**Nom** : Formelio
**Symbole** : Double chevron `>>`
**Fichier** : [formelio_logo.png](../05-assets/formelio_logo.png)

**Usage** :
- Header : 32px de hauteur
- Favicon : Généré depuis le logo (voir [P1-08-FAVICON-SEO-GUIDE.md](tasks/P1-08-FAVICON-SEO-GUIDE.md))
- OG Image : 1200x630px avec logo centré

### Tagline

**Principal** : "Votre temps, notre priorité"

**Variantes** :
- Court : "Experts en formalités complexes"
- Long : "Spécialistes des dossiers rejetés et situations bloquées"

---

## Système de couleurs

### Palette principale

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: {
          DEFAULT: '#2E5F7E',  // Bleu Formelio
          50: '#F0F7FA',
          100: '#E0EFF5',
          200: '#C2DFEB',
          300: '#A3CFE1',
          400: '#73B0CF',
          500: '#4A90B5',       // Bleu clair
          600: '#2E5F7E',       // Primary
          700: '#1E4A5F',       // Dark
          800: '#163B4D',
          900: '#0F2C3A',
        },

        // Accent Colors
        accent: {
          DEFAULT: '#F59E0B',  // Orange
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F59E0B',      // Accent
          600: '#D97706',      // Dark
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },

        // Semantic Colors
        success: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dark: '#D97706',
        },
        info: {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB',
        },

        // Neutrals (extended gray scale)
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },
      },
    },
  },
}
```

### Usage des couleurs

| Couleur | Usage | Exemple |
|---------|-------|---------|
| `primary.600` | Boutons primaires, liens | CTA "Démarrer un dossier" |
| `primary.500` | Hover states, highlights | Hover sur navigation |
| `accent.500` | Call-to-actions secondaires | Boutons "En savoir plus" |
| `success` | Statuts positifs | "Dossier validé" |
| `error` | Erreurs, alertes critiques | "Document manquant" |
| `warning` | Avertissements | "En attente de validation" |
| `gray.900` | Textes principaux | Body text |
| `gray.600` | Textes secondaires | Labels, descriptions |
| `gray.200` | Bordures | Cards, inputs |
| `gray.50` | Backgrounds | Page backgrounds |

### Exemples d'implémentation

```tsx
// Button primary
<button className="bg-primary-600 hover:bg-primary-700 text-white">
  Démarrer
</button>

// Badge success
<span className="bg-success/10 text-success px-2 py-1 rounded-full">
  Validé
</span>

// Card avec border
<div className="bg-white border border-gray-200 rounded-lg p-4">
  Content
</div>
```

---

## Typographie

### Fonts

```typescript
// app/layout.tsx
import { Poppins, Inter } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

// tailwind.config.ts
export default {
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-poppins)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
}
```

### Scale typographique

| Classe | Font | Size | Line Height | Weight | Usage |
|--------|------|------|-------------|--------|-------|
| `text-5xl` | Poppins | 48px | 1.2 | 700 | Hero title |
| `text-4xl` | Poppins | 36px | 1.3 | 700 | Page title |
| `text-3xl` | Poppins | 30px | 1.3 | 600 | Section title |
| `text-2xl` | Poppins | 24px | 1.4 | 600 | Card title |
| `text-xl` | Poppins | 20px | 1.5 | 600 | Subtitle |
| `text-lg` | Inter | 18px | 1.6 | 500 | Large body |
| `text-base` | Inter | 16px | 1.6 | 400 | Body text |
| `text-sm` | Inter | 14px | 1.5 | 400 | Small text |
| `text-xs` | Inter | 12px | 1.4 | 400 | Labels, captions |

### Exemples d'utilisation

```tsx
// Hero title
<h1 className="font-heading text-5xl font-bold text-gray-900">
  Experts en formalités juridiques
</h1>

// Section title
<h2 className="font-heading text-3xl font-semibold text-gray-900">
  Nos services
</h2>

// Body text
<p className="font-body text-base text-gray-700">
  Description du service...
</p>

// Caption
<span className="font-body text-xs text-gray-500">
  * Mentions légales
</span>
```

---

## Spacing & Sizing

### Spacing scale

Tailwind utilise une échelle basée sur 4px (rem).

| Classe | Value | Usage |
|--------|-------|-------|
| `space-1` | 4px | Très serré |
| `space-2` | 8px | Serré |
| `space-3` | 12px | Compact |
| `space-4` | 16px | Standard |
| `space-6` | 24px | Confortable |
| `space-8` | 32px | Large |
| `space-12` | 48px | Très large |
| `space-16` | 64px | Sections |
| `space-24` | 96px | Sections majeures |

### Sizing presets

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      spacing: {
        '18': '4.5rem',   // 72px
        '88': '22rem',    // 352px
        '128': '32rem',   // 512px
      },
      maxWidth: {
        '8xl': '88rem',   // 1408px
      },
    },
  },
}
```

### Container widths

| Breakpoint | Max Width |
|------------|-----------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

---

## Composants UI

### Shadcn UI Components

Liste des composants Shadcn à installer :

```bash
# Core components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add form

# Feedback components
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add progress

# Layout components
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add avatar

# Advanced components
npx shadcn-ui@latest add table
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
```

### Button variants

```tsx
import { Button } from '@/components/ui/button';

// Primary
<Button variant="default">Démarrer</Button>

// Secondary
<Button variant="secondary">En savoir plus</Button>

// Outline
<Button variant="outline">Annuler</Button>

// Ghost
<Button variant="ghost">Lien</Button>

// Destructive
<Button variant="destructive">Supprimer</Button>

// With icon
<Button>
  <ArrowRight className="mr-2 h-4 w-4" />
  Continuer
</Button>
```

### Card patterns

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

// Standard card
<Card>
  <CardHeader>
    <CardTitle>Dossier #123</CardTitle>
    <CardDescription>Créé le Octobre 2025</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Contenu du dossier...</p>
  </CardContent>
  <CardFooter>
    <Button>Voir détails</Button>
  </CardFooter>
</Card>
```

### Badge status

```tsx
import { Badge } from '@/components/ui/badge';

// Success
<Badge variant="default" className="bg-success/10 text-success">
  Validé
</Badge>

// Warning
<Badge variant="default" className="bg-warning/10 text-warning">
  En attente
</Badge>

// Error
<Badge variant="destructive">
  Rejeté
</Badge>

// Info
<Badge variant="secondary">
  En cours
</Badge>
```

---

## Responsive Breakpoints

### Configuration

```typescript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      'sm': '640px',   // Mobile landscape
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large desktop
      '2xl': '1536px', // Extra large
    },
  },
}
```

### Exemples responsive

```tsx
// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>

// Padding responsive
<section className="px-4 md:px-8 lg:px-16">
  {/* Content */}
</section>

// Text size responsive
<h1 className="text-3xl md:text-4xl lg:text-5xl">
  Titre responsive
</h1>

// Hide/show based on breakpoint
<div className="hidden md:block">
  Desktop only
</div>

<div className="block md:hidden">
  Mobile only
</div>
```

---

## Animations

### Transitions standards

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      transitionDuration: {
        '2000': '2000ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
}
```

### Exemples d'animations

```tsx
// Hover effect
<button className="transition-colors duration-200 hover:bg-primary-700">
  Hover me
</button>

// Fade in
<div className="animate-fade-in">
  Content
</div>

// Transform on hover
<div className="transform transition-transform hover:scale-105">
  Card
</div>
```

---

## Accessibilité

### Checklist WCAG AA

- ✅ **Contrast ratio minimum** : 4.5:1 pour texte normal, 3:1 pour texte large
- ✅ **Focus visible** : Tous les éléments interactifs ont un focus outline
- ✅ **Keyboard navigation** : Tous les composants navigables au clavier
- ✅ **ARIA labels** : Labels appropriés pour screen readers
- ✅ **Alt text** : Toutes les images ont un texte alternatif

### Implémentation focus

```tsx
// Focus ring
<button className="focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
  Button
</button>

// Focus visible only (no mouse focus)
<a href="#" className="focus-visible:ring-2 focus-visible:ring-primary-500">
  Link
</a>
```

### ARIA examples

```tsx
// Loading state
<button disabled aria-busy="true">
  <Loader className="animate-spin" />
  Chargement...
</button>

// Alert
<div role="alert" aria-live="assertive">
  Erreur : Document manquant
</div>

// Hidden but accessible
<span className="sr-only">
  Ouvrir le menu de navigation
</span>
```

---

## Implémentation Tailwind

### Configuration complète

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#2E5F7E',
          50: '#F0F7FA',
          100: '#E0EFF5',
          200: '#C2DFEB',
          300: '#A3CFE1',
          400: '#73B0CF',
          500: '#4A90B5',
          600: '#2E5F7E',
          700: '#1E4A5F',
          800: '#163B4D',
          900: '#0F2C3A',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#F59E0B',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dark: '#D97706',
        },
      },
      fontFamily: {
        heading: ['var(--font-poppins)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

### Global CSS

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --radius: 0.5rem;

    /* Primary */
    --primary: 203 48% 34%;
    --primary-foreground: 0 0% 100%;

    /* Accent */
    --accent: 38 92% 50%;
    --accent-foreground: 0 0% 100%;

    /* Borders */
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 203 48% 34%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 203 48% 54%;
    --primary-foreground: 222.2 47.4% 11.2%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground font-body;
  }
  h1, h2, h3, h4, h5, h6 {
    @apply font-heading;
  }
}
```

---

## Ressources externes

### Documentation officielle

| Ressource | Description | Lien |
|-----------|-------------|------|
| **Shadcn UI** | Composants React avec Tailwind CSS et Radix UI | [ui.shadcn.com](https://ui.shadcn.com) |
| **Tailwind CSS** | Framework CSS utility-first | [tailwindcss.com](https://tailwindcss.com) |
| **Radix UI** | Primitives UI accessibles (base de Shadcn) | [radix-ui.com](https://www.radix-ui.com) |
| **Lucide Icons** | Bibliothèque d'icônes | [lucide.dev](https://lucide.dev) |

### Design Resources

| Ressource | Description | Lien |
|-----------|-------------|------|
| **Vercel Design Guidelines** | Grille responsive, tokens de couleurs, dark mode, patterns de components | [vercel.com/design](https://vercel.com/design) |
| **Figma UI Kit Supabase** | Kit officiel des composants Supabase (auth, profils, dashboards) | [figma.com/community/file/1021211203122621522](https://www.figma.com/community/file/1021211203122621522) |
| **Refactoring UI** | Livre de design pragmatique pour développeurs, parfait pour un SaaS minimaliste | [refactoringui.com](https://refactoringui.com) |

### Outils utiles

| Outil | Description | Lien |
|-------|-------------|------|
| **Coolors** | Générateur et explorateur de palettes | [coolors.co](https://coolors.co) |
| **Color Contrast Checker** | Vérifier conformité WCAG | [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker) |
| **Google Fonts** | Bibliothèque de polices open source | [fonts.google.com](https://fonts.google.com) |
| **Tailwind Play** | Playground Tailwind en ligne | [play.tailwindcss.com](https://play.tailwindcss.com) |

### Exemples de code

| Exemple | Description | Lien |
|---------|-------------|------|
| **Shadcn Examples** | Exemples de composants et patterns | [ui.shadcn.com/examples](https://ui.shadcn.com/examples) |
| **Tailwind UI** | Templates et composants premium (payant) | [tailwindui.com](https://tailwindui.com) |
| **Next.js SaaS Starter** | Boilerplate Next.js + Supabase + Stripe | [github.com/vercel/nextjs-subscription-payments](https://github.com/vercel/nextjs-subscription-payments) |

### SaaS Boilerplates & Open Source

Projets complets à étudier pour l'architecture et l'implémentation :

| Projet | Stack | Points forts | Lien |
|--------|-------|--------------|------|
| **Dub.co** | Next.js 15 + Supabase + Tailwind | Architecture clean, RLS exemplaire, API Edge | [github.com/dubinc/dub](https://github.com/dubinc/dub) |
| **Cal.com** | Next.js + Prisma + tRPC | Multi-tenant, monorepo Turborepo, patterns complexes | [github.com/calcom/cal.com](https://github.com/calcom/cal.com) |
| **Supastarter** | Supabase + Next.js + Stripe | Boilerplate complet avec tests et CI/CD | [supastarter.dev](https://supastarter.dev) |
| **Nhost Boilerplate** | Nhost + Next.js + GraphQL | Organisation multi-services, patterns GraphQL | [github.com/nhost/nhost-nextjs-boilerplate](https://github.com/nhost/nhost-nextjs-boilerplate) |

**Ressource complémentaire** : [IndieHackers - I built a SaaS with Supabase](https://www.indiehackers.com/post/i-built-a-saas-boilerplate-for-nextjs-and-supabase-ad798d3133) - Retour d'expérience détaillé.

---

## 📝 Changelog

### Version 1.0 (Octobre 2025)
- ✅ Design system initial créé
- ✅ Palette de couleurs Formelio définie
- ✅ Système typographique avec Poppins + Inter
- ✅ Composants Shadcn UI listés
- ✅ Guidelines d'accessibilité WCAG AA
- ✅ Configuration Tailwind complète
- ✅ Ressources externes référencées

---

## 🔗 Documents liés

- [CLAUDE.md](CLAUDE.md) - Section 8 : Styling avec Tailwind & Shadcn
- [cahier_des_charges_formelio.md](../02-project-management/cahier_des_charges_formelio.md) - Section 5 : Design et identité visuelle
- [01-homepage-layout.md](tasks/01-homepage-layout.md) - Implémentation layout et fonts
- [P1-08-FAVICON-SEO-GUIDE.md](tasks/P1-08-FAVICON-SEO-GUIDE.md) - Favicon et brand assets

---

**Version** : 1.0
**Dernière mise à jour** : Octobre 2025
**Statut** : ✅ Complet et prêt à l'implémentation

💙 **Formelio** - Votre temps, notre priorité
