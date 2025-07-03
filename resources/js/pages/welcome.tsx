import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { GamepadIcon, Trophy, Users, Calendar, ArrowRight } from 'lucide-react';

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
    tournaments_count?: number;
}

interface WelcomeProps extends SharedData {
    games: Game[];
}

export default function Welcome() {
    const { auth, games } = usePage<WelcomeProps>().props;

    return (
        <>
            <Head title="Vulca Torneos - Plataforma de Torneos TCG">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                {/* Header */}
                <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 dark:border-slate-700">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Trophy className="h-8 w-8 text-primary" />
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Vulca Torneos
                                </h1>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <Link href="/games" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                                    Juegos
                                </Link>
                                <Link href="/tournaments" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                                    Torneos
                                </Link>
                                
                                {auth.user ? (
                                    <div className="flex items-center space-x-2">
                                        {auth.user.role === 'admin' && (
                                            <Link href="/dashboard">
                                                <Button variant="outline" size="sm">
                                                    Panel Admin
                                                </Button>
                                            </Link>
                                        )}
                                        <Link href="/my-registrations">
                                            <Button size="sm">
                                                Mis Inscripciones
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Link href="/login">
                                            <Button variant="outline" size="sm">
                                                Iniciar Sesión
                                            </Button>
                                        </Link>
                                        <Link href="/register">
                                            <Button size="sm">
                                                Registrarse
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="py-20 px-4">
                    <div className="container mx-auto text-center">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                                Plataforma de Torneos <span className="text-primary">TCG</span>
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                                Únete a torneos de Trading Card Games, compite con otros jugadores y demuestra tus habilidades 
                                en los mejores juegos de cartas.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <Link href="/tournaments">
                                    <Button size="lg" className="px-8">
                                        Ver Torneos
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                {!auth.user && (
                                    <Link href="/register">
                                        <Button variant="outline" size="lg" className="px-8">
                                            Crear Cuenta
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Games Section */}
                <section className="py-16 px-4">
                    <div className="container mx-auto">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                                Juegos Destacados
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Explora los juegos TCG más populares con torneos activos
                            </p>
                        </div>

                        {games.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {games.map((game) => (
                                    <Card key={game.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                        <CardHeader>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="p-3 bg-primary/10 rounded-xl">
                                                    <GamepadIcon className="h-8 w-8 text-primary" />
                                                </div>
                                                <Badge variant="secondary">
                                                    {game.tournaments_count || 0} torneos
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-xl">{game.name}</CardTitle>
                                            {game.description && (
                                                <CardDescription className="line-clamp-2">
                                                    {game.description}
                                                </CardDescription>
                                            )}
                                        </CardHeader>
                                        
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                                                    <div className="flex items-center">
                                                        <Trophy className="h-4 w-4 mr-1" />
                                                        <span>Torneos activos</span>
                                                    </div>
                                                    <span className="font-semibold">{game.tournaments_count || 0}</span>
                                                </div>
                                                
                                                <Link href={`/games/${game.slug}`} className="block">
                                                    <Button className="w-full">
                                                        Ver Torneos
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <GamepadIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                                    No hay juegos disponibles
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Actualmente no hay juegos con torneos activos.
                                </p>
                            </div>
                        )}

                        <div className="text-center mt-12">
                            <Link href="/games">
                                <Button variant="outline" size="lg">
                                    Ver Todos los Juegos
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 px-4 bg-white dark:bg-slate-900">
                    <div className="container mx-auto">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                                ¿Por qué elegir Vulca Torneos?
                            </h3>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="text-center">
                                <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <Trophy className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                    Torneos Organizados
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Participa en torneos bien estructurados con reglas claras y premios atractivos.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="p-4 bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                    Comunidad Activa
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Únete a una comunidad de jugadores apasionados por los juegos de cartas.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                    Eventos Regulares
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Nuevos torneos cada semana en diferentes formatos y juegos.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                {!auth.user && (
                    <section className="py-16 px-4 bg-primary text-white">
                        <div className="container mx-auto text-center">
                            <h3 className="text-3xl font-bold mb-4">
                                ¿Listo para competir?
                            </h3>
                            <p className="text-xl mb-8 opacity-90">
                                Crea tu cuenta y únete a tu primer torneo hoy mismo.
                            </p>
                            <Link href="/register">
                                <Button size="lg" variant="secondary" className="px-8">
                                    Registrarse Ahora
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="py-8 px-4 bg-gray-900 text-white">
                    <div className="container mx-auto text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <Trophy className="h-6 w-6" />
                            <span className="text-lg font-semibold">Vulca Torneos</span>
                        </div>
                        <p className="text-gray-400">
                            © 2025 Vulca Torneos. Plataforma de torneos TCG.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
