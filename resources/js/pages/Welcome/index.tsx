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

            <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-secondary-dark via-secondary to-secondary-dark">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
                </div>

                <div className="relative z-10 flex min-h-dvh flex-col items-center justify-between px-6 py-8 text-center">
                    {/* Header */}
                    <div className="flex w-full max-w-7xl items-center justify-between">
                        <h1 className="text-2xl font-bold text-white drop-shadow">Vulca Comics</h1>

                        {!user ? (
                            <div className="flex gap-3">
                                <Link
                                    href={route('login')}
                                    className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-text-primary transition-all hover:border-primary hover:bg-primary/20"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-secondary shadow-lg hover:bg-primary-dark"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href={route(isAdmin ? 'admin.dashboard' : 'welcome')}
                                    className="rounded-lg border border-primary/40 px-4 py-2 text-sm font-semibold text-text-primary transition-all hover:border-primary hover:bg-primary/20"
                                >
                                    {isAdmin ? 'Ir al panel' : 'Inicio'}
                                </Link>
                                <button
                                    onClick={() => post(route('logout'))}
                                    disabled={processing}
                                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-secondary shadow-lg hover:bg-primary-dark disabled:opacity-70"
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
                        <p className="max-w-2xl text-lg text-text-primary/80">
                            Descubre un mundo lleno de torneos, cartas y héroes. Crea tu cuenta, participa en eventos y compite junto a otros fans.
                        </p>

                        <div className="mt-8 flex gap-4">
                            {!user ? (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-secondary shadow-lg transition-all hover:scale-[1.02] hover:bg-primary-dark"
                                    >
                                        Crear Cuenta
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="rounded-lg border border-primary/40 px-6 py-3 text-lg font-semibold text-text-primary transition-all hover:border-primary hover:bg-primary/20"
                                    >
                                        Ya tengo cuenta
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route(isAdmin ? 'admin.dashboard' : 'welcome')}
                                        className="rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-secondary shadow-lg transition-all hover:scale-[1.02] hover:bg-primary-dark"
                                    >
                                        {isAdmin ? 'Ir al panel' : 'Seguir navegando'}
                                    </Link>
                                    <button
                                        onClick={() => post(route('logout'))}
                                        disabled={processing}
                                        className="rounded-lg border border-primary/40 px-6 py-3 text-lg font-semibold text-text-primary transition-all hover:border-primary hover:bg-primary/20 disabled:opacity-70"
                                    >
                                        Cerrar sesión
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <footer className="mt-10 text-sm text-text-primary/60">
                        © {new Date().getFullYear()} Vulca Comics — Todos los derechos reservados
                    </footer>
                </div>
            </div>
        </>
    );
};

export default Welcome;
