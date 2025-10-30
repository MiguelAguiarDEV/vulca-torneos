// pages/Admin/Registrations/Index.tsx - REFACTORIZADO
import { RegistrationCard } from '@/components/Admin/Registrations/RegistrationCard';
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
import type { Registration, Tournament, User } from '@/types';
import { Plus, UserPlus } from 'lucide-react';
import { useState } from 'react';

interface IndexProps {
    registrations: Registration[];
    tournaments: Tournament[];
    users: User[];
}

interface RegistrationFormValues {
    user_selection_type: 'existing' | 'new';
    user_id: number | '';
    new_user_name: string;
    new_user_email: string;
    tournament_id: number | '';
    payment_method: string;
    payment_status: string;
    payment_notes: string;
}

interface EditRegistrationFormValues {
    payment_method: string;
    payment_status: string;
    payment_notes: string;
}

const Index: React.FC<IndexProps> = ({ registrations, tournaments, users }) => {
    // CRUD
    const { update, navigateTo } = useCRUD({
        resourceName: 'inscripción',
        routePrefix: 'admin.registrations',
    });

    // Filtros y búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
    const [tournamentFilter, setTournamentFilter] = useState('all');
    const [gameFilter, setGameFilter] = useState('all');

    // Modal: Eliminar
    const deleteModal = useConfirmModal<Registration>();

    // Modal: Crear
    const createModal = useFormModal<RegistrationFormValues>({
        initialValues: {
            user_selection_type: 'existing',
            user_id: '',
            new_user_name: '',
            new_user_email: '',
            tournament_id: '',
            payment_method: 'cash',
            payment_status: 'pending',
            payment_notes: '',
        },
        onSubmit: (values) => {
            if (values.user_selection_type === 'existing' && !values.user_id) {
                alert('Debes seleccionar un usuario');
                return;
            }
            if (values.user_selection_type === 'new' && !values.new_user_name.trim()) {
                alert('El nombre del nuevo usuario es requerido');
                return;
            }
            if (!values.tournament_id) {
                alert('Debes seleccionar un torneo');
                return;
            }

            const data = new FormData();
            data.append('user_selection_type', values.user_selection_type);

            if (values.user_selection_type === 'existing') {
                data.append('user_id', values.user_id.toString());
            } else {
                data.append('new_user_name', values.new_user_name.trim());
                if (values.new_user_email.trim()) {
                    data.append('new_user_email', values.new_user_email.trim());
                }
            }

            data.append('tournament_id', values.tournament_id.toString());
            data.append('payment_method', values.payment_method);
            data.append('payment_status', values.payment_status);

            if (values.payment_notes.trim()) {
                data.append('payment_notes', values.payment_notes.trim());
            }

            import('@inertiajs/react').then(({ router }) => {
                router.post(route('admin.registrations.store'), data, {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => createModal.close(),
                });
            });
        },
    });

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
            import('@inertiajs/react').then(({ router }) => {
                router.delete(route('admin.registrations.destroy', deleteModal.item!.id), {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => deleteModal.close(),
                });
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

    // Filtrado
    const filteredRegistrations = registrations.filter((reg) => {
        const searchMatch =
            searchTerm === '' ||
            reg.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.tournament.name.toLowerCase().includes(searchTerm.toLowerCase());

        const paymentMatch = paymentStatusFilter === 'all' || reg.payment_status === paymentStatusFilter;
        const tournamentMatch = tournamentFilter === 'all' || reg.tournament.id.toString() === tournamentFilter;
        const gameMatch = gameFilter === 'all' || reg.tournament.game.id.toString() === gameFilter;

        return searchMatch && paymentMatch && tournamentMatch && gameMatch;
    });

    // Estadísticas
    const confirmedCount = registrations.filter((r) => r.payment_status === 'confirmed').length;
    const pendingCount = registrations.filter((r) => r.payment_status === 'pending').length;
    const totalRevenue = registrations.filter((r) => r.payment_status === 'confirmed' && r.amount).reduce((sum, r) => sum + (r.amount || 0), 0);

    return (
        <AdminLayout title="Inscripciones" pageTitle="Gestión de Inscripciones">
            {/* Header con stats y botón crear */}
            <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatsCard
                        icon={UserPlus}
                        title="Total"
                        value={filteredRegistrations.length}
                        subtitle={`${filteredRegistrations.length !== registrations.length ? `de ${registrations.length}` : 'inscripciones'}`}
                    />
                    <StatsCard icon={UserPlus} title="Confirmadas" value={confirmedCount} subtitle="pagos completados" variant="success" />
                    <StatsCard icon={UserPlus} title="Pendientes" value={pendingCount} subtitle="por confirmar" variant="warning" />
                </div>

                <button
                    onClick={() => createModal.open()}
                    className="bg-primary text-secondary hover:bg-primary-dark inline-flex items-center justify-center rounded-lg px-6 py-3 font-semibold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                >
                    <Plus className="mr-2 h-5 w-5" />
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

            {/* Grid de inscripciones */}
            {filteredRegistrations.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredRegistrations.map((registration) => (
                        <RegistrationCard
                            key={registration.id}
                            registration={registration}
                            onClick={() => navigateTo('admin.registrations.show', registration.id)}
                            onEdit={() => handleEdit(registration)}
                            onDelete={() => deleteModal.open(registration)}
                            onQuickAction={handleQuickAction}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={UserPlus}
                    title={
                        searchTerm || paymentStatusFilter !== 'all' || tournamentFilter !== 'all' || gameFilter !== 'all'
                            ? 'No se encontraron inscripciones'
                            : 'No hay inscripciones'
                    }
                    description={
                        searchTerm || paymentStatusFilter !== 'all' || tournamentFilter !== 'all' || gameFilter !== 'all'
                            ? 'No hay inscripciones que coincidan con los filtros.'
                            : 'Comienza registrando la primera inscripción para un torneo.'
                    }
                    actionText={
                        searchTerm || paymentStatusFilter !== 'all' || tournamentFilter !== 'all' || gameFilter !== 'all'
                            ? 'Limpiar Filtros'
                            : 'Primera Inscripción'
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
                message={`¿Estás seguro de que deseas eliminar la inscripción de "${deleteModal.item?.user.name}" al torneo "${deleteModal.item?.tournament.name}"? Esta acción no se puede deshacer.`}
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
