import { HeroSection } from '@/components/landing/hero-section';
import { WhyFormelioSection } from '@/components/landing/why-formelio-section';
import { StatsBadges } from '@/components/landing/stats-badges';
import { ServicesSection } from '@/components/landing/services-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
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
