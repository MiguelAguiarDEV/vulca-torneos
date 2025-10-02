// components/Admin/Games/PendingRegistrationsList.tsx
import { EmptyState } from '@/components/Admin/Shared/EmptyState';
import { Calendar, Clock, CreditCard, Trophy } from 'lucide-react';

interface Registration {
    id: number;
    user_name: string;
    user_email: string;
    tournament_name: string;
    registration_date: string;
    payment_status: string;
}

interface PendingRegistrationsListProps {
    registrations: Registration[];
}

export function PendingRegistrationsList({ registrations }: PendingRegistrationsListProps) {
    return (
        <div className="rounded-lg border-2 border-warning/30 bg-secondary/95 p-6 shadow-lg backdrop-blur-sm">
            <div className="mb-6 flex items-center">
                <Clock className="mr-3 h-8 w-8 text-warning" />
                <h2 className="text-2xl font-bold text-text-primary">Inscripciones Pendientes</h2>
            </div>

            {registrations.length > 0 ? (
                <div className="space-y-4">
                    {registrations.map((registration) => (
                        <div
                            key={registration.id}
                            className="rounded-lg border border-warning/30 bg-secondary-dark/80 p-4 backdrop-blur-sm transition-all duration-200 hover:border-warning hover:shadow-lg"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-text-primary">{registration.user_name}</h3>
                                <span className="rounded-full bg-warning px-3 py-1 text-sm font-medium text-secondary shadow-lg">Pendiente</span>
                            </div>
                            <div className="space-y-2 text-text-primary/70">
                                <div className="flex items-center">
                                    <Trophy className="mr-2 h-4 w-4" />
                                    <span>Torneo: {registration.tournament_name}</span>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <span>Inscrito: {registration.registration_date}</span>
                                </div>
                                <div className="flex items-center">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    <span>Pago: {registration.payment_status}</span>
                                </div>
                                <div className="text-sm text-text-primary/50">Email: {registration.user_email}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-12">
                    <EmptyState
                        icon={Clock}
                        title="No hay inscripciones pendientes"
                        description="Las inscripciones pendientes de aprobación aparecerán aquí."
                    />
                </div>
            )}
        </div>
    );
}
