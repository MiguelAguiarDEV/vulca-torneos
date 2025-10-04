import AdminLayout from '@/layouts/AdminLayout';
import { Calendar, Gamepad2, Rocket, Trophy, Users } from 'lucide-react';
import React from 'react';

const stats = [
    {
        title: 'Torneos activos',
        value: 12,
        icon: Trophy,
        color: 'text-primary',
        bg: 'from-primary/20 to-primary/10',
    },
    {
        title: 'Juegos registrados',
        value: 8,
        icon: Gamepad2,
        color: 'text-success',
        bg: 'from-success/20 to-success/10',
    },
    {
        title: 'Jugadores inscritos',
        value: 132,
        icon: Users,
        color: 'text-accent',
        bg: 'from-accent/20 to-accent/10',
    },
    {
        title: 'Eventos próximos',
        value: 3,
        icon: Calendar,
        color: 'text-warning',
        bg: 'from-warning/20 to-warning/10',
    },
];

const Dashboard: React.FC = () => {
    return (
        <AdminLayout title="Dashboard" pageTitle="Vulca Torneos">
            {/* Contenedor principal */}
            <div className="space-y-8">
                {/* Header */}
                <div className="rounded-lg border-2 border-primary/30 bg-gradient-to-br from-secondary-dark via-secondary to-secondary-light p-8 shadow-lg backdrop-blur-sm">
                    <h1 className="mb-3 text-4xl font-bold text-primary drop-shadow-lg">Panel de Control</h1>
                    <p className="text-lg text-text-primary/80">
                        Bienvenido al sistema de administración de <span className="font-semibold text-primary">Vulca Torneos</span>
                    </p>
                    <div className="mt-6 flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-4 py-3 text-primary shadow-sm backdrop-blur">
                        <Rocket className="h-5 w-5" />
                        <p className="font-medium">Sistema listo para gestionar torneos épicos</p>
                    </div>
                </div>

                {/* Estadísticas principales */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={i}
                                className={`group relative overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br ${stat.bg} p-6 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:border-primary hover:shadow-2xl`}
                            >
                                {/* Brillo decorativo */}
                                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                    <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-text-primary/70">{stat.title}</p>
                                        <h3 className="mt-2 text-3xl font-bold text-white">{stat.value}</h3>
                                    </div>
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/80 ${stat.color} shadow-lg backdrop-blur-sm`}
                                    >
                                        <Icon className="h-6 w-6" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Accesos rápidos */}
                <div className="rounded-lg border-2 border-primary/20 bg-secondary/95 p-6 shadow-lg backdrop-blur-sm">
                    <h2 className="mb-4 text-2xl font-semibold text-primary">Accesos Rápidos</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <a
                            href="/admin/games"
                            className="flex items-center gap-3 rounded-lg border border-primary/20 bg-secondary-dark/80 px-4 py-3 text-text-primary transition-all duration-300 hover:scale-[1.02] hover:border-primary hover:text-primary"
                        >
                            <Gamepad2 className="h-5 w-5" />
                            <span>Gestionar Juegos</span>
                        </a>
                        <a
                            href="/admin/tournaments"
                            className="flex items-center gap-3 rounded-lg border border-primary/20 bg-secondary-dark/80 px-4 py-3 text-text-primary transition-all duration-300 hover:scale-[1.02] hover:border-primary hover:text-primary"
                        >
                            <Trophy className="h-5 w-5" />
                            <span>Ver Torneos</span>
                        </a>
                        <a
                            href="/admin/registrations"
                            className="flex items-center gap-3 rounded-lg border border-primary/20 bg-secondary-dark/80 px-4 py-3 text-text-primary transition-all duration-300 hover:scale-[1.02] hover:border-primary hover:text-primary"
                        >
                            <Users className="h-5 w-5" />
                            <span>Ver Inscripciones</span>
                        </a>
                        <a
                            href="/admin/settings"
                            className="flex items-center gap-3 rounded-lg border border-primary/20 bg-secondary-dark/80 px-4 py-3 text-text-primary transition-all duration-300 hover:scale-[1.02] hover:border-primary hover:text-primary"
                        >
                            <Calendar className="h-5 w-5" />
                            <span>Eventos</span>
                        </a>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
