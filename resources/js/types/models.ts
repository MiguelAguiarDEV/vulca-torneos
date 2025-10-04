export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Game {
    id: number;
    name: string;
    description: string | null;
    image: string;
}

export interface Tournament {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
    game_id: number;
    game: Game;
    start_date: string;
    end_date: string | null;
    registration_start: string | null;
    registration_end: string | null;
    entry_fee: number | null;
    has_registration_limit: boolean;
    registration_limit: number | null;
    status: TournamentStatus;
    registrations_count: number;
    available_spots?: number | null;
    registration_progress?: number | null;
}

export type TournamentStatus = 'draft' | 'published' | 'registration_open' | 'registration_closed' | 'ongoing' | 'finished' | 'cancelled';

export interface Registration {
    id: number;
    user_id: number;
    tournament_id: number;
    user: User;
    tournament: Tournament;
    status: string;
    payment_method: string;
    payment_status: string;
    payment_notes: string | null;
    amount: number | null;
    registered_at: string;
    team_name: string | null;
    created_at: string;
    updated_at: string;
}
