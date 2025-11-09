// components/Admin/Registrations/RegistrationCard.tsx
import type { Registration } from '@/types';
import { CheckCircle, Clock, Edit, Mail, Trash2, Trophy, User, XCircle } from 'lucide-react';

interface RegistrationCardProps {
    registration: Registration;
    onClick?: (registration: Registration) => void;
    onEdit: (registration: Registration) => void;
    onDelete: (registration: Registration) => void;
    onQuickAction: (registration: Registration, action: 'confirm' | 'pending' | 'cancel') => void;
}

const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        pending: 'bg-warning/10 text-warning',
        confirmed: 'bg-success/10 text-success',
        failed: 'bg-danger/10 text-danger',
    };
    return colors[status] || 'bg-tertiary text-t-primary';
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

function formatAmount(value: unknown): string | null {
    // admite number, string numérica o null/undefined
    if (typeof value === 'number' && Number.isFinite(value)) return value.toFixed(2);
    if (typeof value === 'string') {
        const n = Number(value);
        if (Number.isFinite(n)) return n.toFixed(2);
    }
    return null;
}

export function RegistrationCard({ registration, onClick, onEdit, onDelete, onQuickAction }: RegistrationCardProps) {
    const amountFormatted = formatAmount((registration as any).amount);
    const dateSrc = (registration as any).registered_at || registration.created_at;
    const dateLabel = dateSrc ? new Date(dateSrc).toLocaleDateString('es-ES') : '—';

    return (
        <div
            className="border-border-primary bg-secondary group relative flex cursor-pointer flex-col rounded-xl border p-5 shadow-sm transition-all hover:shadow-md"
            onClick={() => onClick?.(registration)}
        >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-accent/10 text-accent flex h-10 w-10 items-center justify-center rounded-full">
                        <User className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="text-t-primary text-base font-semibold">{registration.user.name}</h3>
                        <p className="text-t-secondary flex items-center gap-1 text-xs">
                            <Mail className="h-3 w-3" strokeWidth={2} />
                            {registration.user.email}
                        </p>
                    </div>
                </div>

                <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${getPaymentStatusColor(registration.payment_status)}`}>
                    {getPaymentStatusText(registration.payment_status)}
                </span>
            </div>

            {/* Torneo */}
            <div className="border-border-primary bg-tertiary mb-4 rounded-lg border p-3 text-sm">
                <div className="flex items-center gap-2">
                    <Trophy className="text-accent h-4 w-4" strokeWidth={2} />
                    <span className="text-t-primary font-medium">{registration.tournament.name}</span>
                </div>
                <p className="text-t-secondary ml-6 text-xs">{registration.tournament.game.name}</p>
            </div>

            {/* Detalles de pago */}
            <div className="text-t-secondary mb-4 space-y-1 text-sm">
                <div className="flex justify-between">
                    <span>Método:</span>
                    <span className="text-t-primary font-medium">{getPaymentMethodText(registration.payment_method)}</span>
                </div>
                {amountFormatted !== null && (
                    <div className="flex justify-between">
                        <span>Importe:</span>
                        <span className="text-success font-semibold">€{amountFormatted}</span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span>Fecha:</span>
                    <span className="text-t-primary font-medium">{dateLabel}</span>
                </div>
            </div>

            {/* Notas */}
            {registration.payment_notes && (
                <div className="border-border-primary bg-tertiary text-t-secondary mb-4 rounded-lg border p-2 text-xs italic">
                    <span className="text-t-primary font-medium">Notas:</span> {registration.payment_notes}
                </div>
            )}

            {/* Acciones */}
            <div className="mt-auto flex flex-wrap gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                {registration.payment_status === 'pending' && (
                    <button
                        onClick={() => onQuickAction(registration, 'confirm')}
                        className="bg-success hover:bg-success/90 flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:shadow-md"
                        title="Confirmar pago"
                    >
                        <CheckCircle className="h-3.5 w-3.5" strokeWidth={2} />
                        Confirmar
                    </button>
                )}
                {registration.payment_status === 'confirmed' && (
                    <button
                        onClick={() => onQuickAction(registration, 'pending')}
                        className="bg-warning hover:bg-warning/90 flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:shadow-md"
                        title="Marcar como pendiente"
                    >
                        <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                        Pendiente
                    </button>
                )}
                <button
                    onClick={() => onEdit(registration)}
                    className="bg-info hover:bg-info/90 flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:shadow-md"
                    title="Editar inscripción"
                >
                    <Edit className="h-3.5 w-3.5" strokeWidth={2} />
                    Editar
                </button>
                <button
                    onClick={() => onQuickAction(registration, 'cancel')}
                    className="bg-danger/80 hover:bg-danger flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:shadow-md"
                    title="Cancelar inscripción"
                >
                    <XCircle className="h-3.5 w-3.5" strokeWidth={2} />
                    Cancelar
                </button>
                <button
                    onClick={() => onDelete(registration)}
                    className="border-border-primary hover:bg-danger/10 text-danger flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium shadow-sm transition-all hover:shadow-md"
                    title="Eliminar inscripción"
                >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                    Eliminar
                </button>
            </div>
        </div>
    );
}
