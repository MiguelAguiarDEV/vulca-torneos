// components/Admin/Tournaments/TournamentStats.tsx
import { Award, BarChart3, DollarSign, Trophy, Users } from 'lucide-react';

interface TournamentStatsProps {
    // Lo que ya pasas desde Show:
    confirmedCount: number;
    pendingCount: number;
    totalRevenue?: number; // opcional

    // Opcionales extra por si quieres mostrar progreso/partidas:
    registrationsCount?: number; // total = confirmed + pending si no lo pasas
    hasRegistrationLimit?: boolean; // para mostrar barra de progreso
    registrationLimit?: number; // límite máximo si hay
    matchesPlayed?: number; // partidas jugadas
    totalMatches?: number; // partidas totales
    winnerName?: string | null; // ganador si ya existe
}

export function TournamentStats({
    confirmedCount,
    pendingCount,
    totalRevenue = 0,
    registrationsCount,
    hasRegistrationLimit = false,
    registrationLimit = 0,
    matchesPlayed = 0,
    totalMatches = 0,
    winnerName = null,
}: TournamentStatsProps) {
    const total = typeof registrationsCount === 'number' ? registrationsCount : confirmedCount + pendingCount;

    const hasLimit = !!hasRegistrationLimit && registrationLimit > 0;
    const progress = hasLimit ? Math.min(100, Math.round((total / registrationLimit) * 100)) : 0;

    const completion = totalMatches > 0 ? Math.round((matchesPlayed / totalMatches) * 100) : 0;

    const pct = (num: number, den: number) => (den > 0 ? Math.round((num / den) * 100) : 0);

    return (
        <div className="border-border-primary bg-secondary rounded-xl border p-6 shadow-sm">
            <h2 className="text-t-primary mb-6 flex items-center gap-2 text-lg font-semibold">
                <BarChart3 className="text-accent h-5 w-5" strokeWidth={2} />
                Estadísticas del Torneo
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total de Inscripciones */}
                <div className="bg-tertiary border-border-primary rounded-lg border p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="text-t-secondary text-sm font-medium">Inscripciones totales</div>
                        <Users className="text-accent h-5 w-5" strokeWidth={2} />
                    </div>
                    <div className="text-t-primary mt-2 text-2xl font-bold">{total}</div>
                    {hasLimit && (
                        <div className="text-t-secondary mt-1 text-xs">
                            Límite: <span className="text-t-primary font-medium">{registrationLimit}</span> (
                            <span className={progress >= 90 ? 'text-danger' : progress >= 70 ? 'text-warning' : 'text-success'}>{progress}%</span>)
                        </div>
                    )}
                </div>

                {/* Confirmadas */}
                <div className="bg-tertiary border-border-primary rounded-lg border p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="text-t-secondary text-sm font-medium">Inscripciones confirmadas</div>
                        <Award className="text-success h-5 w-5" strokeWidth={2} />
                    </div>
                    <div className="text-success mt-2 text-2xl font-bold">{confirmedCount}</div>
                    <div className="text-t-secondary mt-1 text-xs">{pct(confirmedCount, total)}% del total</div>
                </div>

                {/* Pendientes */}
                <div className="bg-tertiary border-border-primary rounded-lg border p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="text-t-secondary text-sm font-medium">Pendientes</div>
                        <Award className="text-warning h-5 w-5" strokeWidth={2} />
                    </div>
                    <div className="text-warning mt-2 text-2xl font-bold">{pendingCount}</div>
                    <div className="text-t-secondary mt-1 text-xs">{total > 0 ? `${pct(pendingCount, total)}% del total` : 'Sin inscripciones'}</div>
                </div>

                {/* Ingresos / Partidas */}
                <div className="bg-tertiary border-border-primary rounded-lg border p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="text-t-secondary text-sm font-medium">Ingresos y progreso</div>
                        <DollarSign className="text-info h-5 w-5" strokeWidth={2} />
                    </div>

                    {/* Ingresos */}
                    <div className="text-t-primary mt-2 text-lg font-bold">€{Number(totalRevenue || 0).toFixed(2)}</div>

                    {/* Barra de progreso de partidas (si hay datos) */}
                    {totalMatches > 0 && (
                        <>
                            <div className="bg-t-muted/20 mt-3 h-2 w-full rounded-full">
                                <div className="bg-info h-2 rounded-full transition-all" style={{ width: `${completion}%` }} />
                            </div>
                            <div className="text-t-secondary mt-1 text-right text-xs">
                                {matchesPlayed}/{totalMatches} ({completion}%)
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Ganador */}
            {winnerName && (
                <div className="bg-accent/10 mt-8 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <Trophy className="text-accent h-6 w-6" strokeWidth={2} />
                        <div>
                            <p className="text-t-primary text-sm font-medium">Ganador del torneo</p>
                            <p className="text-accent text-lg font-semibold">{winnerName}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
