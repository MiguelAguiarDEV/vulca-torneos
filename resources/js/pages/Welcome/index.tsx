import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { route } from 'ziggy-js';

const Welcome: React.FC = () => {
    return (
        <>
            <Head title="Bienvenido - Vulca Torneos" />

            <div className="from-secondary via-secondary to-primary relative min-h-dvh overflow-hidden bg-gradient-to-br">
                {/* Luces decorativas */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="bg-accent/10 absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl" />
                    <div className="bg-accent/10 absolute -right-32 -bottom-32 h-96 w-96 rounded-full blur-3xl" />
                </div>

                {/* Contenido principal */}
                <div className="relative z-10 flex min-h-dvh flex-col items-center justify-between px-6 py-8 text-center">
                    {/* HEADER */}
                    <div className="flex w-full max-w-7xl items-center justify-between">
                        <h1 className="text-t-primary text-2xl font-bold drop-shadow">Vulca Torneos</h1>

                        <div className="flex gap-3">
                            <Link
                                href={route('login')}
                                className="bg-accent hover:bg-accent-hover shadow-accent-lg rounded-lg px-5 py-2 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                            >
                                Iniciar Sesión
                            </Link>
                        </div>
                    </div>

                    {/* HERO */}
                    <div className="flex flex-grow flex-col items-center justify-center">
                        <h2 className="text-t-primary mb-4 text-5xl font-extrabold drop-shadow-lg">
                            ¡Bienvenido a <span className="text-accent">Vulca Torneos</span>!
                        </h2>
                        <p className="text-t-secondary max-w-2xl text-lg">
                            Organiza, compite y disfruta de los mejores torneos. Regístrate, administra tus jugadores y sigue tus partidas fácilmente.
                        </p>

                        <div className="mt-8">
                            <Link
                                href={route('login')}
                                className="bg-accent hover:bg-accent-hover shadow-accent-lg rounded-lg px-8 py-3 text-lg font-semibold text-white transition-all hover:scale-[1.02]"
                            >
                                Iniciar Sesión
                            </Link>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <footer className="text-t-muted mt-10 text-sm">
                        © {new Date().getFullYear()} Vulca Torneos — Todos los derechos reservados
                    </footer>
                </div>
            </div>
        </>
    );
};

export default Welcome;
