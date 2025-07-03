import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { GamepadIcon, Calendar, Users, Trophy, Clock } from 'lucide-react';

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
    registrations_count?: number;
}

interface Game {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    tournaments?: Tournament[];
}

interface GameShowProps {
    game: Game;
}

const getBreadcrumbs = (game: Game): BreadcrumbItem[] => [
    {
        title: 'Juegos',
        href: '/games',
    },
    {
        title: game.name,
        href: `/games/${game.slug}`,
    },
];

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
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

export default function GameShow({ game }: GameShowProps) {
    const breadcrumbs = getBreadcrumbs(game);
    const activeTournaments = game.tournaments?.filter(t => t.status === 'active') || [];
    const completedTournaments = game.tournaments?.filter(t => t.status === 'completed') || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={game.name} />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Game Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <GamepadIcon className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{game.name}</h1>
                            {game.description && (
                                <p className="text-muted-foreground mt-2 max-w-2xl">
                                    {game.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground">Total de torneos</div>
                        <div className="text-2xl font-bold">{game.tournaments?.length || 0}</div>
                    </div>
                </div>

                {/* Stats Cards */}
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
                            <CardTitle className="text-sm font-medium">Torneos Completados</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{completedTournaments.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Finalizados anteriormente
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
                                {game.tournaments?.reduce((sum, t) => sum + (t.registrations_count || 0), 0) || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                En todos los torneos
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Active Tournaments */}
                {activeTournaments.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Torneos Activos</CardTitle>
                                    <CardDescription>
                                        Torneos disponibles para inscripción
                                    </CardDescription>
                                </div>
                                <Link href="/tournaments">
                                    <Button variant="outline" size="sm">Ver todos</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {activeTournaments.map((tournament) => (
                                    <div key={tournament.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-semibold">{tournament.name}</h4>
                                                {tournament.description && (
                                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                        {tournament.description}
                                                    </p>
                                                )}
                                            </div>
                                            <Badge className={getStatusBadge(tournament.status)}>
                                                {getStatusText(tournament.status)}
                                            </Badge>
                                        </div>
                                        
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center text-muted-foreground">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                <span>Inicio: {formatDate(tournament.start_date)}</span>
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
                                            <div className="flex items-center justify-between pt-2">
                                                <span className="font-semibold text-green-600">
                                                    {formatPrice(tournament.entry_fee)}
                                                </span>
                                                <Link href={`/tournaments/${tournament.slug}`}>
                                                    <Button size="sm">
                                                        Ver detalles
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
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
                            <div className="space-y-3">
                                {completedTournaments.slice(0, 5).map((tournament) => (
                                    <div key={tournament.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                                        <div>
                                            <h4 className="font-medium">{tournament.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <Badge className={getStatusBadge(tournament.status)}>
                                                {getStatusText(tournament.status)}
                                            </Badge>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {tournament.registrations_count || 0} participantes
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* No Tournaments */}
                {(!game.tournaments || game.tournaments.length === 0) && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No hay torneos disponibles</h3>
                            <p className="text-muted-foreground mb-6">
                                Actualmente no hay torneos programados para {game.name}.
                            </p>
                            <Link href="/tournaments">
                                <Button variant="outline">
                                    Explorar otros torneos
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
