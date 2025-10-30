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
            <div className="border-primary/30 bg-secondary/95 hover:border-primary rounded-lg border-2 p-4 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
                <div className="flex items-center">
                    <Users className="text-primary mr-3 h-8 w-8" />
                    <div>
                        <h3 className="text-text-primary/70 text-sm font-medium">Total Inscripciones</h3>
                        <p className="text-text-primary text-2xl font-bold">{totalRegistrations}</p>
                    </div>
                </div>
            </div>

            <div className="border-success/30 bg-secondary/95 hover:border-success rounded-lg border-2 p-4 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
                <div className="flex items-center">
                    <Trophy className="text-success mr-3 h-8 w-8" />
                    <div>
                        <h3 className="text-text-primary/70 text-sm font-medium">Confirmadas</h3>
                        <p className="text-text-primary text-2xl font-bold">{confirmedCount}</p>
                    </div>
                </div>
            </div>

            <div className="border-warning/30 bg-secondary/95 hover:border-warning rounded-lg border-2 p-4 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
                <div className="flex items-center">
                    <Clock className="text-warning mr-3 h-8 w-8" />
                    <div>
                        <h3 className="text-text-primary/70 text-sm font-medium">Pendientes</h3>
                        <p className="text-text-primary text-2xl font-bold">{pendingCount}</p>
                    </div>
                </div>
            </div>

            <div className="border-info/30 bg-secondary/95 hover:border-info rounded-lg border-2 p-4 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
                <div className="flex items-center">
                    <DollarSign className="text-info mr-3 h-8 w-8" />
                    <div>
                        <h3 className="text-text-primary/70 text-sm font-medium">Ingresos</h3>
                        <p className="text-text-primary text-2xl font-bold">€{totalRevenue.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
