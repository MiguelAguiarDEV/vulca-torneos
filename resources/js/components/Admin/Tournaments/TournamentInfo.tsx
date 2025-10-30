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
            <div className="border-primary/30 bg-secondary/95 rounded-lg border-2 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="text-text-primary mb-4 flex items-center text-lg font-semibold">
                    <Calendar className="text-primary mr-2 h-5 w-5" />
                    Fechas del Torneo
                </h3>
                <div className="text-text-primary/70 space-y-3">
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
            <div className="border-warning/30 bg-secondary/95 rounded-lg border-2 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="text-text-primary mb-4 flex items-center text-lg font-semibold">
                    <Clock className="text-warning mr-2 h-5 w-5" />
                    Inscripciones
                </h3>
                <div className="text-text-primary/70 space-y-3">
                    {tournament.registration_start && (
                        <div>
                            <span className="font-medium">Apertura:</span>
                            <span className="ml-2">{new Date(tournament.registration_start).toLocaleDateString('es-ES')}</span>
                        </div>
                    )}
                    <div>
                        <span className="font-medium">Total:</span>
                        <span className="text-text-primary ml-2 font-bold">
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
                            <div className="bg-secondary-light h-2 w-full rounded-full">
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
            <div className="border-success/30 bg-secondary/95 rounded-lg border-2 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="text-text-primary mb-4 flex items-center text-lg font-semibold">
                    <DollarSign className="text-success mr-2 h-5 w-5" />
                    Información Adicional
                </h3>
                <div className="text-text-primary/70 space-y-3">
                    <div>
                        <span className="font-medium">Cuota:</span>
                        <span className="text-text-primary ml-2 font-bold">{tournament.entry_fee ? `€${tournament.entry_fee}` : 'Gratis'}</span>
                    </div>
                    <div>
                        <span className="font-medium">Confirmadas:</span>
                        <span className="text-success ml-2 font-bold">{confirmedCount}</span>
                    </div>
                    <div>
                        <span className="font-medium">Pendientes:</span>
                        <span className="text-warning ml-2 font-bold">{pendingCount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
