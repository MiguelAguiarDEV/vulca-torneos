import Modal from '@/components/UI/Modal';
import AdminLayout from '@/layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { Gamepad, Pencil, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

// Tipo para un juego
interface Game {
    id: number;
    name: string;
    description: string | null;
    image: string;
}

// Props del componente
interface IndexProps {
    games: Game[];
}

const Index: React.FC<IndexProps> = ({ games }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [gameToEdit, setGameToEdit] = useState<Game | null>(null);
    const [editName, setEditName] = useState<string>('');
    const [editDescription, setEditDescription] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string>('');

    // Estados para el modal de crear
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createName, setCreateName] = useState<string>('');
    const [createDescription, setCreateDescription] = useState<string>('');
    const [createImageFile, setCreateImageFile] = useState<File | null>(null);
    const [createPreviewImage, setCreatePreviewImage] = useState<string>('');

    const confirmDelete = (game: Game) => {
        setGameToDelete(game);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setGameToDelete(null);
    };

    const deleteGame = () => {
        if (gameToDelete) {
            router.delete(route('admin.games.destroy', gameToDelete.id), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Juego eliminado exitosamente');
                    closeDeleteModal();
                },
                onError: (errors) => {
                    console.error('Error al eliminar el juego:', errors);
                    alert('Error al eliminar el juego. Intenta nuevamente.');
                },
            });
        }
    };
    const openEditModal = (game: Game) => {
        setGameToEdit(game);
        setEditName(game.name);
        setEditDescription(game.description || ''); // Asegurar que no sea null/undefined
        setPreviewImage(game.image);
        setShowEditModal(true);
    };

    const navigateToGameDetails = (game: Game) => {
        router.get(route('admin.games.show', game.id));
    };
    const closeEditModal = () => {
        setShowEditModal(false);
        setGameToEdit(null);
        setEditName('');
        setEditDescription('');
        setImageFile(null);
        setPreviewImage('');
    };
    const saveEdit = () => {
        if (gameToEdit) {
            // Validación del lado del cliente
            if (!editName.trim()) {
                alert('El nombre del juego es requerido');
                return;
            }

            const data = new FormData();
            data.append('_method', 'PUT');
            data.append('name', editName.trim());

            // Manejo especial para descripción vacía
            const description = editDescription ? editDescription.trim() : '';
            data.append('description', description);

            if (imageFile) {
                data.append('image', imageFile);
            }

            console.log('Datos antes de enviar:', {
                name: editName.trim(),
                description: description,
                descriptionLength: description.length,
                hasImage: !!imageFile,
                formData: Object.fromEntries(data.entries()),
            });

            router.post(route('admin.games.update', gameToEdit.id), data, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    console.log('Juego actualizado exitosamente');
                    closeEditModal();
                },
                onError: (errors) => {
                    console.error('Error al actualizar el juego:', errors);
                    // Mostrar errores específicos de validación
                    let errorMessage = 'Error al actualizar el juego:\n';
                    Object.keys(errors).forEach((key) => {
                        errorMessage += `${key}: ${errors[key]}\n`;
                    });
                    alert(errorMessage);
                },
            });
        }
    };

    // Funciones para el modal de crear
    const openCreateModal = () => {
        setShowCreateModal(true);
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
        setCreateName('');
        setCreateDescription('');
        setCreateImageFile(null);
        setCreatePreviewImage('');
    };

    const saveCreate = () => {
        // Validación del lado del cliente
        if (!createName.trim()) {
            alert('El nombre del juego es requerido');
            return;
        }

        const data = new FormData();
        data.append('name', createName.trim());

        // Manejo especial para descripción vacía
        const description = createDescription ? createDescription.trim() : '';
        data.append('description', description);

        if (createImageFile) {
            data.append('image', createImageFile);
        }

        router.post(route('admin.games.store'), data, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                console.log('Juego creado exitosamente');
                closeCreateModal();
            },
            onError: (errors) => {
                console.error('Error al crear el juego:', errors);
                // Mostrar errores específicos de validación
                let errorMessage = 'Error al crear el juego:\n';
                Object.keys(errors).forEach((key) => {
                    errorMessage += `${key}: ${errors[key]}\n`;
                });
                alert(errorMessage);
            },
        });
    };

    return (
        <AdminLayout title="Juegos" pageTitle="Gestión de Juegos">
            <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div className="rounded-lg border-2 border-primary bg-secondary/95 p-6 shadow-lg backdrop-blur-sm">
                    <div className="mb-2 flex items-center">
                        <Gamepad className="mr-3 h-6 w-6 text-primary" />
                        <h3 className="text-lg font-semibold text-primary">Total de Juegos</h3>
                    </div>
                    <p className="text-3xl font-bold text-text-primary">{games.length}</p>
                    <p className="mt-1 text-sm text-text-primary/70">
                        {games.length === 0 ? 'Ningún juego creado' : games.length === 1 ? 'Juego disponible' : 'Juegos disponibles'}
                    </p>
                </div>

                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-secondary shadow-lg transition-all duration-200 hover:scale-105 hover:bg-primary-dark hover:shadow-xl"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Crear Nuevo Juego
                </button>
            </div>

            {games.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {games.map((game: Game) => (
                        <div
                            key={game.id}
                            className="flex h-full cursor-pointer flex-col rounded-lg border-2 border-primary/30 bg-secondary/95 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-primary hover:shadow-xl"
                            onClick={() => navigateToGameDetails(game)}
                        >
                            {/* Imagen del juego */}
                            <div className="relative h-48 overflow-hidden rounded-t-lg bg-secondary-dark">
                                {game.image ? (
                                    <img
                                        src={game.image}
                                        alt={game.name}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                ) : null}

                                {/* Fallback */}
                                <div className={`absolute inset-0 flex items-center justify-center ${game.image ? 'hidden' : ''}`}>
                                    <div className="text-center">
                                        <Gamepad className="mx-auto mb-2 h-12 w-12 text-text-primary/50" />
                                        <span className="text-sm text-text-primary/50">Sin imagen</span>
                                    </div>
                                </div>

                                {/* Badge de estado */}
                                <div className="absolute top-3 right-3">
                                    <div className="rounded-md bg-success px-2 py-1 text-xs font-medium text-text-primary shadow-lg">Activo</div>
                                </div>
                            </div>

                            {/* Contenido de la tarjeta */}
                            <div className="flex flex-grow flex-col p-4">
                                <div className="mb-4">
                                    <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-text-primary transition-colors duration-200 hover:text-primary">
                                        {game.name}
                                    </h3>
                                    {game.description && (
                                        <p className="line-clamp-2 text-sm leading-relaxed text-text-primary/70">{game.description}</p>
                                    )}
                                </div>

                                <div className="flex-grow"></div>
                            </div>

                            {/* Botones de acción */}
                            <div className="border-t-2 border-primary bg-secondary-dark/80 px-4 py-3">
                                <div className="flex items-center justify-end space-x-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEditModal(game);
                                        }}
                                        className="rounded-md p-2 text-text-primary transition-colors duration-200 hover:bg-primary-alpha-20 hover:text-primary"
                                        title="Editar juego"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            confirmDelete(game);
                                        }}
                                        className="rounded-md p-2 text-text-primary transition-colors duration-200 hover:bg-danger/10 hover:text-danger"
                                        title="Eliminar juego"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border-2 border-primary/30 bg-secondary/95 py-16 text-center shadow-lg backdrop-blur-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-secondary-dark">
                        <Gamepad className="h-8 w-8 text-primary" />
                    </div>

                    <h3 className="mb-2 text-xl font-semibold text-text-primary">No hay juegos todavía</h3>
                    <p className="mx-auto mb-6 max-w-sm text-text-primary/70">Empieza creando tu primer juego para organizar torneos.</p>

                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center rounded-lg bg-primary px-6 py-3 font-semibold text-secondary shadow-lg transition-all duration-200 hover:scale-105 hover:bg-primary-dark hover:shadow-xl"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Crear Mi Primer Juego
                    </button>
                </div>
            )}

            <Modal show={showDeleteModal} onClose={closeDeleteModal} maxWidth="md">
                <div className="rounded-lg border-2 border-primary bg-secondary/95 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 text-xl font-semibold text-text-primary">Confirmar Eliminación</h2>
                    <p className="mb-6 text-text-primary/70">
                        ¿Estás seguro de que quieres eliminar el juego "{gameToDelete?.name}"? Esta acción no se puede deshacer.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={closeDeleteModal}
                            className="rounded-lg border border-primary/30 bg-secondary-light px-4 py-2 text-text-primary transition-colors hover:bg-secondary-lighter"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={deleteGame}
                            className="rounded-lg bg-danger px-4 py-2 text-text-primary shadow-lg transition-colors hover:bg-danger/90"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </Modal>
            {/* Edit game modal */}
            <Modal show={showEditModal} onClose={closeEditModal} maxWidth="md">
                <div className="rounded-lg border-2 border-primary bg-secondary/95 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 text-xl font-semibold text-text-primary">Editar Juego</h2>

                    {/* Nombre */}
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-text-primary">Nombre</label>
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>

                    {/* Descripción */}
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-text-primary">Descripción</label>
                        <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="h-20 w-full resize-none rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>

                    {/* Imagen actual */}
                    {previewImage && (
                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-text-primary">Imagen actual</label>
                            <img src={previewImage} alt="Preview" className="h-24 w-24 rounded-lg border-2 border-primary/30 object-cover" />
                        </div>
                    )}

                    {/* Subir nueva imagen */}
                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-medium text-text-primary">Nueva imagen</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setImageFile(file);
                                    setPreviewImage(URL.createObjectURL(file));
                                }
                            }}
                            className="w-full text-sm text-text-primary/70 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-secondary file:shadow-lg hover:file:bg-primary-dark"
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={closeEditModal}
                            className="rounded-lg border border-primary/30 bg-secondary-light px-4 py-2 text-text-primary transition-colors hover:bg-secondary-lighter"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={saveEdit}
                            className="rounded-lg bg-primary px-4 py-2 font-medium text-secondary shadow-lg transition-colors hover:bg-primary-dark"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Create game modal */}
            <Modal show={showCreateModal} onClose={closeCreateModal} maxWidth="md">
                <div className="rounded-lg border-2 border-primary bg-secondary/95 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 text-xl font-semibold text-text-primary">Crear Nuevo Juego</h2>

                    {/* Nombre */}
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-text-primary">Nombre</label>
                        <input
                            type="text"
                            value={createName}
                            onChange={(e) => setCreateName(e.target.value)}
                            className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="Nombre del juego"
                        />
                    </div>

                    {/* Descripción */}
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-text-primary">Descripción</label>
                        <textarea
                            value={createDescription}
                            onChange={(e) => setCreateDescription(e.target.value)}
                            className="h-20 w-full resize-none rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="Descripción del juego (opcional)"
                        />
                    </div>

                    {/* Preview de imagen nueva */}
                    {createPreviewImage && (
                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-text-primary">Vista previa</label>
                            <img src={createPreviewImage} alt="Preview" className="h-24 w-24 rounded-lg border-2 border-primary/30 object-cover" />
                        </div>
                    )}

                    {/* Subir imagen */}
                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-medium text-text-primary">Imagen del juego</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setCreateImageFile(file);
                                    setCreatePreviewImage(URL.createObjectURL(file));
                                }
                            }}
                            className="w-full text-sm text-text-primary/70 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-secondary file:shadow-lg hover:file:bg-primary-dark"
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={closeCreateModal}
                            className="rounded-lg border border-primary/30 bg-secondary-light px-4 py-2 text-text-primary transition-colors hover:bg-secondary-lighter"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={saveCreate}
                            className="rounded-lg bg-primary px-4 py-2 font-medium text-secondary shadow-lg transition-colors hover:bg-primary-dark"
                        >
                            Crear Juego
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
};

export default Index;
