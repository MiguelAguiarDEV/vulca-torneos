import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { Plus, Trophy, Trash2, Pencil, Calendar, Users, GamepadIcon, DollarSign } from 'lucide-react';
import Modal from '@/components/Modal';

// Tipo para un torneo
interface Tournament {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
    game_id: number;
    game: {
        id: number;
        name: string;
        image: string | null;
    };
    start_date: string;
    end_date: string | null;
    registration_start: string | null;
    registration_end: string | null;
    entry_fee: number | null;
    has_registration_limit: boolean;
    registration_limit: number | null;
    status: string;
    registrations_count: number;
    available_spots?: number | null;
    registration_progress?: number | null;
}

// Props del componente
interface IndexProps {
    tournaments: Tournament[];
    games: Array<{
        id: number;
        name: string;
        image: string | null;
    }>;
}

const Index: React.FC<IndexProps> = ({ tournaments, games }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [tournamentToDelete, setTournamentToDelete] = useState<Tournament | null>(null);
    
    // Estados para el modal de crear
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createName, setCreateName] = useState<string>('');
    const [createDescription, setCreateDescription] = useState<string>('');
    const [createGameId, setCreateGameId] = useState<number | ''>('');
    const [createStartDate, setCreateStartDate] = useState<string>('');
    const [createEndDate, setCreateEndDate] = useState<string>('');
    const [createRegistrationStart, setCreateRegistrationStart] = useState<string>('');
    const [createEntryFee, setCreateEntryFee] = useState<string>('');
    const [createStatus, setCreateStatus] = useState<string>('draft');
    const [createHasRegistrationLimit, setCreateHasRegistrationLimit] = useState<boolean>(false);
    const [createRegistrationLimit, setCreateRegistrationLimit] = useState<string>('');
    const [createImageFile, setCreateImageFile] = useState<File | null>(null);
    const [createPreviewImage, setCreatePreviewImage] = useState<string>('');
    
    // Estados para el modal de editar
    const [showEditModal, setShowEditModal] = useState(false);
    const [tournamentToEdit, setTournamentToEdit] = useState<Tournament | null>(null);
    const [editName, setEditName] = useState<string>('');
    const [editDescription, setEditDescription] = useState<string>('');
    const [editGameId, setEditGameId] = useState<number | ''>('');
    const [editStartDate, setEditStartDate] = useState<string>('');
    const [editEndDate, setEditEndDate] = useState<string>('');
    const [editRegistrationStart, setEditRegistrationStart] = useState<string>('');
    const [editEntryFee, setEditEntryFee] = useState<string>('');
    const [editStatus, setEditStatus] = useState<string>('draft');
    const [editHasRegistrationLimit, setEditHasRegistrationLimit] = useState<boolean>(false);
    const [editRegistrationLimit, setEditRegistrationLimit] = useState<string>('');
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [editPreviewImage, setEditPreviewImage] = useState<string>('');

    const confirmDelete = (tournament: Tournament) => {
        setTournamentToDelete(tournament);
        setShowDeleteModal(true);
    };

    const closeModal = () => {
        setShowDeleteModal(false);
        setTournamentToDelete(null);
    };

    const deleteTournament = () => {
        if (tournamentToDelete) {
            router.delete(route('admin.tournaments.destroy', tournamentToDelete.id), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Torneo eliminado exitosamente');
                    closeModal();
                },
                onError: (errors) => {
                    console.error('Error al eliminar el torneo:', errors);
                    alert('Error al eliminar el torneo. Intenta nuevamente.');
                }
            });
        }
    };

    const navigateToTournamentDetails = (tournament: Tournament) => {
        router.get(route('admin.tournaments.show', tournament.id));
    };

    // Funciones para el modal de crear
    const openCreateModal = () => {
        setShowCreateModal(true);
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
        setCreateName('');
        setCreateDescription('');
        setCreateGameId('');
        setCreateStartDate('');
        setCreateEndDate('');
        setCreateRegistrationStart('');
        setCreateEntryFee('');
        setCreateStatus('draft');
        setCreateHasRegistrationLimit(false);
        setCreateRegistrationLimit('');
        setCreateImageFile(null);
        setCreatePreviewImage('');
    };

    const saveCreate = () => {
        // Validación del lado del cliente
        if (!createName.trim()) {
            alert('El nombre del torneo es requerido');
            return;
        }
        if (!createGameId) {
            alert('Debes seleccionar un juego');
            return;
        }
        if (!createStartDate) {
            alert('La fecha de inicio es requerida');
            return;
        }
        if (createHasRegistrationLimit && (!createRegistrationLimit || parseInt(createRegistrationLimit) < 1)) {
            alert('Si el torneo tiene límite de inscripciones, debe especificar un número válido mayor a 0');
            return;
        }

        const data = new FormData();
        data.append('name', createName.trim());
        data.append('game_id', createGameId.toString());
        data.append('start_date', createStartDate);
        data.append('status', createStatus);
        data.append('has_registration_limit', createHasRegistrationLimit ? '1' : '0');
        
        if (createHasRegistrationLimit && createRegistrationLimit) {
            data.append('registration_limit', createRegistrationLimit);
        }
        
        const description = createDescription ? createDescription.trim() : '';
        data.append('description', description);
        
        if (createEndDate) data.append('end_date', createEndDate);
        if (createRegistrationStart) data.append('registration_start', createRegistrationStart);
        if (createEntryFee) data.append('entry_fee', createEntryFee);
        if (createImageFile) data.append('image', createImageFile);
        
        router.post(route('admin.tournaments.store'), data, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Torneo creado exitosamente');
                closeCreateModal();
            },
            onError: (errors) => {
                console.error('Error al crear el torneo:', errors);
                let errorMessage = 'Error al crear el torneo:\n';
                Object.keys(errors).forEach(key => {
                    errorMessage += `${key}: ${errors[key]}\n`;
                });
                alert(errorMessage);
            }
        });
    };

    // Funciones para el modal de editar
// Función para convertir fecha del backend (YYYY-MM-DD) a formato DD/MM/YYYY para mostrar
const formatDateForDisplay = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error("Error formatting date for display:", dateString, error);
        return '';
    }
};

// Función para convertir fecha del backend (YYYY-MM-DD) a formato YYYY-MM-DD para input type="date"
const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error("Error formatting date for input:", dateString, error);
        return '';
    }
};

// Función para convertir fecha DD/MM/YYYY a formato YYYY-MM-DD para enviar al backend
const formatDateForBackend = (dateString: string): string => {
    if (!dateString) return '';
    
    // Si ya está en formato YYYY-MM-DD (desde input date), devolverlo tal como está
    const isoDateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
    if (isoDateRegex.test(dateString)) {
        return dateString;
    }
    
    // Verificar que el formato sea DD/MM/YYYY
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(dateRegex);
    
    if (!match) return '';
    
    const [, day, month, year] = match;
    return `${year}-${month}-${day}`;
};

const openEditModal = (tournament: Tournament) => {
    setTournamentToEdit(tournament);
    setEditName(tournament.name);
    setEditDescription(tournament.description || '');
    setEditGameId(tournament.game_id);
    setEditStatus(tournament.status);
    
    // Formatear fechas para inputs de tipo date en formato YYYY-MM-DD
    setEditStartDate(formatDateForInput(tournament.start_date));
    setEditEndDate(formatDateForInput(tournament.end_date));
    setEditRegistrationStart(formatDateForInput(tournament.registration_start));
    
    setEditEntryFee(tournament.entry_fee?.toString() || '0');
    setEditHasRegistrationLimit(tournament.has_registration_limit || false);
    setEditRegistrationLimit(tournament.registration_limit?.toString() || '');
    setEditPreviewImage(tournament.image || '');
    setEditImageFile(null);
    setShowEditModal(true);
};    const closeEditModal = () => {
        setShowEditModal(false);
        setTournamentToEdit(null);
        setEditName('');
        setEditDescription('');
        setEditGameId('');
        setEditStartDate('');
        setEditEndDate('');
        setEditRegistrationStart('');
        setEditEntryFee('');
        setEditStatus('draft');
        setEditHasRegistrationLimit(false);
        setEditRegistrationLimit('');
        setEditImageFile(null);
        setEditPreviewImage('');
    };

    const saveEdit = () => {
        if (!tournamentToEdit) return;
        
        // Validación del lado del cliente
        if (!editName.trim()) {
            alert('El nombre del torneo es requerido');
            return;
        }
        if (!editGameId) {
            alert('Debes seleccionar un juego');
            return;
        }
        if (!editStartDate) {
            alert('La fecha de inicio es requerida');
            return;
        }
        if (editHasRegistrationLimit && (!editRegistrationLimit || parseInt(editRegistrationLimit) < 1)) {
            alert('Si el torneo tiene límite de inscripciones, debe especificar un número válido mayor a 0');
            return;
        }

        const data = new FormData();
        data.append('_method', 'PUT');
        data.append('name', editName.trim());
        data.append('game_id', editGameId.toString());
        data.append('start_date', formatDateForBackend(editStartDate));
        data.append('status', editStatus);
        data.append('has_registration_limit', editHasRegistrationLimit ? '1' : '0');
        
        if (editHasRegistrationLimit && editRegistrationLimit) {
            data.append('registration_limit', editRegistrationLimit);
        }
        
        const description = editDescription ? editDescription.trim() : '';
        data.append('description', description);
        
        if (editEndDate) data.append('end_date', formatDateForBackend(editEndDate));
        if (editRegistrationStart) data.append('registration_start', formatDateForBackend(editRegistrationStart));
        if (editEntryFee) data.append('entry_fee', editEntryFee);
        if (editImageFile) data.append('image', editImageFile);
        
        // Agregar el method spoofing para PUT
        data.append('_method', 'PUT');
        
        router.post(route('admin.tournaments.update', tournamentToEdit.id), data, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Torneo actualizado exitosamente');
                closeEditModal();
            },
            onError: (errors) => {
                console.error('Error al actualizar el torneo:', errors);
                let errorMessage = 'Error al actualizar el torneo:\n';
                Object.keys(errors).forEach(key => {
                    errorMessage += `${key}: ${errors[key]}\n`;
                });
                alert(errorMessage);
            }
        });
    };

    const getStatusColor = (status: string) => {
        const statusColors: Record<string, string> = {
            'draft': 'bg-secondary text-text-primary',
            'published': 'bg-info text-text-primary',
            'registration_open': 'bg-success text-text-primary',
            'registration_closed': 'bg-warning text-secondary',
            'ongoing': 'bg-primary text-secondary',
            'finished': 'bg-secondary text-text-primary',
            'cancelled': 'bg-error text-text-primary'
        };
        return statusColors[status] || 'bg-secondary text-text-primary';
    };

    const getStatusText = (status: string) => {
        const statusTexts: Record<string, string> = {
            'draft': 'Borrador',
            'published': 'Publicado',
            'registration_open': 'Inscripciones Abiertas',
            'registration_closed': 'Inscripciones Cerradas',
            'ongoing': 'En Curso',
            'finished': 'Finalizado',
            'cancelled': 'Cancelado'
        };
        return statusTexts[status] || status;
    };

    return (
        <AdminLayout title="Torneos" pageTitle="Gestión de Torneos">
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="bg-secondary/95 backdrop-blur-sm border-2 border-primary p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-2">
                        <Trophy className="w-6 h-6 text-primary mr-3" />
                        <h3 className="text-lg font-semibold text-primary">Total de Torneos</h3>
                    </div>
                    <p className="text-3xl font-bold text-text-primary">{tournaments.length}</p>
                    <p className="text-sm text-text-primary/70 mt-1">
                        {tournaments.length === 0 ? 'Ningún torneo creado' : 
                         tournaments.length === 1 ? 'Torneo disponible' : 
                         'Torneos disponibles'}
                    </p>
                </div>
                
                <button 
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-secondary font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Crear Nuevo Torneo
                </button>
            </div>

            {tournaments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tournaments.map((tournament: Tournament) => (
                        <div 
                            key={tournament.id} 
                            className="bg-secondary/95 backdrop-blur-sm border-2 border-primary/30 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:border-primary hover:scale-105 flex flex-col h-full cursor-pointer"
                            onClick={() => navigateToTournamentDetails(tournament)}
                        >
                            {/* Imagen del torneo */}
                            <div className="relative h-48 overflow-hidden rounded-t-lg bg-secondary-dark">
                                {tournament.image ? (
                                    <img 
                                        src={tournament.image} 
                                        alt={tournament.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                ) : null}
                                
                                {/* Fallback */}
                                <div className={`absolute inset-0 flex items-center justify-center ${tournament.image ? 'hidden' : ''}`}>
                                    <div className="text-center">
                                        <Trophy className="w-12 h-12 text-text-primary/50 mx-auto mb-2" />
                                        <span className="text-sm text-text-primary/50">Sin imagen</span>
                                    </div>
                                </div>

                                {/* Badge de estado */}
                                <div className="absolute top-3 right-3">
                                    <div className={`px-2 py-1 rounded-md text-xs font-medium shadow-lg ${getStatusColor(tournament.status)}`}>
                                        {getStatusText(tournament.status)}
                                    </div>
                                </div>

                                {/* Badge del juego */}
                                {tournament.game && (
                                    <div className="absolute top-3 left-3">
                                        <div className="bg-primary/90 text-secondary px-2 py-1 rounded-md text-xs font-medium shadow-lg backdrop-blur-sm">
                                            {tournament.game.name}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Contenido de la tarjeta */}
                            <div className="p-4 flex-grow flex flex-col">
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-text-primary mb-2 hover:text-primary transition-colors duration-200 line-clamp-1">
                                        {tournament.name}
                                    </h3>
                                    {tournament.description && (
                                        <p className="text-text-primary/70 text-sm leading-relaxed line-clamp-2">
                                            {tournament.description}
                                        </p>
                                    )}
                                </div>

                                {/* Información del torneo */}
                                <div className="space-y-2 text-sm text-text-primary/70 mb-4">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span>Inicio: {new Date(tournament.start_date).toLocaleDateString('es-ES')}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="w-4 h-4 mr-2" />
                                        <span>
                                            {tournament.registrations_count}
                                            {tournament.has_registration_limit 
                                                ? ` / ${tournament.registration_limit} inscripciones`
                                                : ' inscripciones'
                                            }
                                        </span>
                                        {tournament.has_registration_limit && (
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                                (tournament.registrations_count / tournament.registration_limit!) >= 0.9 
                                                    ? 'bg-error/20 text-error' 
                                                    : (tournament.registrations_count / tournament.registration_limit!) >= 0.7 
                                                        ? 'bg-warning/20 text-warning' 
                                                        : 'bg-success/20 text-success'
                                            }`}>
                                                {Math.round((tournament.registrations_count / tournament.registration_limit!) * 100)}%
                                            </span>
                                        )}
                                    </div>
                                    {tournament.entry_fee && (
                                        <div className="flex items-center">
                                            <DollarSign className="w-4 h-4 mr-2" />
                                            <span>€{tournament.entry_fee}</span>
                                        </div>
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
                                            openEditModal(tournament);
                                        }} 
                                        className="p-2 text-text-primary hover:text-primary transition-colors duration-200 hover:bg-primary-alpha-20 rounded-md"
                                        title="Editar torneo"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            confirmDelete(tournament);
                                        }} 
                                        className="p-2 text-text-primary hover:text-error transition-colors duration-200 hover:bg-error-alpha-20 rounded-md"
                                        title="Eliminar torneo"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="bg-secondary/95 backdrop-blur-sm border-2 border-primary/30 rounded-lg shadow-lg p-12 max-w-md mx-auto">
                        <Trophy className="w-16 h-16 text-primary/50 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-text-primary mb-3">No hay torneos creados</h3>
                        <p className="text-text-primary/70 mb-6">
                            Comienza creando tu primer torneo para gestionar las competiciones.
                        </p>
                        <button 
                            onClick={openCreateModal}
                            className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-secondary font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Crear Primer Torneo
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de confirmación de eliminación */}
            <Modal show={showDeleteModal} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-text-primary mb-4">Confirmar Eliminación</h2>
                    <p className="text-text-primary/70 mb-6">
                        ¿Estás seguro de que deseas eliminar el torneo "{tournamentToDelete?.name}"? 
                        Esta acción no se puede deshacer y se eliminarán todas las inscripciones asociadas.
                    </p>
                    <div className="flex justify-end space-x-4">
                        <button 
                            onClick={closeModal}
                            className="px-4 py-2 text-text-primary border border-primary/30 rounded-lg hover:bg-primary/20 transition-colors duration-200"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={deleteTournament}
                            className="px-4 py-2 bg-error text-text-primary rounded-lg hover:bg-error-dark transition-colors duration-200"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal de crear torneo */}
            <Modal show={showCreateModal} onClose={closeCreateModal} maxWidth="lg">
                <div className="p-6 bg-secondary/95 backdrop-blur-sm border-2 border-primary rounded-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Crear Nuevo Torneo</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-primary mb-2">Nombre</label>
                            <input
                                type="text"
                                value={createName}
                                onChange={(e) => setCreateName(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Nombre del torneo"
                            />
                        </div>
                        
                        {/* Descripción */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-primary mb-2">Descripción</label>
                            <textarea
                                value={createDescription}
                                onChange={(e) => setCreateDescription(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary h-20 resize-none"
                                placeholder="Descripción del torneo (opcional)"
                            />
                        </div>
                        
                        {/* Juego */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Juego</label>
                            <select
                                value={createGameId}
                                onChange={(e) => setCreateGameId(e.target.value ? parseInt(e.target.value) : '')}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="">Seleccionar juego</option>
                                {games.map((game) => (
                                    <option key={game.id} value={game.id}>{game.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Estado */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Estado</label>
                            <select
                                value={createStatus}
                                onChange={(e) => setCreateStatus(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="draft">Borrador</option>
                                <option value="published">Publicado</option>
                                <option value="registration_open">Inscripciones Abiertas</option>
                                <option value="registration_closed">Inscripciones Cerradas</option>
                                <option value="ongoing">En Curso</option>
                                <option value="finished">Finalizado</option>
                                <option value="cancelled">Cancelado</option>
                            </select>
                        </div>
                        
                        {/* Fecha de inicio */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Fecha de inicio</label>
                            <input
                                type="date"
                                value={createStartDate}
                                onChange={(e) => setCreateStartDate(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                        </div>
                        
                        {/* Fecha de fin */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Fecha de fin</label>
                            <input
                                type="date"
                                value={createEndDate}
                                onChange={(e) => setCreateEndDate(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                        </div>
                        
                        {/* Inicio de inscripciones */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-primary mb-2">Inicio inscripciones</label>
                            <input
                                type="date"
                                value={createRegistrationStart}
                                onChange={(e) => setCreateRegistrationStart(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                            <p className="text-xs text-text-primary/60 mt-1">
                                Las inscripciones se cerrarán automáticamente cuando comience el torneo
                            </p>
                        </div>
                        
                        {/* Cuota de entrada */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Cuota (€)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={createEntryFee}
                                onChange={(e) => setCreateEntryFee(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="0.00"
                            />
                        </div>
                        
                        {/* Límite de inscripciones */}
                        <div className="md:col-span-2">
                            <div className="flex items-center mb-3">
                                <input
                                    type="checkbox"
                                    id="createHasLimit"
                                    checked={createHasRegistrationLimit}
                                    onChange={(e) => setCreateHasRegistrationLimit(e.target.checked)}
                                    className="w-4 h-4 text-primary bg-secondary-light border-primary/30 rounded focus:ring-primary focus:ring-2"
                                />
                                <label htmlFor="createHasLimit" className="ml-2 text-sm font-medium text-text-primary">
                                    El torneo tiene límite de inscripciones
                                </label>
                            </div>
                            {createHasRegistrationLimit && (
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">Número máximo de inscripciones</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={createRegistrationLimit}
                                        onChange={(e) => setCreateRegistrationLimit(e.target.value)}
                                        className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Ej: 32"
                                    />
                                    <p className="text-xs text-text-primary/60 mt-1">
                                        Las inscripciones se cerrarán automáticamente al alcanzar este límite
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        {/* Preview de imagen nueva */}
                        {createPreviewImage && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-text-primary mb-2">Vista previa</label>
                                <img src={createPreviewImage} alt="Preview" className="w-24 h-24 object-cover rounded-lg border-2 border-primary/30" />
                            </div>
                        )}
                        
                        {/* Subir imagen */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-primary mb-2">Imagen del torneo</label>
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
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-6">
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
                            Crear Torneo
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal de editar torneo */}
            <Modal show={showEditModal} onClose={closeEditModal} maxWidth="lg">
                <div className="p-6 bg-secondary/95 backdrop-blur-sm border-2 border-primary rounded-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Editar Torneo</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-primary mb-2">Nombre</label>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                        </div>
                        
                        {/* Descripción */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-primary mb-2">Descripción</label>
                            <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary h-20 resize-none"
                            />
                        </div>
                        
                        {/* Juego */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Juego</label>
                            <select
                                value={editGameId}
                                onChange={(e) => setEditGameId(e.target.value ? parseInt(e.target.value) : '')}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="">Seleccionar juego</option>
                                {games.map((game) => (
                                    <option key={game.id} value={game.id}>{game.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Estado */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Estado</label>
                            <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="draft">Borrador</option>
                                <option value="published">Publicado</option>
                                <option value="registration_open">Inscripciones Abiertas</option>
                                <option value="registration_closed">Inscripciones Cerradas</option>
                                <option value="ongoing">En Curso</option>
                                <option value="finished">Finalizado</option>
                                <option value="cancelled">Cancelado</option>
                            </select>
                        </div>
                        
                        {/* Fecha de inicio */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Fecha de inicio</label>
                            <input
                                type="date"
                                value={editStartDate}
                                onChange={(e) => setEditStartDate(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                        </div>
                        
                        {/* Fecha de fin */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Fecha de fin</label>
                            <input
                                type="date"
                                value={editEndDate}
                                onChange={(e) => setEditEndDate(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                        </div>
                        
                        {/* Inicio de inscripciones */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-primary mb-2">Inicio inscripciones</label>
                            <input
                                type="date"
                                value={editRegistrationStart}
                                onChange={(e) => setEditRegistrationStart(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                            <p className="text-xs text-text-primary/60 mt-1">
                                Las inscripciones se cerrarán automáticamente cuando comience el torneo
                            </p>
                        </div>
                        
                        {/* Cuota de entrada */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Cuota (€)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editEntryFee}
                                onChange={(e) => setEditEntryFee(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="0.00"
                            />
                        </div>
                        
                        {/* Límite de inscripciones */}
                        <div className="md:col-span-2">
                            <div className="flex items-center mb-3">
                                <input
                                    type="checkbox"
                                    id="editHasLimit"
                                    checked={editHasRegistrationLimit}
                                    onChange={(e) => setEditHasRegistrationLimit(e.target.checked)}
                                    className="w-4 h-4 text-primary bg-secondary-light border-primary/30 rounded focus:ring-primary focus:ring-2"
                                />
                                <label htmlFor="editHasLimit" className="ml-2 text-sm font-medium text-text-primary">
                                    El torneo tiene límite de inscripciones
                                </label>
                            </div>
                            {editHasRegistrationLimit && (
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">Número máximo de inscripciones</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={editRegistrationLimit}
                                        onChange={(e) => setEditRegistrationLimit(e.target.value)}
                                        className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Ej: 32"
                                    />
                                    <p className="text-xs text-text-primary/60 mt-1">
                                        Las inscripciones se cerrarán automáticamente al alcanzar este límite
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        {/* Imagen actual */}
                        {editPreviewImage && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-text-primary mb-2">Imagen actual</label>
                                <img src={editPreviewImage} alt="Preview" className="w-24 h-24 object-cover rounded-lg border-2 border-primary/30" />
                            </div>
                        )}
                        
                        {/* Subir nueva imagen */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-primary mb-2">Nueva imagen</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setEditImageFile(file);
                                        setEditPreviewImage(URL.createObjectURL(file));
                                    }
                                }}
                                className="w-full text-sm text-text-primary/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-secondary hover:file:bg-primary-dark file:cursor-pointer file:shadow-lg"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-6">
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
        </AdminLayout>
    );
};

export default Index;
