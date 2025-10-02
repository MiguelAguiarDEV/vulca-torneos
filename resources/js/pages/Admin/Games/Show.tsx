// pages/Admin/Games/Show.tsx - REFACTORIZADO
import { GameHeader } from '@/components/Admin/Games/GameHeader';
import { PendingRegistrationsList } from '@/components/Admin/Games/PendingRegistrationsList';
import { TournamentsList } from '@/components/Admin/Games/TournamentsList';
import { StatsCard } from '@/components/Admin/Shared/StatsCard';
import AdminLayout from '@/layouts/AdminLayout';
import { Clock, Trophy, Users } from 'lucide-react';
import React from 'react';

interface Game {
    id: number;
    name: string;
    description: string | null;
    image: string;
}

interface Tournament {
    id: number;
    name: string;
    status: 'active' | 'upcoming';
    original_status: string;
    start_date: string;
    participants_count: number;
}

interface Registration {
    id: number;
    user_name: string;
    user_email: string;
    tournament_name: string;
    registration_date: string;
    payment_status: string;
}

interface ShowProps {
    game: Game;
    tournaments: Tournament[];
    pendingRegistrations: Registration[];
}

const Show: React.FC<ShowProps> = ({ game, tournaments, pendingRegistrations }) => {
    const totalParticipants = tournaments.reduce((total, t) => total + t.participants_count, 0);

    return (
        <AdminLayout title={`Detalles - ${game.name}`} pageTitle="Detalles del Juego">
            {/* Game Header */}
            <GameHeader game={game} />

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Tournaments */}
                <TournamentsList tournaments={tournaments} />

                {/* Pending Registrations */}
                <PendingRegistrationsList registrations={pendingRegistrations} />
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <StatsCard icon={Trophy} title="Total Torneos" value={tournaments.length} iconColor="text-primary" borderColor="border-primary/30" />

                <StatsCard
                    icon={Clock}
                    title="Inscripciones Pendientes"
                    value={pendingRegistrations.length}
                    iconColor="text-warning"
                    borderColor="border-warning/30"
                />

                <StatsCard
                    icon={Users}
                    title="Total Participantes"
                    value={totalParticipants}
                    iconColor="text-success"
                    borderColor="border-success/30"
                />
            </div>
        </AdminLayout>
    );
};

export default Show;
