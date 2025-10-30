import { Head, Link, router } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Tournament {
  id: number;
  name: string;
  slug: string;
  description: string;
  entry_fee: string;
  start_date: string;
  end_date: string;
  registration_start: string;
  registration_end: string;
  status: string;
  registrations_count?: number;
}

interface UserRegistration {
  id: number;
  status: string;
  payment_status: string;
}

interface ShowProps {
  tournament: Tournament;
  userRegistration: UserRegistration | null;
  canRegister: boolean;
  auth?: {
    user?: any;
  };
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function Show({ tournament, userRegistration, canRegister, auth, flash }: ShowProps) {
  const handleRegister = (e: FormEvent) => {
    e.preventDefault();

    console.log('Intentando inscribirse...');
    router.post(`/tournaments/${tournament.slug}/register`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        console.log('Inscripción exitosa');
      },
      onError: (errors) => {
        console.error('Error en inscripción:', errors);
      }
    });
  };

  const handleUnregister = (e: FormEvent) => {
    e.preventDefault();

    if (confirm('¿Estás seguro de que quieres cancelar tu inscripción?')) {
      router.delete(`/tournaments/${tournament.slug}/unregister`, {
        preserveScroll: true,
      });
    }
  };

  return (
    <>
      <Head title={tournament.name} />

      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <Link
          href="/tournaments"
          style={{
            display: 'inline-block',
            marginBottom: '20px',
            color: '#007bff'
          }}
        >
          ← Volver a torneos
        </Link>

        <h1>{tournament.name}</h1>
        <p style={{ fontSize: '18px', marginTop: '10px' }}>{tournament.description}</p>

        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <p><strong>Precio:</strong> €{tournament.entry_fee}</p>
          <p><strong>Inicio:</strong> {new Date(tournament.start_date).toLocaleString()}</p>
          <p><strong>Fin:</strong> {new Date(tournament.end_date).toLocaleString()}</p>
          <p><strong>Estado:</strong> {tournament.status}</p>
          {tournament.registrations_count !== undefined && (
            <p><strong>Inscritos:</strong> {tournament.registrations_count}</p>
          )}
        </div>

        <div style={{ marginTop: '30px' }}>
          {flash?.error && (
            <div style={{ padding: '15px', backgroundColor: '#f8d7da', borderRadius: '4px', marginBottom: '20px', color: '#721c24' }}>
              <strong>Error:</strong> {flash.error}
            </div>
          )}

          {flash?.success && (
            <div style={{ padding: '15px', backgroundColor: '#d4edda', borderRadius: '4px', marginBottom: '20px', color: '#155724' }}>
              <strong>Éxito:</strong> {flash.success}
            </div>
          )}

          {!auth?.user && (
            <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px', marginBottom: '20px' }}>
              <p>Debes <Link href="/login" style={{ color: '#007bff' }}>iniciar sesión</Link> para inscribirte</p>
            </div>
          )}

          {auth?.user && userRegistration && (
            <div style={{ padding: '15px', backgroundColor: '#d4edda', borderRadius: '4px', marginBottom: '20px' }}>
              <p><strong>¡Estás inscrito en este torneo!</strong></p>
              <p>Estado de inscripción: {userRegistration.status}</p>
              <p>Estado de pago: {userRegistration.payment_status}</p>

              {userRegistration.payment_status === 'pending' && (
                <Link
                  href={`/registrations/${userRegistration.id}/checkout`}
                  style={{
                    display: 'inline-block',
                    marginTop: '10px',
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px'
                  }}
                >
                  Pagar inscripción (€{tournament.entry_fee})
                </Link>
              )}

              <button
                onClick={handleUnregister}
                style={{
                  display: 'block',
                  marginTop: '10px',
                  padding: '10px 20px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancelar inscripción
              </button>
            </div>
          )}

          {auth?.user && !userRegistration && canRegister && (
            <form onSubmit={handleRegister}>
              <button
                type="submit"
                style={{
                  padding: '15px 30px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Inscribirse (€{tournament.entry_fee})
              </button>
            </form>
          )}

          {auth?.user && !userRegistration && !canRegister && (
            <div style={{ padding: '15px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
              <p>No puedes inscribirte en este torneo en este momento</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
