// components/Admin/Tournaments/RegistrationList.tsx
import type { Registration } from '@/types';
import { CheckCircle, Clock, Edit, Plus, Search, Trash2, Users, XCircle } from 'lucide-react';

interface RegistrationListProps {
    registrations: Registration[];
    allRegistrationsCount: number;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onEdit: (registration: Registration) => void;
    onDelete: (registration: Registration) => void;
    onQuickAction: (registration: Registration, action: 'confirm' | 'pending' | 'cancel') => void;
    onCreate: () => void;
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

export function RegistrationList({
    registrations,
    allRegistrationsCount,
    searchTerm,
    onSearchChange,
    onEdit,
    onDelete,
    onQuickAction,
    onCreate,
}: RegistrationListProps) {
    return (
        <div className="rounded-lg border-2 border-primary/30 bg-secondary/95 p-6 shadow-lg backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <Users className="mr-3 h-8 w-8 text-primary" />
                    <h2 className="text-2xl font-bold text-text-primary">Inscripciones</h2>
                </div>
                <button
                    onClick={onCreate}
                    className="inline-flex items-center rounded-lg bg-primary px-4 py-2 font-semibold text-secondary shadow-lg transition-all hover:scale-105 hover:bg-primary-dark"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Inscripción
                </button>
            </div>

            {/* Búsqueda */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full rounded-lg border border-primary/30 bg-secondary-light px-4 py-3 pl-10 text-text-primary placeholder-text-primary/50 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-primary/70" />
                    {searchTerm && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-text-primary/50 hover:text-text-primary"
                        >
                            <XCircle className="h-5 w-5" />
                        </button>
                    )}
                </div>
                {searchTerm && (
                    <p className="mt-2 text-sm text-text-primary/60">
                        Mostrando {registrations.length} de {allRegistrationsCount} inscripciones
                    </p>
                )}
            </div>

            {/* Lista */}
            {registrations.length > 0 ? (
                <div className="space-y-4">
                    {registrations.map((registration) => (
                        <div
                            key={registration.id}
                            className="rounded-lg border border-primary/30 bg-secondary-dark/80 p-4 backdrop-blur-sm transition-all hover:border-primary hover:shadow-lg"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-text-primary">{registration.user.name}</h3>
                                    <p className="text-sm text-text-primary/70">{registration.user.email}</p>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-sm font-medium ${getPaymentStatusColor(registration.payment_status)}`}>
                                    {getPaymentStatusText(registration.payment_status)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1 text-sm text-text-primary/70">
                                    <div>
                                        <span className="font-medium">Método:</span>
                                        <span className="ml-2">{getPaymentMethodText(registration.payment_method)}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Inscrito:</span>
                                        <span className="ml-2">{new Date(registration.created_at).toLocaleDateString('es-ES')}</span>
                                    </div>
                                    {registration.payment_notes && (
                                        <div>
                                            <span className="font-medium">Notas:</span>
                                            <span className="ml-2">{registration.payment_notes}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {registration.payment_status === 'pending' && (
                                        <button
                                            onClick={() => onQuickAction(registration, 'confirm')}
                                            className="flex items-center rounded-lg bg-success px-3 py-2 text-sm font-medium text-text-primary shadow-lg transition-all hover:scale-105"
                                            title="Confirmar pago"
                                        >
                                            <CheckCircle className="mr-1 h-4 w-4" />
                                            Confirmar
                                        </button>
                                    )}
                                    {registration.payment_status === 'confirmed' && (
                                        <button
                                            onClick={() => onQuickAction(registration, 'pending')}
                                            className="flex items-center rounded-lg bg-warning px-3 py-2 text-sm font-medium text-secondary shadow-lg transition-all hover:scale-105"
                                            title="Marcar como pendiente"
                                        >
                                            <Clock className="mr-1 h-4 w-4" />
                                            Pendiente
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onEdit(registration)}
                                        className="flex items-center rounded-lg bg-info px-3 py-2 text-sm font-medium text-text-primary shadow-lg transition-all hover:scale-105"
                                    >
                                        <Edit className="mr-1 h-4 w-4" />
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => onQuickAction(registration, 'cancel')}
                                        className="bg-error flex items-center rounded-lg px-3 py-2 text-sm font-medium text-text-primary shadow-lg transition-all hover:scale-105"
                                    >
                                        <XCircle className="mr-1 h-4 w-4" />
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => onDelete(registration)}
                                        className="bg-error flex items-center rounded-lg px-3 py-2 text-sm font-medium text-text-primary shadow-lg transition-all hover:scale-105"
                                    >
                                        <Trash2 className="mr-1 h-4 w-4" />
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center">
                    <Users className="mx-auto mb-4 h-16 w-16 text-primary/50" />
                    <h3 className="mb-2 text-lg font-semibold text-text-primary">
                        {searchTerm ? 'No se encontraron resultados' : 'No hay inscripciones'}
                    </h3>
                    <p className="mb-6 text-text-primary/70">
                        {searchTerm
                            ? `No hay inscripciones que coincidan con "${searchTerm}"`
                            : 'Las inscripciones aparecerán aquí cuando los usuarios se registren'}
                    </p>
                    <button
                        onClick={searchTerm ? () => onSearchChange('') : onCreate}
                        className="inline-flex items-center rounded-lg bg-primary px-4 py-2 font-semibold text-secondary shadow-lg transition-all hover:bg-primary-dark"
                    >
                        {searchTerm ? <XCircle className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                        {searchTerm ? 'Limpiar búsqueda' : 'Primera Inscripción'}
                    </button>
                </div>
            )}
        </div>
    );
}
