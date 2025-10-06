import { Head, Link } from '@inertiajs/react';

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

      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '3rem 1rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <svg style={{ width: '40px', height: '40px', color: '#059669' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '0.5rem' }}>¡Pago completado!</h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              Tu inscripción ha sido confirmada con éxito
            </p>

            <div style={{ padding: '1rem', backgroundColor: '#d1fae5', borderRadius: '6px', marginBottom: '2rem' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#065f46' }}>
                Te has inscrito exitosamente al torneo
              </p>
              <p style={{ marginTop: '0.5rem', fontSize: '18px', fontWeight: '600', color: '#047857' }}>
                {tournament.name}
              </p>
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '0.5rem' }}>
                <span style={{ color: '#6b7280' }}>Estado de inscripción:</span>
                <span style={{ fontWeight: '500', color: '#059669' }}>Confirmada</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '0.5rem' }}>
                <span style={{ color: '#6b7280' }}>Estado de pago:</span>
                <span style={{ fontWeight: '500', color: '#059669' }}>Pagado</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#6b7280' }}>Número de inscripción:</span>
                <span style={{ fontWeight: '500', color: '#111827' }}>#{registration.id}</span>
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#dbeafe', borderRadius: '6px', marginBottom: '2rem' }}>
              <p style={{ fontSize: '14px', color: '#1e40af' }}>
                Recibirás un correo electrónico con los detalles de tu inscripción y más información sobre el torneo.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
              <Link
                href={`/tournaments/${tournament.slug}`}
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
                Ver detalles del torneo
              </Link>
              <Link
                href="/tournaments"
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
                Ver todos los torneos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
