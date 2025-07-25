import React, { useState } from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { Link, router } from '@inertiajs/react';
import { 
    Calendar, 
    Users, 
    Trophy, 
    ArrowLeft, 
    Gamepad2, 
    Award, 
    Clock, 
    MapPin, 
    UserPlus, 
    CheckCircle, 
    AlertCircle,
    XCircle,
    DollarSign,
    Target,
    Star
} from 'lucide-react';
import Modal from '@/components/Modal';

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
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Registration {
    id: number;
    user: User;
    status: string;
    payment_method: string;
    payment_status: string;
    registered_at: string;
    team_name: string | null;
}

interface TournamentShowProps {
    tournament: Tournament;
    userRegistration: Registration | null;
    canRegister: boolean;
    registrations?: Registration[];
}

const TournamentShow: React.FC<TournamentShowProps> = ({ 
    tournament, 
    userRegistration, 
    canRegister,
    registrations = [] 
}) => {
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'registration_open':
                return <UserPlus className="w-5 h-5" />;
            case 'registration_closed':
                return <XCircle className="w-5 h-5" />;
            case 'ongoing':
                return <Target className="w-5 h-5" />;
            case 'finished':
                return <Trophy className="w-5 h-5" />;
            case 'cancelled':
                return <XCircle className="w-5 h-5" />;
            default:
                return <Clock className="w-5 h-5" />;
        }
    };

    const handleRegistration = () => {
        if (!canRegister) return;
        
        setIsRegistering(true);
        router.post(route('tournaments.register', tournament.id), {}, {
            onSuccess: () => {
                setShowRegistrationModal(false);
                setIsRegistering(false);
            },
            onError: (errors) => {
                console.error('Error al registrarse:', errors);
                alert('Error al registrarse en el torneo. Intenta nuevamente.');
                setIsRegistering(false);
            }
        });
    };

    const isRegistrationFull = tournament.has_registration_limit && 
        registrations.length >= tournament.registration_limit!;

    const registrationProgress = tournament.has_registration_limit 
        ? (registrations.length / tournament.registration_limit!) * 100 
        : null;

    return (
        <PublicLayout title={`${tournament.name} - Vulca Torneos`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link 
                        href={route('tournaments.index')} 
                        className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver a Torneos
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Contenido Principal */}
                    <div className="lg:col-span-2">
                        {/* Header del Torneo */}
                        <div className="bg-secondary/95 backdrop-blur-sm border-2 border-primary/30 rounded-lg shadow-lg p-6 mb-6">
                            {tournament.image && (
                                <div className="h-64 mb-6 rounded-lg overflow-hidden">
                                    <img 
                                        src={tournament.image} 
                                        alt={tournament.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center mb-3">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(tournament.status)}`}>
                                            {getStatusIcon(tournament.status)}
                                            <span className="ml-2">{getStatusText(tournament.status)}</span>
                                        </span>
                                    </div>
                                    
                                    <h1 className="text-3xl font-bold text-text-primary mb-2">{tournament.name}</h1>
                                    
                                    <div className="flex items-center text-text-primary/70 mb-4">
                                        <Gamepad2 className="w-5 h-5 mr-2" />
                                        <span className="text-lg">{tournament.game.name}</span>
                                    </div>
                                </div>
                            </div>

                            {tournament.description && (
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-text-primary/80 leading-relaxed">
                                        {tournament.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Detalles del Torneo */}
                        <div className="bg-secondary/95 backdrop-blur-sm border-2 border-primary/30 rounded-lg shadow-lg p-6 mb-6">
                            <h2 className="text-xl font-semibold text-text-primary mb-4">Detalles del Torneo</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Calendar className="w-5 h-5 text-primary mr-3" />
                                        <div>
                                            <span className="text-sm text-text-primary/70">Fecha de inicio</span>
                                            <p className="font-medium text-text-primary">
                                                {new Date(tournament.start_date).toLocaleDateString('es-ES', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {tournament.end_date && (
                                        <div className="flex items-center">
                                            <Calendar className="w-5 h-5 text-primary mr-3" />
                                            <div>
                                                <span className="text-sm text-text-primary/70">Fecha de fin</span>
                                                <p className="font-medium text-text-primary">
                                                    {new Date(tournament.end_date).toLocaleDateString('es-ES', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center">
                                        <Users className="w-5 h-5 text-primary mr-3" />
                                        <div>
                                            <span className="text-sm text-text-primary/70">Participantes</span>
                                            <p className="font-medium text-text-primary">
                                                {registrations.length}
                                                {tournament.has_registration_limit 
                                                    ? ` / ${tournament.registration_limit}`
                                                    : ' registrados'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {tournament.registration_start && (
                                        <div className="flex items-center">
                                            <Clock className="w-5 h-5 text-primary mr-3" />
                                            <div>
                                                <span className="text-sm text-text-primary/70">Inscripciones abren</span>
                                                <p className="font-medium text-text-primary">
                                                    {new Date(tournament.registration_start).toLocaleDateString('es-ES')}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {tournament.registration_end && (
                                        <div className="flex items-center">
                                            <Clock className="w-5 h-5 text-primary mr-3" />
                                            <div>
                                                <span className="text-sm text-text-primary/70">Inscripciones cierran</span>
                                                <p className="font-medium text-text-primary">
                                                    {new Date(tournament.registration_end).toLocaleDateString('es-ES')}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center">
                                        {tournament.entry_fee && tournament.entry_fee > 0 ? (
                                            <>
                                                <DollarSign className="w-5 h-5 text-primary mr-3" />
                                                <div>
                                                    <span className="text-sm text-text-primary/70">Cuota de entrada</span>
                                                    <p className="font-medium text-text-primary">€{tournament.entry_fee}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <Star className="w-5 h-5 text-success mr-3" />
                                                <div>
                                                    <span className="text-sm text-text-primary/70">Cuota de entrada</span>
                                                    <p className="font-medium text-success">¡Gratis!</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Progreso de Inscripciones */}
                            {tournament.has_registration_limit && registrationProgress !== null && (
                                <div className="mt-6 p-4 bg-secondary-light/50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-text-primary">Plazas ocupadas</span>
                                        <span className="text-sm text-text-primary/70">{Math.round(registrationProgress)}%</span>
                                    </div>
                                    <div className="w-full bg-secondary-dark rounded-full h-3">
                                        <div 
                                            className={`h-3 rounded-full transition-all duration-300 ${
                                                registrationProgress >= 90 
                                                    ? 'bg-error' 
                                                    : registrationProgress >= 70 
                                                        ? 'bg-warning' 
                                                        : 'bg-success'
                                            }`}
                                            style={{ width: `${Math.min(100, registrationProgress)}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-text-primary/60 mt-1">
                                        {tournament.registration_limit! - registrations.length} plazas disponibles
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Lista de Participantes */}
                        {registrations.length > 0 && (
                            <div className="bg-secondary/95 backdrop-blur-sm border-2 border-primary/30 rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
                                    <Users className="w-5 h-5 mr-2" />
                                    Participantes ({registrations.length})
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {registrations.map((registration, index) => (
                                        <div key={registration.id} className="flex items-center p-3 bg-secondary-light/50 rounded-lg">
                                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-sm font-medium text-primary">
                                                    {registration.user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-text-primary truncate">
                                                    {registration.user.name}
                                                </p>
                                                <p className="text-xs text-text-primary/60">
                                                    #{index + 1}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            
                            {/* Card de Registro */}
                            <div className="bg-secondary/95 backdrop-blur-sm border-2 border-primary/30 rounded-lg shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-text-primary mb-4">Inscripción</h3>
                                
                                {userRegistration ? (
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-8 h-8 text-success" />
                                        </div>
                                        <h4 className="font-semibold text-text-primary mb-2">¡Ya estás inscrito!</h4>
                                        <p className="text-sm text-text-primary/70 mb-4">
                                            Te registraste el {new Date(userRegistration.registered_at).toLocaleDateString('es-ES')}
                                        </p>
                                        <div className="bg-success/10 border border-success/30 rounded-lg p-3">
                                            <p className="text-sm text-success">
                                                Estado: {userRegistration.payment_status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        {canRegister ? (
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <UserPlus className="w-8 h-8 text-primary" />
                                                </div>
                                                <h4 className="font-semibold text-text-primary mb-2">¡Únete al torneo!</h4>
                                                <p className="text-sm text-text-primary/70 mb-4">
                                                    Regístrate para participar en este emocionante torneo.
                                                </p>
                                                
                                                {tournament.entry_fee && tournament.entry_fee > 0 && (
                                                    <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 mb-4">
                                                        <p className="text-sm text-warning font-medium">
                                                            Cuota: €{tournament.entry_fee}
                                                        </p>
                                                    </div>
                                                )}
                                                
                                                <button
                                                    onClick={() => setShowRegistrationModal(true)}
                                                    className="w-full bg-primary hover:bg-primary-dark text-secondary font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                                >
                                                    Inscribirse
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    {isRegistrationFull ? (
                                                        <Users className="w-8 h-8 text-error" />
                                                    ) : (
                                                        <XCircle className="w-8 h-8 text-error" />
                                                    )}
                                                </div>
                                                <h4 className="font-semibold text-text-primary mb-2">
                                                    {isRegistrationFull ? 'Torneo Completo' : 'Inscripciones Cerradas'}
                                                </h4>
                                                <p className="text-sm text-text-primary/70">
                                                    {isRegistrationFull 
                                                        ? 'Este torneo ha alcanzado el límite máximo de participantes.'
                                                        : 'Las inscripciones para este torneo están cerradas.'
                                                    }
                                                </p>
                                                <Link
                                                    href={route('login')}
                                                    className="inline-block mt-4 text-primary hover:text-primary-dark underline"
                                                >
                                                    Iniciar sesión para ver más opciones
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Información del Juego */}
                            <div className="bg-secondary/95 backdrop-blur-sm border-2 border-primary/30 rounded-lg shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-text-primary mb-4">Acerca del Juego</h3>
                                
                                <div className="flex items-center mb-3">
                                    {tournament.game.image ? (
                                        <img 
                                            src={tournament.game.image} 
                                            alt={tournament.game.name}
                                            className="w-12 h-12 rounded-lg object-cover mr-3"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
                                            <Gamepad2 className="w-6 h-6 text-primary" />
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-medium text-text-primary">{tournament.game.name}</h4>
                                    </div>
                                </div>
                                
                                {tournament.game.description && (
                                    <p className="text-sm text-text-primary/70">
                                        {tournament.game.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Confirmación de Registro */}
            <Modal show={showRegistrationModal} onClose={() => setShowRegistrationModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-text-primary mb-4">Confirmar Inscripción</h2>
                    <p className="text-text-primary/70 mb-6">
                        ¿Estás seguro de que quieres inscribirte en "{tournament.name}"?
                        {tournament.entry_fee && tournament.entry_fee > 0 && (
                            <span className="block mt-2 font-medium text-warning">
                                Se requiere el pago de €{tournament.entry_fee}.
                            </span>
                        )}
                    </p>
                    <div className="flex justify-end space-x-4">
                        <button 
                            onClick={() => setShowRegistrationModal(false)}
                            className="px-4 py-2 text-text-primary border border-primary/30 rounded-lg hover:bg-primary/20 transition-colors duration-200"
                            disabled={isRegistering}
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleRegistration}
                            disabled={isRegistering}
                            className="px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50"
                        >
                            {isRegistering ? 'Inscribiendo...' : 'Confirmar Inscripción'}
                        </button>
                    </div>
                </div>
            </Modal>
        </PublicLayout>
    );
};

export default TournamentShow;
