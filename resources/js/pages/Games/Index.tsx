import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { GamepadIcon, Trophy } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Juegos',
        href: '/games',
    },
];

interface Tournament {
    id: number;
    name: string;
    slug: string;
    start_date: string;
    end_date: string;
    status: string;
    entry_fee: number;
}

interface Game {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    tournaments?: Tournament[];
}

interface GamesIndexProps {
    games: Game[];
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

export default function GamesIndex({ games }: GamesIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Juegos" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Juegos</h1>
                        <p className="text-muted-foreground">
                            Explora los diferentes juegos TCG disponibles
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {games.map((game) => (
                        <Card key={game.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <GamepadIcon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{game.name}</CardTitle>
                                        </div>
                                    </div>
                                    {game.tournaments && game.tournaments.length > 0 && (
                                        <Badge variant="secondary">
                                            {game.tournaments.length} torneos
                                        </Badge>
                                    )}
                                </div>
                                {game.description && (
                                    <CardDescription className="line-clamp-2">
                                        {game.description}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            
                            <CardContent>
                                {game.tournaments && game.tournaments.length > 0 ? (
                                    <div className="space-y-3">
                                        <div className="text-sm font-medium text-muted-foreground">
                                            Próximos torneos:
                                        </div>
                                        <div className="space-y-2">
                                            {game.tournaments.slice(0, 2).map((tournament) => (
                                                <div key={tournament.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                                                    <div>
                                                        <p className="text-sm font-medium">{tournament.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatDate(tournament.start_date)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-green-600">
                                                            {formatPrice(tournament.entry_fee)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <Link href={`/games/${game.slug}`} className="flex-1">
                                                <Button variant="outline" className="w-full">
                                                    Ver detalles
                                                </Button>
                                            </Link>
                                            <Link href={`/tournaments?game_id=${game.id}`} className="flex-1">
                                                <Button className="w-full">
                                                    Ver torneos
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground mb-4">
                                            No hay torneos disponibles para este juego
                                        </p>
                                        <Link href={`/games/${game.slug}`}>
                                            <Button variant="outline">
                                                Ver detalles
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {games.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <GamepadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No hay juegos disponibles</h3>
                            <p className="text-muted-foreground">
                                Actualmente no hay juegos registrados en el sistema.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
