// components/Admin/Tournaments/RegistrationList.tsx
import type { Registration } from '@/types';
import { CheckCircle, Clock, CreditCard, Edit, PlusCircle, Search, Trash2, Users, XCircle } from 'lucide-react';

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
        <div className="border-border-primary bg-secondary mt-8 rounded-xl border p-6 shadow-sm">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-t-primary flex items-center gap-2 text-lg font-semibold">
                    <Users className="text-accent h-5 w-5" strokeWidth={2} />
                    Inscripciones
                </h2>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative">
                        <Search className="text-t-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" strokeWidth={2} />
                        <input
                            type="text"
                            placeholder="Buscar jugador..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="border-border-primary bg-tertiary text-t-primary placeholder-t-muted focus:ring-accent w-full rounded-lg border px-9 py-2 text-sm outline-none focus:ring-2 sm:w-64"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                className="text-t-muted hover:text-accent absolute top-1/2 right-3 -translate-y-1/2"
                                onClick={() => onSearchChange('')}
                            >
                                <XCircle className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <button className="btn-accent flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium" onClick={onCreate}>
                        <PlusCircle className="h-4 w-4" />
                        Nueva inscripción
                    </button>
                </div>
            </div>

            {/* Contenido */}
            {registrations.length === 0 ? (
                <div className="py-12 text-center">
                    <Users className="text-accent/30 mx-auto mb-4 h-16 w-16" />
                    <h3 className="text-t-primary mb-2 text-lg font-semibold">
                        {searchTerm ? 'No se encontraron resultados' : 'No hay inscripciones'}
                    </h3>
                    <p className="text-t-muted mb-6">
                        {searchTerm
                            ? `No hay inscripciones que coincidan con "${searchTerm}"`
                            : 'Las inscripciones aparecerán aquí cuando los usuarios se registren'}
                    </p>
                    <button
                        onClick={searchTerm ? () => onSearchChange('') : onCreate}
                        className="btn-accent inline-flex items-center rounded-lg px-4 py-2 font-semibold shadow-lg transition-all"
                    >
                        {searchTerm ? <XCircle className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                        {searchTerm ? 'Limpiar búsqueda' : 'Primera Inscripción'}
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-border-primary text-t-secondary border-b">
                                <th className="px-4 py-3 text-left font-medium">Jugador</th>
                                <th className="px-4 py-3 text-left font-medium">Estado</th>
                                <th className="px-4 py-3 text-left font-medium">Monto</th>
                                <th className="px-4 py-3 text-left font-medium">Fecha</th>
                                <th className="px-4 py-3 text-right font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map((reg) => (
                                <tr key={reg.id} className="border-border-primary/50 hover:bg-tertiary/40 border-b transition-colors last:border-0">
                                    {/* Jugador */}
                                    <td className="text-t-primary px-4 py-3 font-medium">{reg.user?.name ?? '—'}</td>

                                    {/* Estado */}
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                reg.payment_status === 'confirmed'
                                                    ? 'bg-success/10 text-success'
                                                    : reg.payment_status === 'pending'
                                                      ? 'bg-warning/10 text-warning'
                                                      : 'bg-t-muted/10 text-t-muted'
                                            }`}
                                        >
                                            {reg.payment_status === 'confirmed'
                                                ? 'Confirmado'
                                                : reg.payment_status === 'pending'
                                                  ? 'Pendiente'
                                                  : 'Sin pago'}
                                        </span>
                                    </td>

                                    {/* Monto */}
                                    <td className="px-4 py-3">
                                        {reg.amount ? (
                                            <div className="text-t-primary flex items-center gap-1">
                                                <CreditCard className="text-accent h-4 w-4" strokeWidth={2} />€{Number(reg.amount).toFixed(2)}
                                            </div>
                                        ) : (
                                            <span className="text-t-muted">—</span>
                                        )}
                                    </td>

                                    {/* Fecha */}
                                    <td className="text-t-secondary px-4 py-3">
                                        {reg.created_at
                                            ? new Date(reg.created_at).toLocaleDateString('es-ES', {
                                                  day: '2-digit',
                                                  month: 'short',
                                                  year: 'numeric',
                                              })
                                            : '—'}
                                    </td>

                                    {/* Acciones */}
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex flex-wrap justify-end gap-2">
                                            {/* Confirmar/Pendiente */}
                                            {reg.payment_status === 'pending' ? (
                                                <button
                                                    onClick={() => onQuickAction(reg, 'confirm')}
                                                    className="bg-success hover:bg-success/90 flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-white transition-colors"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                    Confirmar
                                                </button>
                                            ) : reg.payment_status === 'confirmed' ? (
                                                <button
                                                    onClick={() => onQuickAction(reg, 'pending')}
                                                    className="bg-warning hover:bg-warning/90 flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-white transition-colors"
                                                >
                                                    <Clock className="h-4 w-4" />
                                                    Marcar como pendiente
                                                </button>
                                            ) : null}

                                            {/* Editar */}
                                            <button
                                                onClick={() => onEdit(reg)}
                                                className="bg-info hover:bg-info/90 flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-white transition-colors"
                                            >
                                                <Edit className="h-4 w-4" />
                                                Editar
                                            </button>

                                            {/* Eliminar */}
                                            <button
                                                onClick={() => onDelete(reg)}
                                                className="bg-danger hover:bg-danger/90 flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-white transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
