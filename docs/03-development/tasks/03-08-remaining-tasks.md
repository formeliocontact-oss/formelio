# Phase 1 - Landing Page (P1-01 à P1-08)

Voici les 8 tasks de Phase 1 en format condensé mais avec toutes les informations nécessaires.

---

## P1-01 - Layout & Navigation (Header + Footer)

**ID**: P1-01 | **Phase**: 1 | **Priority**: P0 | **Effort**: 6h | **Status**: 🔴 TODO
**Branch**: `feature/phase1-landing`

### Description
Créer la structure de layout marketing avec header (navigation + logo) et footer (liens + contact + copyright).

### Acceptance Criteria
- [ ] Header avec logo Formelio (SVG)
- [ ] Navigation: Accueil, À propos, Services, Contact
- [ ] Boutons: Inscription, Connexion (liens vers auth)
- [ ] Responsive: menu burger mobile
- [ ] Footer avec 3 colonnes: Liens rapides, Contact, Copyright
- [ ] Sticky header au scroll (optionnel)
- [ ] Accessible (ARIA labels)

### Implementation
```typescript
// components/layout/marketing-header.tsx
'use client'

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MarketingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'À propos', href: '/a-propos' },
    { name: 'Services', href: '/#services' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Icône chevrons >> style Formelio */}
            <path
              d="M5 12L10 7L11.5 8.5L8 12L11.5 15.5L10 17L5 12Z"
              fill="currentColor"
            />
            <path
              d="M13 12L18 7L19.5 8.5L16 12L19.5 15.5L18 17L13 12Z"
              fill="currentColor"
            />
          </svg>
          <span className="text-xl font-heading font-bold">FORMELIO</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/signup">Inscription</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Connexion</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t bg-white md:hidden">
          <div className="container mx-auto space-y-1 px-4 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="outline" asChild className="w-full">
                <Link href="/signup">Inscription</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/login">Connexion</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// components/layout/marketing-footer.tsx
import Link from 'next/link';

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Colonne 1: Liens rapides */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/a-propos" className="hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 2: Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:contact@formelio.fr"
                  className="hover:text-white transition-colors"
                >
                  Email: contact@formelio.fr
                </a>
              </li>
              <li className="text-gray-500">Phone: to be added</li>
              <li className="text-gray-500">Address: to be added</li>
            </ul>
          </div>

          {/* Colonne 3: Logo + Tagline */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <svg
                className="h-8 w-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12L10 7L11.5 8.5L8 12L11.5 15.5L10 17L5 12Z"
                  fill="currentColor"
                />
                <path
                  d="M13 12L18 7L19.5 8.5L16 12L19.5 15.5L18 17L13 12Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-xl font-heading font-bold text-white">FORMELIO</span>
            </div>
            <p className="text-sm italic">Votre temps, notre priorité</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm">
          <p>© {currentYear} Formelio. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

// app/(marketing)/layout.tsx
import { MarketingHeader } from '@/components/layout/marketing-header';
import { MarketingFooter } from '@/components/layout/marketing-footer';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingHeader />
      <main>{children}</main>
      <MarketingFooter />
    </>
  );
}
```

### Dependencies
- ✅ COMMON-02: Design System (Button, colors)
- ✅ Lucide React (Menu, X icons)

---

## P1-02 - Homepage Hero & Why Section

**ID**: P1-02 | **Phase**: 1 | **Priority**: P0 | **Effort**: 8h | **Status**: 🔴 TODO
**Branch**: `feature/phase1-landing`

### Description
Créer la page d'accueil avec hero, section "Pourquoi Formelio réussit", témoignages clients et badges stats.

### Acceptance Criteria
- [ ] Hero section: titre H1 + sous-titre + CTA primaire
- [ ] Background gradient ou image (optionnel)
- [ ] Section "Pourquoi Formelio" avec 4 cards (Formation, Expérience, Connaissance, Relations)
- [ ] Témoignages: 3 cards avec nom, profession, étoiles
- [ ] Stats badges: 3 badges (100%, 24h, Anciens greffe)
- [ ] Responsive et animations
- [ ] Structured data pour SEO

### Implementation
```typescript
// components/landing/hero-section.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Logo chevrons décoratif (optionnel) */}
          <div className="mb-6 flex justify-center">
            <svg
              className="h-16 w-16 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12L10 7L11.5 8.5L8 12L11.5 15.5L10 17L5 12Z"
                fill="currentColor"
              />
              <path
                d="M13 12L18 7L19.5 8.5L16 12L19.5 15.5L18 17L13 12Z"
                fill="currentColor"
              />
            </svg>
          </div>

          <h1 className="mb-6 text-4xl font-heading font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
            Votre dossier est bloqué ?<br />
            <span className="text-primary">Nous le débloquerons.</span>
          </h1>

          <p className="mb-8 text-lg text-gray-600 md:text-xl">
            Service spécialisé dans les formalités juridiques complexes et les dossiers rejetés.
            <br />
            Expertise insider des greffes français.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="min-w-[200px]">
              <Link href="/contact">Débloquer mon dossier</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="min-w-[200px]">
              <Link href="/a-propos">En savoir plus</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// components/landing/why-formelio-section.tsx
import { GraduationCap, Building2, Search, Handshake } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const reasons = [
  {
    icon: GraduationCap,
    title: 'Formation juridique spécialisée',
    description: 'Diplôme en droit de l\'Université de Montpellier',
  },
  {
    icon: Building2,
    title: 'Expérience au greffe RCS',
    description: 'Anciens du service RCS du tribunal de commerce',
  },
  {
    icon: Search,
    title: 'Connaissance des causes de rejet',
    description: 'Expertise approfondie des divergences RNE/RCS/INSEE',
  },
  {
    icon: Handshake,
    title: 'Relations directes avec les registres',
    description: 'Communication privilégiée pour débloquer les situations',
  },
];

export function WhyFormelioSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Pourquoi Formelio réussit là où d'autres échouent
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <Card key={reason.title} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <reason.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">{reason.title}</CardTitle>
                <CardDescription>{reason.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// components/landing/testimonials-section.tsx
import { Star } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Marie D.',
    role: 'Expert-comptable',
    content: 'Formelio a débloqué notre dossier en 48h après 3 mois d\'attente.',
    rating: 5,
  },
  {
    name: 'Jean-Pierre L.',
    role: 'Avocat',
    content: 'Leur connaissance du greffe fait toute la différence',
    rating: 5,
  },
  {
    name: 'Sophie M.',
    role: 'Notaire',
    content: 'Service professionnel et réactif, vraiment experts dans leur domaine',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-heading font-bold">
          Ils nous font confiance
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-2 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 italic text-gray-600">"{testimonial.content}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// components/landing/stats-badges.tsx
import { CheckCircle2, Clock, Shield } from 'lucide-react';

const stats = [
  {
    icon: CheckCircle2,
    label: '100% de dossiers débloqués',
    color: 'text-green-600',
  },
  {
    icon: Clock,
    label: 'Réponse sous 24h',
    color: 'text-blue-600',
  },
  {
    icon: Shield,
    label: 'Anciens du greffe RCS',
    color: 'text-primary',
  },
];

export function StatsBadges() {
  return (
    <section className="border-y bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <span className="font-semibold text-gray-900">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// app/(marketing)/page.tsx
import { HeroSection } from '@/components/landing/hero-section';
import { WhyFormelioSection } from '@/components/landing/why-formelio-section';
import { StatsBadges } from '@/components/landing/stats-badges';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { ServicesSection } from '@/components/landing/services-section';
import { ProcessSection } from '@/components/landing/process-section';
import { CTASection } from '@/components/landing/cta-section';

export default function HomePage() {
  // Structured data pour SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Formelio',
    url: 'https://formelio.fr',
    logo: 'https://formelio.fr/formelio_logo.png',
    description: 'Service spécialisé dans les formalités juridiques complexes',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@formelio.fr',
      contactType: 'Customer Service',
      areaServed: 'FR',
      availableLanguage: 'French',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HeroSection />
      <WhyFormelioSection />
      <StatsBadges />
      <ServicesSection />
      <TestimonialsSection />
      <ProcessSection />
      <CTASection />
    </>
  );
}
```

### Dependencies
- ✅ P1-01: Layout (Header + Footer structure)
- ✅ COMMON-02: Design System

---

## P1-03 - Homepage Services Section

**ID**: P1-03 | **Phase**: 1 | **Priority**: P0 | **Effort**: 5h | **Status**: 🔴 TODO
**Branch**: `feature/phase1-landing`

### Description
Section présentant les 3-4 services principaux de Formelio avec icônes, titres et descriptions.

### Acceptance Criteria
- [ ] 4 cards de services responsives
- [ ] Icônes pertinentes (Lucide React)
- [ ] Hover effects sur les cards
- [ ] Grid layout responsive (1/2/4 colonnes)
- [ ] Animations smooth au scroll

### Implementation
```typescript
// components/landing/services-section.tsx
'use client'

import { CheckCircle2, FileSearch, MessageSquare, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const services = [
  {
    icon: FileSearch,
    title: 'Déblocage de dossiers rejetés',
    description: 'Expertise unique pour résoudre les rejets administratifs complexes',
  },
  {
    icon: Shield,
    title: 'Formalités complexes',
    description: 'Restructurations, cas atypiques, situations administratives bloquées',
  },
  {
    icon: CheckCircle2,
    title: 'Audit préventif',
    description: 'Résolution des problèmes AVANT soumission aux greffes',
  },
  {
    icon: MessageSquare,
    title: 'Communication directe',
    description: 'Relations privilégiées avec les registres (RNE, RCS, INSEE)',
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Les situations que nous résolvons
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Service spécialisé dans les formalités juridiques que les autres services ne peuvent pas traiter
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Card key={service.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <service.icon className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Dependencies
- ✅ P1-01: Layout (structure)
- ✅ COMMON-02: Design System

---

## P1-04 - Homepage Process & CTA

**ID**: P1-04 | **Phase**: 1 | **Priority**: P0 | **Effort**: 4h | **Status**: 🔴 TODO
**Branch**: `feature/phase1-landing`

### Description
Section expliquant le processus en 4 étapes + CTA final pour convertir les visiteurs.

### Acceptance Criteria
- [ ] Timeline visuelle en 4 étapes
- [ ] Numérotation claire (1, 2, 3, 4)
- [ ] Responsive (vertical mobile, horizontal desktop)
- [ ] CTA section avec 2 boutons (Contact + À propos)
- [ ] Animations au scroll

### Implementation
```typescript
// components/landing/process-section.tsx
const steps = [
  {
    number: 1,
    title: 'Analyse du dossier',
    description: 'Nous étudions votre situation et identifions les blocages',
  },
  {
    number: 2,
    title: 'Identification des causes',
    description: 'Expertise insider pour comprendre les raisons du rejet',
  },
  {
    number: 3,
    title: 'Résolution et soumission',
    description: 'Correction des problèmes et communication directe avec les registres',
  },
  {
    number: 4,
    title: 'Suivi jusqu\'à validation',
    description: 'Accompagnement complet jusqu\'à la validation finale',
  },
];

export function ProcessSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-12">
          Notre processus
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-primary/20" />

          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4 relative z-10">
                  {step.number}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// components/landing/cta-section.tsx
export function CTASection() {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-heading font-bold mb-4">
          Votre dossier est bloqué ?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Ne perdez plus de temps. Notre expertise unique débloque les situations les plus complexes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/contact">Débloquer mon dossier</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white/10">
            <Link href="/a-propos">En savoir plus</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
```

---

## P1-05 - About Page

**ID**: P1-05 | **Phase**: 1 | **Priority**: P1 | **Effort**: 3h | **Status**: 🔴 TODO
**Branch**: `feature/phase1-landing`

### Description
Page "À propos" présentant le fondateur, son expertise, et la mission de Formelio.

### Acceptance Criteria
- [ ] Section hero avec titre et intro
- [ ] Section parcours (diplôme, expérience greffe)
- [ ] Section expertise (insider knowledge)
- [ ] Section mission et valeurs
- [ ] Timeline professionnelle
- [ ] CTA vers contact

### Implementation
```typescript
// app/(marketing)/a-propos/page.tsx
export default function AboutPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-heading font-bold mb-4">
            Une expertise unique au service des professionnels
          </h1>
          <p className="text-xl text-gray-600">
            Ancien du greffe du tribunal de commerce, diplômé en droit de l'Université de Montpellier
          </p>
        </div>

        {/* Parcours */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Parcours</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🎓 Formation juridique</CardTitle>
                <CardDescription>
                  Diplôme en droit de l'Université de Montpellier, spécialisation en droit des sociétés
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>🏛️ Expérience au greffe RCS</CardTitle>
                <CardDescription>
                  Plusieurs années au service du Registre du Commerce et des Sociétés, connaissance approfondie des processus internes
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Expertise */}
        <section className="mb-16 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Pourquoi Formelio réussit là où d'autres échouent</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle2 className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Connaissance insider :</strong> Compréhension profonde des rouages administratifs du greffe
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Divergences bases de données :</strong> Maîtrise des incohérences entre RNE, RCS et INSEE
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Causes de rejet :</strong> Identification rapide des raisons de blocage
              </div>
            </li>
          </ul>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/contact">Discutons de votre situation</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

## P1-06 - Contact Page & Form

**ID**: P1-06 | **Phase**: 1 | **Priority**: P0 | **Effort**: 6h | **Status**: 🔴 TODO
**Branch**: `feature/phase1-landing`

### Description
Page contact avec formulaire structuré, validation Zod, et option d'upload de document.

### Acceptance Criteria
- [ ] Formulaire avec 8 champs (nom, email, tél, profession, type problème, message, fichier optionnel)
- [ ] Validation Zod côté client
- [ ] Upload PDF optionnel (max 10MB)
- [ ] Messages de succès/erreur
- [ ] Email transactionnel envoyé (Resend ou similaire)
- [ ] Responsive et accessible

### Implementation
```typescript
// lib/validations/contact.ts
import { z } from 'zod';

export const contactFormSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().regex(/^0[1-9][0-9]{8}$/, 'Téléphone invalide'),
  profession: z.enum(['expert-comptable', 'avocat', 'notaire', 'autre']),
  problemType: z.enum(['rejected', 'complex', 'question', 'other']),
  message: z.string().min(20, 'Message trop court (min 20 caractères)'),
  file: z.instanceof(File).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// app/(marketing)/contact/page.tsx
'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { contactFormSchema, type ContactFormData } from '@/lib/validations/contact';
import { toast } from 'sonner';

export default function ContactPage() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  async function onSubmit(data: ContactFormData) {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Erreur lors de l\'envoi');

      toast.success('Message envoyé ! Nous vous répondrons sous 24h.');
      form.reset();
    } catch (error) {
      toast.error('Erreur lors de l\'envoi. Veuillez réessayer.');
    }
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-heading font-bold mb-4 text-center">
          Contactez-nous
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Décrivez votre situation, nous vous répondons sous 24h
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email, Phone, Profession, ProblemType fields... */}

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea rows={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Document (optionnel, PDF max 10MB)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => onChange(e.target.files?.[0])}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Envoi...' : 'Envoyer le message'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validations/contact';
// TODO: Intégrer Resend pour email transactionnel

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const validated = contactFormSchema.parse(data);

    // TODO: Save to database
    // TODO: Send email notification

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
```

---

## P1-07 - Legal Pages

**ID**: P1-07 | **Phase**: 1 | **Priority**: P1 | **Effort**: 4h | **Status**: 🔴 TODO
**Branch**: `feature/phase1-landing`

### Description
Créer les 3 pages légales obligatoires : Mentions légales, CGU, Politique de confidentialité (RGPD).

### Acceptance Criteria
- [ ] Page Mentions légales (éditeur, hébergeur, SIRET)
- [ ] Page CGU (conditions d'utilisation)
- [ ] Page Confidentialité (RGPD conforme)
- [ ] Structure markdown lisible
- [ ] Liens depuis le footer
- [ ] SEO optimisé

### Implementation
```typescript
// app/(marketing)/mentions-legales/page.tsx
export default function LegalNoticePage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-4xl prose prose-gray">
        <h1>Mentions légales</h1>

        <h2>Éditeur du site</h2>
        <p>
          <strong>Raison sociale :</strong> Formelio<br />
          <strong>SIRET :</strong> [À COMPLÉTER]<br />
          <strong>Adresse :</strong> [À COMPLÉTER]<br />
          <strong>Email :</strong> contact@formelio.fr<br />
        </p>

        <h2>Directeur de la publication</h2>
        <p>[Nom du fondateur]</p>

        <h2>Hébergement</h2>
        <p>
          <strong>Hébergeur :</strong> Vercel Inc.<br />
          <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA<br />
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L'ensemble du contenu de ce site (textes, images, logos) est la propriété exclusive de Formelio...
        </p>
      </div>
    </div>
  );
}

// app/(marketing)/cgu/page.tsx
export default function TosPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-4xl prose prose-gray">
        <h1>Conditions Générales d'Utilisation (CGU)</h1>

        <h2>1. Objet</h2>
        <p>
          Les présentes conditions générales d'utilisation (CGU) ont pour objet de définir...
        </p>

        <h2>2. Accès au site</h2>
        <p>
          Le site formelio.fr est accessible gratuitement...
        </p>

        <h2>3. Services proposés</h2>
        <p>
          Formelio propose des services de formalités juridiques...
        </p>

        <h2>4. Responsabilités</h2>
        {/* ... */}
      </div>
    </div>
  );
}

// app/(marketing)/confidentialite/page.tsx
export default function PrivacyPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-4xl prose prose-gray">
        <h1>Politique de Confidentialité</h1>

        <p className="lead">
          Conformément au Règlement Général sur la Protection des Données (RGPD)...
        </p>

        <h2>1. Données collectées</h2>
        <p>Nous collectons les données suivantes :</p>
        <ul>
          <li>Données d'identification (nom, prénom, email)</li>
          <li>Données professionnelles (profession, entreprise)</li>
          <li>Documents fournis volontairement</li>
        </ul>

        <h2>2. Finalité du traitement</h2>
        <p>Les données sont utilisées pour :</p>
        <ul>
          <li>Traiter vos demandes de formalités</li>
          <li>Gérer votre compte client</li>
          <li>Vous informer de l'avancement de vos dossiers</li>
        </ul>

        <h2>3. Vos droits (RGPD)</h2>
        <p>Vous disposez des droits suivants :</p>
        <ul>
          <li>Droit d'accès à vos données</li>
          <li>Droit de rectification</li>
          <li>Droit à l'effacement</li>
          <li>Droit à la portabilité</li>
          <li>Droit d'opposition</li>
        </ul>

        <p>
          Pour exercer vos droits : <a href="mailto:contact@formelio.fr">contact@formelio.fr</a>
        </p>

        <h2>4. Hébergement des données</h2>
        <p>
          Vos données sont hébergées en Europe (région EU-Central-1) par Supabase...
        </p>

        <h2>5. Cookies</h2>
        <p>
          Notre site utilise des cookies strictement nécessaires au fonctionnement...
        </p>
      </div>
    </div>
  );
}
```

---

## P1-08 - SEO & Performance Optimization

**ID**: P1-08 | **Phase**: 1 | **Priority**: P1 | **Effort**: 5h | **Status**: 🔴 TODO
**Branch**: `feature/phase1-landing`

### Description
Optimiser le SEO et les performances du site (meta tags, sitemap, images, Core Web Vitals).

### Acceptance Criteria
- [ ] Meta tags sur toutes les pages
- [ ] Sitemap.xml généré
- [ ] Robots.txt configuré
- [ ] Images optimisées (WebP, lazy loading)
- [ ] PageSpeed score > 80 (mobile & desktop)
- [ ] Core Web Vitals dans le vert
- [ ] Structured data (Schema.org)

### Implementation
```typescript
// app/(marketing)/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://formelio.fr'),
  title: {
    default: 'Formelio - Formalités juridiques complexes | Déblocage de dossiers',
    template: '%s | Formelio',
  },
  description: 'Service spécialisé dans les formalités administratives et juridiques complexes. Expertise insider des greffes français pour débloquer vos dossiers rejetés.',
  keywords: ['formalités juridiques', 'dossier rejeté', 'greffe tribunal commerce', 'RCS', 'expert-comptable'],
  authors: [{ name: 'Formelio' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://formelio.fr',
    siteName: 'Formelio',
    title: 'Formelio - Déblocage de formalités juridiques',
    description: 'Votre temps, notre priorité. Expertise unique pour résoudre les blocages administratifs.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Formelio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Formelio - Formalités juridiques',
    description: 'Service spécialisé dans le déblocage de dossiers complexes',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'TODO_GOOGLE_VERIFICATION',
  },
};

// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://formelio.fr';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}

// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/'],
    },
    sitemap: 'https://formelio.fr/sitemap.xml',
  };
}

// Structured data
// app/(marketing)/page.tsx
export default function HomePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Formelio',
    url: 'https://formelio.fr',
    logo: 'https://formelio.fr/formelio_logo.png',
    description: 'Service spécialisé dans les formalités juridiques complexes',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@formelio.fr',
      contactType: 'Customer Service',
      areaServed: 'FR',
      availableLanguage: 'French',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Page content */}
    </>
  );
}

// next.config.js - Image optimization
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 60,
  },
};
```

### Testing performance
```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --collect.url=http://localhost:3000

# Bundle analyzer
npm install --save-dev @next/bundle-analyzer
```

---

**Total Phase 1**: 8 tasks, 47 heures
**Branch unique**: `feature/phase1-landing`
**Merge vers develop**: Après validation complète
