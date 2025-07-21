import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { Plus, Trophy, Trash2, Pencil, Calendar, Users, GamepadIcon } from 'lucide-react';
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
    status: string;
    registrations_count: number;
}

// Props del componente
interface IndexProps {
    tournaments: Tournament[];
}

const Index: React.FC<IndexProps> = ({ tournaments }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [tournamentToDelete, setTournamentToDelete] = useState<Tournament | null>(null);

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
                
                <Link 
                    href={route('admin.tournaments.create')}
                    className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-secondary font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Crear Nuevo Torneo
                </Link>
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
                                        <span>{tournament.registrations_count} inscripciones</span>
                                    </div>
                                    {tournament.entry_fee && (
                                        <div className="flex items-center">
                                            <span className="w-4 h-4 mr-2">💰</span>
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
                                            router.get(route('admin.tournaments.edit', tournament.id));
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
                        <Link 
                            href={route('admin.tournaments.create')}
                            className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-secondary font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Crear Primer Torneo
                        </Link>
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
        </AdminLayout>
    );
};

export default Index;
