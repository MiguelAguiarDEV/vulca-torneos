// components/Admin/Registrations/RegistrationDetails.tsx
import type { Registration } from '@/types';
import { Link } from '@inertiajs/react';
import { Calendar, CreditCard, DollarSign, FileText, Gamepad2, Mail, Trophy, User } from 'lucide-react';

interface RegistrationDetailsProps {
    registration: Registration;
}

const getPaymentMethodText = (method: string) => {
    const map: Record<string, string> = {
        cash: 'Efectivo',
        transfer: 'Transferencia',
        card: 'Tarjeta',
    };
    return map[method] || method;
};

export function RegistrationDetails({ registration }: RegistrationDetailsProps) {
    const formatDate = (date?: string | null) => {
        if (!date) return '—';
        try {
            return new Date(date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return '—';
        }
    };

    const formatTime = (date?: string | null) => {
        if (!date) return '';
        try {
            return new Date(date).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return '';
        }
    };

    const amount =
        typeof registration.amount === 'number'
            ? registration.amount.toFixed(2)
            : typeof registration.amount === 'string'
              ? Number(registration.amount).toFixed(2)
              : null;

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Usuario */}
            <div className="border-border-primary bg-secondary rounded-xl border p-6 shadow-sm">
                <h2 className="text-t-primary mb-4 flex items-center text-xl font-semibold">
                    <User className="text-accent mr-3 h-5 w-5" />
                    Información del Usuario
                </h2>

                <div className="flex items-start gap-4">
                    <div className="bg-accent/10 text-accent flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold">
                        {registration.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-t-primary text-lg font-semibold">{registration.user.name}</h3>
                        <p className="text-t-secondary flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4" strokeWidth={2} />
                            {registration.user.email}
                        </p>
                        <p className="text-t-muted mt-1 text-xs">ID: {registration.user.id}</p>
                    </div>
                </div>

                {registration.team_name && (
                    <div className="border-border-primary bg-tertiary mt-5 rounded-lg border p-3">
                        <p className="text-t-secondary text-sm font-medium">Nombre del equipo</p>
                        <p className="text-t-primary font-semibold">{registration.team_name}</p>
                    </div>
                )}
            </div>

            {/* Torneo */}
            <div className="border-border-primary bg-secondary rounded-xl border p-6 shadow-sm">
                <h2 className="text-t-primary mb-4 flex items-center text-xl font-semibold">
                    <Trophy className="text-accent mr-3 h-5 w-5" />
                    Información del Torneo
                </h2>

                <div className="space-y-4">
                    <div>
                        <p className="text-t-secondary text-sm font-medium">Torneo</p>
                        <Link
                            href={route('admin.tournaments.show', registration.tournament.id)}
                            className="text-accent hover:text-accent-hover font-semibold transition-colors"
                        >
                            {registration.tournament.name}
                        </Link>
                    </div>

                    <div className="border-border-primary bg-tertiary flex items-center gap-3 rounded-lg border p-3">
                        <Gamepad2 className="text-accent h-4 w-4" strokeWidth={2} />
                        <div>
                            <p className="text-t-secondary text-sm font-medium">Juego</p>
                            <p className="text-t-primary font-semibold">{registration.tournament.game.name}</p>
                        </div>
                    </div>

                    <div className="border-border-primary bg-tertiary rounded-lg border p-3">
                        <p className="text-t-secondary text-sm font-medium">ID del Torneo</p>
                        <p className="text-t-primary font-mono text-sm">{registration.tournament.id}</p>
                    </div>
                </div>
            </div>

            {/* Pago */}
            <div className="border-border-primary bg-secondary rounded-xl border p-6 shadow-sm">
                <h2 className="text-t-primary mb-4 flex items-center text-xl font-semibold">
                    <CreditCard className="text-success mr-3 h-5 w-5" />
                    Información de Pago
                </h2>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-t-secondary mb-1 font-medium">Método</p>
                        <p className="text-t-primary font-semibold">{getPaymentMethodText(registration.payment_method)}</p>
                    </div>

                    {amount && (
                        <div>
                            <p className="text-t-secondary mb-1 font-medium">Importe</p>
                            <p className="text-success flex items-center gap-1 font-bold">
                                <DollarSign className="h-4 w-4" strokeWidth={2} />€{amount}
                            </p>
                        </div>
                    )}
                </div>

                {registration.payment_notes && (
                    <div className="border-border-primary bg-tertiary mt-5 rounded-lg border p-3 text-sm">
                        <p className="text-t-secondary mb-1 flex items-center gap-2 font-medium">
                            <FileText className="h-4 w-4" strokeWidth={2} /> Notas
                        </p>
                        <p className="text-t-primary">{registration.payment_notes}</p>
                    </div>
                )}
            </div>

            {/* Fechas */}
            <div className="border-border-primary bg-secondary rounded-xl border p-6 shadow-sm">
                <h2 className="text-t-primary mb-4 flex items-center text-xl font-semibold">
                    <Calendar className="text-info mr-3 h-5 w-5" />
                    Fechas y Estado
                </h2>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-t-secondary mb-1 font-medium">Inscripción</p>
                        <p className="text-t-primary font-semibold">{formatDate(registration.registered_at)}</p>
                        <p className="text-t-muted">{formatTime(registration.registered_at)}</p>
                    </div>
                    <div>
                        <p className="text-t-secondary mb-1 font-medium">Estado</p>
                        <p className="text-t-primary font-semibold capitalize">{registration.status}</p>
                    </div>
                </div>

                <div className="border-border-primary bg-tertiary mt-5 rounded-lg border p-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <p className="text-t-secondary mb-1 font-medium">Creado</p>
                            <p className="text-t-primary">{formatDate(registration.created_at)}</p>
                        </div>
                        <div>
                            <p className="text-t-secondary mb-1 font-medium">Actualizado</p>
                            <p className="text-t-primary">{formatDate(registration.updated_at)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* IDs */}
            <div className="border-border-primary bg-secondary rounded-xl border p-6 shadow-sm lg:col-span-2">
                <h2 className="text-t-primary mb-4 flex items-center text-xl font-semibold">
                    <FileText className="text-accent mr-3 h-5 w-5" />
                    Identificadores
                </h2>

                <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
                    <div className="border-border-primary bg-tertiary rounded-lg border p-4">
                        <p className="text-t-secondary text-xs font-medium">ID Inscripción</p>
                        <p className="text-accent mt-1 font-mono text-lg font-semibold">{registration.id}</p>
                    </div>
                    <div className="border-border-primary bg-tertiary rounded-lg border p-4">
                        <p className="text-t-secondary text-xs font-medium">ID Usuario</p>
                        <p className="text-t-primary mt-1 font-mono text-lg font-semibold">{registration.user_id}</p>
                    </div>
                    <div className="border-border-primary bg-tertiary rounded-lg border p-4">
                        <p className="text-t-secondary text-xs font-medium">ID Torneo</p>
                        <p className="text-t-primary mt-1 font-mono text-lg font-semibold">{registration.tournament_id}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
