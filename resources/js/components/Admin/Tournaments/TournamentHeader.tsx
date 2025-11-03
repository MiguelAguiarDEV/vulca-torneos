// components/Admin/Tournaments/TournamentHeader.tsx
import type { Tournament } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Gamepad2, Trophy } from 'lucide-react';

interface TournamentHeaderProps {
    tournament: Tournament;
    onEdit: () => void;
}

const STATUS_COLORS: Record<string, string> = {
    draft: 'bg-secondary text-t-secondary',
    published: 'bg-info text-white',
    registration_open: 'bg-success text-white',
    registration_closed: 'bg-warning text-white',
    ongoing: 'bg-accent text-white',
    finished: 'bg-tertiary text-t-secondary',
    cancelled: 'bg-danger text-white',
};

const STATUS_TEXTS: Record<string, string> = {
    draft: 'Borrador',
    published: 'Publicado',
    registration_open: 'Inscripciones Abiertas',
    registration_closed: 'Inscripciones Cerradas',
    ongoing: 'En Curso',
    finished: 'Finalizado',
    cancelled: 'Cancelado',
};

export function TournamentHeader({ tournament, onEdit }: TournamentHeaderProps) {
    return (
        <div className="mb-6">
            <div className="border-border-primary bg-secondary rounded-xl border p-6 shadow-sm">
                <div className="flex items-center gap-6">
                    <Link
                        href={route('admin.tournaments.index')}
                        className="border-border-primary bg-tertiary text-t-secondary hover:bg-highlight hover:text-t-primary flex h-10 w-10 items-center justify-center rounded-lg border transition-all"
                    >
                        <ArrowLeft className="h-5 w-5" strokeWidth={2} />
                    </Link>

                    {tournament.image ? (
                        <img
                            src={tournament.image}
                            alt={tournament.name}
                            className="border-border-primary h-20 w-20 rounded-lg border object-cover shadow-sm"
                        />
                    ) : (
                        <div className="border-border-primary bg-tertiary flex h-20 w-20 items-center justify-center rounded-lg border shadow-sm">
                            <Trophy className="text-accent h-10 w-10" strokeWidth={2} />
                        </div>
                    )}

                    <div className="flex-grow">
                        <div className="mb-2 flex items-center gap-3">
                            <h1 className="text-t-primary text-3xl font-bold">{tournament.name}</h1>
                            <span
                                className={`rounded-lg px-3 py-1 text-xs font-medium shadow-sm ${STATUS_COLORS[tournament.status] ?? STATUS_COLORS.draft}`}
                            >
                                {STATUS_TEXTS[tournament.status] ?? tournament.status}
                            </span>
                        </div>

                        {tournament.description && <p className="text-t-secondary mb-3 text-sm">{tournament.description}</p>}

                        <div className="flex items-center justify-between">
                            <div className="border-border-primary bg-accent-subtle text-accent flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium">
                                <Gamepad2 className="h-4 w-4" strokeWidth={2} />
                                <span>{tournament.game?.name ?? 'Sin juego'}</span>
                            </div>

                            <button
                                onClick={onEdit}
                                className="border-border-primary bg-accent hover:bg-accent-hover flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
                            >
                                <Edit className="h-4 w-4" strokeWidth={2} />
                                Editar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
