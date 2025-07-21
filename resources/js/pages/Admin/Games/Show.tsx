import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Users, Clock, Trophy, Gamepad } from 'lucide-react';

// Tipos
interface Game {
    id: number;
    name: string;
    description: string | null;
    image: string;
}

interface Tournament {
    id: number;
    name: string;
    status: 'active' | 'upcoming';
    original_status: string;
    start_date: string;
    participants_count: number;
}

interface Registration {
    id: number;
    user_name: string;
    user_email: string;
    tournament_name: string;
    registration_date: string;
    payment_status: string;
}

interface ShowProps {
    game: Game;
    tournaments: Tournament[];
    pendingRegistrations: Registration[];
}

const Show: React.FC<ShowProps> = ({ game, tournaments, pendingRegistrations }) => {
    return (
        <AdminLayout title={`Detalles - ${game.name}`} pageTitle={`Detalles del Juego`}>
            {/* Header con información del juego */}
            <div className="mb-8">
                <div className="bg-secondary/95 backdrop-blur-sm rounded-lg shadow-lg border-2 border-primary/30 p-6">
                    <div className="flex items-center">
                        <Link 
                            href={route('admin.games.index')}
                            className="mr-6 p-3 text-text-primary hover:text-primary transition-all duration-200 rounded-lg hover:bg-primary/20 hover:scale-110 border border-primary/30 hover:border-primary"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div className="flex items-center flex-grow">
                            {game.image ? (
                                <img 
                                    src={game.image} 
                                    alt={game.name}
                                    className="w-24 h-24 object-cover rounded-lg border-2 border-primary mr-8 shadow-xl hover:scale-105 transition-transform duration-200"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-secondary/80 rounded-lg flex items-center justify-center mr-8 border-2 border-primary shadow-xl hover:scale-105 transition-transform duration-200">
                                    <Gamepad className="w-12 h-12 text-primary" />
                                </div>
                            )}
                            <div className="flex-grow">
                                <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">{game.name}</h1>
                                {game.description && (
                                    <p className="text-xl text-white bg-secondary/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-primary/20">{game.description}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid de contenido */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Torneos Próximos/Activos */}
                <div className="bg-secondary/95 backdrop-blur-sm rounded-lg shadow-lg border-2 border-primary/30 p-6">
                    <div className="flex items-center mb-6">
                        <Trophy className="w-8 h-8 text-primary mr-3" />
                        <h2 className="text-2xl font-bold text-text-primary">Torneos Próximos/Activos</h2>
                    </div>
                    
                    {tournaments.length > 0 ? (
                        <div className="space-y-4">
                            {tournaments.map((tournament) => (
                                <div key={tournament.id} className="bg-secondary-dark/80 backdrop-blur-sm rounded-lg p-4 border border-primary/30 hover:border-primary hover:shadow-lg transition-all duration-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-semibold text-text-primary">{tournament.name}</h3>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-lg ${
                                            tournament.status === 'active' 
                                                ? 'bg-success text-text-primary' 
                                                : 'bg-info text-text-primary'
                                        }`}>
                                            {tournament.status === 'active' ? 'Activo' : 'Próximo'}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-text-primary/70 space-x-6">
                                        <div className="flex items-center">
                                            <Calendar className="w-5 h-5 mr-2" />
                                            <span>{tournament.start_date}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="w-5 h-5 mr-2" />
                                            <span>{tournament.participants_count} participantes</span>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-sm text-text-primary/70">
                                        Estado: {tournament.original_status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Calendar className="w-16 h-16 text-primary/50 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-text-primary mb-2">No hay torneos próximos o activos</h3>
                            <p className="text-text-primary/70">
                                Los torneos aparecerán aquí cuando estén programados o en curso.
                            </p>
                        </div>
                    )}
                </div>

                {/* Inscripciones Pendientes */}
                <div className="bg-secondary/95 backdrop-blur-sm rounded-lg shadow-lg border-2 border-warning/30 p-6">
                    <div className="flex items-center mb-6">
                        <Clock className="w-8 h-8 text-warning mr-3" />
                        <h2 className="text-2xl font-bold text-text-primary">Inscripciones Pendientes</h2>
                    </div>
                    
                    {pendingRegistrations.length > 0 ? (
                        <div className="space-y-4">
                            {pendingRegistrations.map((registration) => (
                                <div key={registration.id} className="bg-secondary-dark/80 backdrop-blur-sm rounded-lg p-4 border border-warning/30 hover:border-warning hover:shadow-lg transition-all duration-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-semibold text-text-primary">{registration.user_name}</h3>
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-warning text-secondary shadow-lg">
                                            Pendiente
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-text-primary/70">
                                        <div className="flex items-center">
                                            <Trophy className="w-4 h-4 mr-2" />
                                            <span>Torneo: {registration.tournament_name}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span>Inscrito: {registration.registration_date}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="w-4 h-4 mr-2">💳</span>
                                            <span>Pago: {registration.payment_status}</span>
                                        </div>
                                        <div className="text-sm text-text-primary/50">
                                            Email: {registration.user_email}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Clock className="w-16 h-16 text-warning/50 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-text-primary mb-2">No hay inscripciones pendientes</h3>
                            <p className="text-text-primary/70">
                                Las inscripciones pendientes de aprobación aparecerán aquí.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-secondary/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border-2 border-primary/30 hover:border-primary hover:shadow-xl transition-all duration-200">
                    <div className="flex items-center">
                        <Trophy className="w-8 h-8 text-primary mr-3" />
                        <div>
                            <h3 className="text-sm font-medium text-text-primary/70">Total Torneos</h3>
                            <p className="text-2xl font-bold text-text-primary">{tournaments.length}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-secondary/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border-2 border-warning/30 hover:border-warning hover:shadow-xl transition-all duration-200">
                    <div className="flex items-center">
                        <Clock className="w-8 h-8 text-warning mr-3" />
                        <div>
                            <h3 className="text-sm font-medium text-text-primary/70">Inscripciones Pendientes</h3>
                            <p className="text-2xl font-bold text-text-primary">{pendingRegistrations.length}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-secondary/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border-2 border-success/30 hover:border-success hover:shadow-xl transition-all duration-200">
                    <div className="flex items-center">
                        <Users className="w-8 h-8 text-success mr-3" />
                        <div>
                            <h3 className="text-sm font-medium text-text-primary/70">Total Participantes</h3>
                            <p className="text-2xl font-bold text-text-primary">
                                {tournaments.reduce((total, tournament) => total + tournament.participants_count, 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Show;
