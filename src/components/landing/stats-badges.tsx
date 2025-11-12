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
