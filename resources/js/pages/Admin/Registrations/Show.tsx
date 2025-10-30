// pages/Admin/Registrations/Show.tsx - REFACTORIZADO
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

    // Modal: Eliminar
    const deleteModal = useConfirmModal<Registration>();

    // Modal: Editar
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
            destroy(deleteModal.item.id, () => {
                navigateTo('admin.registrations.index');
            });
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

    return (
        <AdminLayout title={`Inscripción - ${registration.user.name}`} pageTitle="Detalles de la Inscripción">
            {/* Header */}
            <div className="mb-8">
                <div className="border-primary/30 bg-secondary/95 rounded-lg border-2 p-6 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link
                                href={route('admin.registrations.index')}
                                className="border-primary/30 text-text-primary hover:border-primary hover:bg-primary/20 mr-6 rounded-lg border p-3 transition-all duration-200 hover:scale-110"
                            >
                                <ArrowLeft className="h-6 w-6" />
                            </Link>
                            <div>
                                <div className="mb-2 flex items-center gap-4">
                                    <h1 className="text-4xl font-bold text-white drop-shadow-lg">Inscripción #{registration.id}</h1>
                                    <span
                                        className={`rounded-full px-4 py-2 text-sm font-medium shadow-lg ${getPaymentStatusColor(registration.payment_status)}`}
                                    >
                                        {getPaymentStatusText(registration.payment_status)}
                                    </span>
                                </div>
                                <p className="text-text-primary/70 text-lg">
                                    {registration.user.name} - {registration.tournament.name}
                                </p>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-2">
                            {registration.payment_status === 'pending' && (
                                <button
                                    onClick={() => handleQuickAction('confirm')}
                                    className="bg-success text-text-primary flex items-center rounded-lg px-4 py-2 font-semibold shadow-lg transition-all hover:scale-105"
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Confirmar Pago
                                </button>
                            )}
                            {registration.payment_status === 'confirmed' && (
                                <button
                                    onClick={() => handleQuickAction('pending')}
                                    className="bg-warning text-secondary flex items-center rounded-lg px-4 py-2 font-semibold shadow-lg transition-all hover:scale-105"
                                >
                                    <Clock className="mr-2 h-4 w-4" />
                                    Marcar Pendiente
                                </button>
                            )}
                            <button
                                onClick={handleEdit}
                                className="bg-info text-text-primary flex items-center rounded-lg px-4 py-2 font-semibold shadow-lg transition-all hover:scale-105"
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </button>
                            <button
                                onClick={() => handleQuickAction('cancel')}
                                className="bg-error text-text-primary flex items-center rounded-lg px-4 py-2 font-semibold shadow-lg transition-all hover:scale-105"
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancelar
                            </button>
                            <button
                                onClick={() => deleteModal.open(registration)}
                                className="bg-error text-text-primary flex items-center rounded-lg px-4 py-2 font-semibold shadow-lg transition-all hover:scale-105"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detalles de la inscripción */}
            <RegistrationDetails registration={registration} />

            {/* Modal: Eliminar */}
            <ConfirmModal
                show={deleteModal.isOpen}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que deseas eliminar la inscripción de "${registration.user.name}" al torneo "${registration.tournament.name}"? Esta acción no se puede deshacer.`}
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
