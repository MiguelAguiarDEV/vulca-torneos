// components/Admin/Tournaments/TournamentInfo.tsx
import type { Registration, Tournament } from '@/types';
import { Calendar, Trophy, Users } from 'lucide-react';

interface TournamentInfoProps {
    tournament: Tournament;
    registrations: Registration[];
}

export function TournamentInfo({ tournament, registrations }: TournamentInfoProps) {
    const confirmedCount = registrations.filter((r) => r.payment_status === 'confirmed').length;
    const pendingCount = registrations.filter((r) => r.payment_status === 'pending').length;
    const total = registrations.length;
    const hasLimit = Boolean(tournament.has_registration_limit && tournament.registration_limit);
    const limit = tournament.registration_limit ?? 0;
    const progress = hasLimit ? Math.min(100, Math.round((total / limit) * 100)) : 0;

    return (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Bloque 1 – Fechas */}
            <div className="border-border-primary bg-secondary rounded-xl border p-5 shadow-sm">
                <h3 className="text-t-primary mb-4 flex items-center gap-2 text-base font-semibold">
                    <Calendar className="text-accent h-5 w-5" strokeWidth={2} />
                    Fechas clave
                </h3>
                <div className="text-t-secondary space-y-2 text-sm">
                    <div>
                        <span className="font-medium">Inicio:</span>
                        <span className="ml-2">
                            {new Date(tournament.start_date).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                            })}
                        </span>
                    </div>
                    {tournament.end_date && (
                        <div>
                            <span className="font-medium">Fin:</span>
                            <span className="ml-2">
                                {new Date(tournament.end_date).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                    )}
                    {tournament.registration_start && tournament.registration_end && (
                        <div className="border-border-primary border-t pt-2">
                            <span className="font-medium">Inscripciones:</span>
                            <span className="ml-2">
                                {new Date(tournament.registration_start).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })}{' '}
                                –{' '}
                                {new Date(tournament.registration_end).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Bloque 2 – Inscripciones */}
            <div className="border-border-primary bg-secondary rounded-xl border p-5 shadow-sm">
                <h3 className="text-t-primary mb-4 flex items-center gap-2 text-base font-semibold">
                    <Users className="text-accent h-5 w-5" strokeWidth={2} />
                    Inscripciones
                </h3>
                <div className="text-t-secondary space-y-2 text-sm">
                    <div>
                        <span className="font-medium">Total:</span>
                        <span className="text-t-primary ml-2 font-semibold">
                            {total}
                            {hasLimit ? ` / ${limit}` : ''}
                        </span>
                    </div>
                    {hasLimit && (
                        <div className="mt-2">
                            <div className="mb-1 flex justify-between text-xs">
                                <span>Progreso</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="bg-tertiary h-2 w-full rounded-full">
                                <div
                                    className={`h-2 rounded-full transition-all ${
                                        progress >= 90 ? 'bg-danger' : progress >= 70 ? 'bg-warning' : 'bg-success'
                                    }`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                    <div>
                        <span className="font-medium">Confirmadas:</span>
                        <span className="text-success ml-2 font-semibold">{confirmedCount}</span>
                    </div>
                    <div>
                        <span className="font-medium">Pendientes:</span>
                        <span className="text-warning ml-2 font-semibold">{pendingCount}</span>
                    </div>
                </div>
            </div>

            {/* Bloque 3 – Información Adicional */}
            <div className="border-border-primary bg-secondary rounded-xl border p-5 shadow-sm">
                <h3 className="text-t-primary mb-4 flex items-center gap-2 text-base font-semibold">
                    <Trophy className="text-accent h-5 w-5" strokeWidth={2} />
                    Información adicional
                </h3>
                <div className="text-t-secondary space-y-2 text-sm">
                    <div>
                        <span className="font-medium">Cuota:</span>
                        <span className="text-t-primary ml-2 font-semibold">
                            {tournament.entry_fee ? `€${Number(tournament.entry_fee).toFixed(2)}` : 'Gratis'}
                        </span>
                    </div>
                    {tournament.prize && (
                        <div>
                            <span className="font-medium">Premio:</span>
                            <span className="ml-2">{tournament.prize}</span>
                        </div>
                    )}
                    {tournament.location && (
                        <div>
                            <span className="font-medium">Ubicación:</span>
                            <span className="ml-2">{tournament.location}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
