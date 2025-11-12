import { Star } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Marie D.',
    role: 'Expert-comptable',
    content: "Formelio a débloqué notre dossier en 48h après 3 mois d'attente.",
    rating: 5,
  },
  {
    name: 'Jean-Pierre L.',
    role: 'Avocat',
    content: 'Leur connaissance du greffe fait toute la différence',
    rating: 5,
  },
  {
    name: 'Sophie M.',
    role: 'Notaire',
    content:
      'Service professionnel et réactif, vraiment experts dans leur domaine',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-heading font-bold">
          Ils nous font confiance
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="mb-2 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 italic text-gray-600">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
