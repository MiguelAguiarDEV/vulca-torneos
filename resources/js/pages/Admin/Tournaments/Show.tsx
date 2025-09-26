import Modal from '@/components/UI/Modal';
import AdminLayout from '@/layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle, Clock, DollarSign, Edit, Gamepad, Plus, Search, Trash2, Trophy, Users, XCircle } from 'lucide-react';
import React, { useState } from 'react';

// Tipos
interface Game {
    id: number;
    name: string;
    image: string | null;
}

interface Tournament {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
    game_id: number;
    game: Game;
    start_date: string;
    end_date: string | null;
    registration_start: string | null;
    registration_end: string | null;
    entry_fee: number | null;
    has_registration_limit: boolean;
    registration_limit: number | null;
    status: string;
    available_spots?: number | null;
    registration_progress?: number | null;
}

interface Registration {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    status: string;
    payment_method: string;
    payment_status: string;
    payment_notes: string | null;
    amount: number | null;
    registered_at: string;
    team_name: string | null;
    created_at: string;
    updated_at: string;
}

interface ShowProps {
    tournament: Tournament;
    registrations?: Registration[];
    users?: Array<{
        id: number;
        name: string;
        email: string;
    }>;
    games?: Array<{
        id: number;
        name: string;
        image: string | null;
    }>;
}

const Show: React.FC<ShowProps> = ({ tournament, registrations = [], users = [], games = [] }) => {
    // Estados para modal de eliminación de inscripciones
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [registrationToDelete, setRegistrationToDelete] = useState<Registration | null>(null);

    // Estado para búsqueda
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Estados para modal de crear inscripción
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [userSelectionType, setUserSelectionType] = useState<'existing' | 'new'>('existing');
    const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
    const [newUserName, setNewUserName] = useState<string>('');
    const [newUserEmail, setNewUserEmail] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('cash');
    const [paymentStatus, setPaymentStatus] = useState<string>('pending');
    const [paymentNotes, setPaymentNotes] = useState<string>('');

    // Estados para modal de editar inscripción
    const [showEditModal, setShowEditModal] = useState(false);
    const [registrationToEdit, setRegistrationToEdit] = useState<Registration | null>(null);
    const [editPaymentMethod, setEditPaymentMethod] = useState<string>('');
    const [editPaymentStatus, setEditPaymentStatus] = useState<string>('');
    const [editPaymentNotes, setEditPaymentNotes] = useState<string>('');

    // Estados para modal de editar torneo
    const [showEditTournamentModal, setShowEditTournamentModal] = useState(false);
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

    // Funciones para formatear fechas
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

    const formatDateForBackend = (dateString: string): string => {
        if (!dateString) return '';

        const isoDateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
        if (isoDateRegex.test(dateString)) {
            return dateString;
        }

        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = dateString.match(dateRegex);

        if (!match) return '';

        const [, day, month, year] = match;
        return `${year}-${month}-${day}`;
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

    const getRegistrationStatusColor = (status: string) => {
        const statusColors: Record<string, string> = {
            pending: 'bg-warning text-secondary',
            confirmed: 'bg-success text-text-primary',
            cancelled: 'bg-error text-text-primary',
            rejected: 'bg-error text-text-primary',
        };
        return statusColors[status] || 'bg-secondary text-text-primary';
    };

    const getRegistrationStatusText = (status: string) => {
        const statusTexts: Record<string, string> = {
            pending: 'Pendiente',
            confirmed: 'Confirmada',
            cancelled: 'Cancelada',
            rejected: 'Rechazada',
        };
        return statusTexts[status] || status;
    };

    // Funciones adicionales para inscripciones
    const getPaymentStatusColor = (status: string) => {
        const statusColors: Record<string, string> = {
            pending: 'bg-warning text-secondary',
            confirmed: 'bg-success text-text-primary',
            failed: 'bg-error text-text-primary',
        };
        return statusColors[status] || 'bg-secondary text-text-primary';
    };

    const getPaymentStatusText = (status: string) => {
        const statusTexts: Record<string, string> = {
            pending: 'Pendiente',
            confirmed: 'Confirmado',
            failed: 'Fallido',
        };
        return statusTexts[status] || status;
    };

    const getPaymentMethodText = (method: string) => {
        const methodTexts: Record<string, string> = {
            cash: 'Efectivo',
            transfer: 'Transferencia',
            card: 'Tarjeta',
        };
        return methodTexts[method] || method;
    };

    // Funciones para manejar inscripciones
    const confirmDeleteRegistration = (registration: Registration) => {
        setRegistrationToDelete(registration);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setRegistrationToDelete(null);
    };

    const deleteRegistration = () => {
        if (registrationToDelete) {
            router.delete(route('admin.registrations.destroy', registrationToDelete.id), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Inscripción eliminada exitosamente');
                    closeDeleteModal();
                },
                onError: (errors) => {
                    console.error('Error al eliminar la inscripción:', errors);
                    alert('Error al eliminar la inscripción. Intenta nuevamente.');
                },
            });
        }
    };

    // Funciones para crear inscripción
    const openCreateModal = () => {
        setShowCreateModal(true);
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
        setUserSelectionType('existing');
        setSelectedUserId('');
        setNewUserName('');
        setNewUserEmail('');
        setPaymentMethod('cash');
        setPaymentStatus('pending');
        setPaymentNotes('');
    };

    const saveCreateRegistration = () => {
        if (userSelectionType === 'existing' && !selectedUserId) {
            alert('Debes seleccionar un usuario');
            return;
        }
        if (userSelectionType === 'new' && !newUserName.trim()) {
            alert('El nombre del nuevo usuario es requerido');
            return;
        }

        const data = new FormData();
        data.append('user_selection_type', userSelectionType);
        data.append('tournament_id', tournament.id.toString());

        if (userSelectionType === 'existing') {
            data.append('user_id', selectedUserId.toString());
        } else {
            data.append('new_user_name', newUserName.trim());
            if (newUserEmail.trim()) {
                data.append('new_user_email', newUserEmail.trim());
            }
        }

        data.append('payment_method', paymentMethod);
        data.append('payment_status', paymentStatus);

        if (paymentNotes.trim()) {
            data.append('payment_notes', paymentNotes.trim());
        }

        router.post(route('admin.registrations.store'), data, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Inscripción creada exitosamente');
                closeCreateModal();
            },
            onError: (errors) => {
                console.error('Error al crear la inscripción:', errors);
                let errorMessage = 'Error al crear la inscripción:\n';
                Object.keys(errors).forEach((key) => {
                    errorMessage += `${key}: ${errors[key]}\n`;
                });
                alert(errorMessage);
            },
        });
    };

    // Funciones para editar inscripción
    const openEditModal = (registration: Registration) => {
        setRegistrationToEdit(registration);
        setEditPaymentMethod(registration.payment_method);
        setEditPaymentStatus(registration.payment_status);
        setEditPaymentNotes(registration.payment_notes || '');
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setRegistrationToEdit(null);
        setEditPaymentMethod('');
        setEditPaymentStatus('');
        setEditPaymentNotes('');
    };

    const saveEditRegistration = () => {
        if (!registrationToEdit) return;

        const data = new FormData();
        data.append('_method', 'PUT');
        data.append('payment_method', editPaymentMethod);
        data.append('payment_status', editPaymentStatus);

        if (editPaymentNotes.trim()) {
            data.append('payment_notes', editPaymentNotes.trim());
        }

        router.post(route('admin.registrations.update', registrationToEdit.id), data, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Inscripción actualizada exitosamente');
                closeEditModal();
            },
            onError: (errors) => {
                console.error('Error al actualizar la inscripción:', errors);
                let errorMessage = 'Error al actualizar la inscripción:\n';
                Object.keys(errors).forEach((key) => {
                    errorMessage += `${key}: ${errors[key]}\n`;
                });
                alert(errorMessage);
            },
        });
    };

    // Funciones para editar torneo
    const openEditTournamentModal = () => {
        setEditName(tournament.name);
        setEditDescription(tournament.description || '');
        setEditGameId(tournament.game_id);
        setEditStatus(tournament.status);
        setEditStartDate(formatDateForInput(tournament.start_date));
        setEditEndDate(formatDateForInput(tournament.end_date));
        setEditRegistrationStart(formatDateForInput(tournament.registration_start));
        setEditEntryFee(tournament.entry_fee?.toString() || '0');
        setEditHasRegistrationLimit(tournament.has_registration_limit || false);
        setEditRegistrationLimit(tournament.registration_limit?.toString() || '');
        setEditPreviewImage(tournament.image || '');
        setEditImageFile(null);
        setShowEditTournamentModal(true);
    };

    const closeEditTournamentModal = () => {
        setShowEditTournamentModal(false);
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

    const saveEditTournament = () => {
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

        router.post(route('admin.tournaments.update', tournament.id), data, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Torneo actualizado exitosamente');
                closeEditTournamentModal();
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

    // Funciones de acciones rápidas
    const quickConfirmPayment = (registration: Registration) => {
        const data = new FormData();
        data.append('_method', 'PUT');
        data.append('payment_method', registration.payment_method);
        data.append('payment_status', 'confirmed');
        data.append('payment_notes', registration.payment_notes || '');

        router.post(route('admin.registrations.update', registration.id), data, {
            preserveState: false,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Pago confirmado exitosamente');
            },
            onError: (errors) => {
                console.error('Error al confirmar el pago:', errors);
                alert('Error al confirmar el pago. Intenta nuevamente.');
            },
        });
    };

    const quickCancelPayment = (registration: Registration) => {
        const data = new FormData();
        data.append('_method', 'PUT');
        data.append('payment_method', registration.payment_method);
        data.append('payment_status', 'pending');
        data.append('payment_notes', registration.payment_notes || '');

        router.post(route('admin.registrations.update', registration.id), data, {
            preserveState: false,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Pago marcado como pendiente');
            },
            onError: (errors) => {
                console.error('Error al cambiar estado del pago:', errors);
                alert('Error al cambiar estado del pago. Intenta nuevamente.');
            },
        });
    };

    const quickCancelRegistration = (registration: Registration) => {
        if (confirm(`¿Estás seguro de que quieres cancelar la inscripción de ${registration.user.name}?`)) {
            const data = new FormData();
            data.append('_method', 'PUT');
            data.append('payment_method', registration.payment_method);
            data.append('payment_status', 'failed');
            data.append('payment_notes', (registration.payment_notes || '') + ' - Inscripción cancelada por administrador');

            router.post(route('admin.registrations.update', registration.id), data, {
                preserveState: false,
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Inscripción cancelada exitosamente');
                },
                onError: (errors) => {
                    console.error('Error al cancelar la inscripción:', errors);
                    alert('Error al cancelar la inscripción. Intenta nuevamente.');
                },
            });
        }
    };

    // Filtrar inscripciones basado en el término de búsqueda
    const filteredRegistrations = registrations
        ? registrations.filter(
              (reg) =>
                  reg.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || reg.user.email.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : [];

    // Estadísticas totales (sin filtrar)
    const totalConfirmedRegistrations = registrations ? registrations.filter((reg) => reg.status === 'confirmed') : [];
    const totalPendingRegistrations = registrations ? registrations.filter((reg) => reg.status === 'pending') : [];

    // Estadísticas filtradas (para la visualización de la lista)
    const confirmedRegistrations = filteredRegistrations.filter((reg) => reg.status === 'confirmed');
    const pendingRegistrations = filteredRegistrations.filter((reg) => reg.status === 'pending');

    return (
        <AdminLayout title={`Detalles - ${tournament.name}`} pageTitle={`Detalles del Torneo`}>
            {/* Header con información del torneo */}
            <div className="mb-8">
                <div className="rounded-lg border-2 border-primary/30 bg-secondary/95 p-6 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center">
                        <Link
                            href={route('admin.tournaments.index')}
                            className="mr-6 rounded-lg border border-primary/30 p-3 text-text-primary transition-all duration-200 hover:scale-110 hover:border-primary hover:bg-primary/20 hover:text-primary"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </Link>
                        <div className="flex flex-grow items-center">
                            {tournament.image ? (
                                <img
                                    src={tournament.image}
                                    alt={tournament.name}
                                    className="mr-8 h-24 w-24 rounded-lg border-2 border-primary object-cover shadow-xl transition-transform duration-200 hover:scale-105"
                                />
                            ) : (
                                <div className="mr-8 flex h-24 w-24 items-center justify-center rounded-lg border-2 border-primary bg-secondary/80 shadow-xl transition-transform duration-200 hover:scale-105">
                                    <Trophy className="h-12 w-12 text-primary" />
                                </div>
                            )}
                            <div className="flex-grow">
                                <div className="mb-3 flex items-center gap-4">
                                    <h1 className="text-5xl font-bold text-white drop-shadow-lg">{tournament.name}</h1>
                                    <span className={`rounded-full px-4 py-2 text-sm font-medium shadow-lg ${getStatusColor(tournament.status)}`}>
                                        {getStatusText(tournament.status)}
                                    </span>
                                </div>
                                {tournament.description && (
                                    <p className="mb-3 rounded-lg border border-primary/20 bg-secondary/50 px-4 py-2 text-xl text-white backdrop-blur-sm">
                                        {tournament.description}
                                    </p>
                                )}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center rounded-lg border border-primary/30 bg-primary/20 px-3 py-2 backdrop-blur-sm">
                                            <Gamepad className="mr-2 h-5 w-5 text-primary" />
                                            <span className="font-medium text-white">{tournament.game.name}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={openEditTournamentModal}
                                        className="flex items-center rounded-lg bg-primary px-4 py-2 font-semibold text-secondary shadow-lg transition-all duration-200 hover:scale-105 hover:bg-primary-dark hover:shadow-xl"
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar Torneo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información del torneo */}
            <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="rounded-lg border-2 border-primary/30 bg-secondary/95 p-6 shadow-lg backdrop-blur-sm">
                    <h3 className="mb-4 flex items-center text-lg font-semibold text-text-primary">
                        <Calendar className="mr-2 h-5 w-5 text-primary" />
                        Fechas del Torneo
                    </h3>
                    <div className="space-y-3 text-text-primary/70">
                        <div>
                            <span className="font-medium">Inicio:</span>
                            <span className="ml-2">
                                {new Date(tournament.start_date).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                        {tournament.end_date && (
                            <div>
                                <span className="font-medium">Fin:</span>
                                <span className="ml-2">
                                    {new Date(tournament.end_date).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-lg border-2 border-warning/30 bg-secondary/95 p-6 shadow-lg backdrop-blur-sm">
                    <h3 className="mb-4 flex items-center text-lg font-semibold text-text-primary">
                        <Clock className="mr-2 h-5 w-5 text-warning" />
                        Inscripciones
                    </h3>
                    <div className="space-y-3 text-text-primary/70">
                        {tournament.registration_start && (
                            <div>
                                <span className="font-medium">Apertura:</span>
                                <span className="ml-2">{new Date(tournament.registration_start).toLocaleDateString('es-ES')}</span>
                            </div>
                        )}
                        {tournament.registration_end && (
                            <div>
                                <span className="font-medium">Cierre:</span>
                                <span className="ml-2">{new Date(tournament.registration_end).toLocaleDateString('es-ES')}</span>
                            </div>
                        )}
                        <div>
                            <span className="font-medium">Total:</span>
                            <span className="ml-2 font-bold text-text-primary">
                                {registrations.length}
                                {tournament.has_registration_limit ? ` / ${tournament.registration_limit} inscripciones` : ' inscripciones'}
                            </span>
                            {tournament.has_registration_limit && (
                                <div className="mt-2">
                                    <div className="mb-1 flex items-center justify-between text-sm text-text-primary/70">
                                        <span>Progreso de llenado</span>
                                        <span>{Math.round((registrations.length / tournament.registration_limit!) * 100)}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-secondary-light">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                registrations.length / tournament.registration_limit! >= 0.9
                                                    ? 'bg-error'
                                                    : registrations.length / tournament.registration_limit! >= 0.7
                                                      ? 'bg-warning'
                                                      : 'bg-success'
                                            }`}
                                            style={{ width: `${Math.min(100, (registrations.length / tournament.registration_limit!) * 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="mt-1 text-xs text-text-primary/60">
                                        {tournament.registration_limit! - registrations.length} plazas disponibles
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border-2 border-success/30 bg-secondary/95 p-6 shadow-lg backdrop-blur-sm">
                    <h3 className="mb-4 flex items-center text-lg font-semibold text-text-primary">
                        <DollarSign className="mr-2 h-5 w-5 text-success" />
                        Información Adicional
                    </h3>
                    <div className="space-y-3 text-text-primary/70">
                        <div>
                            <span className="font-medium">Cuota de entrada:</span>
                            <span className="ml-2 font-bold text-text-primary">{tournament.entry_fee ? `€${tournament.entry_fee}` : 'Gratis'}</span>
                        </div>
                        <div>
                            <span className="font-medium">Confirmadas:</span>
                            <span className="ml-2 font-bold text-success">{totalConfirmedRegistrations.length}</span>
                        </div>
                        <div>
                            <span className="font-medium">Pendientes:</span>
                            <span className="ml-2 font-bold text-warning">{totalPendingRegistrations.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de inscripciones */}
            <div className="rounded-lg border-2 border-primary/30 bg-secondary/95 p-6 shadow-lg backdrop-blur-sm">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <Users className="mr-3 h-8 w-8 text-primary" />
                        <h2 className="text-2xl font-bold text-text-primary">Inscripciones</h2>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-secondary shadow-lg transition-all duration-200 hover:scale-105 hover:bg-primary-dark hover:shadow-xl"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Inscripción
                    </button>
                </div>

                {/* Campo de búsqueda */}
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-primary/30 bg-secondary-light px-4 py-3 pl-10 text-text-primary placeholder-text-primary/50 transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-primary/70" />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-text-primary/50 transition-colors hover:text-text-primary"
                            >
                                <XCircle className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                    {searchTerm && (
                        <p className="mt-2 text-sm text-text-primary/60">
                            Mostrando {filteredRegistrations.length} de {registrations.length} inscripciones
                        </p>
                    )}
                </div>

                {filteredRegistrations.length > 0 ? (
                    <div className="space-y-4">
                        {filteredRegistrations.map((registration) => (
                            <div
                                key={registration.id}
                                className="rounded-lg border border-primary/30 bg-secondary-dark/80 p-4 backdrop-blur-sm transition-all duration-200 hover:border-primary hover:shadow-lg"
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-text-primary">{registration.user.name}</h3>
                                        <p className="text-sm text-text-primary/70">{registration.user.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`rounded-full px-3 py-1 text-sm font-medium shadow-lg ${getPaymentStatusColor(registration.payment_status)}`}
                                        >
                                            {getPaymentStatusText(registration.payment_status)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-1 text-sm text-text-primary/70">
                                        <div>
                                            <span className="font-medium">Método de pago:</span>
                                            <span className="ml-2">{getPaymentMethodText(registration.payment_method)}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium">Inscrito el:</span>
                                            <span className="ml-2">
                                                {new Date(registration.created_at).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                        {registration.payment_notes && (
                                            <div>
                                                <span className="font-medium">Notas:</span>
                                                <span className="ml-2">{registration.payment_notes}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="flex items-center gap-2">
                                        {registration.payment_status === 'pending' && (
                                            <button
                                                onClick={() => quickConfirmPayment(registration)}
                                                className="hover:bg-success-dark flex items-center rounded-lg bg-success px-3 py-2 text-sm font-medium text-text-primary shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                                                title="Confirmar pago"
                                            >
                                                <CheckCircle className="mr-1 h-4 w-4" />
                                                Confirmar Pago
                                            </button>
                                        )}

                                        {registration.payment_status === 'confirmed' && (
                                            <button
                                                onClick={() => quickCancelPayment(registration)}
                                                className="hover:bg-warning-dark flex items-center rounded-lg bg-warning px-3 py-2 text-sm font-medium text-secondary shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                                                title="Marcar como pendiente"
                                            >
                                                <Clock className="mr-1 h-4 w-4" />
                                                Pendiente
                                            </button>
                                        )}

                                        <button
                                            onClick={() => openEditModal(registration)}
                                            className="hover:bg-info-dark flex items-center rounded-lg bg-info px-3 py-2 text-sm font-medium text-text-primary shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                                            title="Editar inscripción"
                                        >
                                            <Edit className="mr-1 h-4 w-4" />
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => quickCancelRegistration(registration)}
                                            className="bg-error hover:bg-error-dark flex items-center rounded-lg px-3 py-2 text-sm font-medium text-text-primary shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                                            title="Cancelar inscripción"
                                        >
                                            <XCircle className="mr-1 h-4 w-4" />
                                            Cancelar
                                        </button>

                                        <button
                                            onClick={() => confirmDeleteRegistration(registration)}
                                            className="bg-error hover:bg-error-dark flex items-center rounded-lg px-3 py-2 text-sm font-medium text-text-primary shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                                            title="Eliminar inscripción"
                                        >
                                            <Trash2 className="mr-1 h-4 w-4" />
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <Users className="mx-auto mb-4 h-16 w-16 text-primary/50" />
                        {searchTerm ? (
                            <>
                                <h3 className="mb-2 text-lg font-semibold text-text-primary">No se encontraron inscripciones</h3>
                                <p className="mb-6 text-text-primary/70">No hay inscripciones que coincidan con "{searchTerm}".</p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-secondary shadow-lg transition-all duration-200 hover:bg-primary-dark hover:shadow-xl"
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Limpiar búsqueda
                                </button>
                            </>
                        ) : registrations.length === 0 ? (
                            <>
                                <h3 className="mb-2 text-lg font-semibold text-text-primary">No hay inscripciones</h3>
                                <p className="mb-6 text-text-primary/70">Las inscripciones aparecerán aquí cuando los usuarios se registren.</p>
                                <button
                                    onClick={openCreateModal}
                                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-secondary shadow-lg transition-all duration-200 hover:bg-primary-dark hover:shadow-xl"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Primera Inscripción
                                </button>
                            </>
                        ) : (
                            <>
                                <h3 className="mb-2 text-lg font-semibold text-text-primary">No se encontraron resultados</h3>
                                <p className="mb-6 text-text-primary/70">Intenta con otros términos de búsqueda.</p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-secondary shadow-lg transition-all duration-200 hover:bg-primary-dark hover:shadow-xl"
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Ver todas las inscripciones
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Estadísticas rápidas */}
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4">
                <div className="rounded-lg border-2 border-primary/30 bg-secondary/95 p-4 shadow-lg backdrop-blur-sm transition-all duration-200 hover:border-primary hover:shadow-xl">
                    <div className="flex items-center">
                        <Users className="mr-3 h-8 w-8 text-primary" />
                        <div>
                            <h3 className="text-sm font-medium text-text-primary/70">Total Inscripciones</h3>
                            <p className="text-2xl font-bold text-text-primary">{registrations.length}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border-2 border-success/30 bg-secondary/95 p-4 shadow-lg backdrop-blur-sm transition-all duration-200 hover:border-success hover:shadow-xl">
                    <div className="flex items-center">
                        <Trophy className="mr-3 h-8 w-8 text-success" />
                        <div>
                            <h3 className="text-sm font-medium text-text-primary/70">Confirmadas</h3>
                            <p className="text-2xl font-bold text-text-primary">{totalConfirmedRegistrations.length}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border-2 border-warning/30 bg-secondary/95 p-4 shadow-lg backdrop-blur-sm transition-all duration-200 hover:border-warning hover:shadow-xl">
                    <div className="flex items-center">
                        <Clock className="mr-3 h-8 w-8 text-warning" />
                        <div>
                            <h3 className="text-sm font-medium text-text-primary/70">Pendientes</h3>
                            <p className="text-2xl font-bold text-text-primary">{totalPendingRegistrations.length}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border-2 border-info/30 bg-secondary/95 p-4 shadow-lg backdrop-blur-sm transition-all duration-200 hover:border-info hover:shadow-xl">
                    <div className="flex items-center">
                        <DollarSign className="mr-3 h-8 w-8 text-info" />
                        <div>
                            <h3 className="text-sm font-medium text-text-primary/70">Ingresos</h3>
                            <p className="text-2xl font-bold text-text-primary">
                                €{tournament.entry_fee ? (totalConfirmedRegistrations.length * tournament.entry_fee).toFixed(2) : '0.00'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación de eliminación */}
            <Modal show={showDeleteModal} onClose={closeDeleteModal}>
                <div className="p-6">
                    <h2 className="mb-4 text-lg font-semibold text-text-primary">Confirmar Eliminación</h2>
                    <p className="mb-6 text-text-primary/70">
                        ¿Estás seguro de que deseas eliminar la inscripción de "{registrationToDelete?.user.name}"? Esta acción no se puede deshacer.
                    </p>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={closeDeleteModal}
                            className="rounded-lg border border-primary/30 px-4 py-2 text-text-primary transition-colors duration-200 hover:bg-primary/20"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={deleteRegistration}
                            className="bg-error hover:bg-error-dark rounded-lg px-4 py-2 text-text-primary transition-colors duration-200"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal de crear inscripción */}
            <Modal show={showCreateModal} onClose={closeCreateModal} maxWidth="lg">
                <div className="rounded-lg border-2 border-primary bg-secondary/95 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 text-xl font-semibold text-text-primary">Nueva Inscripción para {tournament.name}</h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Tipo de usuario */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-text-primary">Tipo de usuario</label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="existing"
                                        checked={userSelectionType === 'existing'}
                                        onChange={(e) => setUserSelectionType(e.target.value as 'existing' | 'new')}
                                        className="mr-2"
                                    />
                                    <span className="text-text-primary">Usuario existente</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="new"
                                        checked={userSelectionType === 'new'}
                                        onChange={(e) => setUserSelectionType(e.target.value as 'existing' | 'new')}
                                        className="mr-2"
                                    />
                                    <span className="text-text-primary">Nuevo usuario</span>
                                </label>
                            </div>
                        </div>

                        {userSelectionType === 'existing' ? (
                            /* Usuario existente */
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-text-primary">Usuario</label>
                                <select
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : '')}
                                    className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                >
                                    <option value="">Selecciona un usuario</option>
                                    {users && users.length > 0 ? (
                                        users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} ({user.email})
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No hay usuarios disponibles</option>
                                    )}
                                </select>
                            </div>
                        ) : (
                            /* Nuevo usuario */
                            <>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-text-primary">Nombre *</label>
                                    <input
                                        type="text"
                                        value={newUserName}
                                        onChange={(e) => setNewUserName(e.target.value)}
                                        className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                        placeholder="Nombre del usuario"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-text-primary">Email</label>
                                    <input
                                        type="email"
                                        value={newUserEmail}
                                        onChange={(e) => setNewUserEmail(e.target.value)}
                                        className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                        placeholder="email@ejemplo.com"
                                    />
                                </div>
                            </>
                        )}

                        {/* Método de pago */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-text-primary">Método de pago</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                <option value="cash">Efectivo</option>
                                <option value="transfer">Transferencia</option>
                                <option value="card">Tarjeta</option>
                            </select>
                        </div>

                        {/* Estado de pago */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-text-primary">Estado de pago</label>
                            <select
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value)}
                                className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                <option value="pending">Pendiente</option>
                                <option value="confirmed">Confirmado</option>
                                <option value="failed">Fallido</option>
                            </select>
                        </div>

                        {/* Notas de pago */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-text-primary">Notas de pago</label>
                            <textarea
                                value={paymentNotes}
                                onChange={(e) => setPaymentNotes(e.target.value)}
                                className="h-20 w-full resize-none rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder="Notas adicionales sobre el pago (opcional)"
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
                            onClick={saveCreateRegistration}
                            className="rounded-lg bg-primary px-4 py-2 font-medium text-secondary shadow-lg transition-colors hover:bg-primary-dark"
                        >
                            Crear Inscripción
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal de editar inscripción */}
            <Modal show={showEditModal} onClose={closeEditModal} maxWidth="lg">
                <div className="rounded-lg border-2 border-primary bg-secondary/95 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 text-xl font-semibold text-text-primary">Editar Inscripción</h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Usuario (solo lectura) */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-text-primary">Usuario</label>
                            <input
                                type="text"
                                value={registrationToEdit ? `${registrationToEdit.user.name} (${registrationToEdit.user.email})` : ''}
                                className="w-full cursor-not-allowed rounded-lg border border-primary/30 bg-secondary-lighter px-3 py-2 text-text-primary"
                                disabled
                            />
                        </div>

                        {/* Método de pago */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-text-primary">Método de pago</label>
                            <select
                                value={editPaymentMethod}
                                onChange={(e) => setEditPaymentMethod(e.target.value)}
                                className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                <option value="cash">Efectivo</option>
                                <option value="transfer">Transferencia</option>
                                <option value="card">Tarjeta</option>
                            </select>
                        </div>

                        {/* Estado de pago */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-text-primary">Estado de pago</label>
                            <select
                                value={editPaymentStatus}
                                onChange={(e) => setEditPaymentStatus(e.target.value)}
                                className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                <option value="pending">Pendiente</option>
                                <option value="confirmed">Confirmado</option>
                                <option value="failed">Fallido</option>
                            </select>
                        </div>

                        {/* Notas de pago */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-text-primary">Notas de pago</label>
                            <textarea
                                value={editPaymentNotes}
                                onChange={(e) => setEditPaymentNotes(e.target.value)}
                                className="h-20 w-full resize-none rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder="Notas adicionales sobre el pago"
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
                            onClick={saveEditRegistration}
                            className="rounded-lg bg-primary px-4 py-2 font-medium text-secondary shadow-lg transition-colors hover:bg-primary-dark"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal de editar torneo */}
            <Modal show={showEditTournamentModal} onClose={closeEditTournamentModal} maxWidth="lg">
                <div className="rounded-lg border-2 border-primary bg-secondary/95 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 text-xl font-semibold text-text-primary">Editar Torneo</h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Nombre */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-text-primary">Nombre *</label>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder="Nombre del torneo"
                            />
                        </div>

                        {/* Descripción */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-text-primary">Descripción</label>
                            <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="h-20 w-full resize-none rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder="Descripción del torneo (opcional)"
                            />
                        </div>

                        {/* Juego */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-text-primary">Juego *</label>
                            <select
                                value={editGameId}
                                onChange={(e) => setEditGameId(e.target.value ? Number(e.target.value) : '')}
                                className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                <option value="">Selecciona un juego</option>
                                {games && games.length > 0 ? (
                                    games.map((game) => (
                                        <option key={game.id} value={game.id}>
                                            {game.name}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No hay juegos disponibles</option>
                                )}
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
                            <label className="mb-2 block text-sm font-medium text-text-primary">Fecha de inicio *</label>
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

                        {/* Imagen previa */}
                        {editPreviewImage && (
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-text-primary">Imagen actual</label>
                                <img
                                    src={editPreviewImage}
                                    alt="Vista previa"
                                    className="h-32 w-32 rounded-lg border-2 border-primary/30 object-cover"
                                />
                            </div>
                        )}

                        {/* Nueva imagen */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-text-primary">Nueva imagen</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setEditImageFile(file);
                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                            setEditPreviewImage(e.target?.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="w-full text-sm text-text-primary/70 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-secondary file:shadow-lg hover:file:bg-primary-dark"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={closeEditTournamentModal}
                            className="rounded-lg border border-primary/30 bg-secondary-light px-4 py-2 text-text-primary transition-colors hover:bg-secondary-lighter"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={saveEditTournament}
                            className="rounded-lg bg-primary px-4 py-2 font-medium text-secondary shadow-lg transition-colors hover:bg-primary-dark"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
};

export default Show;
