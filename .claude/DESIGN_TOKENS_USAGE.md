# Design Tokens - Guide d'Usage Formelio

**Version**: 1.1
**Last Updated**: 2025-11-10

Ce guide montre comment utiliser correctement les design tokens Formelio.

---

## 🎨 Couleurs Sémantiques

### ✅ FAIRE

```tsx
// Liens et actions primaires
<Link className="text-primary hover:underline">En savoir plus</Link>

// Messages d'erreur
<p className="text-destructive">Email invalide</p>

// Messages de succès
<div className="bg-success/10 border-success text-success-foreground">
  ✓ Dossier créé avec succès
</div>

// Texte secondaire
<p className="text-muted-foreground">Informations complémentaires</p>
```

### ❌ NE PAS FAIRE

```tsx
// Hardcoded colors
<Link className="text-blue-600">En savoir plus</Link>
<p className="text-red-600">Email invalide</p>
<div className="bg-green-50 text-green-800">Succès</div>
<p className="text-gray-500">Informations</p>
```

---

## 📐 Typographie

### ✅ FAIRE

```tsx
// Hiérarchie claire avec headings sémantiques
<article>
  <h1>Titre du dossier</h1>              {/* text-4xl font-semibold (auto) */}
  <h2>Section principale</h2>            {/* text-3xl font-semibold (auto) */}
  <p className="text-base">Contenu...</p> {/* 16px, line-height 1.625 */}
  <p className="text-sm text-muted-foreground">
    Informations supplémentaires
  </p>
</article>

// Utiliser les tokens de taille adaptés
<span className="text-lg">Important</span>      {/* 18px avec spacing optimal */}
<small className="text-xs">Légende</small>      {/* 12px avec spacing optimal */}
```

### ❌ NE PAS FAIRE

```tsx
// Headings non sémantiques
<div className="text-4xl font-bold">Titre</div>  {/* Utiliser <h1> */}

// Font weights inappropriés
<h2 className="font-bold">Section</h2>           {/* Utiliser font-semibold */}

// Tailles arbitraires
<span className="text-[17px]">Text</span>        {/* Utiliser text-lg */}
```

---

## 📏 Espacement Sémantique

### Component Spacing

```tsx
// ✅ Tokens sémantiques - Explicites et maintenables
<Card className="p-component-lg">               {/* 24px padding */}
  <form className="space-y-component">          {/* 16px entre champs */}
    <div className="space-y-component-xs">      {/* 8px pour labels */}
      <Label>Email</Label>
      <Input />
    </div>
  </form>
</Card>

// ❌ Valeurs arbitraires - Difficile à maintenir
<Card className="p-6">
  <form className="space-y-4">
    <div className="space-y-2">
      <Label>Email</Label>
      <Input />
    </div>
  </form>
</Card>
```

### Section Spacing

```tsx
// ✅ Espacement entre sections
<main>
  <section className="py-section-xl">          {/* 128px - Hero section */}
    <h1>Bienvenue</h1>
  </section>

  <section className="py-section">             {/* 64px - Section standard */}
    <h2>Fonctionnalités</h2>
  </section>

  <section className="py-section-sm">          {/* 48px - Section compacte */}
    <h2>Contact</h2>
  </section>
</main>

// ❌ Espacements inconsistants
<main>
  <section className="py-20">
    <h1>Bienvenue</h1>
  </section>

  <section className="py-16">
    <h2>Fonctionnalités</h2>
  </section>

  <section className="py-10">
    <h2>Contact</h2>
  </section>
</main>
```

### Content Spacing

```tsx
// ✅ Espacement entre éléments de contenu
<article className="space-y-content-sm">       {/* 24px entre paragraphes */}
  <p>Premier paragraphe du document juridique...</p>
  <p>Deuxième paragraphe avec informations...</p>
  <p>Troisième paragraphe de conclusion...</p>
</article>

// Liste avec espacement confortable
<ul className="space-y-content-xs">            {/* 16px entre items */}
  <li>Premier point</li>
  <li>Deuxième point</li>
  <li>Troisième point</li>
</ul>
```

---

## 📏 Max Widths

### ✅ FAIRE

```tsx
// Document juridique - Confort de lecture optimal
<article className="max-w-prose-legal mx-auto">  {/* 75ch */}
  <h1>Conditions Générales d'Utilisation</h1>
  <p>Long texte juridique...</p>
</article>

// Formulaire - Largeur adaptée
<form className="max-w-form mx-auto">             {/* 512px */}
  <Input />
  <Button>Envoyer</Button>
</form>

// Container responsive
<div className="max-w-container-lg mx-auto px-component">
  {/* Contenu limité à 1024px avec padding */}
</div>
```

### ❌ NE PAS FAIRE

```tsx
// Texte trop large - Difficile à lire
<article className="max-w-full">
  <p>Très long texte sans limite de largeur...</p>
</article>

// Largeurs arbitraires
<form className="max-w-[500px]">
  <Input />
</form>
```

---

## 🎯 Exemple Complet : Page de Dossier

```tsx
// components/features/cases/case-detail-page.tsx
export function CaseDetailPage({ caseData }: Props) {
  return (
    <main className="py-section">
      <div className="max-w-container-lg mx-auto px-component-lg">

        {/* Header */}
        <header className="space-y-component-sm mb-section-sm">
          <h1>{caseData.title}</h1>
          <p className="text-muted-foreground">
            Créé le {formatDate(caseData.created_at)}
          </p>
        </header>

        {/* Content */}
        <article className="max-w-prose-legal space-y-content">
          <section>
            <h2>Description</h2>
            <p>{caseData.description}</p>
          </section>

          <section>
            <h2>Documents</h2>
            <div className="space-y-component">
              {caseData.documents.map(doc => (
                <Card key={doc.id} className="p-component-lg">
                  <h3 className="text-lg">{doc.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {doc.size}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        </article>

        {/* Actions */}
        <footer className="mt-section-sm space-x-component">
          <Button variant="default">Modifier</Button>
          <Button variant="secondary">Télécharger</Button>
          <Button variant="destructive">Supprimer</Button>
        </footer>

      </div>
    </main>
  )
}
```

---

## 🔍 Migration Rapide

### Rechercher et Remplacer

```bash
# Trouver les hardcoded colors
rg "text-(blue|red|green|gray)-\d+" src/

# Trouver les espacements arbitraires
rg "p-[1-9]|py-[1-9]|px-[1-9]" src/

# Trouver les max-w arbitraires
rg "max-w-\[" src/
```

### Mapping Courant

| Ancien | Nouveau | Raison |
|--------|---------|--------|
| `text-blue-600` | `text-primary` | Sémantique |
| `text-red-600` | `text-destructive` | Sémantique |
| `text-gray-500` | `text-muted-foreground` | Sémantique |
| `p-6` | `p-component-lg` | Explicite |
| `py-16` | `py-section` | Cohérence |
| `space-y-4` | `space-y-component` | Maintenabilité |
| `max-w-md` | `max-w-form` | Contexte |

---

## ✅ Checklist Migration

Lors de la création d'un nouveau composant :

- [ ] Utiliser couleurs sémantiques (primary, destructive, muted-foreground)
- [ ] Utiliser headings sémantiques (`<h1>`, `<h2>`, etc.)
- [ ] Utiliser tokens d'espacement (`p-component-lg`, `py-section`)
- [ ] Utiliser max-width adaptée (`max-w-prose-legal`, `max-w-form`)
- [ ] Éviter hardcoded colors (`text-blue-600`)
- [ ] Éviter espacements arbitraires (`p-6` → `p-component-lg`)
- [ ] Éviter largeurs arbitraires (`max-w-[500px]`)

---

**Référence complète** : [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
