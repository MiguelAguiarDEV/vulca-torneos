import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Trophy, Calendar, Users, GamepadIcon, Clock, MapPin } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Game {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    tournaments_count?: number;
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
}

interface Registration {
    id: number;
    status: string;
    registered_at: string;
    tournament: Tournament;
}

interface Stats {
    total_registrations: number;
    active_registrations: number;
    completed_tournaments: number;
}

interface DashboardProps {
    recentRegistrations: Registration[];
    upcomingTournaments: Tournament[];
    featuredGames: Game[];
    stats: Stats;
}

function getStatusBadge(status: string) {
    const variants = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    
    return variants[status as keyof typeof variants] || variants.pending;
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatPrice(price: number) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(price);
}

export default function Dashboard({ 
    recentRegistrations, 
    upcomingTournaments, 
    featuredGames, 
    stats 
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                {/* Stats Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Inscripciones</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_registrations}</div>
                            <p className="text-xs text-muted-foreground">
                                Inscripciones realizadas
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Inscripciones Activas</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_registrations}</div>
                            <p className="text-xs text-muted-foreground">
                                Pendientes y confirmadas
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Torneos Completados</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completed_tournaments}</div>
                            <p className="text-xs text-muted-foreground">
                                Torneos finalizados
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Recent Registrations */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Inscripciones Recientes</CardTitle>
                                    <CardDescription>
                                        Tus últimas 5 inscripciones
                                    </CardDescription>
                                </div>
                                <Link href="/my-registrations">
                                    <Button variant="outline" size="sm">Ver todas</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentRegistrations.length > 0 ? (
                                    recentRegistrations.map((registration) => (
                                        <div key={registration.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {registration.tournament.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {registration.tournament.game.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(registration.registered_at)}
                                                </p>
                                            </div>
                                            <Badge className={getStatusBadge(registration.status)}>
                                                {registration.status === 'pending' ? 'Pendiente' :
                                                 registration.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No tienes inscripciones aún
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Tournaments */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Próximos Torneos</CardTitle>
                                    <CardDescription>
                                        Torneos disponibles para inscribirse
                                    </CardDescription>
                                </div>
                                <Link href="/tournaments">
                                    <Button variant="outline" size="sm">Ver todos</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcomingTournaments.length > 0 ? (
                                    upcomingTournaments.slice(0, 3).map((tournament) => (
                                        <div key={tournament.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1 flex-1">
                                                    <h4 className="text-sm font-medium leading-none">
                                                        {tournament.name}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <GamepadIcon className="h-3 w-3" />
                                                        {tournament.game.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(tournament.start_date)}
                                                    </p>
                                                    <p className="text-xs font-medium text-green-600">
                                                        {formatPrice(tournament.entry_fee)}
                                                    </p>
                                                </div>
                                                <Link href={`/tournaments/${tournament.slug}`}>
                                                    <Button size="sm" variant="outline">
                                                        Ver
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No hay torneos próximos disponibles
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Featured Games */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Juegos Destacados</CardTitle>
                                <CardDescription>
                                    Juegos con más torneos activos
                                </CardDescription>
                            </div>
                            <Link href="/games">
                                <Button variant="outline" size="sm">Ver todos</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            {featuredGames.length > 0 ? (
                                featuredGames.map((game) => (
                                    <Link 
                                        key={game.id} 
                                        href={`/games/${game.slug}`}
                                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="space-y-2">
                                            <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                                                <GamepadIcon className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <h4 className="text-sm font-medium leading-none">
                                                {game.name}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                {game.tournaments_count || 0} torneos activos
                                            </p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4 col-span-4">
                                    No hay juegos con torneos activos
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
