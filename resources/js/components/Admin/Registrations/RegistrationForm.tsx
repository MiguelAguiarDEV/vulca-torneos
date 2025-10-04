// components/Admin/Registrations/RegistrationForm.tsx
import { FormField } from '@/components/Admin/Shared/FormField';
import { Select } from '@/components/Admin/Shared/Select';
import { TextArea } from '@/components/Admin/Shared/TextArea';
import { TextInput } from '@/components/Admin/Shared/TextInput';
import type { Tournament, User } from '@/types';

interface RegistrationFormValues {
    user_selection_type?: 'existing' | 'new';
    user_id?: number | '';
    new_user_name?: string;
    new_user_email?: string;
    tournament_id?: number | '';
    payment_method: string;
    payment_status: string;
    payment_notes: string;
}

interface RegistrationFormProps {
    values: RegistrationFormValues;
    errors: Partial<Record<keyof RegistrationFormValues, string>>;
    onChange: <K extends keyof RegistrationFormValues>(key: K, value: RegistrationFormValues[K]) => void;
    users: User[];
    tournaments: Tournament[];
    isEditing: boolean;
}

export function RegistrationForm({ values, errors, onChange, users, tournaments, isEditing }: RegistrationFormProps) {
    if (isEditing) {
        return (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Método de pago" error={errors.payment_method}>
                    <Select
                        value={values.payment_method}
                        onChange={(e) => onChange('payment_method', e.target.value)}
                        options={[
                            { value: 'cash', label: 'Efectivo' },
                            { value: 'transfer', label: 'Transferencia' },
                            { value: 'card', label: 'Tarjeta' },
                        ]}
                        error={!!errors.payment_method}
                    />
                </FormField>

                <FormField label="Estado de pago" error={errors.payment_status}>
                    <Select
                        value={values.payment_status}
                        onChange={(e) => onChange('payment_status', e.target.value)}
                        options={[
                            { value: 'pending', label: 'Pendiente' },
                            { value: 'confirmed', label: 'Confirmado' },
                            { value: 'failed', label: 'Fallido' },
                        ]}
                        error={!!errors.payment_status}
                    />
                </FormField>

                <FormField label="Notas de pago" error={errors.payment_notes} fullWidth>
                    <TextArea
                        value={values.payment_notes}
                        onChange={(e) => onChange('payment_notes', e.target.value)}
                        placeholder="Notas adicionales"
                        rows={3}
                        error={!!errors.payment_notes}
                    />
                </FormField>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Tipo de usuario */}
            <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-text-primary">Tipo de usuario</label>
                <div className="flex gap-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value="existing"
                            checked={values.user_selection_type === 'existing'}
                            onChange={(e) => onChange('user_selection_type', e.target.value as 'existing' | 'new')}
                            className="mr-2"
                        />
                        <span className="text-text-primary">Usuario existente</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            value="new"
                            checked={values.user_selection_type === 'new'}
                            onChange={(e) => onChange('user_selection_type', e.target.value as 'existing' | 'new')}
                            className="mr-2"
                        />
                        <span className="text-text-primary">Nuevo usuario</span>
                    </label>
                </div>
            </div>

            {values.user_selection_type === 'existing' ? (
                <FormField label="Usuario" required error={errors.user_id} fullWidth>
                    <Select
                        value={values.user_id || ''}
                        onChange={(e) => onChange('user_id', e.target.value ? Number(e.target.value) : '')}
                        options={[
                            { value: '', label: 'Selecciona un usuario' },
                            ...users.map((u) => ({ value: u.id, label: `${u.name} (${u.email})` })),
                        ]}
                        error={!!errors.user_id}
                    />
                </FormField>
            ) : (
                <>
                    <FormField label="Nombre" required error={errors.new_user_name}>
                        <TextInput
                            type="text"
                            value={values.new_user_name || ''}
                            onChange={(e) => onChange('new_user_name', e.target.value)}
                            placeholder="Nombre del usuario"
                            error={!!errors.new_user_name}
                        />
                    </FormField>
                    <FormField label="Email" error={errors.new_user_email}>
                        <TextInput
                            type="email"
                            value={values.new_user_email || ''}
                            onChange={(e) => onChange('new_user_email', e.target.value)}
                            placeholder="email@ejemplo.com"
                            error={!!errors.new_user_email}
                        />
                    </FormField>
                </>
            )}

            <FormField label="Torneo" required error={errors.tournament_id} fullWidth>
                <Select
                    value={values.tournament_id || ''}
                    onChange={(e) => onChange('tournament_id', e.target.value ? Number(e.target.value) : '')}
                    options={[
                        { value: '', label: 'Selecciona un torneo' },
                        ...tournaments.map((t) => ({ value: t.id, label: `${t.name} (${t.game.name})` })),
                    ]}
                    error={!!errors.tournament_id}
                />
            </FormField>

            <FormField label="Método de pago" error={errors.payment_method}>
                <Select
                    value={values.payment_method}
                    onChange={(e) => onChange('payment_method', e.target.value)}
                    options={[
                        { value: 'cash', label: 'Efectivo' },
                        { value: 'transfer', label: 'Transferencia' },
                        { value: 'card', label: 'Tarjeta' },
                    ]}
                    error={!!errors.payment_method}
                />
            </FormField>

            <FormField label="Estado de pago" error={errors.payment_status}>
                <Select
                    value={values.payment_status}
                    onChange={(e) => onChange('payment_status', e.target.value)}
                    options={[
                        { value: 'pending', label: 'Pendiente' },
                        { value: 'confirmed', label: 'Confirmado' },
                        { value: 'failed', label: 'Fallido' },
                    ]}
                    error={!!errors.payment_status}
                />
            </FormField>

            <FormField label="Notas de pago" error={errors.payment_notes} fullWidth>
                <TextArea
                    value={values.payment_notes}
                    onChange={(e) => onChange('payment_notes', e.target.value)}
                    placeholder="Notas adicionales sobre el pago (opcional)"
                    rows={3}
                    error={!!errors.payment_notes}
                />
            </FormField>
        </div>
    );
}
