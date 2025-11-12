// pages/Admin/Registrations/Index.tsx - OPTIMIZADO
import { RegistrationFilters } from '@/components/Admin/Registrations/RegistrationFilters';
import { RegistrationForm } from '@/components/Admin/Registrations/RegistrationForm';
import { ConfirmModal } from '@/components/Admin/Shared/ConfirmModal';
import { EmptyState } from '@/components/Admin/Shared/EmptyState';
import { FormModal } from '@/components/Admin/Shared/FormModal';
import { StatsCard } from '@/components/Admin/Shared/StatsCard';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useCRUD } from '@/hooks/useCRUD';
import { useFormModal } from '@/hooks/useFormModal';
import AdminLayout from '@/layouts/AdminLayout';
import { DEFAULT_FORM_VALUES, Registration, RegistrationFormValues, Tournament, User } from '@/types';
import { router } from '@inertiajs/react';
import { CheckCircle, Clock, Edit, Eye, Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

interface IndexProps {
    registrations: Registration[];
    tournaments: Tournament[];
    users: User[];
}

// ============================================
// TIPOS ESPECÍFICOS PARA EDICIÓN
// ============================================
interface EditRegistrationFormValues {
    id: number;
    payment_method: string;
    payment_status: string;
    payment_notes: string;
}

// ============================================
// HELPER: Construir FormData para crear inscripción
// ============================================
function buildCreateRegistrationFormData(values: RegistrationFormValues): FormData {
    const data = new FormData();
    data.append('user_selection_type', values.user_selection_type || 'existing');

    if (values.user_selection_type === 'existing') {
        data.append('user_id', values.user_id.toString());
    } else {
        data.append('new_user_name', values.new_user_name?.trim() || '');
        if (values.new_user_email?.trim()) {
            data.append('new_user_email', values.new_user_email.trim());
        }
    }

    data.append('tournament_id', values.tournament_id.toString());
    data.append('payment_method', values.payment_method || 'cash');
    data.append('payment_status', values.payment_status || 'pending');

    if (values.payment_notes?.trim()) {
        data.append('payment_notes', values.payment_notes.trim());
    }

    return data;
}

// ============================================
// HELPER: Construir FormData para editar inscripción
// ============================================
function buildEditRegistrationFormData(values: EditRegistrationFormValues): FormData {
    const data = new FormData();
    data.append('payment_method', values.payment_method);
    data.append('payment_status', values.payment_status);
    if (values.payment_notes?.trim()) {
        data.append('payment_notes', values.payment_notes.trim());
    }
    return data;
}

// ============================================
// HELPER: Validar formulario de creación
// ============================================
function validateCreateForm(values: RegistrationFormValues): string | null {
    if (values.user_selection_type === 'existing' && !values.user_id) {
        return 'Debes seleccionar un usuario.';
    }
    if (values.user_selection_type === 'new' && !values.new_user_name?.trim()) {
        return 'El nombre del nuevo usuario es obligatorio.';
    }
    if (!values.tournament_id) {
        return 'Debes seleccionar un torneo.';
    }
    return null;
}

const Index: React.FC<IndexProps> = ({ registrations, tournaments, users }) => {
    // ============================================
    // CRUD OPERATIONS
    // ============================================
    const { update, navigateTo } = useCRUD({
        resourceName: 'inscripción',
        routePrefix: 'admin.registrations',
    });

    // ============================================
    // ESTADO DE FILTROS
    // ============================================
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
    const [tournamentFilter, setTournamentFilter] = useState('all');
    const [gameFilter, setGameFilter] = useState('all');

    // ============================================
    // MODALES
    // ============================================
    const deleteModal = useConfirmModal<Registration>();

    const createModal = useFormModal<RegistrationFormValues>({
        initialValues: DEFAULT_FORM_VALUES.registration,
        onSubmit: (values) => {
            // Validación
            const error = validateCreateForm(values);
            if (error) {
                alert(error);
                return;
            }

            const data = buildCreateRegistrationFormData(values);

            router.post(route('admin.registrations.store'), data, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => createModal.close(),
            });
        },
    });

    const editModal = useFormModal<EditRegistrationFormValues>({
        initialValues: {
            id: 0,
            user_selection_type: 'existing',
            tournament_id: '',
            user_id: '',
            new_user_name: '',
            new_user_email: '',
            payment_method: '',
            payment_status: '',
            payment_notes: '',
        },
        onSubmit: (values) => {
            const data = buildEditRegistrationFormData(values);
            update(values.id, data, () => editModal.close());
        },
    });

    // ============================================
    // HANDLERS
    // ============================================
    const handleDelete = () => {
        if (deleteModal.item) {
            router.delete(route('admin.registrations.destroy', deleteModal.item.id), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => deleteModal.close(),
            });
        }
    };

    const handleEdit = (registration: Registration) => {
        editModal.open({
            id: registration.id,
            payment_method: registration.payment_method,
            payment_status: registration.payment_status,
            payment_notes: registration.payment_notes || '',
        });
    };

    const handleQuickAction = (registration: Registration, action: 'confirm' | 'pending' | 'cancel') => {
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

    const clearFilters = () => {
        setSearchTerm('');
        setPaymentStatusFilter('all');
        setTournamentFilter('all');
        setGameFilter('all');
    };

    // ============================================
    // FILTRADO
    // ============================================
    const filteredRegistrations = registrations.filter((reg) => {
        const searchMatch =
            !searchTerm ||
            reg.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.tournament.name.toLowerCase().includes(searchTerm.toLowerCase());

        const paymentMatch = paymentStatusFilter === 'all' || reg.payment_status === paymentStatusFilter;

        const tournamentMatch = tournamentFilter === 'all' || reg.tournament.id.toString() === tournamentFilter;

        const gameMatch = gameFilter === 'all' || reg.tournament.game.id.toString() === gameFilter;

        return searchMatch && paymentMatch && tournamentMatch && gameMatch;
    });

    // ============================================
    // ESTADÍSTICAS
    // ============================================
    const confirmedCount = registrations.filter((r) => r.payment_status === 'confirmed').length;

    const pendingCount = registrations.filter((r) => r.payment_status === 'pending').length;

    const totalRevenue = registrations.filter((r) => r.payment_status === 'confirmed' && r.amount).reduce((sum, r) => sum + Number(r.amount || 0), 0);

    return (
        <AdminLayout title="Inscripciones" pageTitle="Gestión de Inscripciones">
            {/* Cabecera y estadísticas */}
            <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatsCard icon={Users} title="Total" value={registrations.length} subtitle="inscripciones" />
                    <StatsCard icon={CheckCircle} title="Confirmadas" value={confirmedCount} subtitle="pagos completados" />
                    <StatsCard icon={Clock} title="Pendientes" value={pendingCount} subtitle="por confirmar" />
                </div>

                <button
                    onClick={() => createModal.open()}
                    className="bg-accent hover:bg-accent-hover rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
                >
                    <Plus className="mr-2 inline-block h-4 w-4" strokeWidth={2} />
                    Nueva Inscripción
                </button>
            </div>

            {/* Filtros */}
            <RegistrationFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                paymentStatusFilter={paymentStatusFilter}
                onPaymentStatusChange={setPaymentStatusFilter}
                gameFilter={gameFilter}
                onGameChange={setGameFilter}
                tournamentFilter={tournamentFilter}
                onTournamentChange={setTournamentFilter}
                tournaments={tournaments}
                onClearFilters={clearFilters}
                totalCount={registrations.length}
                filteredCount={filteredRegistrations.length}
            />

            {/* Lista de inscripciones */}
            {filteredRegistrations.length > 0 ? (
                <div className="border-border-primary bg-secondary mt-8 h-[580px] overflow-auto rounded-xl border shadow-sm">
                    <table className="min-w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-border-primary text-t-secondary border-b">
                                <th className="px-4 py-3 text-left font-medium">Jugador</th>
                                <th className="px-4 py-3 text-left font-medium">Email</th>
                                <th className="px-4 py-3 text-left font-medium">Torneo</th>
                                <th className="px-4 py-3 text-left font-medium">Estado</th>
                                <th className="px-4 py-3 text-left font-medium">Método</th>
                                <th className="px-4 py-3 text-left font-medium">Monto</th>
                                <th className="px-4 py-3 text-left font-medium">Fecha</th>
                                <th className="px-4 py-3 text-right font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRegistrations.map((registration) => (
                                <tr
                                    key={registration.id}
                                    className="border-border-primary/50 hover:bg-tertiary/40 border-b transition-colors last:border-0"
                                >
                                    <td className="text-t-primary px-4 py-3 font-medium">{registration.user?.name || '—'}</td>
                                    <td className="text-t-secondary px-4 py-3">{registration.user?.email || '—'}</td>
                                    <td className="px-4 py-3">{registration.tournament?.name || '—'}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                registration.payment_status === 'confirmed'
                                                    ? 'bg-success/10 text-success'
                                                    : registration.payment_status === 'pending'
                                                      ? 'bg-warning/10 text-warning'
                                                      : 'bg-t-muted/10 text-t-muted'
                                            }`}
                                        >
                                            {registration.payment_status === 'confirmed'
                                                ? 'Confirmado'
                                                : registration.payment_status === 'pending'
                                                  ? 'Pendiente'
                                                  : 'Sin pago'}
                                        </span>
                                    </td>
                                    <td className="text-t-secondary px-4 py-3">
                                        {registration.payment_method === 'cash'
                                            ? 'Efectivo'
                                            : registration.payment_method === 'transfer'
                                              ? 'Transferencia'
                                              : registration.payment_method === 'card'
                                                ? 'Tarjeta'
                                                : '—'}
                                    </td>
                                    <td className="text-t-primary px-4 py-3">
                                        {registration.amount ? `€${Number(registration.amount).toFixed(2)}` : <span className="text-t-muted">—</span>}
                                    </td>
                                    <td className="text-t-secondary px-4 py-3">
                                        {registration.created_at
                                            ? new Date(registration.created_at).toLocaleDateString('es-ES', {
                                                  day: '2-digit',
                                                  month: 'short',
                                                  year: 'numeric',
                                              })
                                            : '—'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex flex-wrap justify-end gap-2">
                                            <button
                                                onClick={() => navigateTo('admin.registrations.show', registration.id)}
                                                className="bg-info hover:bg-info/90 flex items-center gap-1 rounded-md p-2 text-xs font-medium text-white transition-colors"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(registration)}
                                                className="bg-accent hover:bg-accent/90 flex items-center gap-1 rounded-md p-2 text-xs font-medium text-white transition-colors"
                                            >
                                                <Edit className="h-4 w-4" />
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => deleteModal.open(registration)}
                                                className="bg-danger hover:bg-danger/90 flex items-center gap-1 rounded-md p-2 text-xs font-medium text-white transition-colors"
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
            ) : (
                <EmptyState
                    icon={Users}
                    title={
                        searchTerm || paymentStatusFilter !== 'all' || tournamentFilter !== 'all' || gameFilter !== 'all'
                            ? 'No se encontraron inscripciones'
                            : 'No hay inscripciones registradas'
                    }
                    description={
                        searchTerm || paymentStatusFilter !== 'all' || tournamentFilter !== 'all' || gameFilter !== 'all'
                            ? 'No existen inscripciones que coincidan con los filtros aplicados.'
                            : 'Comienza creando la primera inscripción para un torneo.'
                    }
                    actionText={
                        searchTerm || paymentStatusFilter !== 'all' || tournamentFilter !== 'all' || gameFilter !== 'all'
                            ? 'Limpiar filtros'
                            : 'Nueva inscripción'
                    }
                    onAction={
                        searchTerm || paymentStatusFilter !== 'all' || tournamentFilter !== 'all' || gameFilter !== 'all'
                            ? clearFilters
                            : () => createModal.open()
                    }
                />
            )}

            {/* Modal: Eliminar */}
            <ConfirmModal
                show={deleteModal.isOpen}
                title="Confirmar Eliminación"
                message={`¿Seguro que deseas eliminar la inscripción de "${deleteModal.item?.user.name}" al torneo "${deleteModal.item?.tournament.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                onConfirm={handleDelete}
                onCancel={deleteModal.close}
                isDestructive
            />

            {/* Modal: Crear */}
            <FormModal
                show={createModal.isOpen}
                title="Nueva Inscripción"
                onClose={createModal.close}
                onSubmit={createModal.handleSubmit}
                submitText="Crear Inscripción"
            >
                <RegistrationForm
                    values={createModal.values}
                    errors={createModal.errors}
                    onChange={createModal.setValue}
                    users={users}
                    tournaments={tournaments}
                    isEditing={false}
                />
            </FormModal>

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

export default Index;
