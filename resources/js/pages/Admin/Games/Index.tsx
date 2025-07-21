import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { Plus, Gamepad, Trash2, Pencil } from 'lucide-react';
import Modal from '@/Components/Modal';

// Tipo para un juego
interface Game { id: number; name: string; description: string | null; image: string; }

// Props del componente
interface IndexProps { games: Game[]; }

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

    const closeModal = () => {
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
                    closeModal();
                },
                onError: (errors) => {
                    console.error('Error al eliminar el juego:', errors);
                    alert('Error al eliminar el juego. Intenta nuevamente.');
                }
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
                formData: Object.fromEntries(data.entries())
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
                    Object.keys(errors).forEach(key => {
                        errorMessage += `${key}: ${errors[key]}\n`;
                    });
                    alert(errorMessage);
                }
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
                Object.keys(errors).forEach(key => {
                    errorMessage += `${key}: ${errors[key]}\n`;
                });
                alert(errorMessage);
            }
        });
    };

    return (
        <AdminLayout title="Juegos" pageTitle="Gestión de Juegos">
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="bg-secondary/95 backdrop-blur-sm border-2 border-primary p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-2">
                        <Gamepad className="w-6 h-6 text-primary mr-3" />
                        <h3 className="text-lg font-semibold text-primary">Total de Juegos</h3>
                    </div>
                    <p className="text-3xl font-bold text-text-primary">{games.length}</p>
                    <p className="text-sm text-text-primary/70 mt-1">
                        {games.length === 0 ? 'Ningún juego creado' : 
                         games.length === 1 ? 'Juego disponible' : 
                         'Juegos disponibles'}
                    </p>
                </div>
                
                <button 
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-secondary font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Crear Nuevo Juego
                </button>
            </div>

            {games.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {games.map((game: Game) => (
                        <div 
                            key={game.id} 
                            className="bg-secondary/95 backdrop-blur-sm border-2 border-primary/30 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:border-primary hover:scale-105 flex flex-col h-full cursor-pointer"
                            onClick={() => navigateToGameDetails(game)}
                        >
                            {/* Imagen del juego */}
                            <div className="relative h-48 overflow-hidden rounded-t-lg bg-secondary-dark">
                                {game.image ? (
                                    <img 
                                        src={game.image} 
                                        alt={game.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                ) : null}
                                
                                {/* Fallback */}
                                <div className={`absolute inset-0 flex items-center justify-center ${game.image ? 'hidden' : ''}`}>
                                    <div className="text-center">
                                        <Gamepad className="w-12 h-12 text-text-primary/50 mx-auto mb-2" />
                                        <span className="text-sm text-text-primary/50">Sin imagen</span>
                                    </div>
                                </div>

                                {/* Badge de estado */}
                                <div className="absolute top-3 right-3">
                                    <div className="bg-success text-text-primary px-2 py-1 rounded-md text-xs font-medium shadow-lg">
                                        Activo
                                    </div>
                                </div>
                            </div>
                            
                            {/* Contenido de la tarjeta */}
                            <div className="p-4 flex-grow flex flex-col">
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-text-primary mb-2 hover:text-primary transition-colors duration-200 line-clamp-1">
                                        {game.name}
                                    </h3>
                                    {game.description && (
                                        <p className="text-text-primary/70 text-sm leading-relaxed line-clamp-2">
                                            {game.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex-grow"></div>
                            </div>
                            
                            {/* Botones de acción */}
                            <div className="px-4 py-3 bg-secondary-dark/80 border-t-2 border-primary">
                                <div className="flex justify-end items-center space-x-2">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEditModal(game);
                                        }} 
                                        className="p-2 text-text-primary hover:text-primary transition-colors duration-200 hover:bg-primary-alpha-20 rounded-md"
                                        title="Editar juego"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            confirmDelete(game);
                                        }} 
                                        className="p-2 text-text-primary hover:text-danger transition-colors duration-200 hover:bg-danger/10 rounded-md"
                                        title="Eliminar juego"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-secondary/95 backdrop-blur-sm border-2 border-primary/30 rounded-lg shadow-lg">
                    <div className="bg-secondary-dark w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary">
                        <Gamepad className="w-8 h-8 text-primary" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-text-primary mb-2">No hay juegos todavía</h3>
                    <p className="text-text-primary/70 mb-6 max-w-sm mx-auto">
                        Empieza creando tu primer juego para organizar torneos.
                    </p>
                    
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-secondary font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Crear Mi Primer Juego
                    </button>
                </div>
            )}

            <Modal show={showDeleteModal} onClose={closeModal} maxWidth="md">
                <div className="p-6 bg-secondary/95 backdrop-blur-sm border-2 border-primary rounded-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Confirmar Eliminación</h2>
                    <p className="text-text-primary/70 mb-6">
                        ¿Estás seguro de que quieres eliminar el juego "{gameToDelete?.name}"? Esta acción no se puede deshacer.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <button 
                            onClick={closeModal} 
                            className="px-4 py-2 rounded-lg text-text-primary bg-secondary-light hover:bg-secondary-lighter transition-colors border border-primary/30"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={deleteGame} 
                            className="px-4 py-2 rounded-lg text-text-primary bg-danger hover:bg-danger/90 transition-colors shadow-lg"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </Modal>
            {/* Edit game modal */}
            <Modal show={showEditModal} onClose={closeEditModal} maxWidth="md">
                <div className="p-6 bg-secondary/95 backdrop-blur-sm border-2 border-primary rounded-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Editar Juego</h2>
                    
                    {/* Nombre */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-text-primary mb-2">Nombre</label>
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                    </div>
                    
                    {/* Descripción */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-text-primary mb-2">Descripción</label>
                        <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary h-20 resize-none"
                        />
                    </div>
                    
                    {/* Imagen actual */}
                    {previewImage && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-text-primary mb-2">Imagen actual</label>
                            <img src={previewImage} alt="Preview" className="w-24 h-24 object-cover rounded-lg border-2 border-primary/30" />
                        </div>
                    )}
                    
                    {/* Subir nueva imagen */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-text-primary mb-2">Nueva imagen</label>
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
                            className="w-full text-sm text-text-primary/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-secondary hover:file:bg-primary-dark file:cursor-pointer file:shadow-lg"
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                        <button 
                            onClick={closeEditModal} 
                            className="px-4 py-2 rounded-lg text-text-primary bg-secondary-light hover:bg-secondary-lighter transition-colors border border-primary/30"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={saveEdit} 
                            className="px-4 py-2 rounded-lg text-secondary bg-primary hover:bg-primary-dark transition-colors font-medium shadow-lg"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Create game modal */}
            <Modal show={showCreateModal} onClose={closeCreateModal} maxWidth="md">
                <div className="p-6 bg-secondary/95 backdrop-blur-sm border-2 border-primary rounded-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Crear Nuevo Juego</h2>
                    
                    {/* Nombre */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-text-primary mb-2">Nombre</label>
                        <input
                            type="text"
                            value={createName}
                            onChange={(e) => setCreateName(e.target.value)}
                            className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Nombre del juego"
                        />
                    </div>
                    
                    {/* Descripción */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-text-primary mb-2">Descripción</label>
                        <textarea
                            value={createDescription}
                            onChange={(e) => setCreateDescription(e.target.value)}
                            className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary h-20 resize-none"
                            placeholder="Descripción del juego (opcional)"
                        />
                    </div>
                    
                    {/* Preview de imagen nueva */}
                    {createPreviewImage && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-text-primary mb-2">Vista previa</label>
                            <img src={createPreviewImage} alt="Preview" className="w-24 h-24 object-cover rounded-lg border-2 border-primary/30" />
                        </div>
                    )}
                    
                    {/* Subir imagen */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-text-primary mb-2">Imagen del juego</label>
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
                            className="w-full text-sm text-text-primary/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-secondary hover:file:bg-primary-dark file:cursor-pointer file:shadow-lg"
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                        <button 
                            onClick={closeCreateModal} 
                            className="px-4 py-2 rounded-lg text-text-primary bg-secondary-light hover:bg-secondary-lighter transition-colors border border-primary/30"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={saveCreate} 
                            className="px-4 py-2 rounded-lg text-secondary bg-primary hover:bg-primary-dark transition-colors font-medium shadow-lg"
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
