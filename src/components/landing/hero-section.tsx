import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Logo chevrons décoratif */}
          <div className="mb-6 flex justify-center">
            <svg
              className="h-16 w-16 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
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
            Service spécialisé dans les formalités juridiques complexes et les
            dossiers rejetés.
            <br />
            Expertise insider des greffes français.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="min-w-[200px]">
              <Link href="/contact">Débloquer mon dossier</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="min-w-[200px]"
            >
              <Link href="/a-propos">En savoir plus</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
