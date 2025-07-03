import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel Administrador',
        href: '/admin/dashboard',
    },
    {
        title: 'Gestión de Torneos',
        href: '/admin/tournaments',
    },
    {
        title: 'Crear Torneo',
        href: '/admin/tournaments/create',
    },
];

interface Game {
    id: number;
    name: string;
    slug: string;
}

interface AdminTournamentsCreateProps {
    games: Game[];
}

export default function AdminTournamentsCreate({ games }: AdminTournamentsCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        game_id: '',
        start_date: '',
        end_date: '',
        max_participants: '',
        entry_fee: '',
        status: 'draft',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/tournaments');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Torneo" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Crear Nuevo Torneo</h1>
                        <p className="text-muted-foreground">
                            Agrega un nuevo torneo a la plataforma
                        </p>
                    </div>
                    <Link href="/admin/tournaments">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Información del Torneo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre del Torneo</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ej: Torneo Nacional de Yu-Gi-Oh!"
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="game_id">Juego</Label>
                                    <Select value={data.game_id} onValueChange={(value) => setData('game_id', value)}>
                                        <SelectTrigger className={errors.game_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Selecciona un juego" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {games.map((game) => (
                                                <SelectItem key={game.id} value={game.id.toString()}>
                                                    {game.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.game_id && (
                                        <p className="text-red-500 text-sm">{errors.game_id}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                    placeholder="Describe el torneo..."
                                    rows={4}
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm">{errors.description}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Fecha de Inicio</Label>
                                    <Input
                                        id="start_date"
                                        type="datetime-local"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className={errors.start_date ? 'border-red-500' : ''}
                                    />
                                    {errors.start_date && (
                                        <p className="text-red-500 text-sm">{errors.start_date}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="end_date">Fecha de Fin</Label>
                                    <Input
                                        id="end_date"
                                        type="datetime-local"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        className={errors.end_date ? 'border-red-500' : ''}
                                    />
                                    {errors.end_date && (
                                        <p className="text-red-500 text-sm">{errors.end_date}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="max_participants">Máximo Participantes</Label>
                                    <Input
                                        id="max_participants"
                                        type="number"
                                        min="1"
                                        value={data.max_participants}
                                        onChange={(e) => setData('max_participants', e.target.value)}
                                        placeholder="32"
                                        className={errors.max_participants ? 'border-red-500' : ''}
                                    />
                                    {errors.max_participants && (
                                        <p className="text-red-500 text-sm">{errors.max_participants}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="entry_fee">Precio de Inscripción</Label>
                                    <Input
                                        id="entry_fee"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.entry_fee}
                                        onChange={(e) => setData('entry_fee', e.target.value)}
                                        placeholder="10.00"
                                        className={errors.entry_fee ? 'border-red-500' : ''}
                                    />
                                    {errors.entry_fee && (
                                        <p className="text-red-500 text-sm">{errors.entry_fee}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Estado</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Borrador</SelectItem>
                                            <SelectItem value="active">Activo</SelectItem>
                                            <SelectItem value="completed">Finalizado</SelectItem>
                                            <SelectItem value="cancelled">Cancelado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-red-500 text-sm">{errors.status}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Link href="/admin/tournaments">
                                    <Button variant="outline">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Creando...' : 'Crear Torneo'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
