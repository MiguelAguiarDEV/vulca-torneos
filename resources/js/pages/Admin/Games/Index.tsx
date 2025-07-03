import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, GamepadIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel Administrador',
        href: '/admin/dashboard',
    },
    {
        title: 'Gestión de Juegos',
        href: '/admin/games',
    },
];

interface Game {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    tournaments_count: number;
    active_tournaments_count: number;
    created_at: string;
    updated_at: string;
}

interface AdminGamesIndexProps {
    games: Game[];
}

export default function AdminGamesIndex({ games }: AdminGamesIndexProps) {
    const handleDelete = (game: Game) => {
        if (game.tournaments_count > 0) {
            alert('No se puede eliminar el juego porque tiene torneos asociados.');
            return;
        }

        if (confirm(`¿Estás seguro de que quieres eliminar "${game.name}"?`)) {
            router.delete(`/admin/games/${game.id}`, {
                onSuccess: () => {
                    // Handle success
                },
                onError: (errors) => {
                    console.error('Error deleting game:', errors);
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Juegos" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gestión de Juegos</h1>
                        <p className="text-muted-foreground">
                            Administra los juegos disponibles en la plataforma
                        </p>
                    </div>
                    <Link href="/admin/games/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Juego
                        </Button>
                    </Link>
                </div>

                {games.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {games.map((game) => (
                            <Card key={game.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <GamepadIcon className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{game.name}</CardTitle>
                                                <p className="text-sm text-muted-foreground">
                                                    {game.slug}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Link href={`/admin/games/${game.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(game)}
                                                disabled={game.tournaments_count > 0}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {game.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {game.description}
                                            </p>
                                        )}
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex space-x-2">
                                                <Badge variant="secondary">
                                                    {game.tournaments_count} torneos
                                                </Badge>
                                                <Badge variant="outline">
                                                    {game.active_tournaments_count} activos
                                                </Badge>
                                            </div>
                                        </div>
                                        
                                        <div className="flex space-x-2">
                                            <Link href={`/games/${game.slug}`} className="flex-1">
                                                <Button variant="outline" className="w-full">
                                                    Ver Público
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/games/${game.id}/edit`} className="flex-1">
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
                        <GamepadIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-medium mb-2">No hay juegos</h3>
                        <p className="text-muted-foreground mb-4">
                            Aún no has creado ningún juego.
                        </p>
                        <Link href="/admin/games/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Crear Primer Juego
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
