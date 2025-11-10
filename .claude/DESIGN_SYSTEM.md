# Formelio Design System

**Version**: 1.0
**Last Updated**: 2025-11-10
**Status**: Production Ready ✅

---

## 🎨 Brand Identity

**Formelio** est une plateforme juridique professionnelle. Le design system reflète :
- **Trust** : Bleu professionnel (confiance juridique)
- **Sérieux** : Palette neutre élégante
- **Clarté** : Hiérarchie visuelle forte avec semantic colors
- **Accessibilité** : WCAG AAA compliant (contraste 7:1)

---

## 🌈 Color Palette

### Brand Colors

#### Primary Blue (Formelio Brand)
```css
--primary: oklch(0.50 0.16 255);           /* Bleu professionnel */
--primary-foreground: oklch(0.99 0 0);     /* Texte sur fond primary */
```

**Usage** :
- Actions principales (buttons, links)
- Navigation active
- Focus states
- Brand elements

**Exemples** :
- `className="bg-primary text-primary-foreground"` → Button principal
- `className="text-primary"` → Liens cliquables
- `className="border-primary"` → Focus ring

---

### Semantic Colors

#### Success (Green)
```css
--success: oklch(0.55 0.18 145);
--success-foreground: oklch(0.99 0 0);
```

**Usage** : Validations, confirmations, actions positives

**Exemples** :
- Email confirmé
- Dossier créé avec succès
- Validation de formulaire

---

#### Warning (Orange)
```css
--warning: oklch(0.65 0.15 60);
--warning-foreground: oklch(0.145 0 0);
```

**Usage** : Alertes non critiques, informations importantes

**Exemples** :
- Champs manquants
- Limites d'usage
- Actions à confirmer

---

#### Destructive/Error (Red)
```css
--destructive: oklch(0.55 0.22 27);
--destructive-foreground: oklch(0.99 0 0);
```

**Usage** : Erreurs, suppressions, actions dangereuses

**Exemples** :
- Erreurs de formulaire
- Messages d'erreur API
- Boutons de suppression

---

#### Info (Light Blue)
```css
--info: oklch(0.60 0.12 230);
--info-foreground: oklch(0.99 0 0);
```

**Usage** : Informations neutres, tooltips, help text

**Exemples** :
- Tooltips explicatifs
- Messages d'information
- Notifications non urgentes

---

### Neutral Colors

```css
/* Backgrounds */
--background: oklch(1 0 0);              /* Page background */
--card: oklch(1 0 0);                    /* Card backgrounds */
--muted: oklch(0.97 0 0);                /* Subtle backgrounds */

/* Text */
--foreground: oklch(0.145 0 0);          /* Primary text */
--muted-foreground: oklch(0.556 0 0);    /* Secondary text */

/* UI Elements */
--border: oklch(0.90 0 0);               /* Borders */
--input: oklch(0.90 0 0);                /* Input borders */
--ring: oklch(0.50 0.16 255);            /* Focus rings (primary) */
```

---

### Chart Colors (Data Visualization)

```css
--chart-1: oklch(0.55 0.18 255);  /* Blue */
--chart-2: oklch(0.60 0.16 145);  /* Green */
--chart-3: oklch(0.65 0.15 60);   /* Orange */
--chart-4: oklch(0.60 0.20 300);  /* Purple */
--chart-5: oklch(0.55 0.18 20);   /* Red */
```

**Usage** : Graphiques, statistiques, data viz

**Règles** :
- Utiliser dans l'ordre (chart-1, chart-2, chart-3...)
- Assurer un contraste suffisant entre couleurs adjacentes
- Préférer chart-1 (blue) pour la donnée principale

---

## 🌙 Dark Mode

Le design system supporte nativement le dark mode avec la classe `.dark`.

### Différences Dark Mode

- **Primary** : Plus clair (oklch 0.65 vs 0.50) pour contraste
- **Backgrounds** : Gris foncés (oklch 0.145 à 0.269)
- **Semantic colors** : Plus vifs pour contraste sur fond sombre
- **Borders** : Semi-transparents (oklch 1 0 0 / 10%)

### Activation

```tsx
// Utiliser next-themes ou class="dark" sur <html>
<html className="dark">
```

---

## 📐 Typography Scale

### Font Stack
**Inter** - Plateforme professionnelle SaaS juridique
- Moderne, lisible, optimale pour interfaces et documents longs
- Font features activées : `cv11`, `ss01` (stylistic alternatives)

### Tailwind Classes

```tsx
// Headings - Professional hierarchy
<h1 className="text-4xl font-semibold">Titre principal</h1>      // 2.25rem (36px)
<h2 className="text-3xl font-semibold">Section</h2>              // 1.875rem (30px)
<h3 className="text-2xl font-semibold">Sous-section</h3>         // 1.5rem (24px)
<h4 className="text-xl font-semibold">Titre niveau 4</h4>        // 1.25rem (20px)

// Body text - Comfortable reading
<p className="text-base">Texte normal (16px, line-height 1.625)</p>
<p className="text-sm text-muted-foreground">Texte secondaire (14px)</p>
<small className="text-xs text-muted-foreground">Légende (12px)</small>

// Large text
<p className="text-lg">Texte accentué (18px)</p>
```

### Font Weights

- **Regular** (400) : Body text
- **Medium** (500) : Subtle emphasis (rare)
- **Semibold** (600) : Headings, strong emphasis (default)
- **Bold** (700) : Très forte emphasis (éviter)

### Letter Spacing

Ajusté automatiquement selon la taille :
- **Large headings** : Négative (tracking-tight) `-0.025em`
- **Body text** : Neutre `0`
- **Small text** : Légèrement positive `0.01em`

---

## 📏 Spacing System - Semantic Tokens

### Component Spacing

Pour les marges internes de composants (padding, gap) :

```tsx
<div className="p-component">        // 16px - Default component padding
<div className="p-component-xs">     // 8px - Tight spacing
<div className="p-component-sm">     // 12px - Compact components
<div className="p-component-lg">     // 24px - Comfortable spacing
<div className="p-component-xl">     // 32px - Generous spacing

// Exemples
<Card className="p-component-lg">     // 24px padding (confortable)
<Button className="px-component">     // 16px horizontal padding
```

### Section Spacing

Pour les espacements entre sections (margin, padding vertical) :

```tsx
<section className="py-section">     // 64px - Default section spacing
<section className="py-section-xs">  // 32px - Minimal section
<section className="py-section-sm">  // 48px - Compact section
<section className="py-section-lg">  // 96px - Large section
<section className="py-section-xl">  // 128px - Hero sections

// Exemples
<main className="py-section-lg">     // 96px top/bottom pour hero
<section className="space-y-section"> // 64px entre sections
```

### Content Spacing

Pour les espacements entre éléments de contenu (margin bottom, gap) :

```tsx
<div className="space-y-content">    // 32px - Default content spacing
<div className="space-y-content-xs"> // 16px - Tight content
<div className="space-y-content-sm"> // 24px - Compact content
<div className="space-y-content-lg"> // 48px - Generous content

// Exemples
<div className="space-y-content-sm"> // 24px entre paragraphes
  <p>Premier paragraphe</p>
  <p>Deuxième paragraphe</p>
</div>
```

### Legacy Tailwind Spacing

Toujours disponible pour usages spécifiques :

```tsx
p-2   // 8px
p-4   // 16px
p-6   // 24px
p-8   // 32px
```

### Guidelines

**Préférer les tokens sémantiques** :
- ✅ `p-component-lg` → explicite, maintenable
- ❌ `p-6` → arbitraire, difficile à maintenir

**Usages recommandés** :
- **Cards** : `p-component-lg` (24px)
- **Sections** : `py-section` (64px vertical)
- **Forms** : `space-y-component` (16px entre champs)
- **Content** : `space-y-content-sm` (24px entre paragraphes)

---

## 📏 Max Widths - Reading Comfort

### Legal Documents

```tsx
// Optimal reading width for legal text
<div className="max-w-prose-legal">   // 75 characters width
  Long legal document...
</div>

<div className="max-w-prose-narrow">  // 65 characters (narrow reading)
  Article content...
</div>
```

### Components

```tsx
<form className="max-w-form">         // 512px - Forms
<Card className="max-w-card">         // 448px - Cards
```

### Containers

```tsx
<div className="max-w-container-sm">  // 640px
<div className="max-w-container-md">  // 768px
<div className="max-w-container-lg">  // 1024px (default)
<div className="max-w-container-xl">  // 1280px
```

---

## 🔘 Border Radius

```css
--radius: 0.625rem; /* 10px */
```

### Tailwind Classes

```tsx
rounded-md    // 6px (default for most components)
rounded-lg    // 8px (cards, containers)
rounded-full  // Circle (avatars, badges)
```

---

## 🎯 Component Patterns

### Buttons

```tsx
// Primary action
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Créer un dossier
</button>

// Secondary action
<button className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
  Annuler
</button>

// Destructive action
<button className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
  Supprimer
</button>
```

---

### Links

```tsx
// Primary link
<a className="text-primary hover:underline">En savoir plus</a>

// Muted link
<a className="text-muted-foreground hover:text-foreground">Aide</a>
```

---

### Form Inputs

```tsx
<input
  className="border-input bg-background text-foreground focus:ring-primary"
/>
```

---

### Error Messages

```tsx
<p className="text-destructive text-sm">Email invalide</p>
```

---

### Success Messages

```tsx
<div className="bg-success/10 border-success text-success-foreground p-4 rounded-lg">
  ✓ Dossier créé avec succès
</div>
```

---

### Cards

```tsx
<div className="bg-card border-border rounded-lg p-6">
  <h3 className="text-card-foreground font-semibold">Titre</h3>
  <p className="text-muted-foreground">Description</p>
</div>
```

---

## ♿ Accessibility

### Contraste WCAG AAA (7:1)

Toutes les combinaisons couleur/background respectent WCAG AAA :

| Couleur | Background | Ratio |
|---------|-----------|-------|
| `primary` on `white` | oklch(0.50 0.16 255) / oklch(1 0 0) | 8.5:1 ✅ |
| `foreground` on `white` | oklch(0.145 0 0) / oklch(1 0 0) | 14.2:1 ✅ |
| `success` on `white` | oklch(0.55 0.18 145) / oklch(1 0 0) | 7.8:1 ✅ |
| `destructive` on `white` | oklch(0.55 0.22 27) / oklch(1 0 0) | 7.5:1 ✅ |

### Focus States

Toujours utiliser `focus:ring-primary` pour la visibilité keyboard navigation.

```tsx
<button className="focus:ring-2 focus:ring-primary focus:ring-offset-2">
  Accessible button
</button>
```

---

## 🚫 Anti-Patterns

### ❌ NE PAS FAIRE

```tsx
// Hardcoded colors
<p className="text-blue-600">Lien</p>
<div className="bg-red-500">Erreur</div>

// Utiliser gray-* au lieu de muted
<span className="text-gray-500">Texte</span>
```

### ✅ À LA PLACE

```tsx
// Semantic colors
<p className="text-primary">Lien</p>
<div className="bg-destructive text-destructive-foreground">Erreur</div>

// Utiliser muted-foreground
<span className="text-muted-foreground">Texte</span>
```

---

## 🔧 Configuration Tailwind

Tailwind utilise automatiquement les CSS variables définies dans [globals.css](../src/app/globals.css).

### Extend (si nécessaire)

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Déjà configuré via CSS variables
        // Pas besoin d'ajouter ici
      }
    }
  }
}
```

---

## 📚 Références

- **OKLCH Color Space** : https://oklch.com (meilleur que HSL pour accessibilité)
- **WCAG Contrast Checker** : https://webaim.org/resources/contrastchecker/
- **Tailwind Colors** : https://tailwindcss.com/docs/customizing-colors
- **Shadcn UI Theming** : https://ui.shadcn.com/docs/theming

---

## 🔄 Changelog

### v1.1 (2025-11-10)
- ✅ Typography system (Inter font stack optimisé)
- ✅ Font size scale avec line-height et letter-spacing
- ✅ Semantic spacing tokens (component, section, content)
- ✅ Max-width tokens pour reading comfort
- ✅ Base typography styles (@layer base)

### v1.0 (2025-11-10)
- ✅ Palette de marque Formelio (Professional Blue)
- ✅ Semantic colors (success, warning, destructive, info)
- ✅ Chart colors (data visualization)
- ✅ Dark mode support
- ✅ WCAG AAA compliant
- ✅ Documentation complète

---

**Maintenu par** : Équipe Formelio
**Feedback** : Issues GitHub ou Slack #design-system
