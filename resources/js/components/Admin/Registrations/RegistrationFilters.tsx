// components/Admin/Registrations/RegistrationFilters.tsx
import type { Tournament } from '@/types';
import { Search, XCircle } from 'lucide-react';

interface RegistrationFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    paymentStatusFilter: string;
    onPaymentStatusChange: (value: string) => void;
    gameFilter: string;
    onGameChange: (value: string) => void;
    tournamentFilter: string;
    onTournamentChange: (value: string) => void;
    tournaments: Tournament[];
    onClearFilters: () => void;
    totalCount: number;
    filteredCount: number;
}

export function RegistrationFilters({
    searchTerm,
    onSearchChange,
    paymentStatusFilter,
    onPaymentStatusChange,
    gameFilter,
    onGameChange,
    tournamentFilter,
    onTournamentChange,
    tournaments,
    onClearFilters,
    totalCount,
    filteredCount,
}: RegistrationFiltersProps) {
    const games = Array.from(new Map(tournaments.map((t) => [t.game.id, t.game])).values());

    return (
        <div className="border-border-primary bg-secondary mb-8 rounded-xl border p-5 shadow-sm">
            {/* Campo de búsqueda */}
            <div className="mb-5">
                <label className="text-t-primary mb-2 block text-sm font-medium">Buscar inscripciones</label>
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar por nombre, email o torneo..."
                        className="border-border-primary bg-tertiary text-t-primary placeholder-t-secondary/60 focus:border-accent focus:ring-accent w-full rounded-lg border px-4 py-2.5 pl-10 text-sm shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                    />
                    <Search className="text-accent absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" strokeWidth={2} />
                    {searchTerm && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="text-t-secondary hover:text-t-primary absolute top-1/2 right-3 -translate-y-1/2"
                            title="Limpiar búsqueda"
                        >
                            <XCircle className="h-5 w-5" strokeWidth={2} />
                        </button>
                    )}
                </div>

                {searchTerm && (
                    <p className="text-t-secondary mt-2 text-xs">
                        Mostrando <span className="text-t-primary font-semibold">{filteredCount}</span> de{' '}
                        <span className="text-t-primary font-semibold">{totalCount}</span> inscripciones.
                    </p>
                )}
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Estado de pago */}
                <div>
                    <label className="text-t-primary mb-2 block text-sm font-medium">Estado de pago</label>
                    <select
                        value={paymentStatusFilter}
                        onChange={(e) => onPaymentStatusChange(e.target.value)}
                        className="border-border-primary bg-tertiary text-t-primary focus:border-accent focus:ring-accent w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                    >
                        <option value="all">Todos</option>
                        <option value="pending">Pendientes</option>
                        <option value="confirmed">Confirmados</option>
                        <option value="failed">Fallidos</option>
                    </select>
                </div>

                {/* Juego */}
                <div>
                    <label className="text-t-primary mb-2 block text-sm font-medium">Juego</label>
                    <select
                        value={gameFilter}
                        onChange={(e) => onGameChange(e.target.value)}
                        className="border-border-primary bg-tertiary text-t-primary focus:border-accent focus:ring-accent w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                    >
                        <option value="all">Todos</option>
                        {games.map((game) => (
                            <option key={game.id} value={game.id}>
                                {game.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Torneo */}
                <div>
                    <label className="text-t-primary mb-2 block text-sm font-medium">Torneo</label>
                    <select
                        value={tournamentFilter}
                        onChange={(e) => onTournamentChange(e.target.value)}
                        className="border-border-primary bg-tertiary text-t-primary focus:border-accent focus:ring-accent w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                    >
                        <option value="all">Todos</option>
                        {tournaments
                            .filter((t) => gameFilter === 'all' || t.game.id.toString() === gameFilter)
                            .map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                    </select>
                </div>

                {/* Botón limpiar */}
                <div className="flex items-end">
                    <button
                        onClick={onClearFilters}
                        className="border-border-primary hover:bg-accent/10 text-t-primary w-full rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                    >
                        Limpiar filtros
                    </button>
                </div>
            </div>
        </div>
    );
}
