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
        <div className="rounded-lg border-2 border-primary/30 bg-secondary/95 p-6 shadow-lg backdrop-blur-sm">
            <div className="mb-6 flex items-center">
                <Trophy className="mr-3 h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold text-text-primary">Torneos Próximos/Activos</h2>
            </div>

            {tournaments.length > 0 ? (
                <div className="space-y-4">
                    {tournaments.map((tournament) => (
                        <div
                            key={tournament.id}
                            className="rounded-lg border border-primary/30 bg-secondary-dark/80 p-4 backdrop-blur-sm transition-all duration-200 hover:border-primary hover:shadow-lg"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-text-primary">{tournament.name}</h3>
                                <span
                                    className={`rounded-full px-3 py-1 text-sm font-medium shadow-lg ${
                                        tournament.status === 'active' ? 'bg-success text-text-primary' : 'bg-info text-text-primary'
                                    }`}
                                >
                                    {tournament.status === 'active' ? 'Activo' : 'Próximo'}
                                </span>
                            </div>
                            <div className="flex items-center space-x-6 text-text-primary/70">
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-5 w-5" />
                                    <span>{tournament.start_date}</span>
                                </div>
                                <div className="flex items-center">
                                    <Users className="mr-2 h-5 w-5" />
                                    <span>{tournament.participants_count} participantes</span>
                                </div>
                            </div>
                            <div className="mt-3 text-sm text-text-primary/70">Estado: {tournament.original_status}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-12">
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
