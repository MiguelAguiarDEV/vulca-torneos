// components/Admin/Games/TournamentsList.tsx
import { EmptyState } from '@/components/Admin/Shared/EmptyState';
import { Calendar, Trophy, Users } from 'lucide-react';

interface Tournament {
    id: number;
    name: string;
    status: 'active' | 'upcoming';
    original_status: string;
    start_date: string;
    participants_count: number;
}

interface TournamentsListProps {
    tournaments: Tournament[];
}

export function TournamentsList({ tournaments }: TournamentsListProps) {
    return (
        <div className="border-border-primary bg-secondary rounded-xl border p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
                <Trophy className="text-accent h-6 w-6" strokeWidth={2} />
                <h2 className="text-t-primary text-lg font-semibold">Torneos Próximos/Activos</h2>
            </div>

            {tournaments.length > 0 ? (
                <div className="space-y-3">
                    {tournaments.map((tournament) => (
                        <div
                            key={tournament.id}
                            className="border-border-primary bg-tertiary hover:border-accent rounded-lg border p-4 shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <h3 className="text-t-primary font-semibold">{tournament.name}</h3>
                                <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                        tournament.status === 'active' ? 'bg-success text-white' : 'bg-info text-white'
                                    }`}
                                >
                                    {tournament.status === 'active' ? 'Activo' : 'Próximo'}
                                </span>
                            </div>
                            <div className="text-t-secondary flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" strokeWidth={2} />
                                    <span>{tournament.start_date}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Users className="h-4 w-4" strokeWidth={2} />
                                    <span>{tournament.participants_count} participantes</span>
                                </div>
                            </div>
                            <div className="text-t-muted mt-2 text-xs">Estado: {tournament.original_status}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-8">
                    <EmptyState
                        icon={Calendar}
                        title="No hay torneos próximos o activos"
                        description="Los torneos aparecerán aquí cuando estén programados o en curso."
                    />
                </div>
            )}
        </div>
    );
}
