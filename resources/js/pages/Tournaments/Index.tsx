import { Head, Link } from '@inertiajs/react';

interface Tournament {
  id: number;
  name: string;
  slug: string;
  description: string;
  entry_fee: string;
  start_date: string;
  status: string;
  registrations_count: number;
}

interface IndexProps {
  tournaments: {
    data: Tournament[];
  };
}

export default function Index({ tournaments }: IndexProps) {
  return (
    <>
      <Head title="Torneos" />

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '20px' }}>Torneos Disponibles</h1>

        <div style={{ display: 'grid', gap: '20px' }}>
          {tournaments.data.map((tournament) => (
            <div
              key={tournament.id}
              style={{
                border: '1px solid #ddd',
                padding: '20px',
                borderRadius: '8px'
              }}
            >
              <h2>{tournament.name}</h2>
              <p>{tournament.description}</p>
              <p>Precio: €{tournament.entry_fee}</p>
              <p>Inscritos: {tournament.registrations_count}</p>
              <p>Estado: {tournament.status}</p>

              <Link
                href={`/tournaments/${tournament.slug}`}
                style={{
                  display: 'inline-block',
                  marginTop: '10px',
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px'
                }}
              >
                Ver detalles
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
