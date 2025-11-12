// pages/Admin/Dashboard/Index.tsx - OPTIMIZADO
import { GameForm } from '@/components/Admin/Games/GameForm';
import { FormModal } from '@/components/Admin/Shared/FormModal';
import { TournamentForm } from '@/components/Admin/Tournaments/TournamentForm';
import { useCRUD } from '@/hooks/useCRUD';
import { useFormModal } from '@/hooks/useFormModal';
import { useImagePreview } from '@/hooks/useImagePreview';
import AdminLayout from '@/layouts/AdminLayout';
import { DEFAULT_FORM_VALUES, Game, GameFormValues, TournamentFormValues } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowUpRight, Calendar, Gamepad2, TrendingUp, Trophy, Users } from 'lucide-react';
import React from 'react';

interface DashboardProps {
    games?: Game[];
}

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

const Dashboard: React.FC<DashboardProps> = ({ games = [] }) => {
    // ============================================
    // HELPERS: Construir FormData
    // ============================================
    const buildGameFormData = (values: GameFormValues, imageFile: File | null): FormData => {
        const data = new FormData();
        data.append('name', values.name.trim());
        data.append('description', values.description.trim() || '');
        if (imageFile) {
            data.append('image', imageFile);
        }
        return data;
    };

    const buildTournamentFormData = (values: TournamentFormValues, imageFile: File | null): FormData => {
        const data = new FormData();

        // Campos requeridos
        data.append('name', values.name.trim());
        data.append('description', values.description.trim() || '');
        data.append('game_id', String(values.game_id));
        data.append('start_date', values.start_date);
        data.append('status', values.status);

        // Campos opcionales
        if (values.end_date) data.append('end_date', values.end_date);
        if (values.registration_start) data.append('registration_start', values.registration_start);
        if (values.registration_end) data.append('registration_end', values.registration_end);
        if (values.entry_fee) data.append('entry_fee', values.entry_fee);

        // Límite de inscripciones
        data.append('has_registration_limit', values.has_registration_limit ? '1' : '0');
        if (values.has_registration_limit && values.registration_limit) {
            data.append('registration_limit', values.registration_limit);
        }

        // Imagen
        if (imageFile) data.append('image', imageFile);

        return data;
    };
    // ============================================
    // CRUD PARA JUEGOS
    // ============================================
    const gamesCRUD = useCRUD({
        resourceName: 'juego',
        routePrefix: 'admin.games',
    });

    const createGameModal = useFormModal<GameFormValues>({
        initialValues: { name: '', description: '' },
        onSubmit: (values) => {
            const data = new FormData();
            data.append('name', values.name.trim());
            data.append('description', values.description.trim() || '');
            if (createGameImage.file) {
                data.append('image', createGameImage.file);
            }
            gamesCRUD.create(data, () => {
                createGameModal.close();
                createGameImage.reset();
            });
        },
    });
    const createGameImage = useImagePreview();

    // ============================================
    // CRUD PARA TORNEOS
    // ============================================
    const tournamentsCRUD = useCRUD({
        resourceName: 'torneo',
        routePrefix: 'admin.tournaments',
    });

    const createTournamentModal = useFormModal<TournamentFormValues>({
        initialValues: DEFAULT_FORM_VALUES.tournament,
        onSubmit: (values) => {
            const data = new FormData();

            // Campos requeridos
            data.append('name', values.name.trim());
            data.append('description', values.description.trim() || '');
            data.append('game_id', String(values.game_id));
            data.append('start_date', values.start_date);
            data.append('status', values.status);

            // Campos opcionales
            if (values.end_date) {
                data.append('end_date', values.end_date);
            }
            if (values.registration_start) {
                data.append('registration_start', values.registration_start);
            }
            if (values.registration_end) {
                data.append('registration_end', values.registration_end);
            }
            if (values.entry_fee) {
                data.append('entry_fee', values.entry_fee);
            }

            // Límite de inscripciones
            data.append('has_registration_limit', values.has_registration_limit ? '1' : '0');
            if (values.has_registration_limit && values.registration_limit) {
                data.append('registration_limit', values.registration_limit);
            }

            // Imagen
            if (createTournamentImage.file) {
                data.append('image', createTournamentImage.file);
            }

            tournamentsCRUD.create(data, () => {
                createTournamentModal.close();
                createTournamentImage.reset();
            });
        },
    });
    const createTournamentImage = useImagePreview();

    // ============================================
    // ACCIONES RÁPIDAS ACTUALIZADAS
    // ============================================
    const quickActions = [
        {
            title: 'Crear Torneo',
            description: 'Organiza un nuevo torneo',
            icon: Trophy,
            onClick: () => createTournamentModal.open(),
        },
        {
            title: 'Añadir Juego',
            description: 'Registra un nuevo juego',
            icon: Gamepad2,
            onClick: () => createGameModal.open(),
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

    return (
        <AdminLayout title="Dashboard" pageTitle="Vulca Torneos">
            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={i}
                                className="group border-border-primary bg-secondary relative overflow-hidden rounded border p-5 shadow-sm transition-all hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-t-muted text-sm font-medium">{stat.title}</p>
                                        <div className="mt-2 flex items-baseline gap-2">
                                            <h3 className="text-t-primary text-3xl font-bold">{stat.value}</h3>
                                            {stat.trend === 'up' && <TrendingUp className="text-success h-4 w-4" strokeWidth={2} />}
                                        </div>
                                        <p className="text-t-muted mt-1 text-xs">{stat.change}</p>
                                    </div>
                                    <div className="bg-accent-subtle text-accent flex h-10 w-10 shrink-0 items-center justify-center rounded">
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
                        <div className="border-border-primary bg-secondary rounded border p-6 shadow-sm">
                            <h2 className="text-t-primary mb-4 text-lg font-semibold">Acciones Rápidas</h2>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {quickActions.map((action, i) => {
                                    const Icon = action.icon;

                                    // Si tiene onClick, es un botón que abre modal
                                    if (action.onClick) {
                                        return (
                                            <button
                                                key={i}
                                                onClick={action.onClick}
                                                className="group border-border-primary bg-tertiary hover:border-accent flex items-start gap-4 rounded border p-4 shadow-sm transition-all hover:shadow-md"
                                            >
                                                <div className="bg-accent-subtle text-accent group-hover:bg-accent flex h-10 w-10 shrink-0 items-center justify-center rounded transition-colors group-hover:text-white">
                                                    <Icon className="h-5 w-5" strokeWidth={2} />
                                                </div>
                                                <div className="min-w-0 flex-1 text-left">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-t-primary group-hover:text-accent text-sm font-semibold">
                                                            {action.title}
                                                        </h3>
                                                        <ArrowUpRight
                                                            className="text-t-muted h-4 w-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                                                            strokeWidth={2}
                                                        />
                                                    </div>
                                                    <p className="text-t-muted mt-0.5 text-xs">{action.description}</p>
                                                </div>
                                            </button>
                                        );
                                    }

                                    // Si tiene href, es un Link de Inertia
                                    return (
                                        <Link
                                            key={i}
                                            href={action.href!}
                                            className="group border-border-primary bg-tertiary hover:border-accent flex items-start gap-4 rounded border p-4 shadow-sm transition-all hover:shadow-md"
                                        >
                                            <div className="bg-accent-subtle text-accent group-hover:bg-accent flex h-10 w-10 shrink-0 items-center justify-center rounded transition-colors group-hover:text-white">
                                                <Icon className="h-5 w-5" strokeWidth={2} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-t-primary group-hover:text-accent text-sm font-semibold">{action.title}</h3>
                                                    <ArrowUpRight
                                                        className="text-t-muted h-4 w-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                                                        strokeWidth={2}
                                                    />
                                                </div>
                                                <p className="text-t-muted mt-0.5 text-xs">{action.description}</p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity - 1 column */}
                    <div className="lg:col-span-1">
                        <div className="border-border-primary bg-secondary rounded border p-6 shadow-sm">
                            <h2 className="text-t-primary mb-4 text-lg font-semibold">Actividad Reciente</h2>
                            <div className="space-y-4">
                                {recentActivity.map((activity, i) => (
                                    <div key={i} className="group relative">
                                        <div className="flex gap-3">
                                            <div className="relative mt-1 flex h-2 w-2 shrink-0">
                                                <span className="bg-accent absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                                                <span className="bg-accent relative inline-flex h-2 w-2 rounded-full"></span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-t-primary text-sm font-medium">{activity.title}</p>
                                                <p className="text-t-secondary mt-0.5 text-xs">{activity.description}</p>
                                                <p className="text-t-muted mt-1 text-xs">{activity.time}</p>
                                            </div>
                                        </div>
                                        {i < recentActivity.length - 1 && <div className="bg-border-primary mt-4 ml-1 h-px w-full"></div>}
                                    </div>
                                ))}
                            </div>
                            <button className="border-border-primary bg-tertiary text-t-secondary hover:bg-highlight hover:text-t-primary mt-4 w-full rounded border py-2 text-sm font-medium transition-all">
                                Ver todo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Overview Chart Placeholder */}
                <div className="border-border-primary bg-secondary rounded border p-6 shadow-sm">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-t-primary text-lg font-semibold">Resumen de Inscripciones</h2>
                            <p className="text-t-muted text-sm">Últimos 30 días</p>
                        </div>
                        <select className="border-border-primary bg-tertiary text-t-secondary hover:bg-highlight focus:ring-accent focus:ring-offset-primary w-full rounded border px-3 py-2 text-sm shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none sm:w-auto">
                            <option>Últimos 7 días</option>
                            <option>Últimos 30 días</option>
                            <option>Últimos 3 meses</option>
                        </select>
                    </div>
                    <div className="border-border-primary bg-tertiary flex h-64 items-center justify-center rounded border border-dashed">
                        <div className="text-center">
                            <TrendingUp className="text-t-muted mx-auto h-12 w-12" strokeWidth={1.5} />
                            <p className="text-t-muted mt-2 text-sm">Gráfico de estadísticas próximamente</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ============================================ */}
            {/* MODALES DE CREACIÓN */}
            {/* ============================================ */}

            {/* Modal Crear Juego */}
            <FormModal
                show={createGameModal.isOpen}
                title="Crear Nuevo Juego"
                onClose={createGameModal.close}
                onSubmit={createGameModal.handleSubmit}
                submitText="Crear Juego"
            >
                <GameForm
                    values={createGameModal.values}
                    errors={createGameModal.errors}
                    onChange={createGameModal.setValue}
                    image={createGameImage}
                />
            </FormModal>

            {/* Modal Crear Torneo */}
            <FormModal
                show={createTournamentModal.isOpen}
                title="Crear Nuevo Torneo"
                onClose={createTournamentModal.close}
                onSubmit={createTournamentModal.handleSubmit}
                submitText="Crear Torneo"
            >
                <TournamentForm
                    values={createTournamentModal.values}
                    errors={createTournamentModal.errors}
                    onChange={createTournamentModal.setValue}
                    image={createTournamentImage}
                    games={games}
                />
            </FormModal>
        </AdminLayout>
    );
};

export default Dashboard;
