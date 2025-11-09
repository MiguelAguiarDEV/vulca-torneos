// components/Admin/Tournaments/TournamentCard.tsx
import type { Tournament } from '@/types';
import { Calendar, Edit, Gamepad2, Trash2, Trophy, Users } from 'lucide-react';

interface TournamentCardProps {
    tournament: Tournament;
    onClick?: (tournament: Tournament) => void;
    onEdit: (tournament: Tournament) => void;
    onDelete: (tournament: Tournament) => void;
}

const STATUS_COLORS: Record<string, string> = {
    draft: 'bg-t-muted/10 text-t-muted',
    published: 'bg-accent/10 text-accent',
    registration_open: 'bg-success/10 text-success',
    registration_closed: 'bg-warning/10 text-warning',
    ongoing: 'bg-info/10 text-info',
    finished: 'bg-t-secondary/10 text-t-secondary',
    cancelled: 'bg-danger/10 text-danger',
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

function formatMoney(value: unknown): string {
    const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
    return Number.isFinite(n) ? n.toFixed(2) : '0.00';
}

export function TournamentCard({ tournament, onClick, onEdit, onDelete }: TournamentCardProps) {
    // Totales para la tarjeta
    const totalRegs = (tournament as any).registrations_count ?? 0;

    const limit = (tournament as any).registration_limit ?? 0;
    const hasLimit = Boolean((tournament as any).has_registration_limit && limit > 0);

    const progress = hasLimit ? Math.min(100, Math.round((totalRegs / limit) * 100)) : null;

    // Ingresos estimados: normalmente interesa solo confirmadas si hay ese campo
    const confirmedCount = (tournament as any).registrations_count ?? 0;
    const entryFee = (tournament as any).entry_fee ?? null;
    const estimatedRevenue = entryFee != null ? Number(confirmedCount) * Number(entryFee) : 0;

    return (
        <div
            className="border-border-primary bg-secondary group relative flex cursor-pointer flex-col rounded-xl border p-5 shadow-sm transition-all hover:shadow-md"
            onClick={() => onClick?.(tournament)}
        >
            {/* Imagen del torneo */}
            {tournament.image && tournament.image.trim() !== '' ? (
                <div className="mb-4 overflow-hidden rounded-md">
                    <img
                        src={tournament.image}
                        alt={tournament.name}
                        className="h-40 w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => (e.currentTarget.style.display = 'none')} // oculta si la imagen falla
                    />
                </div>
            ) : (
                <div className="mb-4 flex items-center justify-center">
                    <Trophy className="text-t-muted group-hover:text-accent h-16 w-16 transition-colors" strokeWidth={1.5} />
                </div>
            )}

            {/* Encabezado */}
            <div className="mb-3 flex flex-col items-start justify-between gap-4">
                <span className={`rounded-md px-2.5 py-1 text-xs font-medium shadow-sm ${STATUS_COLORS[tournament.status] ?? STATUS_COLORS.draft}`}>
                    {STATUS_TEXTS[tournament.status] ?? tournament.status}
                </span>
                <div>
                    <h3 className="text-t-primary text-lg leading-tight font-semibold">{tournament.name}</h3>
                    <p className="text-t-secondary mt-1 flex items-center gap-2 text-xs">
                        <Gamepad2 className="text-accent h-4 w-4" strokeWidth={2} />
                        {tournament.game?.name ?? 'Sin juego'}
                    </p>
                </div>
            </div>

            {/* Fechas */}
            <div className="text-t-secondary mb-3 space-y-1 text-sm">
                <div className="flex items-center gap-2">
                    <Calendar className="text-accent h-4 w-4" strokeWidth={2} />
                    <span className="text-t-primary font-medium">
                        {new Date(tournament.start_date).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        })}
                    </span>
                    {tournament.end_date && (
                        <>
                            <span className="text-t-muted">→</span>
                            <span>
                                {new Date(tournament.end_date).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Inscripciones (contador + barra) */}
            <div className="border-border-primary bg-tertiary mb-4 rounded-md border p-3 text-sm">
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="text-accent h-4 w-4" strokeWidth={2} />
                        <span className="text-t-primary font-medium">Inscripciones</span>
                    </div>
                    <span className="text-t-primary font-semibold">
                        {totalRegs}
                        {hasLimit ? ` / ${limit}` : ''}
                    </span>
                </div>

                {hasLimit && (
                    <div className="bg-t-muted/20 h-2 w-full rounded-full">
                        <div className="bg-success h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                )}

                {/* Indicador compacto de % (si hay límite) */}
                {hasLimit && (
                    <div className="mt-2 text-right">
                        <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                (progress ?? 0) >= 90
                                    ? 'bg-danger/10 text-danger'
                                    : (progress ?? 0) >= 70
                                      ? 'bg-warning/10 text-warning'
                                      : 'bg-success/10 text-success'
                            }`}
                        >
                            {progress}%
                        </span>
                    </div>
                )}
            </div>

            {/* Cuota e ingresos estimados */}
            <div className="text-t-secondary mb-4 space-y-1 text-sm">
                <div className="flex justify-between">
                    <span>Cuota:</span>
                    <span className="text-t-primary font-medium">{entryFee != null ? `€${formatMoney(entryFee)}` : 'Gratis'}</span>
                </div>

                {entryFee != null && (
                    <div className="flex justify-between">
                        <span>Ingresos estimados:</span>
                        <span className="text-success font-semibold">€{formatMoney(estimatedRevenue)}</span>
                    </div>
                )}
            </div>

            {/* Acciones */}
            <div className="mt-auto flex flex-wrap gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={() => onEdit(tournament)}
                    className="bg-info hover:bg-info/90 flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:shadow-md"
                    title="Editar torneo"
                >
                    <Edit className="h-3.5 w-3.5" strokeWidth={2} />
                    Editar
                </button>
                <button
                    onClick={() => onDelete(tournament)}
                    className="border-border-primary hover:bg-danger/10 text-danger flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-medium shadow-sm transition-all hover:shadow-md"
                    title="Eliminar torneo"
                >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                    Eliminar
                </button>
            </div>
        </div>
    );
}
