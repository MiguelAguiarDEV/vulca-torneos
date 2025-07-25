import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Users, Clock, Trophy, Gamepad, DollarSign, MapPin, Plus, Edit, Trash2, CheckCircle, XCircle, MoreVertical, Search } from 'lucide-react';
import Modal from '@/components/Modal';

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
            console.error("Error formatting date for input:", dateString, error);
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

    const getRegistrationStatusColor = (status: string) => {
        const statusColors: Record<string, string> = {
            'pending': 'bg-warning text-secondary',
            'confirmed': 'bg-success text-text-primary',
            'cancelled': 'bg-error text-text-primary',
            'rejected': 'bg-error text-text-primary'
        };
        return statusColors[status] || 'bg-secondary text-text-primary';
    };

    const getRegistrationStatusText = (status: string) => {
        const statusTexts: Record<string, string> = {
            'pending': 'Pendiente',
            'confirmed': 'Confirmada',
            'cancelled': 'Cancelada',
            'rejected': 'Rechazada'
        };
        return statusTexts[status] || status;
    };

    // Funciones adicionales para inscripciones
    const getPaymentStatusColor = (status: string) => {
        const statusColors: Record<string, string> = {
            'pending': 'bg-warning text-secondary',
            'confirmed': 'bg-success text-text-primary',
            'failed': 'bg-error text-text-primary'
        };
        return statusColors[status] || 'bg-secondary text-text-primary';
    };

    const getPaymentStatusText = (status: string) => {
        const statusTexts: Record<string, string> = {
            'pending': 'Pendiente',
            'confirmed': 'Confirmado',
            'failed': 'Fallido'
        };
        return statusTexts[status] || status;
    };

    const getPaymentMethodText = (method: string) => {
        const methodTexts: Record<string, string> = {
            'cash': 'Efectivo',
            'transfer': 'Transferencia',
            'card': 'Tarjeta'
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
                }
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
                Object.keys(errors).forEach(key => {
                    errorMessage += `${key}: ${errors[key]}\n`;
                });
                alert(errorMessage);
            }
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
                Object.keys(errors).forEach(key => {
                    errorMessage += `${key}: ${errors[key]}\n`;
                });
                alert(errorMessage);
            }
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
                Object.keys(errors).forEach(key => {
                    errorMessage += `${key}: ${errors[key]}\n`;
                });
                alert(errorMessage);
            }
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
            }
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
            }
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
                }
            });
        }
    };

    // Filtrar inscripciones basado en el término de búsqueda
    const filteredRegistrations = registrations ? registrations.filter(reg => 
        reg.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    // Estadísticas totales (sin filtrar)
    const totalConfirmedRegistrations = registrations ? registrations.filter(reg => reg.status === 'confirmed') : [];
    const totalPendingRegistrations = registrations ? registrations.filter(reg => reg.status === 'pending') : [];

    // Estadísticas filtradas (para la visualización de la lista)
    const confirmedRegistrations = filteredRegistrations.filter(reg => reg.status === 'confirmed');
    const pendingRegistrations = filteredRegistrations.filter(reg => reg.status === 'pending');

    return (
        <AdminLayout title={`Detalles - ${tournament.name}`} pageTitle={`Detalles del Torneo`}>
            {/* Header con información del torneo */}
            <div className="mb-8">
                <div className="bg-secondary/95 backdrop-blur-sm rounded-lg shadow-lg border-2 border-primary/30 p-6">
                    <div className="flex items-center">
                        <Link 
                            href={route('admin.tournaments.index')}
                            className="mr-6 p-3 text-text-primary hover:text-primary transition-all duration-200 rounded-lg hover:bg-primary/20 hover:scale-110 border border-primary/30 hover:border-primary"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div className="flex items-center flex-grow">
                            {tournament.image ? (
                                <img 
                                    src={tournament.image} 
                                    alt={tournament.name}
                                    className="w-24 h-24 object-cover rounded-lg border-2 border-primary mr-8 shadow-xl hover:scale-105 transition-transform duration-200"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-secondary/80 rounded-lg flex items-center justify-center mr-8 border-2 border-primary shadow-xl hover:scale-105 transition-transform duration-200">
                                    <Trophy className="w-12 h-12 text-primary" />
                                </div>
                            )}
                            <div className="flex-grow">
                                <div className="flex items-center gap-4 mb-3">
                                    <h1 className="text-5xl font-bold text-white drop-shadow-lg">{tournament.name}</h1>
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium shadow-lg ${getStatusColor(tournament.status)}`}>
                                        {getStatusText(tournament.status)}
                                    </span>
                                </div>
                                {tournament.description && (
                                    <p className="text-xl text-white bg-secondary/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-primary/20 mb-3">{tournament.description}</p>
                                )}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center bg-primary/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-primary/30">
                                            <Gamepad className="w-5 h-5 text-primary mr-2" />
                                            <span className="text-white font-medium">{tournament.game.name}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={openEditTournamentModal}
                                        className="flex items-center bg-primary hover:bg-primary-dark text-secondary font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Editar Torneo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información del torneo */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="bg-secondary/95 backdrop-blur-sm rounded-lg shadow-lg border-2 border-primary/30 p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-primary" />
                        Fechas del Torneo
                    </h3>
                    <div className="space-y-3 text-text-primary/70">
                        <div>
                            <span className="font-medium">Inicio:</span>
                            <span className="ml-2">{new Date(tournament.start_date).toLocaleDateString('es-ES', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</span>
                        </div>
                        {tournament.end_date && (
                            <div>
                                <span className="font-medium">Fin:</span>
                                <span className="ml-2">{new Date(tournament.end_date).toLocaleDateString('es-ES', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-secondary/95 backdrop-blur-sm rounded-lg shadow-lg border-2 border-warning/30 p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-warning" />
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
                            <span className="ml-2 text-text-primary font-bold">
                                {registrations.length}
                                {tournament.has_registration_limit 
                                    ? ` / ${tournament.registration_limit} inscripciones`
                                    : ' inscripciones'
                                }
                            </span>
                            {tournament.has_registration_limit && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between text-sm text-text-primary/70 mb-1">
                                        <span>Progreso de llenado</span>
                                        <span>{Math.round((registrations.length / tournament.registration_limit!) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-secondary-light rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                (registrations.length / tournament.registration_limit!) >= 0.9 
                                                    ? 'bg-error' 
                                                    : (registrations.length / tournament.registration_limit!) >= 0.7 
                                                        ? 'bg-warning' 
                                                        : 'bg-success'
                                            }`}
                                            style={{ width: `${Math.min(100, (registrations.length / tournament.registration_limit!) * 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-text-primary/60 mt-1">
                                        {tournament.registration_limit! - registrations.length} plazas disponibles
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-secondary/95 backdrop-blur-sm rounded-lg shadow-lg border-2 border-success/30 p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-success" />
                        Información Adicional
                    </h3>
                    <div className="space-y-3 text-text-primary/70">
                        <div>
                            <span className="font-medium">Cuota de entrada:</span>
                            <span className="ml-2 text-text-primary font-bold">
                                {tournament.entry_fee ? `€${tournament.entry_fee}` : 'Gratis'}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium">Confirmadas:</span>
                            <span className="ml-2 text-success font-bold">{totalConfirmedRegistrations.length}</span>
                        </div>
                        <div>
                            <span className="font-medium">Pendientes:</span>
                            <span className="ml-2 text-warning font-bold">{totalPendingRegistrations.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de inscripciones */}
            <div className="bg-secondary/95 backdrop-blur-sm rounded-lg shadow-lg border-2 border-primary/30 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <Users className="w-8 h-8 text-primary mr-3" />
                        <h2 className="text-2xl font-bold text-text-primary">Inscripciones</h2>
                    </div>
                    <button 
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-secondary font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        <Plus className="w-4 h-4 mr-2" />
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
                            className="w-full px-4 py-3 pl-10 bg-secondary-light border border-primary/30 rounded-lg text-text-primary placeholder-text-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/70" />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-primary/50 hover:text-text-primary transition-colors"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    {searchTerm && (
                        <p className="text-sm text-text-primary/60 mt-2">
                            Mostrando {filteredRegistrations.length} de {registrations.length} inscripciones
                        </p>
                    )}
                </div>
                
                {filteredRegistrations.length > 0 ? (
                    <div className="space-y-4">
                        {filteredRegistrations.map((registration) => (
                            <div key={registration.id} className="bg-secondary-dark/80 backdrop-blur-sm rounded-lg p-4 border border-primary/30 hover:border-primary hover:shadow-lg transition-all duration-200">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-text-primary">{registration.user.name}</h3>
                                        <p className="text-text-primary/70 text-sm">{registration.user.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-lg ${getPaymentStatusColor(registration.payment_status)}`}>
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
                                            <span className="ml-2">{new Date(registration.created_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</span>
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
                                                className="flex items-center px-3 py-2 bg-success hover:bg-success-dark text-text-primary rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-sm font-medium"
                                                title="Confirmar pago"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Confirmar Pago
                                            </button>
                                        )}
                                        
                                        {registration.payment_status === 'confirmed' && (
                                            <button
                                                onClick={() => quickCancelPayment(registration)}
                                                className="flex items-center px-3 py-2 bg-warning hover:bg-warning-dark text-secondary rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-sm font-medium"
                                                title="Marcar como pendiente"
                                            >
                                                <Clock className="w-4 h-4 mr-1" />
                                                Pendiente
                                            </button>
                                        )}
                                        
                                        <button
                                            onClick={() => openEditModal(registration)}
                                            className="flex items-center px-3 py-2 bg-info hover:bg-info-dark text-text-primary rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-sm font-medium"
                                            title="Editar inscripción"
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            Editar
                                        </button>
                                        
                                        <button
                                            onClick={() => quickCancelRegistration(registration)}
                                            className="flex items-center px-3 py-2 bg-error hover:bg-error-dark text-text-primary rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-sm font-medium"
                                            title="Cancelar inscripción"
                                        >
                                            <XCircle className="w-4 h-4 mr-1" />
                                            Cancelar
                                        </button>
                                        
                                        <button
                                            onClick={() => confirmDeleteRegistration(registration)}
                                            className="flex items-center px-3 py-2 bg-error hover:bg-error-dark text-text-primary rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-sm font-medium"
                                            title="Eliminar inscripción"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 text-primary/50 mx-auto mb-4" />
                        {searchTerm ? (
                            <>
                                <h3 className="text-lg font-semibold text-text-primary mb-2">No se encontraron inscripciones</h3>
                                <p className="text-text-primary/70 mb-6">
                                    No hay inscripciones que coincidan con "{searchTerm}".
                                </p>
                                <button 
                                    onClick={() => setSearchTerm('')}
                                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-secondary font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Limpiar búsqueda
                                </button>
                            </>
                        ) : registrations.length === 0 ? (
                            <>
                                <h3 className="text-lg font-semibold text-text-primary mb-2">No hay inscripciones</h3>
                                <p className="text-text-primary/70 mb-6">
                                    Las inscripciones aparecerán aquí cuando los usuarios se registren.
                                </p>
                                <button 
                                    onClick={openCreateModal}
                                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-secondary font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Primera Inscripción
                                </button>
                            </>
                        ) : (
                            <>
                                <h3 className="text-lg font-semibold text-text-primary mb-2">No se encontraron resultados</h3>
                                <p className="text-text-primary/70 mb-6">
                                    Intenta con otros términos de búsqueda.
                                </p>
                                <button 
                                    onClick={() => setSearchTerm('')}
                                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-secondary font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Ver todas las inscripciones
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Estadísticas rápidas */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-secondary/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border-2 border-primary/30 hover:border-primary hover:shadow-xl transition-all duration-200">
                    <div className="flex items-center">
                        <Users className="w-8 h-8 text-primary mr-3" />
                        <div>
                            <h3 className="text-sm font-medium text-text-primary/70">Total Inscripciones</h3>
                            <p className="text-2xl font-bold text-text-primary">{registrations.length}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-secondary/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border-2 border-success/30 hover:border-success hover:shadow-xl transition-all duration-200">
                    <div className="flex items-center">
                        <Trophy className="w-8 h-8 text-success mr-3" />
                        <div>
                            <h3 className="text-sm font-medium text-text-primary/70">Confirmadas</h3>
                            <p className="text-2xl font-bold text-text-primary">{totalConfirmedRegistrations.length}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-secondary/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border-2 border-warning/30 hover:border-warning hover:shadow-xl transition-all duration-200">
                    <div className="flex items-center">
                        <Clock className="w-8 h-8 text-warning mr-3" />
                        <div>
                            <h3 className="text-sm font-medium text-text-primary/70">Pendientes</h3>
                            <p className="text-2xl font-bold text-text-primary">{totalPendingRegistrations.length}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-secondary/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border-2 border-info/30 hover:border-info hover:shadow-xl transition-all duration-200">
                    <div className="flex items-center">
                        <DollarSign className="w-8 h-8 text-info mr-3" />
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
                    <h2 className="text-lg font-semibold text-text-primary mb-4">Confirmar Eliminación</h2>
                    <p className="text-text-primary/70 mb-6">
                        ¿Estás seguro de que deseas eliminar la inscripción de "{registrationToDelete?.user.name}"? 
                        Esta acción no se puede deshacer.
                    </p>
                    <div className="flex justify-end space-x-4">
                        <button 
                            onClick={closeDeleteModal}
                            className="px-4 py-2 text-text-primary border border-primary/30 rounded-lg hover:bg-primary/20 transition-colors duration-200"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={deleteRegistration}
                            className="px-4 py-2 bg-error text-text-primary rounded-lg hover:bg-error-dark transition-colors duration-200"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal de crear inscripción */}
            <Modal show={showCreateModal} onClose={closeCreateModal} maxWidth="lg">
                <div className="p-6 bg-secondary/95 backdrop-blur-sm border-2 border-primary rounded-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Nueva Inscripción para {tournament.name}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Tipo de usuario */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-primary mb-2">Tipo de usuario</label>
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
                                <label className="block text-sm font-medium text-text-primary mb-2">Usuario</label>
                                <select
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : '')}
                                    className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                >
                                    <option value="">Selecciona un usuario</option>
                                    {users && users.length > 0 ? users.map((user) => (
                                        <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                                    )) : (
                                        <option disabled>No hay usuarios disponibles</option>
                                    )}
                                </select>
                            </div>
                        ) : (
                            /* Nuevo usuario */
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">Nombre *</label>
                                    <input
                                        type="text"
                                        value={newUserName}
                                        onChange={(e) => setNewUserName(e.target.value)}
                                        className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Nombre del usuario"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={newUserEmail}
                                        onChange={(e) => setNewUserEmail(e.target.value)}
                                        className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="email@ejemplo.com"
                                    />
                                </div>
                            </>
                        )}

                        {/* Método de pago */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Método de pago</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="cash">Efectivo</option>
                                <option value="transfer">Transferencia</option>
                                <option value="card">Tarjeta</option>
                            </select>
                        </div>

                        {/* Estado de pago */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Estado de pago</label>
                            <select
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="pending">Pendiente</option>
                                <option value="confirmed">Confirmado</option>
                                <option value="failed">Fallido</option>
                            </select>
                        </div>

                        {/* Notas de pago */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-primary mb-2">Notas de pago</label>
                            <textarea
                                value={paymentNotes}
                                onChange={(e) => setPaymentNotes(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary h-20 resize-none"
                                placeholder="Notas adicionales sobre el pago (opcional)"
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
                            onClick={saveCreateRegistration} 
                            className="px-4 py-2 rounded-lg text-secondary bg-primary hover:bg-primary-dark transition-colors font-medium shadow-lg"
                        >
                            Crear Inscripción
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal de editar inscripción */}
            <Modal show={showEditModal} onClose={closeEditModal} maxWidth="lg">
                <div className="p-6 bg-secondary/95 backdrop-blur-sm border-2 border-primary rounded-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Editar Inscripción</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Usuario (solo lectura) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-primary mb-2">Usuario</label>
                            <input
                                type="text"
                                value={registrationToEdit ? `${registrationToEdit.user.name} (${registrationToEdit.user.email})` : ''}
                                className="w-full px-3 py-2 bg-secondary-lighter border border-primary/30 rounded-lg text-text-primary cursor-not-allowed"
                                disabled
                            />
                        </div>

                        {/* Método de pago */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Método de pago</label>
                            <select
                                value={editPaymentMethod}
                                onChange={(e) => setEditPaymentMethod(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="cash">Efectivo</option>
                                <option value="transfer">Transferencia</option>
                                <option value="card">Tarjeta</option>
                            </select>
                        </div>

                        {/* Estado de pago */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Estado de pago</label>
                            <select
                                value={editPaymentStatus}
                                onChange={(e) => setEditPaymentStatus(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="pending">Pendiente</option>
                                <option value="confirmed">Confirmado</option>
                                <option value="failed">Fallido</option>
                            </select>
                        </div>

                        {/* Notas de pago */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-primary mb-2">Notas de pago</label>
                            <textarea
                                value={editPaymentNotes}
                                onChange={(e) => setEditPaymentNotes(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary h-20 resize-none"
                                placeholder="Notas adicionales sobre el pago"
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
                            onClick={saveEditRegistration} 
                            className="px-4 py-2 rounded-lg text-secondary bg-primary hover:bg-primary-dark transition-colors font-medium shadow-lg"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal de editar torneo */}
            <Modal show={showEditTournamentModal} onClose={closeEditTournamentModal} maxWidth="lg">
                <div className="p-6 bg-secondary/95 backdrop-blur-sm border-2 border-primary rounded-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Editar Torneo</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-primary mb-2">Nombre *</label>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Nombre del torneo"
                            />
                        </div>
                        
                        {/* Descripción */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-primary mb-2">Descripción</label>
                            <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary h-20 resize-none"
                                placeholder="Descripción del torneo (opcional)"
                            />
                        </div>
                        
                        {/* Juego */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Juego *</label>
                            <select
                                value={editGameId}
                                onChange={(e) => setEditGameId(e.target.value ? Number(e.target.value) : '')}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="">Selecciona un juego</option>
                                {games && games.length > 0 ? games.map((game) => (
                                    <option key={game.id} value={game.id}>{game.name}</option>
                                )) : (
                                    <option disabled>No hay juegos disponibles</option>
                                )}
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
                            <label className="block text-sm font-medium text-text-primary mb-2">Fecha de inicio *</label>
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
                        
                        {/* Imagen previa */}
                        {editPreviewImage && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-text-primary mb-2">Imagen actual</label>
                                <img 
                                    src={editPreviewImage} 
                                    alt="Vista previa" 
                                    className="w-32 h-32 object-cover rounded-lg border-2 border-primary/30"
                                />
                            </div>
                        )}
                        
                        {/* Nueva imagen */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-primary mb-2">Nueva imagen</label>
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
                                className="w-full text-sm text-text-primary/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-secondary hover:file:bg-primary-dark file:cursor-pointer file:shadow-lg"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-6">
                        <button 
                            onClick={closeEditTournamentModal} 
                            className="px-4 py-2 rounded-lg text-text-primary bg-secondary-light hover:bg-secondary-lighter transition-colors border border-primary/30"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={saveEditTournament} 
                            className="px-4 py-2 rounded-lg text-secondary bg-primary hover:bg-primary-dark transition-colors font-medium shadow-lg"
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
