// components/Admin/Tournaments/TournamentHeader.tsx
import type { Tournament } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Gamepad, Trophy } from 'lucide-react';

interface TournamentHeaderProps {
    tournament: Tournament;
    onEdit: () => void;
}

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        draft: 'bg-secondary text-text-primary',
        published: 'bg-info text-text-primary',
        registration_open: 'bg-success text-text-primary',
        registration_closed: 'bg-warning text-secondary',
        ongoing: 'bg-primary text-secondary',
        finished: 'bg-secondary text-text-primary',
        cancelled: 'bg-error text-text-primary',
    };
    return colors[status] || 'bg-secondary text-text-primary';
};

const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
        draft: 'Borrador',
        published: 'Publicado',
        registration_open: 'Inscripciones Abiertas',
        registration_closed: 'Inscripciones Cerradas',
        ongoing: 'En Curso',
        finished: 'Finalizado',
        cancelled: 'Cancelado',
    };
    return texts[status] || status;
};

export function TournamentHeader({ tournament, onEdit }: TournamentHeaderProps) {
    return (
        <div className="mb-8">
            <div className="rounded-lg border-2 border-primary/30 bg-secondary/95 p-6 shadow-lg backdrop-blur-sm">
                <div className="flex items-center">
                    <Link
                        href={route('admin.tournaments.index')}
                        className="mr-6 rounded-lg border border-primary/30 p-3 text-text-primary transition-all duration-200 hover:scale-110 hover:border-primary hover:bg-primary/20"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <div className="flex flex-grow items-center">
                        {tournament.image ? (
                            <img
                                src={tournament.image}
                                alt={tournament.name}
                                className="mr-8 h-24 w-24 rounded-lg border-2 border-primary object-cover shadow-xl transition-transform hover:scale-105"
                            />
                        ) : (
                            <div className="mr-8 flex h-24 w-24 items-center justify-center rounded-lg border-2 border-primary bg-secondary/80 shadow-xl">
                                <Trophy className="h-12 w-12 text-primary" />
                            </div>
                        )}
                        <div className="flex-grow">
                            <div className="mb-3 flex items-center gap-4">
                                <h1 className="text-5xl font-bold text-white drop-shadow-lg">{tournament.name}</h1>
                                <span className={`rounded-full px-4 py-2 text-sm font-medium shadow-lg ${getStatusColor(tournament.status)}`}>
                                    {getStatusText(tournament.status)}
                                </span>
                            </div>
                            {tournament.description && (
                                <p className="mb-3 rounded-lg border border-primary/20 bg-secondary/50 px-4 py-2 text-xl text-white backdrop-blur-sm">
                                    {tournament.description}
                                </p>
                            )}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center rounded-lg border border-primary/30 bg-primary/20 px-3 py-2 backdrop-blur-sm">
                                    <Gamepad className="mr-2 h-5 w-5 text-primary" />
                                    <span className="font-medium text-white">{tournament.game.name}</span>
                                </div>
                                <button
                                    onClick={onEdit}
                                    className="flex items-center rounded-lg bg-primary px-4 py-2 font-semibold text-secondary shadow-lg transition-all hover:scale-105 hover:bg-primary-dark"
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar Torneo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
