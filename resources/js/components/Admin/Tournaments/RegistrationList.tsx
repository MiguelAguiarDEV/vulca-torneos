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
        <div className="border-primary/30 bg-secondary/95 rounded-lg border-2 p-6 shadow-lg backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                    <Users className="text-primary mr-3 h-8 w-8" />
                    <h2 className="text-text-primary text-2xl font-bold">Inscripciones</h2>
                </div>
                <button
                    onClick={onCreate}
                    className="bg-primary text-secondary hover:bg-primary-dark inline-flex items-center rounded-lg px-4 py-2 font-semibold shadow-lg transition-all hover:scale-105"
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
                        className="border-primary/30 bg-secondary-light text-text-primary placeholder-text-primary/50 focus:border-primary focus:ring-primary w-full rounded-lg border px-4 py-3 pl-10 focus:ring-2 focus:outline-none"
                    />
                    <Search className="text-primary/70 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                    {searchTerm && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="text-text-primary/50 hover:text-text-primary absolute top-1/2 right-3 -translate-y-1/2"
                        >
                            <XCircle className="h-5 w-5" />
                        </button>
                    )}
                </div>
                {searchTerm && (
                    <p className="text-text-primary/60 mt-2 text-sm">
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
                            className="border-primary/30 bg-secondary-dark/80 hover:border-primary rounded-lg border p-4 backdrop-blur-sm transition-all hover:shadow-lg"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <div>
                                    <h3 className="text-text-primary text-lg font-semibold">{registration.user.name}</h3>
                                    <p className="text-text-primary/70 text-sm">{registration.user.email}</p>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-sm font-medium ${getPaymentStatusColor(registration.payment_status)}`}>
                                    {getPaymentStatusText(registration.payment_status)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-text-primary/70 space-y-1 text-sm">
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
                                            className="bg-success text-text-primary flex items-center rounded-lg px-3 py-2 text-sm font-medium shadow-lg transition-all hover:scale-105"
                                            title="Confirmar pago"
                                        >
                                            <CheckCircle className="mr-1 h-4 w-4" />
                                            Confirmar
                                        </button>
                                    )}
                                    {registration.payment_status === 'confirmed' && (
                                        <button
                                            onClick={() => onQuickAction(registration, 'pending')}
                                            className="bg-warning text-secondary flex items-center rounded-lg px-3 py-2 text-sm font-medium shadow-lg transition-all hover:scale-105"
                                            title="Marcar como pendiente"
                                        >
                                            <Clock className="mr-1 h-4 w-4" />
                                            Pendiente
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onEdit(registration)}
                                        className="bg-info text-text-primary flex items-center rounded-lg px-3 py-2 text-sm font-medium shadow-lg transition-all hover:scale-105"
                                    >
                                        <Edit className="mr-1 h-4 w-4" />
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => onQuickAction(registration, 'cancel')}
                                        className="bg-error text-text-primary flex items-center rounded-lg px-3 py-2 text-sm font-medium shadow-lg transition-all hover:scale-105"
                                    >
                                        <XCircle className="mr-1 h-4 w-4" />
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => onDelete(registration)}
                                        className="bg-error text-text-primary flex items-center rounded-lg px-3 py-2 text-sm font-medium shadow-lg transition-all hover:scale-105"
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
                    <Users className="text-primary/50 mx-auto mb-4 h-16 w-16" />
                    <h3 className="text-text-primary mb-2 text-lg font-semibold">
                        {searchTerm ? 'No se encontraron resultados' : 'No hay inscripciones'}
                    </h3>
                    <p className="text-text-primary/70 mb-6">
                        {searchTerm
                            ? `No hay inscripciones que coincidan con "${searchTerm}"`
                            : 'Las inscripciones aparecerán aquí cuando los usuarios se registren'}
                    </p>
                    <button
                        onClick={searchTerm ? () => onSearchChange('') : onCreate}
                        className="bg-primary text-secondary hover:bg-primary-dark inline-flex items-center rounded-lg px-4 py-2 font-semibold shadow-lg transition-all"
                    >
                        {searchTerm ? <XCircle className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                        {searchTerm ? 'Limpiar búsqueda' : 'Primera Inscripción'}
                    </button>
                </div>
            )}
        </div>
    );
}
