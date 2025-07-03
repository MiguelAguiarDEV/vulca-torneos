import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Calendar, Users, Trophy, GamepadIcon, Clock, DollarSign, UserCheck, AlertCircle } from 'lucide-react';
import { useState } from 'react';

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
    registered_at: string;
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
}

interface UserRegistration {
    id: number;
    status: string;
    registered_at: string;
}

interface TournamentShowProps {
    tournament: Tournament;
    userRegistration?: UserRegistration;
    canRegister: boolean;
    auth?: {
        user?: User;
    };
}

const getBreadcrumbs = (tournament: Tournament): BreadcrumbItem[] => [
    {
        title: 'Torneos',
        href: '/tournaments',
    },
    {
        title: tournament.game.name,
        href: `/games/${tournament.game.slug}`,
    },
    {
        title: tournament.name,
        href: `/tournaments/${tournament.slug}`,
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
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    
    return variants[status as keyof typeof variants] || variants.active;
}

function getStatusText(status: string) {
    const texts = {
        active: 'Activo',
        completed: 'Completado',
        cancelled: 'Cancelado',
        pending: 'Pendiente',
        confirmed: 'Confirmada'
    };
    
    return texts[status as keyof typeof texts] || status;
}

function isRegistrationOpen(tournament: Tournament): boolean {
    if (tournament.status !== 'active') return false;
    if (!tournament.registration_ends_at) return true;
    return new Date() < new Date(tournament.registration_ends_at);
}

export default function TournamentShow({ tournament, userRegistration, canRegister, auth }: TournamentShowProps) {
    const breadcrumbs = getBreadcrumbs(tournament);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    
    const { data, setData, post, delete: destroy, processing } = useForm({
        tournament_id: tournament.id,
        payment_method: 'cash'
    });

    const handleRegister = () => {
        post('/registrations', {
            preserveScroll: true,
            onSuccess: () => {
                setShowPaymentForm(false);
            }
        });
    };

    const handleCancelRegistration = () => {
        if (userRegistration) {
            destroy(`/registrations/${userRegistration.id}`, {
                preserveScroll: true
            });
        }
    };

    const registrationOpen = isRegistrationOpen(tournament);
    const confirmedRegistrations = tournament.registrations?.filter(r => r.status === 'confirmed') || [];
    const pendingRegistrations = tournament.registrations?.filter(r => r.status === 'pending') || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={tournament.name} />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Tournament Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <Trophy className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{tournament.name}</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <Link href={`/games/${tournament.game.slug}`} className="flex items-center text-muted-foreground hover:text-primary">
                                    <GamepadIcon className="h-4 w-4 mr-1" />
                                    {tournament.game.name}
                                </Link>
                                <Badge className={getStatusBadge(tournament.status)}>
                                    {getStatusText(tournament.status)}
                                </Badge>
                            </div>
                            {tournament.description && (
                                <p className="text-muted-foreground mt-3 max-w-2xl">
                                    {tournament.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground">Cuota de inscripción</div>
                        <div className="text-2xl font-bold text-green-600">{formatPrice(tournament.entry_fee)}</div>
                    </div>
                </div>

                {/* Registration Status Alert */}
                {userRegistration && (
                    <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5 text-yellow-600" />
                                <div>
                                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                                        Estás inscrito en este torneo
                                    </p>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                        Estado: <Badge className={getStatusBadge(userRegistration.status)}>
                                            {getStatusText(userRegistration.status)}
                                        </Badge>
                                    </p>
                                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                        Inscrito el {formatDateTime(userRegistration.registered_at)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Registration Closed Alert */}
                {!registrationOpen && tournament.status === 'active' && (
                    <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                                <p className="font-medium text-red-800 dark:text-red-200">
                                    Las inscripciones para este torneo han cerrado
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Tournament Details */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detalles del Torneo</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="flex items-center text-muted-foreground">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            <span className="text-sm">Fecha de inicio</span>
                                        </div>
                                        <p className="font-medium">{formatDate(tournament.start_date)}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-muted-foreground">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            <span className="text-sm">Fecha de fin</span>
                                        </div>
                                        <p className="font-medium">{formatDate(tournament.end_date)}</p>
                                    </div>
                                    {tournament.registration_ends_at && (
                                        <div className="space-y-2">
                                            <div className="flex items-center text-muted-foreground">
                                                <Clock className="h-4 w-4 mr-2" />
                                                <span className="text-sm">Inscripciones hasta</span>
                                            </div>
                                            <p className="font-medium">{formatDateTime(tournament.registration_ends_at)}</p>
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <div className="flex items-center text-muted-foreground">
                                            <DollarSign className="h-4 w-4 mr-2" />
                                            <span className="text-sm">Cuota de inscripción</span>
                                        </div>
                                        <p className="font-medium text-green-600">{formatPrice(tournament.entry_fee)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Participants */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Participantes</CardTitle>
                                <CardDescription>
                                    {confirmedRegistrations.length} confirmados, {pendingRegistrations.length} pendientes
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {confirmedRegistrations.length > 0 ? (
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="text-sm font-medium text-green-600 mb-2">Confirmados ({confirmedRegistrations.length})</h4>
                                            <div className="grid gap-2 md:grid-cols-2">
                                                {confirmedRegistrations.map((registration) => (
                                                    <div key={registration.id} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950 rounded-md">
                                                        <span className="text-sm font-medium">{registration.user.name}</span>
                                                        <Badge className={getStatusBadge(registration.status)}>
                                                            {getStatusText(registration.status)}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {pendingRegistrations.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-medium text-yellow-600 mb-2">Pendientes ({pendingRegistrations.length})</h4>
                                                <div className="grid gap-2 md:grid-cols-2">
                                                    {pendingRegistrations.map((registration) => (
                                                        <div key={registration.id} className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-950 rounded-md">
                                                            <span className="text-sm font-medium">{registration.user.name}</span>
                                                            <Badge className={getStatusBadge(registration.status)}>
                                                                {getStatusText(registration.status)}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Aún no hay participantes registrados
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Registration Actions */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Inscripción</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {auth?.user ? (
                                    <>
                                        {userRegistration ? (
                                            <div className="space-y-3">
                                                <p className="text-sm text-muted-foreground">
                                                    Ya estás inscrito en este torneo
                                                </p>
                                                {userRegistration.status !== 'cancelled' && (
                                                    <Button 
                                                        variant="destructive" 
                                                        className="w-full"
                                                        onClick={handleCancelRegistration}
                                                        disabled={processing}
                                                    >
                                                        {processing ? 'Cancelando...' : 'Cancelar inscripción'}
                                                    </Button>
                                                )}
                                            </div>
                                        ) : canRegister && registrationOpen ? (
                                            <div className="space-y-3">
                                                <p className="text-sm text-muted-foreground">
                                                    Únete a este torneo por {formatPrice(tournament.entry_fee)}
                                                </p>
                                                
                                                {!showPaymentForm ? (
                                                    <Button 
                                                        className="w-full"
                                                        onClick={() => setShowPaymentForm(true)}
                                                        disabled={processing}
                                                    >
                                                        Inscribirse
                                                    </Button>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="payment_method">Método de Pago</Label>
                                                            <Select 
                                                                value={data.payment_method} 
                                                                onValueChange={(value) => setData('payment_method', value)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Selecciona método de pago" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="cash">Efectivo</SelectItem>
                                                                    <SelectItem value="transfer">Transferencia</SelectItem>
                                                                    <SelectItem value="card">Tarjeta</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        
                                                        <div className="text-xs text-muted-foreground p-3 bg-yellow-50 rounded-md">
                                                            <p><strong>Nota:</strong> Tu inscripción quedará pendiente hasta que confirmes el pago. Los administradores verificarán tu pago y activarán tu inscripción.</p>
                                                        </div>
                                                        
                                                        <div className="flex space-x-2">
                                                            <Button 
                                                                variant="outline" 
                                                                onClick={() => setShowPaymentForm(false)}
                                                                disabled={processing}
                                                                className="flex-1"
                                                            >
                                                                Cancelar
                                                            </Button>
                                                            <Button 
                                                                onClick={handleRegister}
                                                                disabled={processing}
                                                                className="flex-1"
                                                            >
                                                                {processing ? 'Inscribiendo...' : 'Confirmar'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <p className="text-sm text-muted-foreground">
                                                    {!registrationOpen 
                                                        ? 'Las inscripciones han cerrado' 
                                                        : 'No puedes inscribirte en este torneo'
                                                    }
                                                </p>
                                                <Button variant="outline" className="w-full" disabled>
                                                    No disponible
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-sm text-muted-foreground">
                                            Inicia sesión para inscribirte en este torneo
                                        </p>
                                        <Link href="/login">
                                            <Button className="w-full">
                                                Iniciar sesión
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Estadísticas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Total participantes</span>
                                    <span className="font-medium">{tournament.registrations?.length || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Confirmados</span>
                                    <span className="font-medium text-green-600">{confirmedRegistrations.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Pendientes</span>
                                    <span className="font-medium text-yellow-600">{pendingRegistrations.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Estado</span>
                                    <Badge className={getStatusBadge(tournament.status)}>
                                        {getStatusText(tournament.status)}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
