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
            <div className="border-primary/30 bg-secondary/95 rounded-lg border-2 p-6 shadow-lg backdrop-blur-sm">
                <h2 className="text-text-primary mb-6 flex items-center text-2xl font-bold">
                    <User className="text-primary mr-3 h-6 w-6" />
                    Información del Usuario
                </h2>

                <div className="space-y-4">
                    <div className="flex items-start">
                        <div className="bg-primary/20 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full">
                            <span className="text-primary text-2xl font-bold">{registration.user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-text-primary text-xl font-semibold">{registration.user.name}</h3>
                            <p className="text-text-primary/70 flex items-center">
                                <Mail className="mr-2 h-4 w-4" />
                                {registration.user.email}
                            </p>
                            <p className="text-text-primary/50 mt-1 text-sm">ID: {registration.user.id}</p>
                        </div>
                    </div>

                    {registration.team_name && (
                        <div className="border-primary/20 bg-secondary-light/50 rounded-lg border p-3">
                            <p className="text-text-primary/70 text-sm font-medium">Nombre del Equipo</p>
                            <p className="text-text-primary text-lg font-semibold">{registration.team_name}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Información del Torneo */}
            <div className="border-primary/30 bg-secondary/95 rounded-lg border-2 p-6 shadow-lg backdrop-blur-sm">
                <h2 className="text-text-primary mb-6 flex items-center text-2xl font-bold">
                    <Trophy className="text-primary mr-3 h-6 w-6" />
                    Información del Torneo
                </h2>

                <div className="space-y-4">
                    <div>
                        <p className="text-text-primary/70 text-sm font-medium">Torneo</p>
                        <Link
                            href={route('admin.tournaments.show', registration.tournament.id)}
                            className="text-primary hover:text-primary-dark text-xl font-semibold transition-colors"
                        >
                            {registration.tournament.name}
                        </Link>
                    </div>

                    <div className="border-primary/20 bg-secondary-light/50 flex items-center rounded-lg border p-3">
                        <Gamepad className="text-primary mr-3 h-5 w-5" />
                        <div>
                            <p className="text-text-primary/70 text-sm font-medium">Juego</p>
                            <p className="text-text-primary text-lg font-semibold">{registration.tournament.game.name}</p>
                        </div>
                    </div>

                    <div className="border-primary/20 bg-secondary-light/50 rounded-lg border p-3">
                        <p className="text-text-primary/70 text-sm font-medium">ID del Torneo</p>
                        <p className="text-text-primary font-mono">{registration.tournament.id}</p>
                    </div>
                </div>
            </div>

            {/* Información de Pago */}
            <div className="border-success/30 bg-secondary/95 rounded-lg border-2 p-6 shadow-lg backdrop-blur-sm">
                <h2 className="text-text-primary mb-6 flex items-center text-2xl font-bold">
                    <CreditCard className="text-success mr-3 h-6 w-6" />
                    Información de Pago
                </h2>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-text-primary/70 text-sm font-medium">Método de Pago</p>
                            <p className="text-text-primary text-lg font-semibold">{getPaymentMethodText(registration.payment_method)}</p>
                        </div>

                        {registration.amount !== null && (
                            <div>
                                <p className="text-text-primary/70 text-sm font-medium">Importe</p>
                                <p className="text-success flex items-center text-lg font-bold">
                                    <DollarSign className="mr-1 h-5 w-5" />€{registration.amount}
                                </p>
                            </div>
                        )}
                    </div>

                    {registration.payment_notes && (
                        <div className="border-primary/20 bg-secondary-light/50 rounded-lg border p-3">
                            <p className="text-text-primary/70 mb-2 flex items-center text-sm font-medium">
                                <FileText className="mr-2 h-4 w-4" />
                                Notas de Pago
                            </p>
                            <p className="text-text-primary">{registration.payment_notes}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Fechas y Estado */}
            <div className="border-info/30 bg-secondary/95 rounded-lg border-2 p-6 shadow-lg backdrop-blur-sm">
                <h2 className="text-text-primary mb-6 flex items-center text-2xl font-bold">
                    <Calendar className="text-info mr-3 h-6 w-6" />
                    Fechas y Estado
                </h2>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-text-primary/70 text-sm font-medium">Fecha de Inscripción</p>
                            <p className="text-text-primary text-lg font-semibold">
                                {new Date(registration.registered_at).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                            <p className="text-text-primary/50 text-sm">
                                {new Date(registration.registered_at).toLocaleTimeString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>

                        <div>
                            <p className="text-text-primary/70 text-sm font-medium">Estado de Inscripción</p>
                            <p className="text-text-primary text-lg font-semibold capitalize">{registration.status}</p>
                        </div>
                    </div>

                    <div className="border-primary/20 bg-secondary-light/50 rounded-lg border p-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <p className="text-text-primary/70">Creado</p>
                                <p className="text-text-primary font-medium">{new Date(registration.created_at).toLocaleDateString('es-ES')}</p>
                            </div>
                            <div>
                                <p className="text-text-primary/70">Actualizado</p>
                                <p className="text-text-primary font-medium">{new Date(registration.updated_at).toLocaleDateString('es-ES')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información Adicional */}
            <div className="border-primary/30 bg-secondary/95 rounded-lg border-2 p-6 shadow-lg backdrop-blur-sm lg:col-span-2">
                <h2 className="text-text-primary mb-6 flex items-center text-2xl font-bold">
                    <FileText className="text-primary mr-3 h-6 w-6" />
                    Información Adicional
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="border-primary/20 bg-secondary-light/50 rounded-lg border p-4 text-center">
                        <p className="text-text-primary/70 text-sm font-medium">ID de Inscripción</p>
                        <p className="text-primary mt-1 font-mono text-2xl font-bold">{registration.id}</p>
                    </div>

                    <div className="border-primary/20 bg-secondary-light/50 rounded-lg border p-4 text-center">
                        <p className="text-text-primary/70 text-sm font-medium">ID de Usuario</p>
                        <p className="text-text-primary mt-1 font-mono text-2xl font-bold">{registration.user_id}</p>
                    </div>

                    <div className="border-primary/20 bg-secondary-light/50 rounded-lg border p-4 text-center">
                        <p className="text-text-primary/70 text-sm font-medium">ID de Torneo</p>
                        <p className="text-text-primary mt-1 font-mono text-2xl font-bold">{registration.tournament_id}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
