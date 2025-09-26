import Modal from '@/components/UI/Modal';
import AdminLayout from '@/layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { CheckCircle, Clock, Pencil, Plus, Search, Trash2, UserPlus, Users, XCircle } from 'lucide-react';
import React, { useState } from 'react';

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
                },
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
                Object.keys(errors).forEach((key) => {
                    errorMessage += `${key}: ${errors[key]}\n`;
                });
                alert(errorMessage);
            },
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
                Object.keys(errors).forEach((key) => {
                    errorMessage += `${key}: ${errors[key]}\n`;
                });
                alert(errorMessage);
            },
        });
    };

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

    const getPaymentStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle className="h-4 w-4" />;
            case 'failed':
                return <XCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getPaymentMethodText = (method: string) => {
        const methodTexts: Record<string, string> = {
            cash: 'Efectivo',
            transfer: 'Transferencia',
            card: 'Tarjeta',
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

    // Filtrar registrations según los filtros seleccionados
    const filteredRegistrations = registrations.filter((registration) => {
        const searchMatch =
            searchTerm === '' ||
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
            <div className="mb-6 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div className="rounded-lg border-2 border-primary bg-secondary/95 p-6 shadow-lg backdrop-blur-sm">
                    <div className="mb-2 flex items-center">
                        <UserPlus className="mr-3 h-6 w-6 text-primary" />
                        <h3 className="text-lg font-semibold text-primary">Total de Inscripciones</h3>
                    </div>
                    <p className="text-3xl font-bold text-text-primary">{filteredRegistrations.length}</p>
                    <p className="mt-1 text-sm text-text-primary/70">
                        {filteredRegistrations.length === 0
                            ? 'Ninguna inscripción'
                            : filteredRegistrations.length === 1
                              ? 'Inscripción registrada'
                              : 'Inscripciones registradas'}
                        {registrations.length !== filteredRegistrations.length && (
                            <span className="text-primary"> (de {registrations.length} totales)</span>
                        )}
                    </p>
                </div>

                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-secondary shadow-lg transition-all duration-200 hover:scale-105 hover:bg-primary-dark hover:shadow-xl"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Nueva Inscripción
                </button>
            </div>

            {/* Búsqueda y Filtros */}
            <div className="mb-6 rounded-lg border-2 border-primary/30 bg-secondary/95 p-4 shadow-lg backdrop-blur-sm">
                {/* Campo de búsqueda */}
                <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-text-primary">Buscar inscripciones</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o torneo..."
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

                {/* Filtros */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-text-primary">Estado de pago</label>
                        <select
                            value={paymentStatusFilter}
                            onChange={(e) => setPaymentStatusFilter(e.target.value)}
                            className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="pending">Pendientes</option>
                            <option value="confirmed">Confirmados</option>
                            <option value="failed">Fallidos</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-text-primary">Juego</label>
                        <select
                            value={gameFilter}
                            onChange={(e) => setGameFilter(e.target.value)}
                            className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            <option value="all">Todos los juegos</option>
                            {[...new Map(tournaments.map((tournament) => [tournament.id, tournament])).values()]
                                .filter((tournament) => tournament.game)
                                .reduce((games: any[], tournament) => {
                                    const gameExists = games.find((g) => g.id === tournament.game.id);
                                    if (!gameExists && tournament.game) {
                                        games.push(tournament.game);
                                    }
                                    return games;
                                }, [])
                                .map((game: any) => (
                                    <option key={game.id} value={game.id}>
                                        {game.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-text-primary">Torneo</label>
                        <select
                            value={tournamentFilter}
                            onChange={(e) => setTournamentFilter(e.target.value)}
                            className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            <option value="all">Todos los torneos</option>
                            {tournaments
                                .filter((tournament) => gameFilter === 'all' || tournament.game?.id.toString() === gameFilter)
                                .map((tournament) => (
                                    <option key={tournament.id} value={tournament.id}>
                                        {tournament.name}
                                    </option>
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
                            className="w-full rounded-lg border border-primary/30 bg-secondary-light px-4 py-2 text-text-primary transition-colors duration-200 hover:bg-secondary-lighter"
                        >
                            Limpiar todo
                        </button>
                    </div>
                </div>
            </div>

            {filteredRegistrations.length > 0 ? (
                <div className="overflow-hidden rounded-lg border-2 border-primary/30 bg-secondary/95 shadow-lg backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-primary/30">
                            <thead className="bg-secondary-dark/80">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-primary uppercase">Usuario</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-primary uppercase">Torneo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-primary uppercase">Juego</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-primary uppercase">Estado Pago</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-primary uppercase">Método</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-primary uppercase">Importe</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-primary uppercase">Fecha</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-primary uppercase">
                                        Acciones Rápidas
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-primary uppercase">Gestión</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/20 bg-secondary/95">
                                {filteredRegistrations.map((registration: Registration, index) => (
                                    <tr
                                        key={registration.id}
                                        className={`transition-colors duration-200 hover:bg-primary/10 ${index % 2 === 0 ? 'bg-secondary/50' : 'bg-secondary/30'}`}
                                        onClick={() => navigateToRegistrationDetails(registration)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 flex-shrink-0">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
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
                                                <div className="mr-2 h-6 w-6 flex-shrink-0">
                                                    <Users className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="text-sm font-medium text-text-primary">{registration.tournament.game.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusColor(registration.payment_status)}`}
                                            >
                                                {getPaymentStatusIcon(registration.payment_status)}
                                                <span className="ml-1">{getPaymentStatusText(registration.payment_status)}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-text-primary">
                                            {getPaymentMethodText(registration.payment_method)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-text-primary">
                                            {registration.amount ? `€${registration.amount}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-text-primary/70">
                                            {new Date(registration.registered_at).toLocaleDateString('es-ES')}
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-center space-x-2">
                                                {registration.payment_status === 'pending' && (
                                                    <button
                                                        onClick={() => quickConfirmPayment(registration)}
                                                        className="inline-flex cursor-pointer items-center rounded-md border border-transparent bg-success px-3 py-1 text-xs font-medium text-text-primary transition-colors duration-200 hover:bg-success/80"
                                                        title="Confirmar pago"
                                                    >
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                        Confirmar
                                                    </button>
                                                )}
                                                {registration.payment_status === 'confirmed' && (
                                                    <button
                                                        onClick={() => quickCancelPayment(registration)}
                                                        className="inline-flex cursor-pointer items-center rounded-md border border-transparent bg-warning px-3 py-1 text-xs font-medium text-text-primary transition-colors duration-200 hover:bg-warning/80"
                                                        title="Marcar como pendiente"
                                                    >
                                                        <Clock className="mr-1 h-3 w-3" />
                                                        Pendiente
                                                    </button>
                                                )}
                                                {registration.status !== 'cancelled' && (
                                                    <button
                                                        onClick={() => quickCancelRegistration(registration)}
                                                        className="bg-error hover:bg-error/80 inline-flex cursor-pointer items-center rounded-md border border-transparent px-3 py-1 text-xs font-medium text-text-primary transition-colors duration-200"
                                                        title="Cancelar inscripción"
                                                    >
                                                        <XCircle className="mr-1 h-3 w-3" />
                                                        Cancelar
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-center space-x-1">
                                                <button
                                                    onClick={() => openEditModal(registration)}
                                                    className="cursor-pointer rounded-md p-2 text-text-primary transition-colors duration-200 hover:bg-primary/20 hover:text-primary"
                                                    title="Editar inscripción"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(registration)}
                                                    className="cursor-pointer rounded-md p-2 text-text-primary transition-colors duration-200 hover:bg-danger/10 hover:text-danger"
                                                    title="Eliminar inscripción"
                                                >
                                                    <Trash2 className="h-4 w-4" />
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
                <div className="py-20 text-center">
                    <div className="mx-auto max-w-md rounded-lg border-2 border-primary/30 bg-secondary/95 p-12 shadow-lg backdrop-blur-sm">
                        <UserPlus className="mx-auto mb-6 h-16 w-16 text-primary/50" />
                        {searchTerm || paymentStatusFilter !== 'all' || tournamentFilter !== 'all' || gameFilter !== 'all' ? (
                            <>
                                <h3 className="mb-3 text-xl font-semibold text-text-primary">No se encontraron inscripciones</h3>
                                <p className="mb-6 text-text-primary/70">
                                    No hay inscripciones que coincidan con los criterios de búsqueda o filtros seleccionados.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setPaymentStatusFilter('all');
                                        setTournamentFilter('all');
                                        setGameFilter('all');
                                    }}
                                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-secondary shadow-lg transition-all duration-200 hover:bg-primary-dark hover:shadow-xl"
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Limpiar filtros
                                </button>
                            </>
                        ) : registrations.length === 0 ? (
                            <>
                                <h3 className="mb-3 text-xl font-semibold text-text-primary">No hay inscripciones</h3>
                                <p className="mb-6 text-text-primary/70">Comienza registrando la primera inscripción para un torneo.</p>
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
                                <h3 className="mb-3 text-xl font-semibold text-text-primary">No se encontraron resultados</h3>
                                <p className="mb-6 text-text-primary/70">Intenta ajustar los criterios de búsqueda o filtros.</p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setPaymentStatusFilter('all');
                                        setTournamentFilter('all');
                                        setGameFilter('all');
                                    }}
                                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-secondary shadow-lg transition-all duration-200 hover:bg-primary-dark hover:shadow-xl"
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
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
                    <h2 className="mb-4 text-lg font-semibold text-text-primary">Confirmar Eliminación</h2>
                    <p className="mb-6 text-text-primary/70">
                        ¿Estás seguro de que deseas eliminar la inscripción de "{registrationToDelete?.user.name}" al torneo "
                        {registrationToDelete?.tournament.name}"? Esta acción no se puede deshacer.
                    </p>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={closeModal}
                            className="rounded-lg border border-primary/30 px-4 py-2 text-text-primary transition-colors duration-200 hover:bg-primary/20"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={deleteRegistration}
                            className="rounded-lg bg-danger px-4 py-2 text-text-primary transition-colors duration-200 hover:bg-danger/90"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal de crear inscripción */}
            <Modal show={showCreateModal} onClose={closeCreateModal} maxWidth="lg">
                <div className="rounded-lg border-2 border-primary bg-secondary/95 p-6 backdrop-blur-sm">
                    <h2 className="mb-4 text-xl font-semibold text-text-primary">Nueva Inscripción</h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Selección de usuario */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-text-primary">Tipo de usuario</label>
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
                                <label className="mb-2 block text-sm font-medium text-text-primary">Usuario</label>
                                <select
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value ? parseInt(e.target.value) : '')}
                                    className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                >
                                    <option value="">Seleccionar usuario</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Nuevo usuario */}
                        {userSelectionType === 'new' && (
                            <>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-text-primary">Nombre</label>
                                    <input
                                        type="text"
                                        value={newUserName}
                                        onChange={(e) => setNewUserName(e.target.value)}
                                        className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                        placeholder="Nombre del usuario"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-text-primary">Email (opcional)</label>
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

                        {/* Torneo */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-text-primary">Torneo</label>
                            <select
                                value={selectedTournamentId}
                                onChange={(e) => setSelectedTournamentId(e.target.value ? parseInt(e.target.value) : '')}
                                className="w-full rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                                <option value="">Seleccionar torneo</option>
                                {tournaments.map((tournament) => (
                                    <option key={tournament.id} value={tournament.id}>
                                        {tournament.name}
                                    </option>
                                ))}
                            </select>
                        </div>

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
                            <label className="mb-2 block text-sm font-medium text-text-primary">Notas de pago (opcional)</label>
                            <textarea
                                value={paymentNotes}
                                onChange={(e) => setPaymentNotes(e.target.value)}
                                className="h-20 w-full resize-none rounded-lg border border-primary/30 bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder="Notas adicionales sobre el pago..."
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
                        {/* Información del usuario (solo lectura) */}
                        <div className="rounded-lg border border-primary/20 bg-secondary-light/50 p-4 md:col-span-2">
                            <h3 className="mb-2 font-medium text-text-primary">Usuario</h3>
                            <p className="text-text-primary">{registrationToEdit?.user.name}</p>
                            <p className="text-sm text-text-primary/70">{registrationToEdit?.user.email}</p>
                        </div>

                        {/* Información del torneo (solo lectura) */}
                        <div className="rounded-lg border border-primary/20 bg-secondary-light/50 p-4 md:col-span-2">
                            <h3 className="mb-2 font-medium text-text-primary">Torneo</h3>
                            <p className="text-text-primary">{registrationToEdit?.tournament.name}</p>
                            <p className="text-sm text-text-primary/70">{registrationToEdit?.tournament.game.name}</p>
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
                                placeholder="Notas adicionales sobre el pago..."
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
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
};

export default Index;
