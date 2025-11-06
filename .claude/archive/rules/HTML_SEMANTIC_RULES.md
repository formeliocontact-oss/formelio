# HTML Semantic Rules - Accessibility & Semantics

**Version**: 2.0
**Focus**: Semantic HTML, accessibility (a11y), NO div soup

---

## 🚨 ABSOLUTE PROHIBITION

### ❌ NO Div Soup

**Nested divs without semantic meaning are FORBIDDEN.**

```tsx
// ❌ FORBIDDEN - Div soup
<div className="container">
  <div className="header">
    <div className="title">Titre</div>
    <div className="nav">
      <div onClick={handleClick}>Lien</div>
    </div>
  </div>
  <div className="content">
    <div className="article">Contenu</div>
  </div>
  <div className="footer">Footer</div>
</div>
```

**Problems:**
- 🔴 No semantic meaning
- 🔴 Bad for screen readers
- 🔴 Bad for SEO
- 🔴 Harder to maintain
- 🔴 Poor accessibility

---

## ✅ ALWAYS Use Semantic HTML

```tsx
// ✅ CORRECT - Semantic HTML
<div className="page-wrapper">
  <header>
    <h1>Titre</h1>
    <nav>
      <button onClick={handleClick} type="button">
        Lien
      </button>
    </nav>
  </header>
  <main>
    <article>
      <p>Contenu</p>
    </article>
  </main>
  <footer>
    <p>Footer content</p>
  </footer>
</div>
```

**Benefits:**
- ✅ Clear semantic structure
- ✅ Screen readers understand it
- ✅ Better SEO
- ✅ Easier to maintain
- ✅ Accessible by default

---

## 📋 Semantic Elements Reference

| Element | Use For | Instead of |
|---------|---------|------------|
| `<header>` | Page/section header | `<div className="header">` |
| `<nav>` | Navigation menus | `<div className="nav">` |
| `<main>` | Main content (one per page) | `<div className="main">` |
| `<article>` | Self-contained content | `<div className="article">` |
| `<section>` | Thematic grouping | `<div className="section">` |
| `<aside>` | Sidebar, related content | `<div className="sidebar">` |
| `<footer>` | Page/section footer | `<div className="footer">` |
| `<h1>`-`<h6>` | Headings (hierarchical) | `<div className="title">` |
| `<button>` | Clickable actions | `<div onClick={}>` |
| `<a>` | Links/navigation | `<div onClick={}>` |
| `<form>` | Forms | `<div>` with inputs |
| `<label>` | Input labels | `<span>` or text |
| `<input>` | Form inputs | `<div contenteditable>` |
| `<ul>`/`<ol>` | Lists | `<div>` containers |
| `<figure>` | Images with captions | `<div>` with img |
| `<time>` | Dates/times | `<span>` |
| `<address>` | Contact information | `<div>` |

---

## 🧩 React Fragments

**Use Fragments to avoid unnecessary divs.**

```tsx
// ❌ WRONG - Unnecessary wrapper div
function Component() {
  return (
    <div>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

// ✅ CORRECT - Fragment (no DOM element)
function Component() {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}

// ✅ CORRECT - Fragment with key (in lists)
function List({ items }: { items: Item[] }) {
  return (
    <>
      {items.map(item => (
        <React.Fragment key={item.id}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </React.Fragment>
      ))}
    </>
  );
}
```

**When to use wrapper div:**
- Only when you need it for styling (flexbox, grid, etc.)
- Minimize usage - one wrapper max

---

## ♿ Accessibility (a11y) Rules

### 1. Button vs Link

```tsx
// ✅ Use <button> for actions
<button onClick={handleSubmit} type="button">
  Submit
</button>

// ✅ Use <a> for navigation
<a href="/dashboard">Dashboard</a>

// ❌ WRONG - div with onClick
<div onClick={handleClick}>Click me</div>
```

### 2. Labels for Inputs

```tsx
// ✅ CORRECT - Explicit label
<label htmlFor="email">Email Address</label>
<input id="email" type="email" name="email" />

// ✅ CORRECT - Wrapping label
<label>
  Email Address
  <input type="email" name="email" />
</label>

// ❌ WRONG - No label
<input type="email" placeholder="Email" />
```

### 3. ARIA Attributes

```tsx
// ✅ Modal with ARIA
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">Modal Title</h2>
</div>

// ✅ Button with icon
<button
  onClick={handleClose}
  aria-label="Close modal"
  type="button"
>
  <CloseIcon aria-hidden="true" />
</button>

// ✅ Alert message
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

### 4. Keyboard Navigation

```tsx
// ✅ Support Enter and Space
<button
  onClick={handleAction}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleAction();
    }
  }}
  type="button"
>
  Action
</button>

// ✅ Focus management
<dialog ref={dialogRef}>
  <button
    ref={closeButtonRef}
    onClick={handleClose}
    type="button"
  >
    Close
  </button>
</dialog>

// Focus close button when dialog opens
useEffect(() => {
  if (isOpen) {
    closeButtonRef.current?.focus();
  }
}, [isOpen]);
```

### 5. Alt Text for Images

```tsx
// ✅ Descriptive alt text
<img src="/logo.png" alt="Formelio logo" />

// ✅ Decorative image (empty alt)
<img src="/decoration.png" alt="" aria-hidden="true" />

// ❌ WRONG - No alt text
<img src="/logo.png" />
```

---

## 📐 Heading Hierarchy

**Follow proper heading order (h1 → h2 → h3).**

```tsx
// ✅ CORRECT - Proper hierarchy
<main>
  <h1>Page Title</h1>
  <section>
    <h2>Section Title</h2>
    <article>
      <h3>Article Title</h3>
      <p>Content</p>
    </article>
  </section>
</main>

// ❌ WRONG - Skipping levels
<main>
  <h1>Page Title</h1>
  <h4>Subsection</h4>  {/* Skipped h2, h3 */}
</main>
```

**Rules:**
- One `<h1>` per page
- Don't skip heading levels
- Headings convey structure, not style (use CSS for size)

---

## 🎯 Common Patterns

### Card Component

```tsx
// ✅ Semantic card
<article className="card">
  <header>
    <h3>Card Title</h3>
  </header>
  <p>Card content</p>
  <footer>
    <button type="button">Action</button>
  </footer>
</article>
```

### Navigation

```tsx
// ✅ Semantic navigation
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

### Form

```tsx
// ✅ Semantic form
<form onSubmit={handleSubmit}>
  <fieldset>
    <legend>User Information</legend>

    <label htmlFor="name">Name</label>
    <input id="name" type="text" required />

    <label htmlFor="email">Email</label>
    <input id="email" type="email" required />
  </fieldset>

  <button type="submit">Submit</button>
</form>
```

---

## 📋 Pre-Commit HTML Checklist

Before committing:

- [ ] NO div soup (minimal nested divs)
- [ ] Semantic elements used (`<header>`, `<nav>`, `<main>`, etc.)
- [ ] Fragments used instead of unnecessary divs
- [ ] All inputs have labels
- [ ] Buttons have `type` attribute
- [ ] Images have `alt` text
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] ARIA attributes where needed
- [ ] Keyboard navigation works

---

## 🔗 Related Rules

- **Architecture**: [ARCHITECTURE_RULES.md](./ARCHITECTURE_RULES.md)
- **TypeScript**: [TYPESCRIPT_RULES.md](./TYPESCRIPT_RULES.md)
- **Supabase**: [SUPABASE_RULES.md](./SUPABASE_RULES.md)
- **Next.js**: [NEXTJS_RULES.md](./NEXTJS_RULES.md)
- **Main Rules**: [../CLAUDE.md](../CLAUDE.md)

---

## 📚 Resources

- [MDN HTML Elements Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [WebAIM Accessibility](https://webaim.org/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
