// components/Admin/Tournaments/TournamentCard.tsx
import { Calendar, DollarSign, Pencil, Trash2, Trophy, Users } from 'lucide-react';

interface Game {
    id: number;
    name: string;
    image: string | null;
}

interface Tournament {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
    game_id: number;
    game: Game;
    start_date: string;
    end_date: string | null;
    registration_start: string | null;
    registration_end: string | null;
    entry_fee: number | null;
    has_registration_limit: boolean;
    registration_limit: number | null;
    status: string;
    registrations_count: number;
    available_spots?: number | null;
    registration_progress?: number | null;
}

interface TournamentCardProps {
    tournament: Tournament;
    onClick?: (t: Tournament) => void;
    onEdit?: (t: Tournament) => void;
    onDelete?: (t: Tournament) => void;
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

export function TournamentCard({ tournament, onClick, onEdit, onDelete }: TournamentCardProps) {
    const getStatusColor = (status: string) => STATUS_COLORS[status] ?? STATUS_COLORS.draft;
    const getStatusText = (status: string) => STATUS_TEXTS[status] ?? status;

    const progress =
        tournament.has_registration_limit && tournament.registration_limit
            ? Math.min(100, Math.round((tournament.registrations_count / tournament.registration_limit) * 100))
            : null;

    return (
        <div
            className="group border-border-primary bg-secondary relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md"
            onClick={() => onClick?.(tournament)}
        >
            {/* Imagen */}
            <div className="bg-tertiary relative h-48 overflow-hidden">
                {tournament.image ? (
                    <>
                        <img
                            src={tournament.image}
                            alt={tournament.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                        <div className="from-secondary/80 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
                    </>
                ) : null}

                {/* Fallback */}
                <div className={`absolute inset-0 flex items-center justify-center ${tournament.image ? 'hidden' : ''}`}>
                    <Trophy className="text-t-muted group-hover:text-accent h-16 w-16 transition-colors" strokeWidth={1.5} />
                </div>

                {/* Estado */}
                <div className="absolute top-3 right-3">
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-medium shadow-sm ${getStatusColor(tournament.status)}`}>
                        {getStatusText(tournament.status)}
                    </span>
                </div>

                {/* Juego */}
                {tournament.game && (
                    <div className="absolute top-3 left-3">
                        <span className="border-border-primary bg-accent rounded-lg border px-2.5 py-1 text-xs font-medium text-white shadow-sm">
                            {tournament.game.name}
                        </span>
                    </div>
                )}

                {/* Nombre del torneo superpuesto */}
                <div className="from-secondary absolute right-0 bottom-0 left-0 bg-gradient-to-t to-transparent p-4">
                    <h3 className="text-t-primary group-hover:text-accent line-clamp-1 text-lg font-semibold transition-colors">{tournament.name}</h3>
                </div>
            </div>

            {/* Contenido */}
            <div className="flex flex-grow flex-col p-4">
                {tournament.description && <p className="text-t-secondary line-clamp-2 flex-grow text-sm">{tournament.description}</p>}

                <div className="text-t-secondary mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0" strokeWidth={2} />
                        <span className="truncate">{new Date(tournament.start_date).toLocaleDateString('es-ES')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 shrink-0" strokeWidth={2} />
                        <span>
                            {tournament.registrations_count}
                            {tournament.has_registration_limit && tournament.registration_limit ? ` / ${tournament.registration_limit}` : ''}
                        </span>
                        {progress !== null && (
                            <span
                                className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${
                                    progress >= 90
                                        ? 'bg-danger/10 text-danger'
                                        : progress >= 70
                                          ? 'bg-warning/10 text-warning'
                                          : 'bg-success/10 text-success'
                                }`}
                            >
                                {progress}%
                            </span>
                        )}
                    </div>

                    {tournament.entry_fee != null && (
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 shrink-0" strokeWidth={2} />
                            <span>€{tournament.entry_fee}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="border-border-primary bg-tertiary border-t px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(tournament);
                        }}
                        className="text-t-secondary hover:bg-accent/10 hover:text-accent rounded-lg p-2 transition-colors"
                        title="Editar torneo"
                    >
                        <Pencil className="h-4 w-4" strokeWidth={2} />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(tournament);
                        }}
                        className="text-t-secondary hover:bg-danger/10 hover:text-danger rounded-lg p-2 transition-colors"
                        title="Eliminar torneo"
                    >
                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                    </button>
                </div>
            </div>
        </div>
    );
}
