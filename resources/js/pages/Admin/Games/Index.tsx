// pages/Admin/Games/Index.tsx
import { GameCard } from '@/components/Admin/Games/GameCard';
import { GameForm } from '@/components/Admin/Games/GameForm';
import { ConfirmModal } from '@/components/Admin/Shared/ConfirmModal';
import { EmptyState } from '@/components/Admin/Shared/EmptyState';
import { FormModal } from '@/components/Admin/Shared/FormModal';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useCRUD } from '@/hooks/useCRUD';
import { useFormModal } from '@/hooks/useFormModal';
import { useImagePreview } from '@/hooks/useImagePreview';
import AdminLayout from '@/layouts/AdminLayout';
import { Game } from '@/types';
import { Gamepad, Plus } from 'lucide-react';
import React from 'react';

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
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-t-primary text-3xl font-bold">Juegos</h1>
                    <p className="text-t-muted mt-1 text-sm">
                        {games.length === 0
                            ? 'Ningún juego creado'
                            : games.length === 1
                              ? '1 juego disponible'
                              : `${games.length} juegos disponibles`}
                    </p>
                </div>

                <button
                    onClick={() => createModal.open()}
                    className="border-border-primary bg-accent hover:bg-accent-hover flex w-fit cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
                >
                    <Plus className="h-4 w-4" strokeWidth={2} />
                    Crear Juego
                </button>
            </div>

            {/* Games grid or empty state */}
            {games.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
                <div className="py-12">
                    <EmptyState
                        icon={Gamepad}
                        title="No hay juegos todavía"
                        description="Empieza creando tu primer juego para organizar torneos."
                        actionText="Crear Mi Primer Juego"
                        onAction={() => createModal.open()}
                    />
                </div>
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
