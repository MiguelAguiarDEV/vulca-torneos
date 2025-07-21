import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Users, Clock, Trophy, Gamepad, DollarSign, MapPin } from 'lucide-react';

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
    status: string;
}

interface Registration {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    status: string;
    payment_status: string;
    created_at: string;
}

interface ShowProps {
    tournament: Tournament;
    registrations: Registration[];
}

const Show: React.FC<ShowProps> = ({ tournament, registrations }) => {
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

    const confirmedRegistrations = registrations.filter(reg => reg.status === 'confirmed');
    const pendingRegistrations = registrations.filter(reg => reg.status === 'pending');

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
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-primary/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-primary/30">
                                        <Gamepad className="w-5 h-5 text-primary mr-2" />
                                        <span className="text-white font-medium">{tournament.game.name}</span>
                                    </div>
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
                            <span className="ml-2 text-text-primary font-bold">{registrations.length} inscripciones</span>
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
                            <span className="ml-2 text-success font-bold">{confirmedRegistrations.length}</span>
                        </div>
                        <div>
                            <span className="font-medium">Pendientes:</span>
                            <span className="ml-2 text-warning font-bold">{pendingRegistrations.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de inscripciones */}
            <div className="bg-secondary/95 backdrop-blur-sm rounded-lg shadow-lg border-2 border-primary/30 p-6">
                <div className="flex items-center mb-6">
                    <Users className="w-8 h-8 text-primary mr-3" />
                    <h2 className="text-2xl font-bold text-text-primary">Inscripciones</h2>
                </div>
                
                {registrations.length > 0 ? (
                    <div className="space-y-4">
                        {registrations.map((registration) => (
                            <div key={registration.id} className="bg-secondary-dark/80 backdrop-blur-sm rounded-lg p-4 border border-primary/30 hover:border-primary hover:shadow-lg transition-all duration-200">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-text-primary">{registration.user.name}</h3>
                                        <p className="text-text-primary/70 text-sm">{registration.user.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-lg ${getRegistrationStatusColor(registration.status)}`}>
                                            {getRegistrationStatusText(registration.status)}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-lg ${
                                            registration.payment_status === 'paid' 
                                                ? 'bg-success text-text-primary' 
                                                : registration.payment_status === 'pending'
                                                ? 'bg-warning text-secondary'
                                                : 'bg-error text-text-primary'
                                        }`}>
                                            {registration.payment_status === 'paid' ? 'Pagado' : 
                                             registration.payment_status === 'pending' ? 'Pago Pendiente' : 'No Pagado'}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-sm text-text-primary/70">
                                    Inscrito el: {new Date(registration.created_at).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 text-primary/50 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-text-primary mb-2">No hay inscripciones</h3>
                        <p className="text-text-primary/70">
                            Las inscripciones aparecerán aquí cuando los usuarios se registren.
                        </p>
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
                            <p className="text-2xl font-bold text-text-primary">{confirmedRegistrations.length}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-secondary/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border-2 border-warning/30 hover:border-warning hover:shadow-xl transition-all duration-200">
                    <div className="flex items-center">
                        <Clock className="w-8 h-8 text-warning mr-3" />
                        <div>
                            <h3 className="text-sm font-medium text-text-primary/70">Pendientes</h3>
                            <p className="text-2xl font-bold text-text-primary">{pendingRegistrations.length}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-secondary/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border-2 border-info/30 hover:border-info hover:shadow-xl transition-all duration-200">
                    <div className="flex items-center">
                        <DollarSign className="w-8 h-8 text-info mr-3" />
                        <div>
                            <h3 className="text-sm font-medium text-text-primary/70">Ingresos</h3>
                            <p className="text-2xl font-bold text-text-primary">
                                €{tournament.entry_fee ? (confirmedRegistrations.length * tournament.entry_fee).toFixed(2) : '0.00'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Show;
