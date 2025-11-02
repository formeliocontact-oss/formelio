# Phase 1 - Tasks complÃ¨tes (P1-03 Ã  P1-08)

Voici les 6 tasks restantes de Phase 1 en format condensÃ© mais avec toutes les informations nÃ©cessaires.

---

## P1-03 - Homepage Services Section

**ID**: P1-03 | **Phase**: 1 | **Priority**: P0 | **Effort**: 5h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase1-landing`

### Description
Section prÃ©sentant les 3-4 services principaux de Formelio avec icÃ´nes, titres et descriptions.

### Acceptance Criteria
- [ ] 4 cards de services responsives
- [ ] IcÃ´nes pertinentes (Lucide React)
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
    title: 'DÃ©blocage de dossiers rejetÃ©s',
    description: 'Expertise unique pour rÃ©soudre les rejets administratifs complexes',
  },
  {
    icon: Shield,
    title: 'FormalitÃ©s complexes',
    description: 'Restructurations, cas atypiques, situations administratives bloquÃ©es',
  },
  {
    icon: CheckCircle2,
    title: 'Audit prÃ©ventif',
    description: 'RÃ©solution des problÃ¨mes AVANT soumission aux greffes',
  },
  {
    icon: MessageSquare,
    title: 'Communication directe',
    description: 'Relations privilÃ©giÃ©es avec les registres (RNE, RCS, INSEE)',
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Les situations que nous rÃ©solvons
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Service spÃ©cialisÃ© dans les formalitÃ©s juridiques que les autres services ne peuvent pas traiter
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
- âœ… P1-01: Layout (structure)
- âœ… COMMON-02: Design System

---

## P1-04 - Homepage Process & CTA

**ID**: P1-04 | **Phase**: 1 | **Priority**: P0 | **Effort**: 4h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase1-landing`

### Description
Section expliquant le processus en 4 Ã©tapes + CTA final pour convertir les visiteurs.

### Acceptance Criteria
- [ ] Timeline visuelle en 4 Ã©tapes
- [ ] NumÃ©rotation claire (1, 2, 3, 4)
- [ ] Responsive (vertical mobile, horizontal desktop)
- [ ] CTA section avec 2 boutons (Contact + Ã€ propos)
- [ ] Animations au scroll

### Implementation
```typescript
// components/landing/process-section.tsx
const steps = [
  {
    number: 1,
    title: 'Analyse du dossier',
    description: 'Nous Ã©tudions votre situation et identifions les blocages',
  },
  {
    number: 2,
    title: 'Identification des causes',
    description: 'Expertise insider pour comprendre les raisons du rejet',
  },
  {
    number: 3,
    title: 'RÃ©solution et soumission',
    description: 'Correction des problÃ¨mes et communication directe avec les registres',
  },
  {
    number: 4,
    title: 'Suivi jusqu\'Ã  validation',
    description: 'Accompagnement complet jusqu\'Ã  la validation finale',
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
          Votre dossier est bloquÃ© ?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Ne perdez plus de temps. Notre expertise unique dÃ©bloque les situations les plus complexes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/contact">DÃ©bloquer mon dossier</Link>
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

**ID**: P1-05 | **Phase**: 1 | **Priority**: P1 | **Effort**: 3h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase1-landing`

### Description
Page "Ã€ propos" prÃ©sentant le fondateur, son expertise, et la mission de Formelio.

### Acceptance Criteria
- [ ] Section hero avec titre et intro
- [ ] Section parcours (diplÃ´me, expÃ©rience greffe)
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
            Ancien du greffe du tribunal de commerce, diplÃ´mÃ© en droit de l'UniversitÃ© de Montpellier
          </p>
        </div>

        {/* Parcours */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Parcours</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>ðŸŽ“ Formation juridique</CardTitle>
                <CardDescription>
                  DiplÃ´me en droit de l'UniversitÃ© de Montpellier, spÃ©cialisation en droit des sociÃ©tÃ©s
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>ðŸ›ï¸ ExpÃ©rience au greffe RCS</CardTitle>
                <CardDescription>
                  Plusieurs annÃ©es au service du Registre du Commerce et des SociÃ©tÃ©s, connaissance approfondie des processus internes
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Expertise */}
        <section className="mb-16 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Pourquoi Formelio rÃ©ussit lÃ  oÃ¹ d'autres Ã©chouent</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle2 className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Connaissance insider :</strong> ComprÃ©hension profonde des rouages administratifs du greffe
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Divergences bases de donnÃ©es :</strong> MaÃ®trise des incohÃ©rences entre RNE, RCS et INSEE
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

**ID**: P1-06 | **Phase**: 1 | **Priority**: P0 | **Effort**: 6h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase1-landing`

### Description
Page contact avec formulaire structurÃ©, validation Zod, et option d'upload de document.

### Acceptance Criteria
- [ ] Formulaire avec 8 champs (nom, email, tÃ©l, profession, type problÃ¨me, message, fichier optionnel)
- [ ] Validation Zod cÃ´tÃ© client
- [ ] Upload PDF optionnel (max 10MB)
- [ ] Messages de succÃ¨s/erreur
- [ ] Email transactionnel envoyÃ© (Resend ou similaire)
- [ ] Responsive et accessible

### Implementation
```typescript
// lib/validations/contact.ts
import { z } from 'zod';

export const contactFormSchema = z.object({
  firstName: z.string().min(2, 'PrÃ©nom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().regex(/^0[1-9][0-9]{8}$/, 'TÃ©lÃ©phone invalide'),
  profession: z.enum(['expert-comptable', 'avocat', 'notaire', 'autre']),
  problemType: z.enum(['rejected', 'complex', 'question', 'other']),
  message: z.string().min(20, 'Message trop court (min 20 caractÃ¨res)'),
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

      toast.success('Message envoyÃ© ! Nous vous rÃ©pondrons sous 24h.');
      form.reset();
    } catch (error) {
      toast.error('Erreur lors de l\'envoi. Veuillez rÃ©essayer.');
    }
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-heading font-bold mb-4 text-center">
          Contactez-nous
        </h1>
        <p className="text-center text-gray-600 mb-12">
          DÃ©crivez votre situation, nous vous rÃ©pondons sous 24h
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PrÃ©nom</FormLabel>
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
// TODO: IntÃ©grer Resend pour email transactionnel

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

**ID**: P1-07 | **Phase**: 1 | **Priority**: P1 | **Effort**: 4h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase1-landing`

### Description
CrÃ©er les 3 pages lÃ©gales obligatoires : Mentions lÃ©gales, CGU, Politique de confidentialitÃ© (RGPD).

### Acceptance Criteria
- [ ] Page Mentions lÃ©gales (Ã©diteur, hÃ©bergeur, SIRET)
- [ ] Page CGU (conditions d'utilisation)
- [ ] Page ConfidentialitÃ© (RGPD conforme)
- [ ] Structure markdown lisible
- [ ] Liens depuis le footer
- [ ] SEO optimisÃ©

### Implementation
```typescript
// app/(marketing)/mentions-legales/page.tsx
export default function LegalNoticePage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-4xl prose prose-gray">
        <h1>Mentions lÃ©gales</h1>
        
        <h2>Ã‰diteur du site</h2>
        <p>
          <strong>Raison sociale :</strong> Formelio<br />
          <strong>SIRET :</strong> [Ã€ COMPLÃ‰TER]<br />
          <strong>Adresse :</strong> [Ã€ COMPLÃ‰TER]<br />
          <strong>Email :</strong> contact@formelio.fr<br />
        </p>

        <h2>Directeur de la publication</h2>
        <p>[Nom du fondateur]</p>

        <h2>HÃ©bergement</h2>
        <p>
          <strong>HÃ©bergeur :</strong> Vercel Inc.<br />
          <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA<br />
        </p>

        <h2>PropriÃ©tÃ© intellectuelle</h2>
        <p>
          L'ensemble du contenu de ce site (textes, images, logos) est la propriÃ©tÃ© exclusive de Formelio...
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
        <h1>Conditions GÃ©nÃ©rales d'Utilisation (CGU)</h1>
        
        <h2>1. Objet</h2>
        <p>
          Les prÃ©sentes conditions gÃ©nÃ©rales d'utilisation (CGU) ont pour objet de dÃ©finir...
        </p>

        <h2>2. AccÃ¨s au site</h2>
        <p>
          Le site formelio.fr est accessible gratuitement...
        </p>

        <h2>3. Services proposÃ©s</h2>
        <p>
          Formelio propose des services de formalitÃ©s juridiques...
        </p>

        <h2>4. ResponsabilitÃ©s</h2>
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
        <h1>Politique de ConfidentialitÃ©</h1>
        
        <p className="lead">
          ConformÃ©ment au RÃ¨glement GÃ©nÃ©ral sur la Protection des DonnÃ©es (RGPD)...
        </p>

        <h2>1. DonnÃ©es collectÃ©es</h2>
        <p>Nous collectons les donnÃ©es suivantes :</p>
        <ul>
          <li>DonnÃ©es d'identification (nom, prÃ©nom, email)</li>
          <li>DonnÃ©es professionnelles (profession, entreprise)</li>
          <li>Documents fournis volontairement</li>
        </ul>

        <h2>2. FinalitÃ© du traitement</h2>
        <p>Les donnÃ©es sont utilisÃ©es pour :</p>
        <ul>
          <li>Traiter vos demandes de formalitÃ©s</li>
          <li>GÃ©rer votre compte client</li>
          <li>Vous informer de l'avancement de vos dossiers</li>
        </ul>

        <h2>3. Vos droits (RGPD)</h2>
        <p>Vous disposez des droits suivants :</p>
        <ul>
          <li>Droit d'accÃ¨s Ã  vos donnÃ©es</li>
          <li>Droit de rectification</li>
          <li>Droit Ã  l'effacement</li>
          <li>Droit Ã  la portabilitÃ©</li>
          <li>Droit d'opposition</li>
        </ul>

        <p>
          Pour exercer vos droits : <a href="mailto:contact@formelio.fr">contact@formelio.fr</a>
        </p>

        <h2>4. HÃ©bergement des donnÃ©es</h2>
        <p>
          Vos donnÃ©es sont hÃ©bergÃ©es en Europe (rÃ©gion EU-Central-1) par Supabase...
        </p>

        <h2>5. Cookies</h2>
        <p>
          Notre site utilise des cookies strictement nÃ©cessaires au fonctionnement...
        </p>
      </div>
    </div>
  );
}
```

---

## P1-08 - SEO & Performance Optimization

**ID**: P1-08 | **Phase**: 1 | **Priority**: P1 | **Effort**: 5h | **Status**: ðŸ”´ TODO  
**Branch**: `feature/phase1-landing`

### Description
Optimiser le SEO et les performances du site (meta tags, sitemap, images, Core Web Vitals).

### Acceptance Criteria
- [ ] Meta tags sur toutes les pages
- [ ] Sitemap.xml gÃ©nÃ©rÃ©
- [ ] Robots.txt configurÃ©
- [ ] Images optimisÃ©es (WebP, lazy loading)
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
    default: 'Formelio - FormalitÃ©s juridiques complexes | DÃ©blocage de dossiers',
    template: '%s | Formelio',
  },
  description: 'Service spÃ©cialisÃ© dans les formalitÃ©s administratives et juridiques complexes. Expertise insider des greffes franÃ§ais pour dÃ©bloquer vos dossiers rejetÃ©s.',
  keywords: ['formalitÃ©s juridiques', 'dossier rejetÃ©', 'greffe tribunal commerce', 'RCS', 'expert-comptable'],
  authors: [{ name: 'Formelio' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://formelio.fr',
    siteName: 'Formelio',
    title: 'Formelio - DÃ©blocage de formalitÃ©s juridiques',
    description: 'Votre temps, notre prioritÃ©. Expertise unique pour rÃ©soudre les blocages administratifs.',
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
    title: 'Formelio - FormalitÃ©s juridiques',
    description: 'Service spÃ©cialisÃ© dans le dÃ©blocage de dossiers complexes',
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
    description: 'Service spÃ©cialisÃ© dans les formalitÃ©s juridiques complexes',
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

**Total Phase 1**: 8 tasks, 41 heures  
**Branch unique**: `feature/phase1-landing`  
**Merge vers develop**: AprÃ¨s validation complÃ¨te

