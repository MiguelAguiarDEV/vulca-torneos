import React, { useState } from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Link } from '@inertiajs/react';
import { Calendar, Users, Trophy, Star, ArrowRight, Gamepad2, Target, Award, Search, Filter, XCircle } from 'lucide-react';

// Interfaces
interface Game {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
}

interface Tournament {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
    game: Game;
    start_date: string;
    end_date: string | null;
    registration_start: string | null;
    registration_end: string | null;
    entry_fee: number | null;
    has_registration_limit: boolean;
    registration_limit: number | null;
    status: string;
    registrations_count: number;
}

interface TournamentsIndexProps {
    tournaments: Tournament[];
    games: Game[];
    filters: {
        game_id?: string;
        status?: string;
        search?: string;
    };
}

const TournamentsIndex: React.FC<TournamentsIndexProps> = ({ tournaments, games, filters }) => {
    const [searchTerm, setSearchTerm] = useState<string>(filters.search || '');
    const [selectedGame, setSelectedGame] = useState<string>(filters.game_id || 'all');
    const [selectedStatus, setSelectedStatus] = useState<string>(filters.status || 'all');

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

    const getStatusColor = (status: string) => {
        const statusColors: Record<string, string> = {
            'registration_open': 'bg-success/20 text-success border-success/30',
            'registration_closed': 'bg-warning/20 text-warning border-warning/30',
            'ongoing': 'bg-primary/20 text-primary border-primary/30',
            'finished': 'bg-secondary/20 text-text-primary border-secondary/30',
            'cancelled': 'bg-error/20 text-error border-error/30',
            'published': 'bg-info/20 text-info border-info/30'
        };
        return statusColors[status] || 'bg-secondary/20 text-text-primary border-secondary/30';
    };

    // Filtrar torneos basado en los criterios seleccionados
    const filteredTournaments = tournaments.filter(tournament => {
        const searchMatch = searchTerm === '' || 
            tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tournament.game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (tournament.description && tournament.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const gameMatch = selectedGame === 'all' || tournament.game.id.toString() === selectedGame;
        const statusMatch = selectedStatus === 'all' || tournament.status === selectedStatus;
        
        return searchMatch && gameMatch && statusMatch;
    });

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedGame('all');
        setSelectedStatus('all');
    };

    return (
        <PublicLayout title="Torneos - Vulca Torneos" pageTitle="Torneos">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Filtros y Búsqueda */}
                <div className="mb-8 bg-secondary/95 backdrop-blur-sm border-2 border-primary/30 rounded-lg shadow-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Búsqueda */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-text-primary mb-2">Buscar torneos</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, juego o descripción..."
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
                        </div>

                        {/* Filtro por Juego */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Juego</label>
                            <select
                                value={selectedGame}
                                onChange={(e) => setSelectedGame(e.target.value)}
                                className="w-full px-3 py-3 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="all">Todos los juegos</option>
                                {games.map((game) => (
                                    <option key={game.id} value={game.id}>{game.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filtro por Estado */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Estado</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-3 py-3 bg-secondary-light border border-primary/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="all">Todos los estados</option>
                                <option value="registration_open">Inscripciones Abiertas</option>
                                <option value="registration_closed">Inscripciones Cerradas</option>
                                <option value="ongoing">En Curso</option>
                                <option value="finished">Finalizado</option>
                            </select>
                        </div>
                    </div>

                    {/* Botón para limpiar filtros */}
                    {(searchTerm || selectedGame !== 'all' || selectedStatus !== 'all') && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center px-4 py-2 bg-secondary-light hover:bg-secondary-lighter text-text-primary border border-primary/30 rounded-lg transition-colors duration-200"
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Limpiar filtros
                            </button>
                        </div>
                    )}

                    {/* Contador de resultados */}
                    {filteredTournaments.length !== tournaments.length && (
                        <div className="mt-4 text-sm text-text-primary/60 text-center">
                            Mostrando {filteredTournaments.length} de {tournaments.length} torneos
                        </div>
                    )}
                </div>

                {/* Lista de Torneos */}
                {filteredTournaments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTournaments.map((tournament) => (
                            <div 
                                key={tournament.id} 
                                className="bg-secondary/95 backdrop-blur-sm border-2 border-primary/30 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden group"
                            >
                                {tournament.image && (
                                    <div className="h-48 bg-secondary-light overflow-hidden">
                                        <img 
                                            src={tournament.image} 
                                            alt={tournament.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                        />
                                    </div>
                                )}
                                
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(tournament.status)}`}>
                                            {getStatusText(tournament.status)}
                                        </span>
                                        <div className="flex items-center text-sm text-text-primary/70">
                                            <Gamepad2 className="w-4 h-4 mr-1" />
                                            {tournament.game.name}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                                        {tournament.name}
                                    </h3>
                                    
                                    {tournament.description && (
                                        <p className="text-text-primary/70 text-sm mb-4 line-clamp-3">
                                            {tournament.description}
                                        </p>
                                    )}

                                    <div className="space-y-2 text-sm text-text-primary/70 mb-4">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2 text-primary" />
                                            <span>Inicio: {new Date(tournament.start_date).toLocaleDateString('es-ES')}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 mr-2 text-primary" />
                                            <span>
                                                {tournament.registrations_count}
                                                {tournament.has_registration_limit 
                                                    ? ` / ${tournament.registration_limit} participantes`
                                                    : ' participantes'
                                                }
                                            </span>
                                        </div>
                                        {tournament.entry_fee !== null && tournament.entry_fee > 0 && (
                                            <div className="flex items-center">
                                                <Award className="w-4 h-4 mr-2 text-primary" />
                                                <span>Cuota: €{tournament.entry_fee}</span>
                                            </div>
                                        )}
                                        {tournament.entry_fee === 0 && (
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 mr-2 text-success" />
                                                <span className="text-success font-medium">¡Gratis!</span>
                                            </div>
                                        )}
                                    </div>

                                    {tournament.has_registration_limit && (
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between text-xs text-text-primary/60 mb-1">
                                                <span>Plazas ocupadas</span>
                                                <span>{Math.round((tournament.registrations_count / tournament.registration_limit!) * 100)}%</span>
                                            </div>
                                            <div className="w-full bg-secondary-light rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full transition-all duration-300 ${
                                                        (tournament.registrations_count / tournament.registration_limit!) >= 0.9 
                                                            ? 'bg-error' 
                                                            : (tournament.registrations_count / tournament.registration_limit!) >= 0.7 
                                                                ? 'bg-warning' 
                                                                : 'bg-success'
                                                    }`}
                                                    style={{ width: `${Math.min(100, (tournament.registrations_count / tournament.registration_limit!) * 100)}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-xs text-text-primary/60 mt-1">
                                                {tournament.registration_limit! - tournament.registrations_count} plazas disponibles
                                            </div>
                                        </div>
                                    )}

                                    <Link
                                        href={route('tournaments.show', tournament.id)}
                                        className="inline-flex items-center justify-center w-full bg-primary hover:bg-primary-dark text-secondary font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-105"
                                    >
                                        Ver Detalles
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-secondary/95 backdrop-blur-sm border-2 border-primary/30 rounded-lg shadow-lg p-12 max-w-md mx-auto">
                            <Trophy className="w-16 h-16 text-primary/50 mx-auto mb-6" />
                            {searchTerm || selectedGame !== 'all' || selectedStatus !== 'all' ? (
                                <>
                                    <h3 className="text-xl font-semibold text-text-primary mb-3">No se encontraron torneos</h3>
                                    <p className="text-text-primary/70 mb-6">
                                        No hay torneos que coincidan con los criterios de búsqueda seleccionados.
                                    </p>
                                    <button 
                                        onClick={clearFilters}
                                        className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-secondary font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Limpiar filtros
                                    </button>
                                </>
                            ) : tournaments.length === 0 ? (
                                <>
                                    <h3 className="text-xl font-semibold text-text-primary mb-3">No hay torneos disponibles</h3>
                                    <p className="text-text-primary/70 mb-6">
                                        Actualmente no hay torneos programados. ¡Vuelve pronto para ver las próximas competencias!
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-xl font-semibold text-text-primary mb-3">No se encontraron resultados</h3>
                                    <p className="text-text-primary/70 mb-6">
                                        Intenta ajustar los criterios de búsqueda.
                                    </p>
                                    <button 
                                        onClick={clearFilters}
                                        className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-secondary font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Ver todos los torneos
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
};

export default TournamentsIndex;
