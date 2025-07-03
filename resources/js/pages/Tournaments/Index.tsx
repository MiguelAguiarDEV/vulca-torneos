import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Users, Trophy, GamepadIcon, Clock, DollarSign } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Torneos',
        href: '/tournaments',
    },
];

interface Game {
    id: number;
    name: string;
    slug: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Registration {
    id: number;
    status: string;
    user: User;
}

interface Tournament {
    id: number;
    name: string;
    slug: string;
    description?: string;
    start_date: string;
    end_date: string;
    registration_ends_at?: string;
    entry_fee: number;
    status: string;
    game: Game;
    registrations?: Registration[];
    registrations_count?: number;
}

interface TournamentsIndexProps {
    tournaments: Tournament[];
    filters: {
        game_id?: number;
        status?: string;
    };
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString: string) {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatPrice(price: number) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(price);
}

function getStatusBadge(status: string) {
    const variants = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    
    return variants[status as keyof typeof variants] || variants.active;
}

function getStatusText(status: string) {
    const texts = {
        active: 'Activo',
        completed: 'Completado',
        cancelled: 'Cancelado'
    };
    
    return texts[status as keyof typeof texts] || status;
}

function isRegistrationOpen(tournament: Tournament): boolean {
    if (tournament.status !== 'active') return false;
    if (!tournament.registration_ends_at) return true;
    return new Date() < new Date(tournament.registration_ends_at);
}

export default function TournamentsIndex({ tournaments, filters }: TournamentsIndexProps) {
    const activeTournaments = tournaments.filter(t => t.status === 'active');
    const completedTournaments = tournaments.filter(t => t.status === 'completed');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Torneos" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Torneos</h1>
                        <p className="text-muted-foreground">
                            Encuentra y únete a torneos de juegos TCG
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/games">
                            <Button variant="outline">
                                Ver juegos
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Torneos Activos</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeTournaments.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Disponibles para inscripción
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Participantes</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {tournaments.reduce((sum, t) => sum + (t.registrations_count || 0), 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                En todos los torneos
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Torneos Completados</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{completedTournaments.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Finalizados exitosamente
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Active Tournaments */}
                {activeTournaments.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Torneos Activos</CardTitle>
                            <CardDescription>
                                Torneos disponibles para inscripción
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {activeTournaments.map((tournament) => (
                                    <div key={tournament.id} className="border rounded-lg p-4 hover:shadow-lg transition-all duration-200">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg mb-1">{tournament.name}</h3>
                                                <div className="flex items-center text-sm text-muted-foreground mb-2">
                                                    <GamepadIcon className="h-4 w-4 mr-1" />
                                                    <span>{tournament.game.name}</span>
                                                </div>
                                            </div>
                                            <Badge className={getStatusBadge(tournament.status)}>
                                                {getStatusText(tournament.status)}
                                            </Badge>
                                        </div>
                                        
                                        {tournament.description && (
                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                                {tournament.description}
                                            </p>
                                        )}
                                        
                                        <div className="space-y-2 text-sm mb-4">
                                            <div className="flex items-center text-muted-foreground">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                <span>{formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}</span>
                                            </div>
                                            <div className="flex items-center text-muted-foreground">
                                                <Users className="h-4 w-4 mr-2" />
                                                <span>{tournament.registrations_count || 0} participantes</span>
                                            </div>
                                            {tournament.registration_ends_at && (
                                                <div className="flex items-center text-muted-foreground">
                                                    <Clock className="h-4 w-4 mr-2" />
                                                    <span>Inscripciones hasta: {formatDateTime(tournament.registration_ends_at)}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center text-green-600 font-semibold">
                                                <DollarSign className="h-4 w-4 mr-2" />
                                                <span>{formatPrice(tournament.entry_fee)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <Link href={`/tournaments/${tournament.slug}`} className="flex-1">
                                                <Button variant="outline" className="w-full">
                                                    Ver detalles
                                                </Button>
                                            </Link>
                                            {isRegistrationOpen(tournament) && (
                                                <Link href={`/tournaments/${tournament.slug}`} className="flex-1">
                                                    <Button className="w-full">
                                                        Inscribirse
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                        
                                        {!isRegistrationOpen(tournament) && tournament.status === 'active' && (
                                            <p className="text-xs text-red-600 mt-2 text-center">
                                                Inscripciones cerradas
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Completed Tournaments */}
                {completedTournaments.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Torneos Completados</CardTitle>
                            <CardDescription>
                                Historial de torneos finalizados
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {completedTournaments.map((tournament) => (
                                    <div key={tournament.id} className="border rounded-lg p-4 opacity-75">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-semibold">{tournament.name}</h4>
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <GamepadIcon className="h-4 w-4 mr-1" />
                                                    <span>{tournament.game.name}</span>
                                                </div>
                                            </div>
                                            <Badge className={getStatusBadge(tournament.status)}>
                                                {getStatusText(tournament.status)}
                                            </Badge>
                                        </div>
                                        
                                        <div className="space-y-1 text-sm text-muted-foreground">
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                <span>{formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Users className="h-4 w-4 mr-2" />
                                                <span>{tournament.registrations_count || 0} participantes</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <Link href={`/tournaments/${tournament.slug}`}>
                                                <Button variant="outline" size="sm" className="w-full">
                                                    Ver resultados
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* No Tournaments */}
                {tournaments.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No hay torneos disponibles</h3>
                            <p className="text-muted-foreground mb-6">
                                Actualmente no hay torneos programados.
                            </p>
                            <Link href="/games">
                                <Button variant="outline">
                                    Explorar juegos
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
