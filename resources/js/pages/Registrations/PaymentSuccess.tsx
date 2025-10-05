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
import { CheckCircle } from 'lucide-react';

interface Tournament {
  id: number;
  name: string;
  slug: string;
  description: string;
  start_date: string;
  end_date: string;
}

interface Registration {
  id: number;
  user_id: number;
  tournament_id: number;
  status: string;
  payment_status: string;
  tournament: Tournament;
}

interface PaymentSuccessProps {
  registration: Registration;
  tournament: Tournament;
}

export default function PaymentSuccess({
  registration,
  tournament,
}: PaymentSuccessProps) {
  return (
    <>
      <Head title="Pago completado" />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl">¡Pago completado!</CardTitle>
              <CardDescription>
                Tu inscripción ha sido confirmada con éxito
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm font-medium text-green-800">
                  Te has inscrito exitosamente al torneo
                </p>
                <p className="mt-1 text-lg font-semibold text-green-900">
                  {tournament.name}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <dl className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-600">Estado de inscripción:</dt>
                    <dd className="font-medium text-green-600">Confirmada</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-600">Estado de pago:</dt>
                    <dd className="font-medium text-green-600">Pagado</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-600">Número de inscripción:</dt>
                    <dd className="font-medium text-gray-900">#{registration.id}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  Recibirás un correo electrónico con los detalles de tu inscripción y
                  más información sobre el torneo.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex gap-4">
              <Button asChild variant="outline" className="flex-1">
                <Link href={route('tournaments.index')}>Ver todos los torneos</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href={route('tournaments.show', tournament.slug)}>
                  Ver detalles del torneo
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
