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
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-border-primary bg-secondary rounded-xl border p-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                    <div className="bg-accent-subtle text-accent flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                        <Users className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="text-t-muted text-sm font-medium">Total Inscripciones</h3>
                        <p className="text-t-primary text-2xl font-bold">{totalRegistrations}</p>
                    </div>
                </div>
            </div>

            <div className="border-border-primary bg-secondary rounded-xl border p-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                    <div className="bg-success/10 text-success flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                        <Trophy className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="text-t-muted text-sm font-medium">Confirmadas</h3>
                        <p className="text-t-primary text-2xl font-bold">{confirmedCount}</p>
                    </div>
                </div>
            </div>

            <div className="border-border-primary bg-secondary rounded-xl border p-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                    <div className="bg-warning/10 text-warning flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                        <Clock className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="text-t-muted text-sm font-medium">Pendientes</h3>
                        <p className="text-t-primary text-2xl font-bold">{pendingCount}</p>
                    </div>
                </div>
            </div>

            <div className="border-border-primary bg-secondary rounded-xl border p-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                    <div className="bg-info/10 text-info flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                        <DollarSign className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="text-t-muted text-sm font-medium">Ingresos</h3>
                        <p className="text-t-primary text-2xl font-bold">€{totalRevenue.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
