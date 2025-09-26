import Modal from '@/components/UI/Modal';
import AdminLayout from '@/layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { Calendar, DollarSign, Pencil, Plus, Trash2, Trophy, Users } from 'lucide-react';
import React, { useState } from 'react';

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
                },
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
                Object.keys(errors).forEach((key) => {
                    errorMessage += `${key}: ${errors[key]}\n`;
                });
                alert(errorMessage);
            },
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
            console.error('Error formatting date for display:', dateString, error);
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
            console.error('Error formatting date for input:', dateString, error);
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
    };
    const closeEditModal = () => {
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
                Object.keys(errors).forEach((key) => {
                    errorMessage += `${key}: ${errors[key]}\n`;
                });
                alert(errorMessage);
            },
        });
    };

    const getStatusColor = (status: string) => {
        const statusColors: Record<string, string> = {
            draft: 'bg-secondary text-text-primary',
            published: 'bg-info text-text-primary',
            registration_open: 'bg-success text-text-primary',
            registration_closed: 'bg-warning text-secondary',
            ongoing: 'bg-primary text-secondary',
            finished: 'bg-secondary text-text-primary',
            cancelled: 'bg-error text-text-primary',
        };
        return statusColors[status] || 'bg-secondary text-text-primary';
    };

    const getStatusText = (status: string) => {
        const statusTexts: Record<string, string> = {
            draft: 'Borrador',
            published: 'Publicado',
            registration_open: 'Inscripciones Abiertas',
            registration_closed: 'Inscripciones Cerradas',
            ongoing: 'En Curso',
            finished: 'Finalizado',
            cancelled: 'Cancelado',
        };
        return statusTexts[status] || status;
    };

    return (
        <AdminLayout title="Torneos" pageTitle="Gestión de Torneos">
            <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div className="rounded-lg border-2 border-primary bg-secondary/95 p-6 shadow-lg backdrop-blur-sm">
                    <div className="mb-2 flex items-center">
                        <Trophy className="mr-3 h-6 w-6 text-primary" />
                        <h3 className="text-lg font-semibold text-primary">Total de Torneos</h3>
                    </div>
                    <p className="text-3xl font-bold text-text-primary">{tournaments.length}</p>
                    <p className="mt-1 text-sm text-text-primary/70">
                        {tournaments.length === 0 ? 'Ningún torneo creado' : tournaments.length === 1 ? 'Torneo disponible' : 'Torneos disponibles'}
                    </p>
                </div>

                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-secondary shadow-lg transition-all duration-200 hover:scale-105 hover:bg-primary-dark hover:shadow-xl"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Crear Nuevo Torneo
                </button>
            </div>

            {tournaments.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {tournaments.map((tournament: Tournament) => (
                        <div
                            key={tournament.id}
                            className="flex h-full cursor-pointer flex-col rounded-lg border-2 border-primary/30 bg-secondary/95 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-primary hover:shadow-xl"
                            onClick={() => navigateToTournamentDetails(tournament)}
                        >
                            {/* Imagen del torneo */}
                            <div className="relative h-48 overflow-hidden rounded-t-lg bg-secondary-dark">
                                {tournament.image ? (
                                    <img
                                        src={tournament.image}
                                        alt={tournament.name}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                ) : null}

                                {/* Fallback */}
                                <div className={`absolute inset-0 flex items-center justify-center ${tournament.image ? 'hidden' : ''}`}>
                                    <div className="text-center">
                                        <Trophy className="mx-auto mb-2 h-12 w-12 text-text-primary/50" />
                                        <span className="text-sm text-text-primary/50">Sin imagen</span>
                                    </div>
                                </div>

                                {/* Badge de estado */}
                                <div className="absolute top-3 right-3">
                                    <div className={`rounded-md px-2 py-1 text-xs font-medium shadow-lg ${getStatusColor(tournament.status)}`}>
                                        {getStatusText(tournament.status)}
                                    </div>
                                </div>

                                {/* Badge del juego */}
                                {tournament.game && (
                                    <div className="absolute top-3 left-3">
                                        <div className="rounded-md bg-primary/90 px-2 py-1 text-xs font-medium text-secondary shadow-lg backdrop-blur-sm">
                                            {tournament.game.name}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Contenido de la tarjeta */}
                            <div className="flex flex-grow flex-col p-4">
                                <div className="mb-4">
                                    <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-text-primary transition-colors duration-200 hover:text-primary">
                                        {tournament.name}
                                    </h3>
                                    {tournament.description && (
                                        <p className="line-clamp-2 text-sm leading-relaxed text-text-primary/70">{tournament.description}</p>
                                    )}
                                </div>

                                {/* Información del torneo */}
                                <div className="mb-4 space-y-2 text-sm text-text-primary/70">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        <span>Inicio: {new Date(tournament.start_date).toLocaleDateString('es-ES')}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="mr-2 h-4 w-4" />
                                        <span>
                                            {tournament.registrations_count}
                                            {tournament.has_registration_limit
                                                ? ` / ${tournament.registration_limit} inscripciones`
                                                : ' inscripciones'}
                                        </span>
                                        {tournament.has_registration_limit && (
                                            <span
                                                className={`ml-2 rounded-full px-2 py-1 text-xs ${
                                                    tournament.registrations_count / tournament.registration_limit! >= 0.9
                                                        ? 'bg-error/20 text-error'
                                                        : tournament.registrations_count / tournament.registration_limit! >= 0.7
                                                          ? 'bg-warning/20 text-warning'
                                                          : 'bg-success/20 text-success'
                                                }`}
                                            >
                                                {Math.round((tournament.registrations_count / tournament.registration_limit!) * 100)}%
                                            </span>
                                        )}
                                    </div>
                                    {tournament.entry_fee && (
                                        <div className="flex items-center">
                                            <DollarSign className="mr-2 h-4 w-4" />
                                            <span>€{tournament.entry_fee}</span>
                                        </div>
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
                                            openEditModal(tournament);
                                        }}
                                        className="rounded-md p-2 text-text-primary transition-colors duration-200 hover:bg-primary-alpha-20 hover:text-primary"
                                        title="Editar torneo"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            confirmDelete(tournament);
                                        }}
                                        className="hover:text-error hover:bg-error-alpha-20 rounded-md p-2 text-text-primary transition-colors duration-200"
                                        title="Eliminar torneo"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center">
                    <div className="mx-auto max-w-md rounded-lg border-2 border-primary/30 bg-secondary/95 p-12 shadow-lg backdrop-blur-sm">
                        <Trophy className="mx-auto mb-6 h-16 w-16 text-primary/50" />
                        <h3 className="mb-3 text-xl font-semibold text-text-primary">No hay torneos creados</h3>
                        <p className="mb-6 text-text-primary/70">Comienza creando tu primer torneo para gestionar las competiciones.</p>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-secondary shadow-lg transition-all duration-200 hover:bg-primary-dark hover:shadow-xl"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Crear Primer Torneo
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de confirmación de eliminación */}
            <Modal show={showDeleteModal} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="mb-4 text-lg font-semibold text-text-primary">Confirmar Eliminación</h2>
                    <p className="mb-6 text-text-primary/70">
                        ¿Estás seguro de que deseas eliminar el torneo "{tournamentToDelete?.name}"? Esta acción no se puede deshacer y se eliminarán
                        todas las inscripciones asociadas.
                    </p>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={closeModal}
                            className="rounded-lg border border-primary/30 px-4 py-2 text-text-primary transition-colors duration-200 hover:bg-primary/20"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={deleteTournament}
                            className="bg-error hover:bg-error-dark rounded-lg px-4 py-2 text-text-primary transition-colors duration-200"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal de crear torneo */}
            <Modal show={showCreateModal} onClose={closeCreateModal} maxWidth="lg">
                <div className="rounded-lg border-2 border-primary bg-secondary/95 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 text-xl font-semibold text-text-primary">Crear Nuevo Torneo</h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Nombre */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-text-primary">Nombre</label>
                            <input
                                type="text"
                                value={createName}
                                onChange={(e) => setCreateName(e.target.value)}
                                className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder="Nombre del torneo"
                            />
                        </div>

                        {/* Descripción */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-text-primary">Descripción</label>
                            <textarea
                                value={createDescription}
                                onChange={(e) => setCreateDescription(e.target.value)}
                                className="h-20 w-full resize-none rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder="Descripción del torneo (opcional)"
                            />
                        </div>

                        {/* Juego */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-text-primary">Juego</label>
                            <select
                                value={createGameId}
                                onChange={(e) => setCreateGameId(e.target.value ? parseInt(e.target.value) : '')}
                                className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                <option value="">Seleccionar juego</option>
                                {games.map((game) => (
                                    <option key={game.id} value={game.id}>
                                        {game.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-text-primary">Estado</label>
                            <select
                                value={createStatus}
                                onChange={(e) => setCreateStatus(e.target.value)}
                                className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
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
                            <label className="mb-2 block text-sm font-medium text-text-primary">Fecha de inicio</label>
                            <input
                                type="date"
                                value={createStartDate}
                                onChange={(e) => setCreateStartDate(e.target.value)}
                                className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>

                        {/* Fecha de fin */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-text-primary">Fecha de fin</label>
                            <input
                                type="date"
                                value={createEndDate}
                                onChange={(e) => setCreateEndDate(e.target.value)}
                                className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>

                        {/* Inicio de inscripciones */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-text-primary">Inicio inscripciones</label>
                            <input
                                type="date"
                                value={createRegistrationStart}
                                onChange={(e) => setCreateRegistrationStart(e.target.value)}
                                className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                            <p className="mt-1 text-xs text-text-primary/60">
                                Las inscripciones se cerrarán automáticamente cuando comience el torneo
                            </p>
                        </div>

                        {/* Cuota de entrada */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-text-primary">Cuota (€)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={createEntryFee}
                                onChange={(e) => setCreateEntryFee(e.target.value)}
                                className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder="0.00"
                            />
                        </div>

                        {/* Límite de inscripciones */}
                        <div className="md:col-span-2">
                            <div className="mb-3 flex items-center">
                                <input
                                    type="checkbox"
                                    id="createHasLimit"
                                    checked={createHasRegistrationLimit}
                                    onChange={(e) => setCreateHasRegistrationLimit(e.target.checked)}
                                    className="h-4 w-4 rounded border-primary/30 bg-secondary-light text-primary focus:ring-2 focus:ring-primary"
                                />
                                <label htmlFor="createHasLimit" className="ml-2 text-sm font-medium text-text-primary">
                                    El torneo tiene límite de inscripciones
                                </label>
                            </div>
                            {createHasRegistrationLimit && (
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-text-primary">Número máximo de inscripciones</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={createRegistrationLimit}
                                        onChange={(e) => setCreateRegistrationLimit(e.target.value)}
                                        className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                        placeholder="Ej: 32"
                                    />
                                    <p className="mt-1 text-xs text-text-primary/60">
                                        Las inscripciones se cerrarán automáticamente al alcanzar este límite
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Preview de imagen nueva */}
                        {createPreviewImage && (
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-text-primary">Vista previa</label>
                                <img
                                    src={createPreviewImage}
                                    alt="Preview"
                                    className="h-24 w-24 rounded-lg border-2 border-primary/30 object-cover"
                                />
                            </div>
                        )}

                        {/* Subir imagen */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-text-primary">Imagen del torneo</label>
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
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
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
                            Crear Torneo
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal de editar torneo */}
            <Modal show={showEditModal} onClose={closeEditModal} maxWidth="lg">
                <div className="rounded-lg border-2 border-primary bg-secondary/95 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 text-xl font-semibold text-text-primary">Editar Torneo</h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Nombre */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-text-primary">Nombre</label>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>

                        {/* Descripción */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-text-primary">Descripción</label>
                            <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="h-20 w-full resize-none rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>

                        {/* Juego */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-text-primary">Juego</label>
                            <select
                                value={editGameId}
                                onChange={(e) => setEditGameId(e.target.value ? parseInt(e.target.value) : '')}
                                className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                <option value="">Seleccionar juego</option>
                                {games.map((game) => (
                                    <option key={game.id} value={game.id}>
                                        {game.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-text-primary">Estado</label>
                            <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
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
                            <label className="mb-2 block text-sm font-medium text-text-primary">Fecha de inicio</label>
                            <input
                                type="date"
                                value={editStartDate}
                                onChange={(e) => setEditStartDate(e.target.value)}
                                className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>

                        {/* Fecha de fin */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-text-primary">Fecha de fin</label>
                            <input
                                type="date"
                                value={editEndDate}
                                onChange={(e) => setEditEndDate(e.target.value)}
                                className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>

                        {/* Inicio de inscripciones */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-text-primary">Inicio inscripciones</label>
                            <input
                                type="date"
                                value={editRegistrationStart}
                                onChange={(e) => setEditRegistrationStart(e.target.value)}
                                className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                            <p className="mt-1 text-xs text-text-primary/60">
                                Las inscripciones se cerrarán automáticamente cuando comience el torneo
                            </p>
                        </div>

                        {/* Cuota de entrada */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-text-primary">Cuota (€)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editEntryFee}
                                onChange={(e) => setEditEntryFee(e.target.value)}
                                className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder="0.00"
                            />
                        </div>

                        {/* Límite de inscripciones */}
                        <div className="md:col-span-2">
                            <div className="mb-3 flex items-center">
                                <input
                                    type="checkbox"
                                    id="editHasLimit"
                                    checked={editHasRegistrationLimit}
                                    onChange={(e) => setEditHasRegistrationLimit(e.target.checked)}
                                    className="h-4 w-4 rounded border-primary/30 bg-secondary-light text-primary focus:ring-2 focus:ring-primary"
                                />
                                <label htmlFor="editHasLimit" className="ml-2 text-sm font-medium text-text-primary">
                                    El torneo tiene límite de inscripciones
                                </label>
                            </div>
                            {editHasRegistrationLimit && (
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-text-primary">Número máximo de inscripciones</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={editRegistrationLimit}
                                        onChange={(e) => setEditRegistrationLimit(e.target.value)}
                                        className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                        placeholder="Ej: 32"
                                    />
                                    <p className="mt-1 text-xs text-text-primary/60">
                                        Las inscripciones se cerrarán automáticamente al alcanzar este límite
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Imagen actual */}
                        {editPreviewImage && (
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-text-primary">Imagen actual</label>
                                <img src={editPreviewImage} alt="Preview" className="h-24 w-24 rounded-lg border-2 border-primary/30 object-cover" />
                            </div>
                        )}

                        {/* Subir nueva imagen */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-text-primary">Nueva imagen</label>
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
                                className="w-full text-sm text-text-primary/70 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-secondary file:shadow-lg hover:file:bg-primary-dark"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
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
        </AdminLayout>
    );
};

export default Index;
