# P1-01 - Homepage Layout & Navigation

**ID**: P1-01  
**Phase**: 1 (Landing Page)  
**Priority**: P0 (Critique)  
**Effort**: 4 heures  
**Status**: ðŸ”´ TODO  
**Branch**: `feature/phase1-landing`

---

## ðŸ“‹ Description

CrÃ©er la structure de layout globale du site (header, footer, navigation) et le systÃ¨me de navigation responsive. Cette task Ã©tablit les fondations visuelles et structurelles sur lesquelles toutes les autres pages seront construites.

---

## ðŸŽ¯ Objectifs

1. CrÃ©er un header responsive avec logo et navigation
2. ImplÃ©menter un menu mobile (hamburger)
3. CrÃ©er un footer avec liens utiles
4. Mettre en place le layout global Next.js
5. Assurer l'accessibilitÃ© et la navigation au clavier

---

## âœ… Acceptance Criteria

- [ ] Header avec logo Formelio visible et cliquable
- [ ] Navigation desktop avec liens vers toutes les pages
- [ ] Menu mobile fonctionnel avec animation smooth
- [ ] Footer avec sections: Ã€ propos, LÃ©gal, Contact
- [ ] Liens actifs stylisÃ©s diffÃ©remment
- [ ] Scroll smooth vers les sections
- [ ] Navigation au clavier fonctionnelle (Tab, Enter)
- [ ] Responsive testÃ© (mobile, tablet, desktop)
- [ ] Performance: LCP < 2.5s pour le header

---

## ðŸ”§ Technical Implementation

### 1. Structure du layout

```typescript
// app/layout.tsx
import { Inter, Poppins } from 'next/font/google';
import { Header } from '@/components/layouts/header';
import { Footer } from '@/components/layouts/footer';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen flex flex-col font-body">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
```

### 2. Header Component

```typescript
// components/layouts/header.tsx
'use client'

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Ã€ propos', href: '/a-propos' },
  { name: 'Services', href: '/#services' },
  { name: 'Contact', href: '/contact' },
] as const;

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8" aria-label="Navigation principale">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/formelio_logo.png"
            alt="Formelio"
            width={150}
            height={40}
            priority
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive(item.href) 
                  ? "text-primary font-semibold" 
                  : "text-gray-700"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA Desktop */}
        <div className="hidden md:flex md:items-center md:gap-x-4">
          <Button variant="outline" asChild>
            <Link href="/login">Se connecter</Link>
          </Button>
          <Button asChild>
            <Link href="/contact">DÃ©bloquer mon dossier</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Menu principal"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block rounded-md px-3 py-2 text-base font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t">
              <Button variant="outline" asChild className="w-full">
                <Link href="/login">Se connecter</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/contact">DÃ©bloquer mon dossier</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
```

### 3. Footer Component

```typescript
// components/layouts/footer.tsx
import Link from 'next/link';
import Image from 'next/image';

const footerLinks = {
  services: [
    { name: 'Dossiers rejetÃ©s', href: '/#services' },
    { name: 'FormalitÃ©s complexes', href: '/#services' },
    { name: 'Audit prÃ©ventif', href: '/#services' },
  ],
  company: [
    { name: 'Ã€ propos', href: '/a-propos' },
    { name: 'Contact', href: '/contact' },
    { name: 'Tarifs', href: '/#tarifs' },
  ],
  legal: [
    { name: 'Mentions lÃ©gales', href: '/mentions-legales' },
    { name: 'CGU', href: '/cgu' },
    { name: 'ConfidentialitÃ©', href: '/confidentialite' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo & Tagline */}
          <div className="md:col-span-1">
            <Image
              src="/formelio_logo.png"
              alt="Formelio"
              width={150}
              height={40}
              className="h-8 w-auto mb-4"
            />
            <p className="text-sm text-gray-600">
              Votre temps, notre prioritÃ©
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Entreprise</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">LÃ©gal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-gray-600">
            Â© {new Date().getFullYear()} Formelio. Tous droits rÃ©servÃ©s.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

### 4. Smooth scroll utility

```typescript
// lib/utils/scroll.ts
export function smoothScrollTo(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}

// Usage in components
<Link 
  href="/#services" 
  onClick={(e) => {
    e.preventDefault();
    smoothScrollTo('services');
  }}
>
  Services
</Link>
```

---

## ðŸ“— Dependencies

### Prerequisite
- âœ… COMMON-01: Project Setup
- âœ… COMMON-02: Design System
- âœ… Logo Formelio disponible (`/public/formelio_logo.png`)

### Bloquant pour
- âŒ P1-02: Homepage Hero (nÃ©cessite le header)
- âŒ Toutes les autres pages (utilisent le layout)

---

## ðŸ§ª Testing

### Tests manuels

```typescript
// tests/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('header is visible on all pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
    
    await page.goto('/a-propos');
    await expect(page.locator('header')).toBeVisible();
  });

  test('logo links to homepage', async ({ page }) => {
    await page.goto('/a-propos');
    await page.click('header img[alt="Formelio"]');
    await expect(page).toHaveURL('/');
  });

  test('mobile menu works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Menu closed by default
    await expect(page.locator('nav a:has-text("Ã€ propos")')).not.toBeVisible();
    
    // Open menu
    await page.click('button[aria-label="Menu principal"]');
    await expect(page.locator('nav a:has-text("Ã€ propos")')).toBeVisible();
    
    // Click link closes menu
    await page.click('nav a:has-text("Ã€ propos")');
    await expect(page.locator('nav a:has-text("Ã€ propos")')).not.toBeVisible();
  });

  test('active link is highlighted', async ({ page }) => {
    await page.goto('/a-propos');
    const activeLink = page.locator('nav a:has-text("Ã€ propos")');
    await expect(activeLink).toHaveClass(/font-semibold/);
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab'); // Focus logo
    await page.keyboard.press('Tab'); // Focus first nav link
    await page.keyboard.press('Enter'); // Should navigate
  });
});
```

---

## ðŸ“š Resources

- [Next.js App Router Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [Shadcn UI Button](https://ui.shadcn.com/docs/components/button)
- [Tailwind CSS Sticky Positioning](https://tailwindcss.com/docs/position#sticky)
- [ARIA Navigation Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/navigation/)

---

## âš ï¸ Potential Issues

### Issue 1: Logo ne s'affiche pas
**Symptom**: Image cassÃ©e ou non chargÃ©e  
**Solution**: VÃ©rifier que `/public/formelio_logo.png` existe et format correct

### Issue 2: Sticky header ne fonctionne pas
**Symptom**: Header scroll avec le contenu  
**Solution**: VÃ©rifier `position: sticky` et `top: 0` appliquÃ©s

### Issue 3: Menu mobile ne se ferme pas
**Symptom**: Menu reste ouvert aprÃ¨s clic sur lien  
**Solution**: Ajouter `onClick={() => setMobileMenuOpen(false)}` sur les liens

---

## ðŸ‘¤ Assignee

Frontend developer

---

## ðŸ Completion Checklist

- [ ] Header crÃ©Ã© avec logo et navigation
- [ ] Menu mobile fonctionnel
- [ ] Footer avec toutes les sections
- [ ] Liens actifs stylisÃ©s
- [ ] Responsive testÃ© (mobile, tablet, desktop)
- [ ] AccessibilitÃ© validÃ©e (navigation clavier)
- [ ] Tests E2E passent
- [ ] Performance: LCP < 2.5s
- [ ] Commit: `feat(landing): add homepage layout and navigation`
- [ ] PR vers `feature/phase1-landing`

---

**Estimated time**: 4 heures  
**Actual time**: ___ heures  
**Completed**: ___/___/2025
