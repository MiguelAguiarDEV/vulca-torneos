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
        <div className="border-border-primary bg-secondary rounded-xl border p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
                <Clock className="text-warning h-6 w-6" strokeWidth={2} />
                <h2 className="text-t-primary text-lg font-semibold">Inscripciones Pendientes</h2>
            </div>

            {registrations.length > 0 ? (
                <div className="space-y-3">
                    {registrations.map((registration) => (
                        <div
                            key={registration.id}
                            className="border-border-primary bg-tertiary hover:border-warning rounded-lg border p-4 shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <h3 className="text-t-primary font-semibold">{registration.user_name}</h3>
                                <span className="bg-warning rounded-full px-2.5 py-1 text-xs font-medium text-white">Pendiente</span>
                            </div>
                            <div className="text-t-secondary space-y-1.5 text-sm">
                                <div className="flex items-center gap-1.5">
                                    <Trophy className="h-4 w-4" strokeWidth={2} />
                                    <span>Torneo: {registration.tournament_name}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" strokeWidth={2} />
                                    <span>Inscrito: {registration.registration_date}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CreditCard className="h-4 w-4" strokeWidth={2} />
                                    <span>Pago: {registration.payment_status}</span>
                                </div>
                                <div className="text-t-muted text-xs">Email: {registration.user_email}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-8">
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
