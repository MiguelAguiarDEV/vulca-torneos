import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Calendar, Trophy, GamepadIcon, Clock, DollarSign, X } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mis Inscripciones',
        href: '/my-registrations',
    },
];

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
    end_date: string;
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

interface RegistrationsIndexProps {
    registrations: Registration[];
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

function getTournamentStatusBadge(status: string) {
    const variants = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    
    return variants[status as keyof typeof variants] || variants.active;
}

function getTournamentStatusText(status: string) {
    const texts = {
        active: 'Activo',
        completed: 'Completado',
        cancelled: 'Cancelado'
    };
    
    return texts[status as keyof typeof texts] || status;
}

export default function RegistrationsIndex({ registrations }: RegistrationsIndexProps) {
    const { delete: destroy, processing } = useForm();

    const handleCancelRegistration = (registrationId: number) => {
        if (confirm('¿Estás seguro de que quieres cancelar esta inscripción?')) {
            destroy(`/registrations/${registrationId}`, {
                preserveScroll: true
            });
        }
    };

    const activeRegistrations = registrations.filter(r => r.status !== 'cancelled');
    const cancelledRegistrations = registrations.filter(r => r.status === 'cancelled');
    const upcomingTournaments = activeRegistrations.filter(r => new Date(r.tournament.start_date) > new Date());
    const pastTournaments = activeRegistrations.filter(r => new Date(r.tournament.end_date) < new Date());

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mis Inscripciones" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Mis Inscripciones</h1>
                        <p className="text-muted-foreground">
                            Gestiona tus inscripciones a torneos
                        </p>
                    </div>
                    <Link href="/tournaments">
                        <Button>
                            Explorar torneos
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{registrations.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Inscripciones totales
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Activas</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeRegistrations.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Pendientes y confirmadas
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Próximos</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{upcomingTournaments.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Torneos por venir
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completados</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pastTournaments.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Torneos finalizados
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Upcoming Tournaments */}
                {upcomingTournaments.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Próximos Torneos</CardTitle>
                            <CardDescription>
                                Torneos en los que estás inscrito que aún no han comenzado
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcomingTournaments.map((registration) => (
                                    <div key={registration.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-semibold">{registration.tournament.name}</h3>
                                                    <Badge className={getTournamentStatusBadge(registration.tournament.status)}>
                                                        {getTournamentStatusText(registration.tournament.status)}
                                                    </Badge>
                                                </div>
                                                
                                                <div className="flex items-center text-sm text-muted-foreground mb-2">
                                                    <GamepadIcon className="h-4 w-4 mr-1" />
                                                    <Link href={`/games/${registration.tournament.game.slug}`} className="hover:text-primary">
                                                        {registration.tournament.game.name}
                                                    </Link>
                                                </div>
                                                
                                                <div className="grid gap-2 md:grid-cols-3 text-sm">
                                                    <div className="flex items-center text-muted-foreground">
                                                        <Calendar className="h-4 w-4 mr-2" />
                                                        <span>{formatDate(registration.tournament.start_date)}</span>
                                                    </div>
                                                    <div className="flex items-center text-muted-foreground">
                                                        <Clock className="h-4 w-4 mr-2" />
                                                        <span>Inscrito: {formatDateTime(registration.registered_at)}</span>
                                                    </div>
                                                    <div className="flex items-center text-green-600 font-medium">
                                                        <DollarSign className="h-4 w-4 mr-2" />
                                                        <span>{formatPrice(registration.tournament.entry_fee)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <Badge className={getStatusBadge(registration.status)}>
                                                    {getStatusText(registration.status)}
                                                </Badge>
                                                <Link href={`/tournaments/${registration.tournament.slug}`}>
                                                    <Button variant="outline" size="sm">
                                                        Ver torneo
                                                    </Button>
                                                </Link>
                                                {registration.status !== 'cancelled' && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleCancelRegistration(registration.id)}
                                                        disabled={processing}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Past Tournaments */}
                {pastTournaments.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Torneos Completados</CardTitle>
                            <CardDescription>
                                Historial de torneos en los que has participado
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {pastTournaments.map((registration) => (
                                    <div key={registration.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-medium">{registration.tournament.name}</h4>
                                                <Badge className={getTournamentStatusBadge(registration.tournament.status)}>
                                                    {getTournamentStatusText(registration.tournament.status)}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <GamepadIcon className="h-4 w-4 mr-1" />
                                                <span>{registration.tournament.game.name}</span>
                                                <span className="mx-2">•</span>
                                                <Calendar className="h-4 w-4 mr-1" />
                                                <span>{formatDate(registration.tournament.start_date)} - {formatDate(registration.tournament.end_date)}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={getStatusBadge(registration.status)}>
                                                {getStatusText(registration.status)}
                                            </Badge>
                                            <Link href={`/tournaments/${registration.tournament.slug}`}>
                                                <Button variant="outline" size="sm">
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

                {/* Cancelled Registrations */}
                {cancelledRegistrations.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Inscripciones Canceladas</CardTitle>
                            <CardDescription>
                                Inscripciones que has cancelado
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 opacity-75">
                                {cancelledRegistrations.map((registration) => (
                                    <div key={registration.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                                        <div>
                                            <h4 className="font-medium text-muted-foreground">{registration.tournament.name}</h4>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <GamepadIcon className="h-4 w-4 mr-1" />
                                                <span>{registration.tournament.game.name}</span>
                                                <span className="mx-2">•</span>
                                                <span>{formatDate(registration.tournament.start_date)}</span>
                                            </div>
                                        </div>
                                        <Badge className={getStatusBadge(registration.status)}>
                                            {getStatusText(registration.status)}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* No Registrations */}
                {registrations.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No tienes inscripciones</h3>
                            <p className="text-muted-foreground mb-6">
                                Explora los torneos disponibles y únete a tu primer torneo.
                            </p>
                            <Link href="/tournaments">
                                <Button>
                                    Explorar torneos
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
