import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface Tournament {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  entry_fee: string;
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
      // Obtener token CSRF de la cookie
      const getCsrfToken = () => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; XSRF-TOKEN=`);
        if (parts.length === 2) {
          return decodeURIComponent(parts.pop()?.split(';').shift() || '');
        }
        return '';
      };

      const csrfToken = getCsrfToken();
      console.log('CSRF Token:', csrfToken ? 'Found' : 'Not found');

      // Crear sesión de checkout en el backend
      const response = await fetch(
        `/registrations/${registration.id}/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': csrfToken,
          },
          credentials: 'same-origin',
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

      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '3rem 1rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '0.5rem' }}>Completar pago</h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              Finaliza tu inscripción al torneo {tournament.name}
            </p>

            <div style={{ marginBottom: '2rem' }}>
              {tournament.image && (
                <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                  <img
                    src={tournament.image}
                    alt={tournament.name}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
              )}

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{tournament.name}</h3>
                <p style={{ marginTop: '0.5rem', fontSize: '14px', color: '#6b7280' }}>{tournament.description}</p>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>
                    Precio de inscripción
                  </span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    €{tournament.entry_fee}
                  </span>
                </div>
              </div>

              {error && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '6px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#991b1b' }}>Error</h3>
                  <div style={{ marginTop: '0.5rem', fontSize: '14px', color: '#b91c1c' }}>{error}</div>
                </div>
              )}

              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#dbeafe', borderRadius: '6px' }}>
                <p style={{ fontSize: '14px', color: '#1e40af' }}>
                  Serás redirigido a la pasarela de pago segura de Stripe para completar tu inscripción.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={() => router.visit(`/tournaments/${tournament.slug}`)}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleCheckout}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '10px 20px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Procesando...' : 'Proceder al pago'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
