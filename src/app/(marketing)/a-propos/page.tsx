import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Hero */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-heading font-bold">
            Une expertise unique au service des professionnels
          </h1>
          <p className="text-xl text-gray-600">
            Ancien du greffe du tribunal de commerce, diplômé en droit de
            l&apos;Université de Montpellier
          </p>
        </div>

        {/* Parcours */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold">Parcours</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🎓 Formation juridique</CardTitle>
                <CardDescription>
                  Diplôme en droit de l&apos;Université de Montpellier,
                  spécialisation en droit des sociétés
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>🏛️ Expérience au greffe RCS</CardTitle>
                <CardDescription>
                  Plusieurs années au service du Registre du Commerce et des
                  Sociétés, connaissance approfondie des processus internes
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Expertise */}
        <section className="mb-16 rounded-lg bg-gray-50 p-8">
          <h2 className="mb-6 text-2xl font-semibold">
            Pourquoi Formelio réussit là où d&apos;autres échouent
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle2 className="mt-0.5 mr-3 h-6 w-6 flex-shrink-0 text-primary" />
              <div>
                <strong>Connaissance insider :</strong> Compréhension profonde
                des rouages administratifs du greffe
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="mt-0.5 mr-3 h-6 w-6 flex-shrink-0 text-primary" />
              <div>
                <strong>Divergences bases de données :</strong> Maîtrise des
                incohérences entre RNE, RCS et INSEE
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="mt-0.5 mr-3 h-6 w-6 flex-shrink-0 text-primary" />
              <div>
                <strong>Causes de rejet :</strong> Identification rapide des
                raisons de blocage
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
