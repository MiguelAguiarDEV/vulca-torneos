import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { Plus, UserPlus, Trash2, Pencil, Calendar, Users, Trophy, CreditCard, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import Modal from '@/components/Modal';

// Tipo para una inscripción
interface Registration {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    tournament: {
        id: number;
        name: string;
        game: {
            id: number;
            name: string;
        };
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

// Tipo para un torneo
interface Tournament {
    id: number;
    name: string;
    game: {
        id: number;
        name: string;
    };
}

// Tipo para un usuario
interface User {
    id: number;
    name: string;
    email: string;
}

// Props del componente
interface IndexProps {
    registrations: Registration[];
    tournaments: Tournament[];
    users: Array<{
        id: number;
        name: string;
        email: string;
    }>;
}

const Index: React.FC<IndexProps> = ({ registrations, tournaments, users }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [registrationToDelete, setRegistrationToDelete] = useState<Registration | null>(null);
    
    // Estado para búsqueda
    const [searchTerm, setSearchTerm] = useState<string>('');
    
    // Estado para filtros
    const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
    const [tournamentFilter, setTournamentFilter] = useState<string>('all');
    const [gameFilter, setGameFilter] = useState<string>('all');
    
    // Estados para el modal de crear
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [userSelectionType, setUserSelectionType] = useState<'existing' | 'new'>('existing');
    const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
    const [newUserName, setNewUserName] = useState<string>('');
    const [newUserEmail, setNewUserEmail] = useState<string>('');
    const [selectedTournamentId, setSelectedTournamentId] = useState<number | ''>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('cash');
    const [paymentStatus, setPaymentStatus] = useState<string>('pending');
    const [paymentNotes, setPaymentNotes] = useState<string>('');
    
    // Estados para el modal de editar
    const [showEditModal, setShowEditModal] = useState(false);
    const [registrationToEdit, setRegistrationToEdit] = useState<Registration | null>(null);
    const [editPaymentMethod, setEditPaymentMethod] = useState<string>('');
    const [editPaymentStatus, setEditPaymentStatus] = useState<string>('');
    const [editPaymentNotes, setEditPaymentNotes] = useState<string>('');

    const confirmDelete = (registration: Registration) => {
        setRegistrationToDelete(registration);
        setShowDeleteModal(true);
    };

    const closeModal = () => {
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
                    closeModal();
                },
                onError: (errors) => {
                    console.error('Error al eliminar la inscripción:', errors);
                    alert('Error al eliminar la inscripción. Intenta nuevamente.');
                }
            });
        }
    };

    const navigateToRegistrationDetails = (registration: Registration) => {
        router.get(route('admin.registrations.show', registration.id));
    };

    // Funciones para el modal de crear
    const openCreateModal = () => {
        setShowCreateModal(true);
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
        setUserSelectionType('existing');
        setSelectedUserId('');
        setNewUserName('');
        setNewUserEmail('');
        setSelectedTournamentId('');
        setPaymentMethod('cash');
        setPaymentStatus('pending');
        setPaymentNotes('');
    };

    const saveCreate = () => {
        // Validación del lado del cliente
        if (userSelectionType === 'existing' && !selectedUserId) {
            alert('Debes seleccionar un usuario');
            return;
        }
        if (userSelectionType === 'new' && !newUserName.trim()) {
            alert('El nombre del nuevo usuario es requerido');
            return;
        }
        if (!selectedTournamentId) {
            alert('Debes seleccionar un torneo');
            return;
        }

        const data = new FormData();
        data.append('user_selection_type', userSelectionType);
        
        if (userSelectionType === 'existing') {
            data.append('user_id', selectedUserId.toString());
        } else {
            data.append('new_user_name', newUserName.trim());
            if (newUserEmail.trim()) {
                data.append('new_user_email', newUserEmail.trim());
            }
        }
        
        data.append('tournament_id', selectedTournamentId.toString());
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

    // Funciones para el modal de editar
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

    const saveEdit = () => {
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

    const getPaymentStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle className="w-4 h-4" />;
            case 'failed':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getPaymentMethodText = (method: string) => {
        const methodTexts: Record<string, string> = {
            'cash': 'Efectivo',
            'transfer': 'Transferencia',
            'card': 'Tarjeta'
        };
        return methodTexts[method] || method;
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

    // Filtrar registrations según los filtros seleccionados
    const filteredRegistrations = registrations.filter(registration => {
        const searchMatch = searchTerm === '' || 
            registration.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            registration.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            registration.tournament.name.toLowerCase().includes(searchTerm.toLowerCase());
        const paymentStatusMatch = paymentStatusFilter === 'all' || registration.payment_status === paymentStatusFilter;
        const tournamentMatch = tournamentFilter === 'all' || registration.tournament.id.toString() === tournamentFilter;
        const gameMatch = gameFilter === 'all' || registration.tournament.game.id.toString() === gameFilter;
        return searchMatch && paymentStatusMatch && tournamentMatch && gameMatch;
    });

    return (
        <AdminLayout title="Inscripciones" pageTitle="Gestión de Inscripciones">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="bg-secondary/95 backdrop-blur-sm border-2 border-primary p-6 rounded-lg shadow-lg">
                    <div className="flex items-center mb-2">
                        <UserPlus className="w-6 h-6 text-primary mr-3" />
                        <h3 className="text-lg font-semibold text-primary">Total de Inscripciones</h3>
                    </div>
                    <p className="text-3xl font-bold text-text-primary">{filteredRegistrations.length}</p>
                    <p className="text-sm text-text-primary/70 mt-1">
                        {filteredRegistrations.length === 0 ? 'Ninguna inscripción' : 
                         filteredRegistrations.length === 1 ? 'Inscripción registrada' : 
                         'Inscripciones registradas'}
                        {registrations.length !== filteredRegistrations.length && (
                            <span className="text-primary"> (de {registrations.length} totales)</span>
                        )}
                    </p>
                </div>
                
                <button 
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-secondary font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nueva Inscripción
                </button>
            </div>

            {/* Búsqueda y Filtros */}
            <div className="mb-6 bg-secondary/95 backdrop-blur-sm border-2 border-primary/30 rounded-lg shadow-lg p-4">
                {/* Campo de búsqueda */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-text-primary mb-2">Buscar inscripciones</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o torneo..."
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

                {/* Filtros */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Estado de pago</label>
                        <select
                            value={paymentStatusFilter}
                            onChange={(e) => setPaymentStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="pending">Pendientes</option>
                            <option value="confirmed">Confirmados</option>
                            <option value="failed">Fallidos</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Juego</label>
                        <select
                            value={gameFilter}
                            onChange={(e) => setGameFilter(e.target.value)}
                            className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                            <option value="all">Todos los juegos</option>
                            {[...new Map(tournaments.map(tournament => [tournament.id, tournament])).values()]
                                .filter(tournament => tournament.game)
                                .reduce((games: any[], tournament) => {
                                    const gameExists = games.find(g => g.id === tournament.game.id);
                                    if (!gameExists && tournament.game) {
                                        games.push(tournament.game);
                                    }
                                    return games;
                                }, [])
                                .map((game: any) => (
                                    <option key={game.id} value={game.id}>{game.name}</option>
                                ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Torneo</label>
                        <select
                            value={tournamentFilter}
                            onChange={(e) => setTournamentFilter(e.target.value)}
                            className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                            <option value="all">Todos los torneos</option>
                            {tournaments
                                .filter(tournament => gameFilter === 'all' || tournament.game?.id.toString() === gameFilter)
                                .map((tournament) => (
                                    <option key={tournament.id} value={tournament.id}>{tournament.name}</option>
                                ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setPaymentStatusFilter('all');
                                setTournamentFilter('all');
                                setGameFilter('all');
                            }}
                            className="w-full px-4 py-2 bg-secondary-light hover:bg-secondary-lighter text-text-primary border border-primary/30 rounded-lg transition-colors duration-200"
                        >
                            Limpiar todo
                        </button>
                    </div>
                </div>
            </div>

            {filteredRegistrations.length > 0 ? (
                <div className="bg-secondary/95 backdrop-blur-sm border-2 border-primary/30 rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-primary/30">
                            <thead className="bg-secondary-dark/80">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Usuario</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Torneo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Juego</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Estado Pago</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Método</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Importe</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-primary uppercase tracking-wider">Acciones Rápidas</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-primary uppercase tracking-wider">Gestión</th>
                                </tr>
                            </thead>
                            <tbody className="bg-secondary/95 divide-y divide-primary/20">
                                {filteredRegistrations.map((registration: Registration, index) => (
                                    <tr 
                                        key={registration.id} 
                                        className={`hover:bg-primary/10 transition-colors duration-200 ${index % 2 === 0 ? 'bg-secondary/50' : 'bg-secondary/30'}`}
                                        onClick={() => navigateToRegistrationDetails(registration)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8">
                                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-primary">
                                                            {registration.user.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-text-primary">{registration.user.name}</div>
                                                    <div className="text-sm text-text-primary/70">{registration.user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-text-primary">{registration.tournament.name}</div>
                                            <div className="text-sm text-text-primary/70">ID: {registration.tournament.id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-6 w-6 mr-2">
                                                    <Users className="w-4 h-4 text-primary" />
                                                </div>
                                                <div className="text-sm text-text-primary font-medium">{registration.tournament.game.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(registration.payment_status)}`}>
                                                {getPaymentStatusIcon(registration.payment_status)}
                                                <span className="ml-1">{getPaymentStatusText(registration.payment_status)}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                                            {getPaymentMethodText(registration.payment_method)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary font-medium">
                                            {registration.amount ? `€${registration.amount}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary/70">
                                            {new Date(registration.registered_at).toLocaleDateString('es-ES')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-center space-x-2">
                                                {registration.payment_status === 'pending' && (
                                                    <button
                                                        onClick={() => quickConfirmPayment(registration)}
                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-text-primary bg-success hover:bg-success/80 transition-colors duration-200 cursor-pointer"
                                                        title="Confirmar pago"
                                                    >
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Confirmar
                                                    </button>
                                                )}
                                                {registration.payment_status === 'confirmed' && (
                                                    <button
                                                        onClick={() => quickCancelPayment(registration)}
                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-text-primary bg-warning hover:bg-warning/80 transition-colors duration-200 cursor-pointer"
                                                        title="Marcar como pendiente"
                                                    >
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        Pendiente
                                                    </button>
                                                )}
                                                {registration.status !== 'cancelled' && (
                                                    <button
                                                        onClick={() => quickCancelRegistration(registration)}
                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-text-primary bg-error hover:bg-error/80 transition-colors duration-200 cursor-pointer"
                                                        title="Cancelar inscripción"
                                                    >
                                                        <XCircle className="w-3 h-3 mr-1" />
                                                        Cancelar
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-center space-x-1">
                                                <button 
                                                    onClick={() => openEditModal(registration)}
                                                    className="p-2 text-text-primary hover:text-primary transition-colors duration-200 hover:bg-primary/20 rounded-md cursor-pointer"
                                                    title="Editar inscripción"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => confirmDelete(registration)}
                                                    className="p-2 text-text-primary hover:text-danger transition-colors duration-200 hover:bg-danger/10 rounded-md cursor-pointer"
                                                    title="Eliminar inscripción"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="bg-secondary/95 backdrop-blur-sm border-2 border-primary/30 rounded-lg shadow-lg p-12 max-w-md mx-auto">
                        <UserPlus className="w-16 h-16 text-primary/50 mx-auto mb-6" />
                        {searchTerm || paymentStatusFilter !== 'all' || tournamentFilter !== 'all' || gameFilter !== 'all' ? (
                            <>
                                <h3 className="text-xl font-semibold text-text-primary mb-3">No se encontraron inscripciones</h3>
                                <p className="text-text-primary/70 mb-6">
                                    No hay inscripciones que coincidan con los criterios de búsqueda o filtros seleccionados.
                                </p>
                                <button 
                                    onClick={() => {
                                        setSearchTerm('');
                                        setPaymentStatusFilter('all');
                                        setTournamentFilter('all');
                                        setGameFilter('all');
                                    }}
                                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-secondary font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Limpiar filtros
                                </button>
                            </>
                        ) : registrations.length === 0 ? (
                            <>
                                <h3 className="text-xl font-semibold text-text-primary mb-3">No hay inscripciones</h3>
                                <p className="text-text-primary/70 mb-6">
                                    Comienza registrando la primera inscripción para un torneo.
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
                                <h3 className="text-xl font-semibold text-text-primary mb-3">No se encontraron resultados</h3>
                                <p className="text-text-primary/70 mb-6">
                                    Intenta ajustar los criterios de búsqueda o filtros.
                                </p>
                                <button 
                                    onClick={() => {
                                        setSearchTerm('');
                                        setPaymentStatusFilter('all');
                                        setTournamentFilter('all');
                                        setGameFilter('all');
                                    }}
                                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-secondary font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Ver todas las inscripciones
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Modal de confirmación de eliminación */}
            <Modal show={showDeleteModal} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-text-primary mb-4">Confirmar Eliminación</h2>
                    <p className="text-text-primary/70 mb-6">
                        ¿Estás seguro de que deseas eliminar la inscripción de "{registrationToDelete?.user.name}" al torneo "{registrationToDelete?.tournament.name}"? 
                        Esta acción no se puede deshacer.
                    </p>
                    <div className="flex justify-end space-x-4">
                        <button 
                            onClick={closeModal}
                            className="px-4 py-2 text-text-primary border border-primary/30 rounded-lg hover:bg-primary/20 transition-colors duration-200"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={deleteRegistration}
                            className="px-4 py-2 bg-danger text-text-primary rounded-lg hover:bg-danger/90 transition-colors duration-200"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal de crear inscripción */}
            <Modal show={showCreateModal} onClose={closeCreateModal} maxWidth="lg">
                <div className="p-6 bg-secondary/95 backdrop-blur-sm border-2 border-primary rounded-lg">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Nueva Inscripción</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Selección de usuario */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-primary mb-2">Tipo de usuario</label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="userType"
                                        value="existing"
                                        checked={userSelectionType === 'existing'}
                                        onChange={(e) => setUserSelectionType(e.target.value as 'existing')}
                                        className="mr-2"
                                    />
                                    <span className="text-text-primary">Usuario existente</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="userType"
                                        value="new"
                                        checked={userSelectionType === 'new'}
                                        onChange={(e) => setUserSelectionType(e.target.value as 'new')}
                                        className="mr-2"
                                    />
                                    <span className="text-text-primary">Nuevo usuario</span>
                                </label>
                            </div>
                        </div>

                        {/* Usuario existente */}
                        {userSelectionType === 'existing' && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-text-primary mb-2">Usuario</label>
                                <select
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value ? parseInt(e.target.value) : '')}
                                    className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                >
                                    <option value="">Seleccionar usuario</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Nuevo usuario */}
                        {userSelectionType === 'new' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">Nombre</label>
                                    <input
                                        type="text"
                                        value={newUserName}
                                        onChange={(e) => setNewUserName(e.target.value)}
                                        className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Nombre del usuario"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">Email (opcional)</label>
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
                        
                        {/* Torneo */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-primary mb-2">Torneo</label>
                            <select
                                value={selectedTournamentId}
                                onChange={(e) => setSelectedTournamentId(e.target.value ? parseInt(e.target.value) : '')}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="">Seleccionar torneo</option>
                                {tournaments.map((tournament) => (
                                    <option key={tournament.id} value={tournament.id}>{tournament.name}</option>
                                ))}
                            </select>
                        </div>
                        
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
                            <label className="block text-sm font-medium text-text-primary mb-2">Notas de pago (opcional)</label>
                            <textarea
                                value={paymentNotes}
                                onChange={(e) => setPaymentNotes(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary h-20 resize-none"
                                placeholder="Notas adicionales sobre el pago..."
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
                        {/* Información del usuario (solo lectura) */}
                        <div className="md:col-span-2 p-4 bg-secondary-light/50 rounded-lg border border-primary/20">
                            <h3 className="font-medium text-text-primary mb-2">Usuario</h3>
                            <p className="text-text-primary">{registrationToEdit?.user.name}</p>
                            <p className="text-text-primary/70 text-sm">{registrationToEdit?.user.email}</p>
                        </div>

                        {/* Información del torneo (solo lectura) */}
                        <div className="md:col-span-2 p-4 bg-secondary-light/50 rounded-lg border border-primary/20">
                            <h3 className="font-medium text-text-primary mb-2">Torneo</h3>
                            <p className="text-text-primary">{registrationToEdit?.tournament.name}</p>
                            <p className="text-text-primary/70 text-sm">{registrationToEdit?.tournament.game.name}</p>
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
                                placeholder="Notas adicionales sobre el pago..."
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
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
};

export default Index;
