// pages/Admin/Games/Index.tsx - REFACTORIZADO
import { GameCard } from '@/components/Admin/Games/GameCard';
import { GameForm } from '@/components/Admin/Games/GameForm';
import { ConfirmModal } from '@/components/Admin/Shared/ConfirmModal';
import { EmptyState } from '@/components/Admin/Shared/EmptyState';
import { FormModal } from '@/components/Admin/Shared/FormModal';
import { StatsCard } from '@/components/Admin/Shared/StatsCard';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useCRUD } from '@/hooks/useCRUD';
import { useFormModal } from '@/hooks/useFormModal';
import { useImagePreview } from '@/hooks/useImagePreview';
import AdminLayout from '@/layouts/AdminLayout';
import { Gamepad, Plus } from 'lucide-react';
import React from 'react';

interface Game {
    id: number;
    name: string;
    description: string | null;
    image: string;
}

interface IndexProps {
    games: Game[];
}

interface GameFormValues {
    name: string;
    description: string;
}

const Index: React.FC<IndexProps> = ({ games }) => {
    // CRUD operations
    const { create, update, destroy, navigateTo } = useCRUD({
        resourceName: 'juego',
        routePrefix: 'admin.games',
    });

    // Delete modal
    const deleteModal = useConfirmModal<Game>();

    // Create modal
    const createModal = useFormModal<GameFormValues>({
        initialValues: { name: '', description: '' },
        onSubmit: (values) => {
            const data = new FormData();
            data.append('name', values.name.trim());
            data.append('description', values.description.trim() || '');
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
    const editModal = useFormModal<GameFormValues & { id: number }>({
        initialValues: { id: 0, name: '', description: '' },
        onSubmit: (values) => {
            const data = new FormData();
            data.append('name', values.name.trim());
            data.append('description', values.description.trim() || '');
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
    const handleEdit = (game: Game) => {
        editModal.open({
            id: game.id,
            name: game.name,
            description: game.description || '',
        });
        editImage.setPreview(game.image);
    };

    const handleDelete = () => {
        if (deleteModal.item) {
            destroy(deleteModal.item.id, deleteModal.close);
        }
    };

    const handleCardClick = (game: Game) => {
        navigateTo('admin.games.show', game.id);
    };

    return (
        <AdminLayout title="Juegos" pageTitle="Gestión de Juegos">
            {/* Header with stats and create button */}
            <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <StatsCard
                    icon={Gamepad}
                    title="Total de Juegos"
                    value={games.length}
                    subtitle={games.length === 0 ? 'Ningún juego creado' : games.length === 1 ? 'Juego disponible' : 'Juegos disponibles'}
                />

                <button
                    onClick={() => createModal.open()}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-secondary shadow-lg transition-all duration-200 hover:scale-105 hover:bg-primary-dark hover:shadow-xl"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Crear Nuevo Juego
                </button>
            </div>

            {/* Games grid or empty state */}
            {games.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {games.map((game) => (
                        <GameCard
                            key={game.id}
                            game={game}
                            onEdit={() => handleEdit(game)}
                            onDelete={() => deleteModal.open(game)}
                            onClick={() => handleCardClick(game)}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Gamepad}
                    title="No hay juegos todavía"
                    description="Empieza creando tu primer juego para organizar torneos."
                    actionText="Crear Mi Primer Juego"
                    onAction={() => createModal.open()}
                />
            )}

            {/* Delete confirmation modal */}
            <ConfirmModal
                show={deleteModal.isOpen}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que quieres eliminar el juego "${deleteModal.item?.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                onConfirm={handleDelete}
                onCancel={deleteModal.close}
                isDestructive
            />

            {/* Create modal */}
            <FormModal
                show={createModal.isOpen}
                title="Crear Nuevo Juego"
                onClose={createModal.close}
                onSubmit={createModal.handleSubmit}
                submitText="Crear Juego"
            >
                <GameForm values={createModal.values} errors={createModal.errors} onChange={createModal.setValue} image={createImage} />
            </FormModal>

            {/* Edit modal */}
            <FormModal show={editModal.isOpen} title="Editar Juego" onClose={editModal.close} onSubmit={editModal.handleSubmit} submitText="Guardar">
                <GameForm values={editModal.values} errors={editModal.errors} onChange={editModal.setValue} image={editImage} />
            </FormModal>
        </AdminLayout>
    );
};

export default Index;
