// components/Admin/Tournaments/TournamentInfo.tsx
import type { Registration, Tournament } from '@/types';
import { Calendar, Clock, DollarSign } from 'lucide-react';

interface TournamentInfoProps {
    tournament: Tournament;
    registrations: Registration[];
}

export function TournamentInfo({ tournament, registrations }: TournamentInfoProps) {
    const confirmedCount = registrations.filter((r) => r.payment_status === 'confirmed').length;
    const pendingCount = registrations.filter((r) => r.payment_status === 'pending').length;

    return (
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Fechas */}
            <div className="border-border-primary bg-secondary rounded-xl border p-5 shadow-sm">
                <h3 className="text-t-primary mb-4 flex items-center gap-2 text-base font-semibold">
                    <Calendar className="text-accent h-5 w-5" strokeWidth={2} />
                    Fechas del Torneo
                </h3>
                <div className="text-t-secondary space-y-2 text-sm">
                    <div>
                        <span className="font-medium">Inicio:</span>
                        <span className="ml-2">
                            {new Date(tournament.start_date).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                    </div>
                    {tournament.end_date && (
                        <div>
                            <span className="font-medium">Fin:</span>
                            <span className="ml-2">
                                {new Date(tournament.end_date).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Inscripciones */}
            <div className="border-border-primary bg-secondary rounded-xl border p-5 shadow-sm">
                <h3 className="text-t-primary mb-4 flex items-center gap-2 text-base font-semibold">
                    <Clock className="text-warning h-5 w-5" strokeWidth={2} />
                    Inscripciones
                </h3>
                <div className="text-t-secondary space-y-2 text-sm">
                    {tournament.registration_start && (
                        <div>
                            <span className="font-medium">Apertura:</span>
                            <span className="ml-2">{new Date(tournament.registration_start).toLocaleDateString('es-ES')}</span>
                        </div>
                    )}
                    <div>
                        <span className="font-medium">Total:</span>
                        <span className="text-t-primary ml-2 font-semibold">
                            {registrations.length}
                            {tournament.has_registration_limit ? ` / ${tournament.registration_limit}` : ''}
                        </span>
                    </div>
                    {tournament.has_registration_limit && (
                        <div className="mt-3">
                            <div className="mb-1 flex justify-between text-xs">
                                <span>Progreso</span>
                                <span>{Math.round((registrations.length / tournament.registration_limit!) * 100)}%</span>
                            </div>
                            <div className="bg-tertiary h-2 w-full rounded-full">
                                <div
                                    className="bg-success h-2 rounded-full transition-all"
                                    style={{ width: `${Math.min(100, (registrations.length / tournament.registration_limit!) * 100)}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Información adicional */}
            <div className="border-border-primary bg-secondary rounded-xl border p-5 shadow-sm">
                <h3 className="text-t-primary mb-4 flex items-center gap-2 text-base font-semibold">
                    <DollarSign className="text-success h-5 w-5" strokeWidth={2} />
                    Información Adicional
                </h3>
                <div className="text-t-secondary space-y-2 text-sm">
                    <div>
                        <span className="font-medium">Cuota:</span>
                        <span className="text-t-primary ml-2 font-semibold">{tournament.entry_fee ? `€${tournament.entry_fee}` : 'Gratis'}</span>
                    </div>
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
        </div>
    );
}
