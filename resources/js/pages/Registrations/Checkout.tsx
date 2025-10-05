import { Head, router } from '@inertiajs/react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';

interface Tournament {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  entry_fee: string;
  formatted_entry_fee: string;
  start_date: string;
  end_date: string;
}

interface Registration {
  id: number;
  user_id: number;
  tournament_id: number;
  status: string;
  payment_status: string;
  payment_method: string | null;
  amount: string | null;
  tournament: Tournament;
}

interface CheckoutProps {
  registration: Registration;
  tournament: Tournament;
  stripePublicKey: string;
}

export default function Checkout({
  registration,
  tournament,
  stripePublicKey,
}: CheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // Crear sesión de checkout en el backend
      const response = await fetch(
        route('registration.payment.create-session', { registration: registration.id }),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document
              .querySelector('meta[name="csrf-token"]')
              ?.getAttribute('content') || '',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la sesión de pago');
      }

      // Redirigir a Stripe Checkout usando la URL directa
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No se recibió URL de pago');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setLoading(false);
    }
  };

  return (
    <>
      <Head title={`Pagar inscripción - ${tournament.name}`} />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Completar pago</CardTitle>
              <CardDescription>
                Finaliza tu inscripción al torneo {tournament.name}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {tournament.image && (
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    src={tournament.image}
                    alt={tournament.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold">{tournament.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{tournament.description}</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-gray-900">
                    Precio de inscripción
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {tournament.formatted_entry_fee}
                  </span>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <div className="mt-2 text-sm text-red-700">{error}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-md bg-blue-50 p-4">
                <p className="text-sm text-blue-700">
                  Serás redirigido a la pasarela de pago segura de Stripe para completar
                  tu inscripción.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => router.visit(route('tournaments.show', tournament.slug))}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button onClick={handleCheckout} disabled={loading} className="flex-1">
                {loading ? 'Procesando...' : 'Proceder al pago'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
