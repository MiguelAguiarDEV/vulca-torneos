// components/Admin/Registrations/RegistrationDetails.tsx
import type { Registration } from '@/types';
import { Link } from '@inertiajs/react';
import { Calendar, CreditCard, DollarSign, FileText, Gamepad, Mail, Trophy, User } from 'lucide-react';

interface RegistrationDetailsProps {
    registration: Registration;
}

const getPaymentMethodText = (method: string) => {
    const texts: Record<string, string> = {
        cash: 'Efectivo',
        transfer: 'Transferencia',
        card: 'Tarjeta',
    };
    return texts[method] || method;
};

export function RegistrationDetails({ registration }: RegistrationDetailsProps) {
    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Información del Usuario */}
            <div className="rounded-lg border-2 border-primary/30 bg-secondary/95 p-6 shadow-lg backdrop-blur-sm">
                <h2 className="mb-6 flex items-center text-2xl font-bold text-text-primary">
                    <User className="mr-3 h-6 w-6 text-primary" />
                    Información del Usuario
                </h2>

                <div className="space-y-4">
                    <div className="flex items-start">
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                            <span className="text-2xl font-bold text-primary">{registration.user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-xl font-semibold text-text-primary">{registration.user.name}</h3>
                            <p className="flex items-center text-text-primary/70">
                                <Mail className="mr-2 h-4 w-4" />
                                {registration.user.email}
                            </p>
                            <p className="mt-1 text-sm text-text-primary/50">ID: {registration.user.id}</p>
                        </div>
                    </div>

                    {registration.team_name && (
                        <div className="rounded-lg border border-primary/20 bg-secondary-light/50 p-3">
                            <p className="text-sm font-medium text-text-primary/70">Nombre del Equipo</p>
                            <p className="text-lg font-semibold text-text-primary">{registration.team_name}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Información del Torneo */}
            <div className="rounded-lg border-2 border-primary/30 bg-secondary/95 p-6 shadow-lg backdrop-blur-sm">
                <h2 className="mb-6 flex items-center text-2xl font-bold text-text-primary">
                    <Trophy className="mr-3 h-6 w-6 text-primary" />
                    Información del Torneo
                </h2>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-text-primary/70">Torneo</p>
                        <Link
                            href={route('admin.tournaments.show', registration.tournament.id)}
                            className="text-xl font-semibold text-primary transition-colors hover:text-primary-dark"
                        >
                            {registration.tournament.name}
                        </Link>
                    </div>

                    <div className="flex items-center rounded-lg border border-primary/20 bg-secondary-light/50 p-3">
                        <Gamepad className="mr-3 h-5 w-5 text-primary" />
                        <div>
                            <p className="text-sm font-medium text-text-primary/70">Juego</p>
                            <p className="text-lg font-semibold text-text-primary">{registration.tournament.game.name}</p>
                        </div>
                    </div>

                    <div className="rounded-lg border border-primary/20 bg-secondary-light/50 p-3">
                        <p className="text-sm font-medium text-text-primary/70">ID del Torneo</p>
                        <p className="font-mono text-text-primary">{registration.tournament.id}</p>
                    </div>
                </div>
            </div>

            {/* Información de Pago */}
            <div className="rounded-lg border-2 border-success/30 bg-secondary/95 p-6 shadow-lg backdrop-blur-sm">
                <h2 className="mb-6 flex items-center text-2xl font-bold text-text-primary">
                    <CreditCard className="mr-3 h-6 w-6 text-success" />
                    Información de Pago
                </h2>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-text-primary/70">Método de Pago</p>
                            <p className="text-lg font-semibold text-text-primary">{getPaymentMethodText(registration.payment_method)}</p>
                        </div>

                        {registration.amount !== null && (
                            <div>
                                <p className="text-sm font-medium text-text-primary/70">Importe</p>
                                <p className="flex items-center text-lg font-bold text-success">
                                    <DollarSign className="mr-1 h-5 w-5" />€{registration.amount}
                                </p>
                            </div>
                        )}
                    </div>

                    {registration.payment_notes && (
                        <div className="rounded-lg border border-primary/20 bg-secondary-light/50 p-3">
                            <p className="mb-2 flex items-center text-sm font-medium text-text-primary/70">
                                <FileText className="mr-2 h-4 w-4" />
                                Notas de Pago
                            </p>
                            <p className="text-text-primary">{registration.payment_notes}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Fechas y Estado */}
            <div className="rounded-lg border-2 border-info/30 bg-secondary/95 p-6 shadow-lg backdrop-blur-sm">
                <h2 className="mb-6 flex items-center text-2xl font-bold text-text-primary">
                    <Calendar className="mr-3 h-6 w-6 text-info" />
                    Fechas y Estado
                </h2>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-text-primary/70">Fecha de Inscripción</p>
                            <p className="text-lg font-semibold text-text-primary">
                                {new Date(registration.registered_at).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                            <p className="text-sm text-text-primary/50">
                                {new Date(registration.registered_at).toLocaleTimeString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-text-primary/70">Estado de Inscripción</p>
                            <p className="text-lg font-semibold text-text-primary capitalize">{registration.status}</p>
                        </div>
                    </div>

                    <div className="rounded-lg border border-primary/20 bg-secondary-light/50 p-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <p className="text-text-primary/70">Creado</p>
                                <p className="font-medium text-text-primary">{new Date(registration.created_at).toLocaleDateString('es-ES')}</p>
                            </div>
                            <div>
                                <p className="text-text-primary/70">Actualizado</p>
                                <p className="font-medium text-text-primary">{new Date(registration.updated_at).toLocaleDateString('es-ES')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información Adicional */}
            <div className="rounded-lg border-2 border-primary/30 bg-secondary/95 p-6 shadow-lg backdrop-blur-sm lg:col-span-2">
                <h2 className="mb-6 flex items-center text-2xl font-bold text-text-primary">
                    <FileText className="mr-3 h-6 w-6 text-primary" />
                    Información Adicional
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-primary/20 bg-secondary-light/50 p-4 text-center">
                        <p className="text-sm font-medium text-text-primary/70">ID de Inscripción</p>
                        <p className="mt-1 font-mono text-2xl font-bold text-primary">{registration.id}</p>
                    </div>

                    <div className="rounded-lg border border-primary/20 bg-secondary-light/50 p-4 text-center">
                        <p className="text-sm font-medium text-text-primary/70">ID de Usuario</p>
                        <p className="mt-1 font-mono text-2xl font-bold text-text-primary">{registration.user_id}</p>
                    </div>

                    <div className="rounded-lg border border-primary/20 bg-secondary-light/50 p-4 text-center">
                        <p className="text-sm font-medium text-text-primary/70">ID de Torneo</p>
                        <p className="mt-1 font-mono text-2xl font-bold text-text-primary">{registration.tournament_id}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
