import { CheckCircle2, FileSearch, MessageSquare, Shield } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

const services = [
  {
    icon: FileSearch,
    title: 'Déblocage de dossiers rejetés',
    description:
      'Expertise unique pour résoudre les rejets administratifs complexes',
  },
  {
    icon: Shield,
    title: 'Formalités complexes',
    description:
      'Restructurations, cas atypiques, situations administratives bloquées',
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
    <section id="services" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-heading font-bold">
            Les situations que nous résolvons
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Service spécialisé dans les formalités juridiques que les autres
            services ne peuvent pas traiter
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card
              key={service.title}
              className="transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <service.icon className="mb-4 h-12 w-12 text-primary" />
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
