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
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Fechas */}
            <div className="rounded-lg border-2 border-primary/30 bg-secondary/95 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-text-primary">
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    Fechas del Torneo
                </h3>
                <div className="space-y-3 text-text-primary/70">
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
            <div className="rounded-lg border-2 border-warning/30 bg-secondary/95 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-text-primary">
                    <Clock className="mr-2 h-5 w-5 text-warning" />
                    Inscripciones
                </h3>
                <div className="space-y-3 text-text-primary/70">
                    {tournament.registration_start && (
                        <div>
                            <span className="font-medium">Apertura:</span>
                            <span className="ml-2">{new Date(tournament.registration_start).toLocaleDateString('es-ES')}</span>
                        </div>
                    )}
                    <div>
                        <span className="font-medium">Total:</span>
                        <span className="ml-2 font-bold text-text-primary">
                            {registrations.length}
                            {tournament.has_registration_limit ? ` / ${tournament.registration_limit}` : ''}
                        </span>
                    </div>
                    {tournament.has_registration_limit && (
                        <div className="mt-2">
                            <div className="mb-1 flex justify-between text-sm">
                                <span>Progreso</span>
                                <span>{Math.round((registrations.length / tournament.registration_limit!) * 100)}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary-light">
                                <div
                                    className="h-2 rounded-full bg-success transition-all"
                                    style={{ width: `${Math.min(100, (registrations.length / tournament.registration_limit!) * 100)}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Información adicional */}
            <div className="rounded-lg border-2 border-success/30 bg-secondary/95 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-text-primary">
                    <DollarSign className="mr-2 h-5 w-5 text-success" />
                    Información Adicional
                </h3>
                <div className="space-y-3 text-text-primary/70">
                    <div>
                        <span className="font-medium">Cuota:</span>
                        <span className="ml-2 font-bold text-text-primary">{tournament.entry_fee ? `€${tournament.entry_fee}` : 'Gratis'}</span>
                    </div>
                    <div>
                        <span className="font-medium">Confirmadas:</span>
                        <span className="ml-2 font-bold text-success">{confirmedCount}</span>
                    </div>
                    <div>
                        <span className="font-medium">Pendientes:</span>
                        <span className="ml-2 font-bold text-warning">{pendingCount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
