// pages/Admin/Registrations/Show.tsx
import { RegistrationDetails } from '@/components/Admin/Registrations/RegistrationDetails';
import { RegistrationForm } from '@/components/Admin/Registrations/RegistrationForm';
import { ConfirmModal } from '@/components/Admin/Shared/ConfirmModal';
import { FormModal } from '@/components/Admin/Shared/FormModal';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useCRUD } from '@/hooks/useCRUD';
import { useFormModal } from '@/hooks/useFormModal';
import AdminLayout from '@/layouts/AdminLayout';
import type { Registration, Tournament, User } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Clock, Edit, Trash2, XCircle } from 'lucide-react';
import React from 'react';

interface ShowProps {
    registration: Registration;
    tournaments: Tournament[];
    users: User[];
}

interface EditRegistrationFormValues {
    payment_method: string;
    payment_status: string;
    payment_notes: string;
}

const Show: React.FC<ShowProps> = ({ registration, tournaments, users }) => {
    // CRUD
    const { update, destroy, navigateTo } = useCRUD({
        resourceName: 'inscripción',
        routePrefix: 'admin.registrations',
    });

    // Modal: Confirmar eliminación
    const deleteModal = useConfirmModal<Registration>();

    // Modal: Editar inscripción
    const editModal = useFormModal<EditRegistrationFormValues & { id: number }>({
        initialValues: {
            id: 0,
            payment_method: '',
            payment_status: '',
            payment_notes: '',
        },
        onSubmit: (values) => {
            const data = new FormData();
            data.append('payment_method', values.payment_method);
            data.append('payment_status', values.payment_status);
            if (values.payment_notes.trim()) {
                data.append('payment_notes', values.payment_notes.trim());
            }
            update(values.id, data, () => editModal.close());
        },
    });

    // Handlers
    const handleDelete = () => {
        if (deleteModal.item) {
            destroy(deleteModal.item.id, () => navigateTo('admin.registrations.index'));
        }
    };

    const handleEdit = () => {
        editModal.open({
            id: registration.id,
            payment_method: registration.payment_method,
            payment_status: registration.payment_status,
            payment_notes: registration.payment_notes || '',
        });
    };

    const handleQuickAction = (action: 'confirm' | 'pending' | 'cancel') => {
        const statusMap = {
            confirm: 'confirmed',
            pending: 'pending',
            cancel: 'failed',
        };

        const data = new FormData();
        data.append('payment_method', registration.payment_method);
        data.append('payment_status', statusMap[action]);

        let notes = registration.payment_notes || '';
        if (action === 'cancel') {
            notes += ' - Inscripción cancelada por administrador';
        }
        data.append('payment_notes', notes);

        update(registration.id, data, () => {});
    };

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

    return (
        <AdminLayout title={`Inscripción - ${registration.user.name}`} pageTitle="Detalles de la Inscripción">
            {/* Encabezado */}
            <div className="border-border-primary bg-secondary mb-8 rounded-xl border p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.registrations.index')}
                            className="border-border-primary text-t-primary hover:bg-accent/10 rounded-lg border p-2 transition-all hover:scale-105"
                            title="Volver al listado"
                        >
                            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
                        </Link>

                        <div>
                            <div className="mb-1 flex items-center gap-3">
                                <h1 className="text-t-primary text-2xl font-bold">Inscripción #{registration.id}</h1>
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium shadow-sm ${getPaymentStatusColor(
                                        registration.payment_status
                                    )}`}
                                >
                                    {getPaymentStatusText(registration.payment_status)}
                                </span>
                            </div>
                            <p className="text-t-secondary text-sm">
                                {registration.user.name} → {registration.tournament.name}
                            </p>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-wrap gap-2">
                        {registration.payment_status === 'pending' && (
                            <button
                                onClick={() => handleQuickAction('confirm')}
                                className="bg-success hover:bg-success/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-md"
                            >
                                <CheckCircle className="h-4 w-4" strokeWidth={2} />
                                Confirmar Pago
                            </button>
                        )}
                        {registration.payment_status === 'confirmed' && (
                            <button
                                onClick={() => handleQuickAction('pending')}
                                className="bg-warning hover:bg-warning/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-md"
                            >
                                <Clock className="h-4 w-4" strokeWidth={2} />
                                Marcar Pendiente
                            </button>
                        )}
                        <button
                            onClick={handleEdit}
                            className="bg-info hover:bg-info/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-md"
                        >
                            <Edit className="h-4 w-4" strokeWidth={2} />
                            Editar
                        </button>
                        <button
                            onClick={() => handleQuickAction('cancel')}
                            className="bg-danger hover:bg-danger/90 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-md"
                        >
                            <XCircle className="h-4 w-4" strokeWidth={2} />
                            Cancelar
                        </button>
                        <button
                            onClick={() => deleteModal.open(registration)}
                            className="border-border-primary hover:bg-danger/10 text-danger flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-all hover:shadow-md"
                        >
                            <Trash2 className="h-4 w-4" strokeWidth={2} />
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>

            {/* Detalles */}
            <RegistrationDetails registration={registration} />

            {/* Modal: Eliminar */}
            <ConfirmModal
                show={deleteModal.isOpen}
                title="Confirmar Eliminación"
                message={`¿Seguro que deseas eliminar la inscripción de "${registration.user.name}" al torneo "${registration.tournament.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                onConfirm={handleDelete}
                onCancel={deleteModal.close}
                isDestructive
            />

            {/* Modal: Editar */}
            <FormModal
                show={editModal.isOpen}
                title="Editar Inscripción"
                onClose={editModal.close}
                onSubmit={editModal.handleSubmit}
                submitText="Guardar Cambios"
            >
                <RegistrationForm
                    values={editModal.values}
                    errors={editModal.errors}
                    onChange={(key, value) => editModal.setValue(key, value)}
                    users={users}
                    tournaments={tournaments}
                    isEditing={true}
                />
            </FormModal>
        </AdminLayout>
    );
};

export default Show;
