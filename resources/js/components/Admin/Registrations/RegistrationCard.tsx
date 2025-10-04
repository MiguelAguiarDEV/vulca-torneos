// components/Admin/Registrations/RegistrationCard.tsx
import type { Registration } from '@/types';
import { CheckCircle, Clock, Edit, Gamepad2, Mail, Trash2, Trophy, User, XCircle } from 'lucide-react';

interface RegistrationCardProps {
    registration: Registration;
    onClick: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onQuickAction: (registration: Registration, action: 'confirm' | 'pending' | 'cancel') => void;
}

const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        pending: 'bg-warning text-secondary',
        confirmed: 'bg-success text-text-primary',
        failed: 'bg-error text-text-primary',
    };
    return colors[status] || 'bg-secondary text-text-primary';
};

const getPaymentStatusText = (status: string) => {
    const texts: Record<string, string> = {
        pending: 'Pendiente',
        confirmed: 'Confirmado',
        failed: 'Fallido',
    };
    return texts[status] || status;
};

const getPaymentMethodText = (method: string) => {
    const texts: Record<string, string> = {
        cash: 'Efectivo',
        transfer: 'Transferencia',
        card: 'Tarjeta',
    };
    return texts[method] || method;
};

export function RegistrationCard({ registration, onClick, onEdit, onDelete, onQuickAction }: RegistrationCardProps) {
    return (
        <div
            onClick={onClick}
            className="group cursor-pointer rounded-lg border-2 border-primary/30 bg-secondary/95 p-6 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:border-primary hover:shadow-xl"
        >
            {/* Header con usuario y estado */}
            <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                        <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">{registration.user.name}</h3>
                        <p className="flex items-center text-sm text-text-primary/70">
                            <Mail className="mr-1 h-3 w-3" />
                            {registration.user.email}
                        </p>
                    </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${getPaymentStatusColor(registration.payment_status)}`}>
                    {getPaymentStatusText(registration.payment_status)}
                </span>
            </div>

            {/* Info del torneo */}
            <div className="mb-4 space-y-2 rounded-lg border border-primary/20 bg-secondary-dark/50 p-3">
                <div className="flex items-center text-sm text-text-primary">
                    <Trophy className="mr-2 h-4 w-4 text-primary" />
                    <span className="font-medium">{registration.tournament.name}</span>
                </div>
                <div className="flex items-center text-sm text-text-primary/70">
                    <Gamepad2 className="mr-2 h-4 w-4 text-primary/70" />
                    <span>{registration.tournament.game.name}</span>
                </div>
            </div>

            {/* Detalles de pago */}
            <div className="mb-4 space-y-1 text-sm">
                <div className="flex justify-between text-text-primary/70">
                    <span>Método:</span>
                    <span className="font-medium text-text-primary">{getPaymentMethodText(registration.payment_method)}</span>
                </div>
                {registration.amount && (
                    <div className="flex justify-between text-text-primary/70">
                        <span>Importe:</span>
                        <span className="font-bold text-primary">€{registration.amount}</span>
                    </div>
                )}
                <div className="flex justify-between text-text-primary/70">
                    <span>Fecha:</span>
                    <span className="font-medium text-text-primary">{new Date(registration.registered_at).toLocaleDateString('es-ES')}</span>
                </div>
            </div>

            {registration.payment_notes && (
                <div className="mb-4 rounded border border-primary/10 bg-secondary-light/30 p-2 text-xs text-text-primary/60">
                    <span className="font-medium">Notas:</span> {registration.payment_notes}
                </div>
            )}

            {/* Acciones */}
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                {registration.payment_status === 'pending' && (
                    <button
                        onClick={() => onQuickAction(registration, 'confirm')}
                        className="flex flex-1 items-center justify-center rounded-lg bg-success px-3 py-2 text-sm font-medium text-text-primary transition-all hover:scale-105"
                        title="Confirmar pago"
                    >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Confirmar
                    </button>
                )}
                {registration.payment_status === 'confirmed' && (
                    <button
                        onClick={() => onQuickAction(registration, 'pending')}
                        className="flex flex-1 items-center justify-center rounded-lg bg-warning px-3 py-2 text-sm font-medium text-secondary transition-all hover:scale-105"
                        title="Marcar como pendiente"
                    >
                        <Clock className="mr-1 h-4 w-4" />
                        Pendiente
                    </button>
                )}
                <button
                    onClick={onEdit}
                    className="flex items-center justify-center rounded-lg bg-info px-3 py-2 text-sm font-medium text-text-primary transition-all hover:scale-105"
                    title="Editar"
                >
                    <Edit className="h-4 w-4" />
                </button>
                <button
                    onClick={() => onQuickAction(registration, 'cancel')}
                    className="bg-error flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-text-primary transition-all hover:scale-105"
                    title="Cancelar"
                >
                    <XCircle className="h-4 w-4" />
                </button>
                <button
                    onClick={onDelete}
                    className="bg-error flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-text-primary transition-all hover:scale-105"
                    title="Eliminar"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
