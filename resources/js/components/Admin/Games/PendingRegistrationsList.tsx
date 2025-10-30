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
        <div className="border-warning/30 bg-secondary/95 rounded-lg border-2 p-6 shadow-lg backdrop-blur-sm">
            <div className="mb-6 flex items-center">
                <Clock className="text-warning mr-3 h-8 w-8" />
                <h2 className="text-text-primary text-2xl font-bold">Inscripciones Pendientes</h2>
            </div>

            {registrations.length > 0 ? (
                <div className="space-y-4">
                    {registrations.map((registration) => (
                        <div
                            key={registration.id}
                            className="border-warning/30 bg-secondary-dark/80 hover:border-warning rounded-lg border p-4 backdrop-blur-sm transition-all duration-200 hover:shadow-lg"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-text-primary text-lg font-semibold">{registration.user_name}</h3>
                                <span className="bg-warning text-secondary rounded-full px-3 py-1 text-sm font-medium shadow-lg">Pendiente</span>
                            </div>
                            <div className="text-text-primary/70 space-y-2">
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
                                <div className="text-text-primary/50 text-sm">Email: {registration.user_email}</div>
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
