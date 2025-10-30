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
        <div className="border-primary/30 bg-secondary/95 mb-6 rounded-lg border-2 p-4 shadow-lg backdrop-blur-sm">
            {/* Búsqueda */}
            <div className="mb-4">
                <label className="text-text-primary mb-2 block text-sm font-medium">Buscar inscripciones</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o torneo..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="border-primary/30 bg-secondary-light text-text-primary placeholder-text-primary/50 focus:border-primary focus:ring-primary w-full rounded-lg border px-4 py-3 pl-10 focus:ring-2 focus:outline-none"
                    />
                    <Search className="text-primary/70 absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                    {searchTerm && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="text-text-primary/50 hover:text-text-primary absolute top-1/2 right-3 -translate-y-1/2"
                        >
                            <XCircle className="h-5 w-5" />
                        </button>
                    )}
                </div>
                {searchTerm && (
                    <p className="text-text-primary/60 mt-2 text-sm">
                        Mostrando {filteredCount} de {totalCount} inscripciones
                    </p>
                )}
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <label className="text-text-primary mb-2 block text-sm font-medium">Estado de pago</label>
                    <select
                        value={paymentStatusFilter}
                        onChange={(e) => onPaymentStatusChange(e.target.value)}
                        className="border-primary/30 bg-secondary-light text-text-primary focus:border-primary focus:ring-primary w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
                    >
                        <option value="all">Todos</option>
                        <option value="pending">Pendientes</option>
                        <option value="confirmed">Confirmados</option>
                        <option value="failed">Fallidos</option>
                    </select>
                </div>

                <div>
                    <label className="text-text-primary mb-2 block text-sm font-medium">Juego</label>
                    <select
                        value={gameFilter}
                        onChange={(e) => onGameChange(e.target.value)}
                        className="border-primary/30 bg-secondary-light text-text-primary focus:border-primary focus:ring-primary w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
                    >
                        <option value="all">Todos</option>
                        {games.map((game) => (
                            <option key={game.id} value={game.id}>
                                {game.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-text-primary mb-2 block text-sm font-medium">Torneo</label>
                    <select
                        value={tournamentFilter}
                        onChange={(e) => onTournamentChange(e.target.value)}
                        className="border-primary/30 bg-secondary-light text-text-primary focus:border-primary focus:ring-primary w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
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

                <div className="flex items-end">
                    <button
                        onClick={onClearFilters}
                        className="border-primary/30 bg-secondary-light text-text-primary hover:bg-secondary-lighter w-full rounded-lg border px-4 py-2 transition-colors"
                    >
                        Limpiar todo
                    </button>
                </div>
            </div>
        </div>
    );
}
