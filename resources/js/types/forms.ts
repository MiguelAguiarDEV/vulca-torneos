// types/forms.ts
// Tipos de formularios que extienden los modelos existentes

import type { TournamentStatus } from './models';

// ============================================
// TIPOS ADICIONALES (no están en models.ts)
// ============================================

export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'paypal';

// ============================================
// FORM VALUES - Valores de formularios
// ============================================

/**
 * Valores del formulario de juegos
 */
export interface GameFormValues {
    name: string;
    description: string;
}

/**
 * Valores del formulario de torneos
 */
export interface TournamentFormValues {
    name: string;
    description: string;
    game_id: number | '';
    start_date: string;
    end_date: string;
    registration_start: string;
    registration_end: string;
    entry_fee: string;
    has_registration_limit: boolean;
    registration_limit: string;
    status: TournamentStatus;
}

/**
 * Valores del formulario de inscripciones
 */
export interface RegistrationFormValues {
    tournament_id: number | '';
    user_id: number | '';
    new_user_name?: string;
    new_user_email?: string;
    payment_method: PaymentMethod | '';
    payment_status: RegistrationStatus;
    notes: string;
}

// ============================================
// EDIT FORM VALUES - Con ID para edición
// ============================================

export interface GameEditFormValues extends GameFormValues {
    id: number;
}

export interface TournamentEditFormValues extends TournamentFormValues {
    id: number;
}

export interface RegistrationEditFormValues extends RegistrationFormValues {
    id: number;
}

// ============================================
// FORM PROPS - Props para componentes de formulario
// ============================================

/**
 * Props base para todos los formularios
 */
export interface BaseFormProps<T> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    onChange: <K extends keyof T>(key: K, value: T[K]) => void;
}

/**
 * Props para formulario de juegos
 */
export interface GameFormProps extends BaseFormProps<GameFormValues> {
    image: {
        file: File | null;
        preview: string;
        handleFileChange: (file: File | null) => void;
    };
}

/**
 * Props para formulario de torneos
 */
export interface TournamentFormProps extends BaseFormProps<TournamentFormValues> {
    image: {
        file: File | null;
        preview: string;
        handleFileChange: (file: File | null) => void;
    };
    games: Array<{ id: number; name: string }>;
}

/**
 * Props para formulario de inscripciones
 */
export interface RegistrationFormProps extends BaseFormProps<RegistrationFormValues> {
    tournaments: Array<{ id: number; name: string }>;
    users: Array<{ id: number; name: string; email: string }>;
}

// ============================================
// DEFAULT VALUES - Valores iniciales
// ============================================

export const DEFAULT_FORM_VALUES = {
    game: {
        name: '',
        description: '',
    } as GameFormValues,

    tournament: {
        name: '',
        description: '',
        game_id: '',
        start_date: '',
        end_date: '',
        registration_start: '',
        registration_end: '',
        entry_fee: '',
        has_registration_limit: false,
        registration_limit: '',
        status: 'draft' as TournamentStatus,
    } as TournamentFormValues,

    registration: {
        tournament_id: '',
        user_id: '',
        new_user_name: '',
        new_user_email: '',
        payment_method: '',
        payment_status: 'pending' as RegistrationStatus,
        notes: '',
    } as RegistrationFormValues,
} as const;
