// components/Admin/Registrations/RegistrationForm.tsx
import { FormField } from '@/components/Admin/Shared/FormField';
import { Select } from '@/components/Admin/Shared/Select';
import { TextArea } from '@/components/Admin/Shared/TextArea';
import { TextInput } from '@/components/Admin/Shared/TextInput';
import type { Tournament, User } from '@/types';

export interface RegistrationFormValues {
    user_selection_type: 'existing' | 'new';
    user_id: number | '';
    new_user_name: string;
    new_user_email: string;
    tournament_id: number | '';
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
    const paymentMethods = [
        { value: 'cash', label: 'Efectivo' },
        { value: 'transfer', label: 'Transferencia' },
        { value: 'card', label: 'Tarjeta' },
    ];

    const paymentStatuses = [
        { value: 'pending', label: 'Pendiente' },
        { value: 'confirmed', label: 'Confirmado' },
        { value: 'failed', label: 'Fallido' },
    ];

    if (isEditing) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Método de pago" required error={errors.payment_method}>
                    <Select
                        value={values.payment_method}
                        onChange={(e) => onChange('payment_method', e.target.value)}
                        options={paymentMethods}
                        error={!!errors.payment_method}
                    />
                </FormField>

                <FormField label="Estado de pago" required error={errors.payment_status}>
                    <Select
                        value={values.payment_status}
                        onChange={(e) => onChange('payment_status', e.target.value)}
                        options={paymentStatuses}
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

    return (
        <div className="h-[550px] space-y-6 overflow-y-auto px-2">
            {/* Tipo de usuario */}
            <div>
                <h3 className="text-t-primary mb-3 text-sm font-semibold">Tipo de Usuario</h3>
                <div className="flex gap-6">
                    <label className="text-t-primary flex items-center gap-2 text-sm">
                        <input
                            type="radio"
                            value="existing"
                            checked={values.user_selection_type === 'existing'}
                            onChange={(e) => onChange('user_selection_type', e.target.value as 'existing' | 'new')}
                            className="border-border-primary text-accent focus:ring-accent focus:ring-offset-tertiary h-4 w-4 rounded focus:ring-2 focus:ring-offset-2"
                        />
                        Usuario existente
                    </label>
                    <label className="text-t-primary flex items-center gap-2 text-sm">
                        <input
                            type="radio"
                            value="new"
                            checked={values.user_selection_type === 'new'}
                            onChange={(e) => onChange('user_selection_type', e.target.value as 'existing' | 'new')}
                            className="border-border-primary text-accent focus:ring-accent focus:ring-offset-tertiary h-4 w-4 rounded focus:ring-2 focus:ring-offset-2"
                        />
                        Nuevo usuario
                    </label>
                </div>
            </div>

            {/* Datos del usuario */}
            {values.user_selection_type === 'existing' ? (
                <FormField label="Usuario" required error={errors.user_id} fullWidth>
                    <Select
                        value={values.user_id || ''}
                        onChange={(e) => onChange('user_id', e.target.value ? Number(e.target.value) : '')}
                        options={[
                            { value: '', label: 'Seleccionar usuario' },
                            ...users.map((u) => ({ value: u.id, label: `${u.name} (${u.email})` })),
                        ]}
                        error={!!errors.user_id}
                    />
                </FormField>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField label="Nombre" required error={errors.new_user_name}>
                        <TextInput
                            type="text"
                            value={values.new_user_name}
                            onChange={(e) => onChange('new_user_name', e.target.value)}
                            placeholder="Nombre del usuario"
                            error={!!errors.new_user_name}
                        />
                    </FormField>
                    <FormField label="Email" error={errors.new_user_email}>
                        <TextInput
                            type="email"
                            value={values.new_user_email}
                            onChange={(e) => onChange('new_user_email', e.target.value)}
                            placeholder="correo@ejemplo.com"
                            error={!!errors.new_user_email}
                        />
                    </FormField>
                </div>
            )}

            {/* Selección de torneo */}
            <FormField label="Torneo" required error={errors.tournament_id} fullWidth>
                <Select
                    value={values.tournament_id || ''}
                    onChange={(e) => onChange('tournament_id', e.target.value ? Number(e.target.value) : '')}
                    options={[
                        { value: '', label: 'Seleccionar torneo' },
                        ...tournaments.map((t) => ({ value: t.id, label: `${t.name} (${t.game.name})` })),
                    ]}
                    error={!!errors.tournament_id}
                />
            </FormField>

            {/* Pago */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Método de pago" required error={errors.payment_method}>
                    <Select
                        value={values.payment_method}
                        onChange={(e) => onChange('payment_method', e.target.value)}
                        options={paymentMethods}
                        error={!!errors.payment_method}
                    />
                </FormField>

                <FormField label="Estado de pago" required error={errors.payment_status}>
                    <Select
                        value={values.payment_status}
                        onChange={(e) => onChange('payment_status', e.target.value)}
                        options={paymentStatuses}
                        error={!!errors.payment_status}
                    />
                </FormField>
            </div>

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
