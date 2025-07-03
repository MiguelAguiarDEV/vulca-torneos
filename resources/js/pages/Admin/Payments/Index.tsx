import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Check, X, DollarSign, User, Calendar, Filter, Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel Administrador',
        href: '/admin/dashboard',
    },
    {
        title: 'Gestión de Pagos',
        href: '/admin/payments',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
}

interface Game {
    id: number;
    name: string;
    slug: string;
}

interface Tournament {
    id: number;
    name: string;
    slug: string;
    game: Game;
}

interface Registration {
    id: number;
    amount: number;
    payment_method: string;
    payment_status: string;
    payment_notes?: string;
    created_at: string;
    user: User;
    tournament: Tournament;
}

interface AdminPaymentsIndexProps {
    payments: {
        data: Registration[];
        links: any;
        meta: any;
    };
    games: Game[];
    tournaments: Tournament[];
    filters: {
        game_id?: string;
        tournament_id?: string;
        payment_method?: string;
        search?: string;
    };
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getPaymentMethodBadge(method: string) {
    const variants = {
        cash: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        transfer: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        card: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };
    
    return variants[method as keyof typeof variants] || variants.cash;
}

function getPaymentMethodText(method: string) {
    const texts = {
        cash: 'Efectivo',
        transfer: 'Transferencia',
        card: 'Tarjeta'
    };
    
    return texts[method as keyof typeof texts] || method;
}

export default function AdminPaymentsIndex({ payments, games, tournaments, filters }: AdminPaymentsIndexProps) {
    const [selectedPayment, setSelectedPayment] = useState<Registration | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    
    const { data, setData, patch, processing } = useForm({
        payment_notes: '',
    });

    const filterForm = useForm({
        game_id: filters.game_id || '',
        tournament_id: filters.tournament_id || '',
        payment_method: filters.payment_method || '',
        search: filters.search || '',
    });

    const handleConfirmPayment = (payment: Registration) => {
        if (confirm(`¿Confirmar el pago de ${payment.user.name} por $${payment.amount}?`)) {
            patch(`/admin/payments/${payment.id}/confirm`, {
                onSuccess: () => {
                    setSelectedPayment(null);
                    setData('payment_notes', '');
                }
            });
        }
    };

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        filterForm.get('/admin/payments', {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        filterForm.reset();
        router.get('/admin/payments');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Pagos" />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pagos Pendientes</h1>
                        <p className="text-muted-foreground">
                            Confirma los pagos pendientes de los usuarios
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros
                    </Button>
                </div>

                {showFilters && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Filtros</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleFilter} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="search">Buscar</Label>
                                        <Input
                                            id="search"
                                            placeholder="Nombre de usuario..."
                                            value={filterForm.data.search}
                                            onChange={(e) => filterForm.setData('search', e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="game_id">Juego</Label>
                                        <Select
                                            value={filterForm.data.game_id}
                                            onValueChange={(value) => filterForm.setData('game_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Todos los juegos" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Todos los juegos</SelectItem>
                                                {games.map((game) => (
                                                    <SelectItem key={game.id} value={game.id.toString()}>
                                                        {game.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="tournament_id">Torneo</Label>
                                        <Select
                                            value={filterForm.data.tournament_id}
                                            onValueChange={(value) => filterForm.setData('tournament_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Todos los torneos" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Todos los torneos</SelectItem>
                                                {tournaments.map((tournament) => (
                                                    <SelectItem key={tournament.id} value={tournament.id.toString()}>
                                                        {tournament.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="payment_method">Método de Pago</Label>
                                        <Select
                                            value={filterForm.data.payment_method}
                                            onValueChange={(value) => filterForm.setData('payment_method', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Todos los métodos" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Todos los métodos</SelectItem>
                                                <SelectItem value="cash">Efectivo</SelectItem>
                                                <SelectItem value="transfer">Transferencia</SelectItem>
                                                <SelectItem value="card">Tarjeta</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                
                                <div className="flex space-x-2">
                                    <Button type="submit" disabled={filterForm.processing}>
                                        <Search className="mr-2 h-4 w-4" />
                                        Filtrar
                                    </Button>
                                    <Button type="button" variant="outline" onClick={clearFilters}>
                                        Limpiar
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {payments.data.length > 0 ? (
                    <div className="grid gap-4">
                        {payments.data.map((payment) => (
                            <Card key={payment.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-4 mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">{payment.user.name}</span>
                                                </div>
                                                <Badge className={getPaymentMethodBadge(payment.payment_method)}>
                                                    {getPaymentMethodText(payment.payment_method)}
                                                </Badge>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                                <div>
                                                    <span className="font-medium">Torneo:</span> {payment.tournament.name}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Juego:</span> {payment.tournament.game.name}
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{formatDate(payment.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <div className="flex items-center space-x-1">
                                                    <DollarSign className="h-4 w-4 text-green-600" />
                                                    <span className="text-lg font-bold">${payment.amount}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => setSelectedPayment(payment)}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-medium mb-2">No hay pagos pendientes</h3>
                        <p className="text-muted-foreground">
                            Todos los pagos han sido confirmados o no hay registros pendientes.
                        </p>
                    </div>
                )}

                {/* Confirm Payment Modal */}
                {selectedPayment && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <Card className="w-full max-w-md">
                            <CardHeader>
                                <CardTitle>Confirmar Pago</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <p><strong>Usuario:</strong> {selectedPayment.user.name}</p>
                                    <p><strong>Torneo:</strong> {selectedPayment.tournament.name}</p>
                                    <p><strong>Monto:</strong> ${selectedPayment.amount}</p>
                                    <p><strong>Método:</strong> {getPaymentMethodText(selectedPayment.payment_method)}</p>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="payment_notes">Notas (opcional)</Label>
                                    <Textarea
                                        id="payment_notes"
                                        value={data.payment_notes}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('payment_notes', e.target.value)}
                                        placeholder="Agrega notas sobre el pago..."
                                        rows={3}
                                    />
                                </div>
                                
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setSelectedPayment(null)}
                                        className="flex-1"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={() => handleConfirmPayment(selectedPayment)}
                                        disabled={processing}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                        <Check className="mr-2 h-4 w-4" />
                                        {processing ? 'Confirmando...' : 'Confirmar'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
