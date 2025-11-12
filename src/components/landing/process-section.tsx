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
    description:
      'Correction des problèmes et communication directe avec les registres',
  },
  {
    number: 4,
    title: "Suivi jusqu'à validation",
    description: "Accompagnement complet jusqu'à la validation finale",
  },
];

export function ProcessSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-heading font-bold">
          Comment nous débloquerons votre dossier
        </h2>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Connecting line (desktop only) */}
          <div className="absolute left-0 right-0 top-8 hidden h-0.5 bg-primary/20 md:block" />

          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                  {step.number}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
