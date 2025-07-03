import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Trophy, Users, GamepadIcon, Calendar, Plus, Settings, CreditCard } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel Administrador',
        href: '/admin/dashboard',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
}

interface Game {
    id: number;
    name: string;
    slug: string;
}

interface Tournament {
    id: number;
    name: string;
    slug: string;
    start_date: string;
    game: Game;
}

interface Registration {
    id: number;
    status: string;
    created_at: string;
    user: User;
    tournament: Tournament;
}

interface Stats {
    total_users: number;
    total_games: number;
    total_tournaments: number;
    total_registrations: number;
    active_tournaments: number;
    pending_registrations: number;
}

interface AdminDashboardProps {
    stats: Stats;
    recentRegistrations: Registration[];
    upcomingTournaments: Tournament[];
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

function getStatusBadge(status: string) {
    const variants = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    
    return variants[status as keyof typeof variants] || variants.pending;
}

function getStatusText(status: string) {
    const texts = {
        pending: 'Pendiente',
        confirmed: 'Confirmada',
        cancelled: 'Cancelada'
    };
    
    return texts[status as keyof typeof texts] || status;
}

export default function AdminDashboard({ stats, recentRegistrations, upcomingTournaments }: AdminDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel Administrador" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
                        <p className="text-muted-foreground">
                            Gestiona torneos, juegos, inscripciones y usuarios
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin/games">
                            <Button variant="outline">
                                <Settings className="h-4 w-4 mr-2" />
                                Gestionar
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-xs text-muted-foreground">
                                Total registrados
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Juegos</CardTitle>
                            <GamepadIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_games}</div>
                            <p className="text-xs text-muted-foreground">
                                Juegos disponibles
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Torneos</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_tournaments}</div>
                            <p className="text-xs text-muted-foreground">
                                Total creados
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Activos</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_tournaments}</div>
                            <p className="text-xs text-muted-foreground">
                                Torneos activos
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Inscripciones</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_registrations}</div>
                            <p className="text-xs text-muted-foreground">
                                Total registradas
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_registrations}</div>
                            <p className="text-xs text-muted-foreground">
                                Por confirmar
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-6 md:grid-cols-4">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <Link href="/admin/games">
                            <CardContent className="p-6 text-center">
                                <GamepadIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                                <h3 className="font-semibold mb-2">Gestionar Juegos</h3>
                                <p className="text-sm text-muted-foreground">
                                    Añadir, editar o eliminar juegos
                                </p>
                            </CardContent>
                        </Link>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <Link href="/admin/tournaments">
                            <CardContent className="p-6 text-center">
                                <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
                                <h3 className="font-semibold mb-2">Gestionar Torneos</h3>
                                <p className="text-sm text-muted-foreground">
                                    Crear y administrar torneos
                                </p>
                            </CardContent>
                        </Link>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <Link href="/admin/registrations">
                            <CardContent className="p-6 text-center">
                                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                                <h3 className="font-semibold mb-2">Inscripciones</h3>
                                <p className="text-sm text-muted-foreground">
                                    Confirmar y gestionar inscripciones
                                </p>
                            </CardContent>
                        </Link>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <Link href="/admin/payments">
                            <CardContent className="p-6 text-center">
                                <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
                                <h3 className="font-semibold mb-2">Pagos</h3>
                                <p className="text-sm text-muted-foreground">
                                    Gestionar pagos pendientes
                                </p>
                            </CardContent>
                        </Link>
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
                                        Últimas 10 inscripciones registradas
                                    </CardDescription>
                                </div>
                                <Link href="/admin/registrations">
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
                                                    {registration.user.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {registration.tournament.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {registration.tournament.game.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDateTime(registration.created_at)}
                                                </p>
                                            </div>
                                            <Badge className={getStatusBadge(registration.status)}>
                                                {getStatusText(registration.status)}
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No hay inscripciones recientes
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
                                        Torneos programados próximamente
                                    </CardDescription>
                                </div>
                                <Link href="/admin/tournaments">
                                    <Button variant="outline" size="sm">Ver todos</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcomingTournaments.length > 0 ? (
                                    upcomingTournaments.map((tournament) => (
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
                                                        {formatDateTime(tournament.start_date)}
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
                                        No hay torneos próximos
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
