import { Head, Link } from '@inertiajs/react';

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

      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '3rem 1rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: '#fef3c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <svg style={{ width: '40px', height: '40px', color: '#d97706' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '0.5rem' }}>Pago cancelado</h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              El proceso de pago ha sido cancelado
            </p>

            <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '6px', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '14px', color: '#92400e' }}>
                No se ha procesado ningún cargo. Tu inscripción al torneo{' '}
                <span style={{ fontWeight: '600' }}>{tournament.name}</span> está pendiente de pago.
              </p>
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Puedes intentar realizar el pago nuevamente cuando estés listo. Tu reserva de inscripción se mantendrá activa.
              </p>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#dbeafe', borderRadius: '6px', marginBottom: '2rem' }}>
              <p style={{ fontSize: '14px', color: '#1e40af' }}>
                Si tienes algún problema con el pago, no dudes en contactarnos para obtener ayuda.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
              <Link
                href={`/registrations/${registration.id}/checkout`}
                style={{
                  display: 'block',
                  padding: '12px 24px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: '500'
                }}
              >
                Intentar de nuevo
              </Link>
              <Link
                href={`/tournaments/${tournament.slug}`}
                style={{
                  display: 'block',
                  padding: '12px 24px',
                  backgroundColor: 'white',
                  color: '#374151',
                  textDecoration: 'none',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
              >
                Volver al torneo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
