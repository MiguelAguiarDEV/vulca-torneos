// components/Admin/Games/GameForm.tsx
import { FileInput } from '@/components/Admin/Shared/FileInput';
import { FormField } from '@/components/Admin/Shared/FormField';
import { TextArea } from '@/components/Admin/Shared/TextArea';
import { TextInput } from '@/components/Admin/Shared/TextInput';

interface GameFormValues {
    name: string;
    description: string;
}

interface GameFormProps {
    values: GameFormValues;
    errors: Partial<Record<keyof GameFormValues, string>>;
    onChange: <Field extends keyof GameFormValues>(key: Field, value: GameFormValues[Field]) => void;
    image: {
        file: File | null;
        preview: string;
        handleFileChange: (file: File | null) => void;
    };
}

export function GameForm({ values, errors, onChange, image }: GameFormProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Nombre" required error={errors.name} fullWidth>
                <TextInput
                    type="text"
                    value={values.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    placeholder="Nombre del juego"
                    error={!!errors.name}
                />
            </FormField>

            <FormField label="Descripción" error={errors.description} fullWidth>
                <TextArea
                    value={values.description}
                    onChange={(e) => onChange('description', e.target.value)}
                    placeholder="Descripción del juego (opcional)"
                    rows={3}
                    error={!!errors.description}
                />
            </FormField>

            <FormField label="Imagen del juego" fullWidth>
                <FileInput onChange={image.handleFileChange} accept="image/*" preview={image.preview} />
            </FormField>
        </div>
    );
}
