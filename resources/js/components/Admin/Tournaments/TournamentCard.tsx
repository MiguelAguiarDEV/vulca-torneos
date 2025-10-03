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
    draft: 'bg-secondary text-text-primary',
    published: 'bg-info text-text-primary',
    registration_open: 'bg-success text-text-primary',
    registration_closed: 'bg-warning text-secondary',
    ongoing: 'bg-primary text-secondary',
    finished: 'bg-secondary text-text-primary',
    cancelled: 'bg-error text-text-primary',
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
            className="flex h-full cursor-pointer flex-col rounded-lg border-2 border-primary/30 bg-secondary/95 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-primary hover:shadow-xl"
            onClick={() => onClick?.(tournament)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter') onClick?.(tournament);
            }}
        >
            {/* Imagen */}
            <div className="relative h-48 overflow-hidden rounded-t-lg bg-secondary-dark">
                {tournament.image ? (
                    <img
                        src={tournament.image}
                        alt={tournament.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                ) : null}

                {/* Fallback */}
                <div className={`absolute inset-0 flex items-center justify-center ${tournament.image ? 'hidden' : ''}`}>
                    <div className="text-center">
                        <Trophy className="mx-auto mb-2 h-12 w-12 text-text-primary/50" />
                        <span className="text-sm text-text-primary/50">Sin imagen</span>
                    </div>
                </div>

                {/* Estado */}
                <div className="absolute top-3 right-3">
                    <div className={`rounded-md px-2 py-1 text-xs font-medium shadow-lg ${getStatusColor(tournament.status)}`}>
                        {getStatusText(tournament.status)}
                    </div>
                </div>

                {/* Juego */}
                {tournament.game && (
                    <div className="absolute top-3 left-3">
                        <div className="rounded-md bg-primary/90 px-2 py-1 text-xs font-medium text-secondary shadow-lg backdrop-blur-sm">
                            {tournament.game.name}
                        </div>
                    </div>
                )}
            </div>

            {/* Contenido */}
            <div className="flex flex-grow flex-col p-4">
                <div className="mb-4">
                    <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-text-primary transition-colors duration-200 hover:text-primary">
                        {tournament.name}
                    </h3>
                    {tournament.description && <p className="line-clamp-2 text-sm leading-relaxed text-text-primary/70">{tournament.description}</p>}
                </div>

                <div className="mb-4 space-y-2 text-sm text-text-primary/70">
                    <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Inicio: {new Date(tournament.start_date).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        <span>
                            {tournament.registrations_count}
                            {tournament.has_registration_limit && tournament.registration_limit
                                ? ` / ${tournament.registration_limit} inscripciones`
                                : ' inscripciones'}
                        </span>
                        {progress !== null && (
                            <span
                                className={`ml-2 rounded-full px-2 py-1 text-xs ${
                                    progress >= 90
                                        ? 'bg-error/20 text-error'
                                        : progress >= 70
                                          ? 'bg-warning/20 text-warning'
                                          : 'bg-success/20 text-success'
                                }`}
                            >
                                {progress}%
                            </span>
                        )}
                    </div>

                    {tournament.entry_fee != null && (
                        <div className="flex items-center">
                            <DollarSign className="mr-2 h-4 w-4" />
                            <span>€{tournament.entry_fee}</span>
                        </div>
                    )}
                </div>

                <div className="flex-grow" />
            </div>

            {/* Acciones */}
            <div className="border-t-2 border-primary bg-secondary-dark/80 px-4 py-3">
                <div className="flex items-center justify-end space-x-2">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(tournament);
                        }}
                        className="rounded-md p-2 text-text-primary transition-colors duration-200 hover:bg-primary/20 hover:text-primary"
                        title="Editar torneo"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(tournament);
                        }}
                        className="hover:bg-error/10 hover:text-error rounded-md p-2 text-text-primary transition-colors duration-200"
                        title="Eliminar torneo"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
