// components/Admin/Tournaments/TournamentStats.tsx
import { Clock, DollarSign, Trophy, Users } from 'lucide-react';

interface TournamentStatsProps {
    totalRegistrations: number;
    confirmedCount: number;
    pendingCount: number;
    totalRevenue: number;
}

export function TournamentStats({ totalRegistrations, confirmedCount, pendingCount, totalRevenue }: TournamentStatsProps) {
    return (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="rounded-lg border-2 border-primary/30 bg-secondary/95 p-4 shadow-lg backdrop-blur-sm transition-all hover:border-primary hover:shadow-xl">
                <div className="flex items-center">
                    <Users className="mr-3 h-8 w-8 text-primary" />
                    <div>
                        <h3 className="text-sm font-medium text-text-primary/70">Total Inscripciones</h3>
                        <p className="text-2xl font-bold text-text-primary">{totalRegistrations}</p>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border-2 border-success/30 bg-secondary/95 p-4 shadow-lg backdrop-blur-sm transition-all hover:border-success hover:shadow-xl">
                <div className="flex items-center">
                    <Trophy className="mr-3 h-8 w-8 text-success" />
                    <div>
                        <h3 className="text-sm font-medium text-text-primary/70">Confirmadas</h3>
                        <p className="text-2xl font-bold text-text-primary">{confirmedCount}</p>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border-2 border-warning/30 bg-secondary/95 p-4 shadow-lg backdrop-blur-sm transition-all hover:border-warning hover:shadow-xl">
                <div className="flex items-center">
                    <Clock className="mr-3 h-8 w-8 text-warning" />
                    <div>
                        <h3 className="text-sm font-medium text-text-primary/70">Pendientes</h3>
                        <p className="text-2xl font-bold text-text-primary">{pendingCount}</p>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border-2 border-info/30 bg-secondary/95 p-4 shadow-lg backdrop-blur-sm transition-all hover:border-info hover:shadow-xl">
                <div className="flex items-center">
                    <DollarSign className="mr-3 h-8 w-8 text-info" />
                    <div>
                        <h3 className="text-sm font-medium text-text-primary/70">Ingresos</h3>
                        <p className="text-2xl font-bold text-text-primary">€{totalRevenue.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
