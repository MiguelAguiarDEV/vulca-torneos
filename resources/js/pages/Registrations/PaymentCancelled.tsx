import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { XCircle } from 'lucide-react';

interface Tournament {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface Registration {
  id: number;
  user_id: number;
  tournament_id: number;
  status: string;
  payment_status: string;
  tournament: Tournament;
}

interface PaymentCancelledProps {
  registration: Registration;
  tournament: Tournament;
}

export default function PaymentCancelled({
  registration,
  tournament,
}: PaymentCancelledProps) {
  return (
    <>
      <Head title="Pago cancelado" />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                <XCircle className="h-10 w-10 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl">Pago cancelado</CardTitle>
              <CardDescription>
                El proceso de pago ha sido cancelado
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-lg bg-yellow-50 p-4">
                <p className="text-sm text-yellow-800">
                  No se ha procesado ningún cargo. Tu inscripción al torneo{' '}
                  <span className="font-semibold">{tournament.name}</span> está pendiente
                  de pago.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600">
                  Puedes intentar realizar el pago nuevamente cuando estés listo. Tu
                  reserva de inscripción se mantendrá activa.
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  Si tienes algún problema con el pago, no dudes en contactarnos para
                  obtener ayuda.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex gap-4">
              <Button asChild variant="outline" className="flex-1">
                <Link href={route('tournaments.show', tournament.slug)}>
                  Volver al torneo
                </Link>
              </Button>
              <Button
                asChild
                className="flex-1"
              >
                <Link href={route('registration.payment.checkout', registration.id)}>
                  Intentar de nuevo
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
