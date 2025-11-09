// components/Admin/Tournaments/TournamentForm.tsx
import { FileInput } from '@/components/Admin/Shared/FileInput';
import { FormField } from '@/components/Admin/Shared/FormField';
import { Select } from '@/components/Admin/Shared/Select';
import { TextArea } from '@/components/Admin/Shared/TextArea';
import { TextInput } from '@/components/Admin/Shared/TextInput';

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
    status: 'draft' | 'published' | 'registration_open' | 'registration_closed' | 'ongoing' | 'finished' | 'cancelled';
}

interface TournamentFormProps {
    values: TournamentFormValues;
    errors: Partial<Record<keyof TournamentFormValues, string>>;
    onChange: <Field extends keyof TournamentFormValues>(key: Field, value: TournamentFormValues[Field]) => void;
    image: {
        file: File | null;
        preview: string;
        handleFileChange: (file: File | null) => void;
    };
    games: Array<{ id: number; name: string }>;
}

export function TournamentForm({ values, errors, onChange, image, games }: TournamentFormProps) {
    return (
        <div className="h-[600px] space-y-4 overflow-y-auto px-2">
            {/* Información Básica */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Nombre" required error={errors.name} fullWidth>
                    <TextInput
                        type="text"
                        value={values.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        placeholder="Nombre del torneo"
                        error={!!errors.name}
                    />
                </FormField>

                <FormField label="Juego" required error={errors.game_id}>
                    <Select
                        value={values.game_id}
                        onChange={(e) => onChange('game_id', e.target.value ? Number(e.target.value) : '')}
                        options={[{ value: '', label: 'Seleccionar juego' }, ...games.map((g) => ({ value: g.id, label: g.name }))]}
                        error={!!errors.game_id}
                    />
                </FormField>
            </div>

            <FormField label="Descripción" error={errors.description} fullWidth>
                <TextArea
                    value={values.description}
                    onChange={(e) => onChange('description', e.target.value)}
                    placeholder="Descripción del torneo (opcional)"
                    rows={3}
                    error={!!errors.description}
                />
            </FormField>

            {/* Fechas del torneo */}
            <div>
                <h3 className="text-t-primary mb-3 text-sm font-semibold">Fechas del torneo</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField label="Fecha de inicio" required error={errors.start_date}>
                        <TextInput
                            type="date"
                            value={values.start_date}
                            onChange={(e) => onChange('start_date', e.target.value)}
                            error={!!errors.start_date}
                        />
                    </FormField>

                    <FormField label="Fecha de fin" error={errors.end_date}>
                        <TextInput
                            type="date"
                            value={values.end_date}
                            onChange={(e) => onChange('end_date', e.target.value)}
                            error={!!errors.end_date}
                        />
                    </FormField>
                </div>
            </div>

            {/* Período de Inscripción */}
            <div>
                <h3 className="text-t-primary mb-3 text-sm font-semibold">Período de inscripciones</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField label="Inicio de inscripciones" error={errors.registration_start}>
                        <TextInput
                            type="date"
                            value={values.registration_start}
                            onChange={(e) => onChange('registration_start', e.target.value)}
                            error={!!errors.registration_start}
                        />
                    </FormField>

                    <FormField label="Fin de inscripciones" error={errors.registration_end}>
                        <TextInput
                            type="date"
                            value={values.registration_end}
                            onChange={(e) => onChange('registration_end', e.target.value)}
                            error={!!errors.registration_end}
                        />
                    </FormField>
                </div>
            </div>

            {/* Configuración */}
            <div>
                <h3 className="text-t-primary mb-3 text-sm font-semibold">Configuración</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField label="Estado" required error={errors.status}>
                        <Select
                            value={values.status}
                            onChange={(e) => onChange('status', e.target.value as TournamentFormValues['status'])}
                            options={[
                                { value: 'draft', label: 'Borrador' },
                                { value: 'published', label: 'Publicado' },
                                { value: 'registration_open', label: 'Inscripciones Abiertas' },
                                { value: 'registration_closed', label: 'Inscripciones Cerradas' },
                                { value: 'ongoing', label: 'En Curso' },
                                { value: 'finished', label: 'Finalizado' },
                                { value: 'cancelled', label: 'Cancelado' },
                            ]}
                            error={!!errors.status}
                        />
                    </FormField>

                    <FormField label="Cuota de inscripción (€)" error={errors.entry_fee}>
                        <TextInput
                            type="number"
                            value={values.entry_fee}
                            onChange={(e) => onChange('entry_fee', e.target.value)}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            error={!!errors.entry_fee}
                        />
                    </FormField>
                </div>
            </div>

            {/* Límite de Inscripciones */}
            <div className="border-border-primary bg-tertiary rounded-lg border p-4">
                <div className="mb-3 flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="has_registration_limit"
                        checked={values.has_registration_limit}
                        onChange={(e) => onChange('has_registration_limit', e.target.checked)}
                        className="border-border-primary text-accent focus:ring-accent focus:ring-offset-tertiary h-4 w-4 rounded focus:ring-2 focus:ring-offset-2"
                    />
                    <label htmlFor="has_registration_limit" className="text-t-primary text-sm font-medium">
                        Establecer límite de inscripciones
                    </label>
                </div>

                {values.has_registration_limit && (
                    <FormField label="Número máximo de participantes" error={errors.registration_limit}>
                        <TextInput
                            type="number"
                            value={values.registration_limit}
                            onChange={(e) => onChange('registration_limit', e.target.value)}
                            placeholder="Ej: 32"
                            min="1"
                            error={!!errors.registration_limit}
                        />
                    </FormField>
                )}
            </div>

            {/* Imagen */}
            <FormField label="Imagen del torneo" fullWidth>
                <FileInput onChange={image.handleFileChange} accept="image/*" preview={image.preview} />
            </FormField>
        </div>
    );
}
