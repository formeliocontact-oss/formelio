import type { Metadata } from 'next';
import { MarketingHeader } from '@/components/layout/marketing-header';
import { MarketingFooter } from '@/components/layout/marketing-footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://formelio.fr'),
  title: {
    default:
      'Formelio - Formalités juridiques complexes | Déblocage de dossiers',
    template: '%s | Formelio',
  },
  description:
    'Service spécialisé dans les formalités administratives et juridiques complexes. Expertise insider des greffes français pour débloquer vos dossiers rejetés.',
  keywords: [
    'formalités juridiques',
    'dossier rejeté',
    'greffe tribunal commerce',
    'RCS',
    'expert-comptable',
    'déblocage dossier',
    'formalités complexes',
  ],
  authors: [{ name: 'Formelio' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://formelio.fr',
    siteName: 'Formelio',
    title: 'Formelio - Déblocage de formalités juridiques',
    description:
      'Votre temps, notre priorité. Expertise unique pour résoudre les blocages administratifs.',
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
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingHeader />
      <main>{children}</main>
      <MarketingFooter />
    </>
  );
}
