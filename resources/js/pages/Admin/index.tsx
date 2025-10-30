import AdminLayout from '@/layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { ArrowUpRight, Calendar, Gamepad2, TrendingUp, Trophy, Users } from 'lucide-react';
import React from 'react';

const stats = [
    {
        title: 'Torneos activos',
        value: 12,
        change: '+3 este mes',
        trend: 'up',
        icon: Trophy,
    },
    {
        title: 'Juegos registrados',
        value: 8,
        change: '+2 nuevos',
        trend: 'up',
        icon: Gamepad2,
    },
    {
        title: 'Jugadores inscritos',
        value: 132,
        change: '+24 esta semana',
        trend: 'up',
        icon: Users,
    },
    {
        title: 'Eventos próximos',
        value: 3,
        change: 'En 7 días',
        trend: 'neutral',
        icon: Calendar,
    },
];

const quickActions = [
    {
        title: 'Crear Torneo',
        description: 'Organiza un nuevo torneo',
        href: '/admin/tournaments/create',
        icon: Trophy,
    },
    {
        title: 'Añadir Juego',
        description: 'Registra un nuevo juego',
        href: '/admin/games/create',
        icon: Gamepad2,
    },
    {
        title: 'Ver Inscripciones',
        description: 'Gestiona participantes',
        href: '/admin/registrations',
        icon: Users,
    },
    {
        title: 'Calendario',
        description: 'Planifica eventos',
        href: '/admin/calendar',
        icon: Calendar,
    },
];

const recentActivity = [
    {
        title: 'Nuevo torneo creado',
        description: 'Pokémon - Spring Championship',
        time: 'Hace 2 horas',
    },
    {
        title: '15 nuevas inscripciones',
        description: 'Yu Gi Oh - World Championship',
        time: 'Hace 5 horas',
    },
    {
        title: 'Juego actualizado',
        description: 'One Piece - Información actualizada',
        time: 'Hace 1 día',
    },
];

const Dashboard: React.FC = () => {
    return (
        <AdminLayout title="Dashboard" pageTitle="Vulca Torneos">
            <div className="space-y-6">
                {/* Header */}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={i}
                                className="group relative overflow-hidden rounded border border-border-primary bg-secondary p-5 shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-t-muted">{stat.title}</p>
                                        <div className="mt-2 flex items-baseline gap-2">
                                            <h3 className="text-3xl font-bold text-t-primary">{stat.value}</h3>
                                            {stat.trend === 'up' && <TrendingUp className="h-4 w-4 text-success" strokeWidth={2} />}
                                        </div>
                                        <p className="mt-1 text-xs text-t-muted">{stat.change}</p>
                                    </div>
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-accent-subtle text-accent">
                                        <Icon className="h-5 w-5" strokeWidth={2} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions & Recent Activity */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Quick Actions - 2 columns */}
                    <div className="lg:col-span-2">
                        <div className="rounded border border-border-primary bg-secondary p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-t-primary">Acciones Rápidas</h2>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {quickActions.map((action, i) => {
                                    const Icon = action.icon;
                                    return (
                                        <Link
                                            key={i}
                                            href={action.href}
                                            className="group flex items-start gap-4 rounded border border-border-primary bg-tertiary p-4 shadow-sm transition-all hover:border-accent hover:shadow-md"
                                        >
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-accent-subtle text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                                                <Icon className="h-5 w-5" strokeWidth={2} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-sm font-semibold text-t-primary group-hover:text-accent">{action.title}</h3>
                                                    <ArrowUpRight
                                                        className="h-4 w-4 text-t-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                                                        strokeWidth={2}
                                                    />
                                                </div>
                                                <p className="mt-0.5 text-xs text-t-muted">{action.description}</p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity - 1 column */}
                    <div className="lg:col-span-1">
                        <div className="rounded border border-border-primary bg-secondary p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-t-primary">Actividad Reciente</h2>
                            <div className="space-y-4">
                                {recentActivity.map((activity, i) => (
                                    <div key={i} className="group relative">
                                        <div className="flex gap-3">
                                            <div className="relative mt-1 flex h-2 w-2 shrink-0">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                                                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-t-primary">{activity.title}</p>
                                                <p className="mt-0.5 text-xs text-t-secondary">{activity.description}</p>
                                                <p className="mt-1 text-xs text-t-muted">{activity.time}</p>
                                            </div>
                                        </div>
                                        {i < recentActivity.length - 1 && <div className="mt-4 ml-1 h-px w-full bg-border-primary"></div>}
                                    </div>
                                ))}
                            </div>
                            <button className="mt-4 w-full rounded border border-border-primary bg-tertiary py-2 text-sm font-medium text-t-secondary transition-all hover:bg-highlight hover:text-t-primary">
                                Ver todo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Overview Chart Placeholder */}
                <div className="rounded border border-border-primary bg-secondary p-6 shadow-sm">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-t-primary">Resumen de Inscripciones</h2>
                            <p className="text-sm text-t-muted">Últimos 30 días</p>
                        </div>
                        <select className="w-full rounded border border-border-primary bg-tertiary px-3 py-2 text-sm text-t-secondary shadow-sm transition-colors hover:bg-highlight focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary focus:outline-none sm:w-auto">
                            <option>Últimos 7 días</option>
                            <option>Últimos 30 días</option>
                            <option>Últimos 3 meses</option>
                        </select>
                    </div>
                    <div className="flex h-64 items-center justify-center rounded border border-dashed border-border-primary bg-tertiary">
                        <div className="text-center">
                            <TrendingUp className="mx-auto h-12 w-12 text-t-muted" strokeWidth={1.5} />
                            <p className="mt-2 text-sm text-t-muted">Gráfico de estadísticas próximamente</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
