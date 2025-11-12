import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="bg-primary py-20 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-3xl font-heading font-bold">
          Prêt à débloquer votre situation ?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
          Contactez-nous dès aujourd&apos;hui pour une première analyse gratuite
          de votre dossier.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/contact">Débloquer mon dossier</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-white text-white hover:bg-white/10"
          >
            <Link href="/a-propos">En savoir plus</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
