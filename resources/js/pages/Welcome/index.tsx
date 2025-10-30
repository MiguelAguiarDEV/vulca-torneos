import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import { route } from 'ziggy-js';

const Welcome: React.FC = () => {
    const { props } = usePage();
    const user = (props as any)?.auth?.user || null;
    const isAdmin = user && (user.role === 'admin' || user.role === 'ADMIN' || user.is_admin);

    const { post, processing } = useForm({});

    return (
        <>
            <Head title="Bienvenido - Vulca Comics" />

            <div className="from-secondary-dark via-secondary to-secondary-dark relative min-h-dvh overflow-hidden bg-gradient-to-br">
                <div className="pointer-events-none absolute inset-0">
                    <div className="bg-primary/10 absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl" />
                    <div className="bg-primary/10 absolute -right-32 -bottom-32 h-96 w-96 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 flex min-h-dvh flex-col items-center justify-between px-6 py-8 text-center">
                    {/* Header */}
                    <div className="flex w-full max-w-7xl items-center justify-between">
                        <h1 className="text-2xl font-bold text-white drop-shadow">Vulca Comics</h1>

                        {!user ? (
                            <div className="flex gap-3">
                                <Link
                                    href={route('login')}
                                    className="border-primary/30 bg-primary/10 text-text-primary hover:border-primary hover:bg-primary/20 rounded-lg border px-4 py-2 text-sm font-medium transition-all"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="bg-primary text-secondary hover:bg-primary-dark rounded-lg px-4 py-2 text-sm font-semibold shadow-lg"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href={route(isAdmin ? 'admin.dashboard' : 'welcome')}
                                    className="border-primary/40 text-text-primary hover:border-primary hover:bg-primary/20 rounded-lg border px-4 py-2 text-sm font-semibold transition-all"
                                >
                                    {isAdmin ? 'Ir al panel' : 'Inicio'}
                                </Link>
                                <button
                                    onClick={() => post(route('logout'))}
                                    disabled={processing}
                                    className="bg-primary text-secondary hover:bg-primary-dark rounded-lg px-4 py-2 text-sm font-semibold shadow-lg disabled:opacity-70"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Hero */}
                    <div className="flex flex-grow flex-col items-center justify-center">
                        <h2 className="mb-4 text-5xl font-extrabold text-white drop-shadow-lg">
                            ¡Bienvenido a <span className="text-primary">Vulca Comics</span>!
                        </h2>
                        <p className="text-text-primary/80 max-w-2xl text-lg">
                            Descubre un mundo lleno de torneos, cartas y héroes. Crea tu cuenta, participa en eventos y compite junto a otros fans.
                        </p>

                        <div className="mt-8 flex gap-4">
                            {!user ? (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="bg-primary text-secondary hover:bg-primary-dark rounded-lg px-6 py-3 text-lg font-semibold shadow-lg transition-all hover:scale-[1.02]"
                                    >
                                        Crear Cuenta
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="border-primary/40 text-text-primary hover:border-primary hover:bg-primary/20 rounded-lg border px-6 py-3 text-lg font-semibold transition-all"
                                    >
                                        Ya tengo cuenta
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route(isAdmin ? 'admin.dashboard' : 'welcome')}
                                        className="bg-primary text-secondary hover:bg-primary-dark rounded-lg px-6 py-3 text-lg font-semibold shadow-lg transition-all hover:scale-[1.02]"
                                    >
                                        {isAdmin ? 'Ir al panel' : 'Seguir navegando'}
                                    </Link>
                                    <button
                                        onClick={() => post(route('logout'))}
                                        disabled={processing}
                                        className="border-primary/40 text-text-primary hover:border-primary hover:bg-primary/20 rounded-lg border px-6 py-3 text-lg font-semibold transition-all disabled:opacity-70"
                                    >
                                        Cerrar sesión
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <footer className="text-text-primary/60 mt-10 text-sm">
                        © {new Date().getFullYear()} Vulca Comics — Todos los derechos reservados
                    </footer>
                </div>
            </div>
        </>
    );
};

export default Welcome;
