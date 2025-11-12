import { GraduationCap, Building2, Search, Handshake } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

const reasons = [
  {
    icon: GraduationCap,
    title: 'Formation juridique spécialisée',
    description: "Diplôme en droit de l'Université de Montpellier",
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
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-heading font-bold">
            Pourquoi Formelio réussit là où d&apos;autres échouent
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <Card
              key={reason.title}
              className="text-center transition-shadow hover:shadow-lg"
            >
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
