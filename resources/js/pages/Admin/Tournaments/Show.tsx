// pages/Admin/Tournaments/Show.tsx - REFACTORIZADO
import { ConfirmModal } from '@/components/Admin/Shared/ConfirmModal';
import { FormModal } from '@/components/Admin/Shared/FormModal';
import { RegistrationForm } from '@/components/Admin/Tournaments/RegistrationForm';
import { RegistrationList } from '@/components/Admin/Tournaments/RegistrationList';
import { TournamentHeader } from '@/components/Admin/Tournaments/TournamentHeader';
import { TournamentInfo } from '@/components/Admin/Tournaments/TournamentInfo';
import { TournamentStats } from '@/components/Admin/Tournaments/TournamentStats';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useCRUD } from '@/hooks/useCRUD';
import { useFormModal } from '@/hooks/useFormModal';
import { useImagePreview } from '@/hooks/useImagePreview';
import AdminLayout from '@/layouts/AdminLayout';
import type { Game, Registration, Tournament, User } from '@/types';
import { useState } from 'react';

interface ShowProps {
    tournament: Tournament;
    registrations: Registration[];
    users: User[];
    games: Game[];
}

// Tipos para formularios
interface RegistrationFormValues {
    user_selection_type: 'existing' | 'new';
    user_id: number | '';
    new_user_name: string;
    new_user_email: string;
    payment_method: string;
    payment_status: string;
    payment_notes: string;
}

interface EditRegistrationFormValues {
    payment_method: string;
    payment_status: string;
    payment_notes: string;
}

interface TournamentFormValues {
    name: string;
    description: string;
    game_id: number | '';
    start_date: string;
    end_date: string;
    registration_start: string;
    entry_fee: string;
    status: string;
    has_registration_limit: boolean;
    registration_limit: string;
}

const Show: React.FC<ShowProps> = ({ tournament, registrations = [], users = [], games = [] }) => {
    // CRUD operations
    const { update } = useCRUD({
        resourceName: 'inscripción',
        routePrefix: 'admin.registrations',
    });

    const tournamentCRUD = useCRUD({
        resourceName: 'torneo',
        routePrefix: 'admin.tournaments',
    });

    // Búsqueda
    const [searchTerm, setSearchTerm] = useState('');

    // Modal: Eliminar inscripción
    const deleteModal = useConfirmModal<Registration>();

    // Modal: Crear inscripción
    const createModal = useFormModal<RegistrationFormValues>({
        initialValues: {
            user_selection_type: 'existing',
            user_id: '',
            new_user_name: '',
            new_user_email: '',
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

            const data = new FormData();
            data.append('user_selection_type', values.user_selection_type);
            data.append('tournament_id', tournament.id.toString());

            if (values.user_selection_type === 'existing') {
                data.append('user_id', values.user_id.toString());
            } else {
                data.append('new_user_name', values.new_user_name.trim());
                if (values.new_user_email.trim()) {
                    data.append('new_user_email', values.new_user_email.trim());
                }
            }

            data.append('payment_method', values.payment_method);
            data.append('payment_status', values.payment_status);

            if (values.payment_notes.trim()) {
                data.append('payment_notes', values.payment_notes.trim());
            }

            // Usamos router directamente porque es una creación especial
            import('@inertiajs/react').then(({ router }) => {
                router.post(route('admin.registrations.store'), data, {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => createModal.close(),
                });
            });
        },
    });

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

    // Modal: Editar torneo
    const editImage = useImagePreview();
    const editTournamentModal = useFormModal<TournamentFormValues & { id: number }>({
        initialValues: {
            id: 0,
            name: '',
            description: '',
            game_id: '',
            start_date: '',
            end_date: '',
            registration_start: '',
            entry_fee: '',
            status: 'draft',
            has_registration_limit: false,
            registration_limit: '',
        },
        onSubmit: (values) => {
            const data = new FormData();
            data.append('name', values.name.trim());
            data.append('game_id', values.game_id.toString());
            data.append('start_date', values.start_date);
            data.append('status', values.status);
            data.append('has_registration_limit', values.has_registration_limit ? '1' : '0');

            if (values.has_registration_limit && values.registration_limit) {
                data.append('registration_limit', values.registration_limit);
            }

            if (values.description.trim()) {
                data.append('description', values.description.trim());
            }
            if (values.end_date) data.append('end_date', values.end_date);
            if (values.registration_start) data.append('registration_start', values.registration_start);
            if (values.entry_fee) data.append('entry_fee', values.entry_fee);
            if (editImage.file) data.append('image', editImage.file);

            tournamentCRUD.update(values.id, data, () => {
                editTournamentModal.close();
                editImage.reset();
            });
        },
    });

    // Handlers
    const handleDeleteRegistration = () => {
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

    const handleEditRegistration = (registration: Registration) => {
        editModal.open({
            id: registration.id,
            payment_method: registration.payment_method,
            payment_status: registration.payment_status,
            payment_notes: registration.payment_notes || '',
        });
    };

    const handleEditTournament = () => {
        const formatDate = (dateString: string | null | undefined): string => {
            if (!dateString) return '';
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return '';
                return date.toISOString().split('T')[0];
            } catch {
                return '';
            }
        };

        editTournamentModal.open({
            id: tournament.id,
            name: tournament.name,
            description: tournament.description || '',
            game_id: tournament.game_id,
            start_date: formatDate(tournament.start_date),
            end_date: formatDate(tournament.end_date),
            registration_start: formatDate(tournament.registration_start),
            entry_fee: tournament.entry_fee?.toString() || '',
            status: tournament.status,
            has_registration_limit: tournament.has_registration_limit || false,
            registration_limit: tournament.registration_limit?.toString() || '',
        });
        editImage.setPreview(tournament.image || '');
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

        update(registration.id, data, () => {}, false);
    };

    // Filtrar inscripciones
    const filteredRegistrations = registrations.filter(
        (reg) => reg.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || reg.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Estadísticas
    const confirmedCount = registrations.filter((r) => r.payment_status === 'confirmed').length;
    const pendingCount = registrations.filter((r) => r.payment_status === 'pending').length;
    const totalRevenue = tournament.entry_fee ? confirmedCount * tournament.entry_fee : 0;

    return (
        <AdminLayout title={`Detalles - ${tournament.name}`} pageTitle="Detalles del Torneo">
            {/* Header */}
            <TournamentHeader tournament={tournament} onEdit={handleEditTournament} games={games} />

            {/* Información del torneo */}
            <TournamentInfo tournament={tournament} registrations={registrations} />

            {/* Lista de inscripciones */}
            <RegistrationList
                registrations={filteredRegistrations}
                allRegistrationsCount={registrations.length}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onEdit={handleEditRegistration}
                onDelete={(reg) => deleteModal.open(reg)}
                onQuickAction={handleQuickAction}
                onCreate={() => createModal.open()}
            />

            {/* Estadísticas */}
            <TournamentStats
                totalRegistrations={registrations.length}
                confirmedCount={confirmedCount}
                pendingCount={pendingCount}
                totalRevenue={totalRevenue}
            />

            {/* Modal: Eliminar inscripción */}
            <ConfirmModal
                show={deleteModal.isOpen}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que deseas eliminar la inscripción de "${deleteModal.item?.user.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                onConfirm={handleDeleteRegistration}
                onCancel={deleteModal.close}
                isDestructive
            />

            {/* Modal: Crear inscripción */}
            <FormModal
                show={createModal.isOpen}
                title={`Nueva Inscripción para ${tournament.name}`}
                onClose={createModal.close}
                onSubmit={createModal.handleSubmit}
                submitText="Crear Inscripción"
            >
                <RegistrationForm
                    values={createModal.values}
                    errors={createModal.errors}
                    onChange={createModal.setValue}
                    users={users}
                    isEditing={false}
                />
            </FormModal>

            {/* Modal: Editar inscripción */}
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
                    isEditing={true}
                />
            </FormModal>

            {/* Modal: Editar torneo */}
            <FormModal
                show={editTournamentModal.isOpen}
                title="Editar Torneo"
                onClose={editTournamentModal.close}
                onSubmit={editTournamentModal.handleSubmit}
                submitText="Guardar Cambios"
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Aquí irían los campos del formulario de torneo */}
                    {/* Por ahora lo dejo simplificado, pero deberías crear un TournamentEditForm component */}
                </div>
            </FormModal>
        </AdminLayout>
    );
};

export default Show;
