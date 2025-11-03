// pages/Admin/Tournaments/Index.tsx - REFACTORIZADO
import { ConfirmModal } from '@/components/Admin/Shared/ConfirmModal';
import { EmptyState } from '@/components/Admin/Shared/EmptyState';
import { FormModal } from '@/components/Admin/Shared/FormModal';
import { StatsCard } from '@/components/Admin/Shared/StatsCard';
import { TournamentCard } from '@/components/Admin/Tournaments/TournamentCard';
import { TournamentForm } from '@/components/Admin/Tournaments/TournamentForm';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useCRUD } from '@/hooks/useCRUD';
import { useFormModal } from '@/hooks/useFormModal';
import { useImagePreview } from '@/hooks/useImagePreview';
import AdminLayout from '@/layouts/AdminLayout';
import { Game, Tournament } from '@/types';
import { Plus, Trophy } from 'lucide-react';
import React from 'react';

interface IndexProps {
    tournaments: Tournament[];
    games: Game[];
}

type TournamentStatus = 'draft' | 'published' | 'registration_open' | 'registration_closed' | 'ongoing' | 'finished' | 'cancelled';

interface TournamentFormValues {
    name: string;
    description: string;
    game_id: number | '';
    start_date: string;
    end_date: string;
    registration_start: string;
    registration_end: string;
    entry_fee: string;
    has_registration_limit: boolean;
    registration_limit: string;
    status: TournamentStatus;
}

const Index: React.FC<IndexProps> = ({ tournaments, games }) => {
    // CRUD operations
    const { create, update, destroy, navigateTo } = useCRUD({
        resourceName: 'torneo',
        routePrefix: 'admin.tournaments',
    });

    // Delete modal
    const deleteModal = useConfirmModal<Tournament>();

    // Create modal
    const createModal = useFormModal<TournamentFormValues>({
        initialValues: {
            name: '',
            description: '',
            game_id: '',
            start_date: '',
            end_date: '',
            registration_start: '',
            registration_end: '',
            entry_fee: '',
            has_registration_limit: false,
            registration_limit: '',
            status: 'draft',
        },
        onSubmit: (values) => {
            const data = new FormData();

            // Campos requeridos
            data.append('name', values.name.trim());
            data.append('description', values.description.trim() || '');
            data.append('game_id', String(values.game_id));
            data.append('start_date', values.start_date);
            data.append('status', values.status);

            // Campos opcionales
            if (values.end_date) {
                data.append('end_date', values.end_date);
            }
            if (values.registration_start) {
                data.append('registration_start', values.registration_start);
            }
            if (values.registration_end) {
                data.append('registration_end', values.registration_end);
            }
            if (values.entry_fee) {
                data.append('entry_fee', values.entry_fee);
            }

            // Límite de inscripciones
            data.append('has_registration_limit', values.has_registration_limit ? '1' : '0');
            if (values.has_registration_limit && values.registration_limit) {
                data.append('registration_limit', values.registration_limit);
            }

            // Imagen
            if (createImage.file) {
                data.append('image', createImage.file);
            }

            create(data, () => {
                createModal.close();
                createImage.reset();
            });
        },
    });
    const createImage = useImagePreview();

    // Edit modal
    type EditFormValues = TournamentFormValues & { id: number };
    const editModal = useFormModal<EditFormValues>({
        initialValues: {
            id: 0,
            name: '',
            description: '',
            game_id: '',
            start_date: '',
            end_date: '',
            registration_start: '',
            registration_end: '',
            entry_fee: '',
            has_registration_limit: false,
            registration_limit: '',
            status: 'draft',
        },
        onSubmit: (values) => {
            const data = new FormData();

            // Campos requeridos
            data.append('name', values.name.trim());
            data.append('description', values.description.trim() || '');
            data.append('game_id', String(values.game_id));
            data.append('start_date', values.start_date);
            data.append('status', values.status);

            // IMPORTANTE: Laravel necesita _method para actualizar con FormData
            data.append('_method', 'PUT');

            // Campos opcionales
            if (values.end_date) {
                data.append('end_date', values.end_date);
            }
            if (values.registration_start) {
                data.append('registration_start', values.registration_start);
            }
            if (values.registration_end) {
                data.append('registration_end', values.registration_end);
            }
            if (values.entry_fee) {
                data.append('entry_fee', values.entry_fee);
            }

            // Límite de inscripciones
            data.append('has_registration_limit', values.has_registration_limit ? '1' : '0');
            if (values.has_registration_limit && values.registration_limit) {
                data.append('registration_limit', values.registration_limit);
            }

            // Imagen
            if (editImage.file) {
                data.append('image', editImage.file);
            }

            update(values.id, data, () => {
                editModal.close();
                editImage.reset();
            });
        },
    });
    const editImage = useImagePreview();

    // Handlers
    const handleEdit = (tournament: Tournament) => {
        editModal.open({
            id: tournament.id,
            name: tournament.name,
            description: tournament.description || '',
            game_id: tournament.game_id,
            start_date: tournament.start_date.split('T')[0],
            end_date: tournament.end_date ? tournament.end_date.split('T')[0] : '',
            registration_start: tournament.registration_start ? tournament.registration_start.split('T')[0] : '',
            registration_end: tournament.registration_end ? tournament.registration_end.split('T')[0] : '',
            entry_fee: tournament.entry_fee ? String(tournament.entry_fee) : '',
            has_registration_limit: tournament.has_registration_limit,
            registration_limit: tournament.registration_limit ? String(tournament.registration_limit) : '',
            status: tournament.status as TournamentStatus,
        });
        editImage.setPreview(tournament.image || '');
    };

    const handleDelete = () => {
        if (deleteModal.item) {
            destroy(deleteModal.item.id, deleteModal.close);
        }
    };

    const handleCardClick = (tournament: Tournament) => {
        navigateTo('admin.tournaments.show', tournament.id);
    };

    return (
        <AdminLayout title="Torneos" pageTitle="Gestión de Torneos">
            {/* Header with stats and create button */}
            <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row">
                <StatsCard
                    icon={Trophy}
                    title="Torneos"
                    value={tournaments.length}
                    subtitle={tournaments.length === 0 ? 'Ningún torneo creado' : tournaments.length === 1 ? 'Torneo disponible' : 'disponibles'}
                />

                <button
                    onClick={() => createModal.open()}
                    className="border-border-primary bg-accent hover:bg-accent-hover flex w-fit cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
                >
                    <Plus className="h-4 w-4" strokeWidth={2} />
                    Crear Nuevo Torneo
                </button>
            </div>

            {/* Tournaments grid or empty state */}
            {tournaments.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {tournaments.map((tournament) => (
                        <TournamentCard
                            key={tournament.id}
                            tournament={tournament}
                            onClick={() => handleCardClick(tournament)}
                            onEdit={() => handleEdit(tournament)}
                            onDelete={() => deleteModal.open(tournament)}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Trophy}
                    title="No hay torneos todavía"
                    description="Comienza creando tu primer torneo para organizar competiciones."
                    actionText="Crear Mi Primer Torneo"
                    onAction={() => createModal.open()}
                />
            )}

            {/* Delete confirmation modal */}
            <ConfirmModal
                show={deleteModal.isOpen}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que quieres eliminar el torneo "${deleteModal.item?.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                onConfirm={handleDelete}
                onCancel={deleteModal.close}
                isDestructive
            />

            {/* Create modal */}
            <FormModal
                show={createModal.isOpen}
                title="Crear Nuevo Torneo"
                onClose={createModal.close}
                onSubmit={createModal.handleSubmit}
                submitText="Crear Torneo"
            >
                <TournamentForm
                    values={createModal.values}
                    errors={createModal.errors}
                    onChange={createModal.setValue}
                    image={createImage}
                    games={games}
                />
            </FormModal>

            {/* Edit modal */}
            <FormModal show={editModal.isOpen} title="Editar Torneo" onClose={editModal.close} onSubmit={editModal.handleSubmit} submitText="Guardar">
                <TournamentForm
                    values={editModal.values}
                    errors={editModal.errors}
                    onChange={editModal.setValue as <K extends keyof TournamentFormValues>(key: K, value: TournamentFormValues[K]) => void}
                    image={editImage}
                    games={games}
                />
            </FormModal>
        </AdminLayout>
    );
};

export default Index;
