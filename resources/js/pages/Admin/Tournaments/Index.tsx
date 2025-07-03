import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Trophy, Users, Calendar, DollarSign } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel Administrador',
        href: '/admin/dashboard',
    },
    {
        title: 'Gestión de Torneos',
        href: '/admin/tournaments',
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
    description?: string;
    start_date: string;
    end_date: string;
    status: string;
    max_participants: number;
    entry_fee: number;
    registrations_count: number;
    game: Game;
    created_at: string;
    updated_at: string;
}

interface AdminTournamentsIndexProps {
    tournaments: Tournament[];
}

function formatDate(dateString: string) {
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
        draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    
    return variants[status as keyof typeof variants] || variants.draft;
}

function getStatusText(status: string) {
    const texts = {
        draft: 'Borrador',
        active: 'Activo',
        completed: 'Finalizado',
        cancelled: 'Cancelado'
    };
    
    return texts[status as keyof typeof texts] || status;
}

export default function AdminTournamentsIndex({ tournaments }: AdminTournamentsIndexProps) {
    const handleDelete = (tournament: Tournament) => {
        if (tournament.registrations_count > 0) {
            alert('No se puede eliminar el torneo porque tiene inscripciones.');
            return;
        }

        if (confirm(`¿Estás seguro de que quieres eliminar "${tournament.name}"?`)) {
            router.delete(`/admin/tournaments/${tournament.id}`, {
                onSuccess: () => {
                    // Handle success
                },
                onError: (errors) => {
                    console.error('Error deleting tournament:', errors);
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Torneos" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gestión de Torneos</h1>
                        <p className="text-muted-foreground">
                            Administra los torneos de la plataforma
                        </p>
                    </div>
                    <Link href="/admin/tournaments/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Torneo
                        </Button>
                    </Link>
                </div>

                {tournaments.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                        {tournaments.map((tournament) => (
                            <Card key={tournament.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Trophy className="h-5 w-5 text-primary" />
                                                <CardTitle className="text-lg">{tournament.name}</CardTitle>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Badge variant="secondary">{tournament.game.name}</Badge>
                                                <Badge className={getStatusBadge(tournament.status)}>
                                                    {getStatusText(tournament.status)}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Link href={`/admin/tournaments/${tournament.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(tournament)}
                                                disabled={tournament.registrations_count > 0}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {tournament.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {tournament.description}
                                            </p>
                                        )}
                                        
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>Inicio: {formatDate(tournament.start_date)}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>Fin: {formatDate(tournament.end_date)}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span>{tournament.registrations_count}/{tournament.max_participants} inscritos</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                <span>${tournament.entry_fee}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex space-x-2">
                                            <Link href={`/tournaments/${tournament.slug}`} className="flex-1">
                                                <Button variant="outline" className="w-full">
                                                    Ver Público
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/tournaments/${tournament.id}/edit`} className="flex-1">
                                                <Button className="w-full">
                                                    Editar
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-medium mb-2">No hay torneos</h3>
                        <p className="text-muted-foreground mb-4">
                            Aún no has creado ningún torneo.
                        </p>
                        <Link href="/admin/tournaments/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Crear Primer Torneo
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
