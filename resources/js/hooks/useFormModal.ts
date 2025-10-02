// hooks/useFormModal.ts
import { useCallback, useState } from 'react';

interface UseFormModalOptions<T> {
    initialValues: T;
    onSubmit: (values: T) => void;
}

export function useFormModal<T extends Record<string, any>>({ initialValues, onSubmit }: UseFormModalOptions<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

    const open = useCallback(
        (initialData?: Partial<T>) => {
            if (initialData) {
                setValues({ ...initialValues, ...initialData });
            }
            setIsOpen(true);
        },
        [initialValues],
    );

    const close = useCallback(() => {
        setIsOpen(false);
        setValues(initialValues);
        setErrors({});
    }, [initialValues]);

    const setValue = useCallback(
        <K extends keyof T>(key: K, value: T[K]) => {
            setValues((prev) => ({ ...prev, [key]: value }));
            // Limpiar error al cambiar el valor
            if (errors[key]) {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[key];
                    return newErrors;
                });
            }
        },
        [errors],
    );

    const setError = useCallback((key: keyof T, message: string) => {
        setErrors((prev) => ({ ...prev, [key]: message }));
    }, []);

    const handleSubmit = useCallback(() => {
        onSubmit(values);
    }, [values, onSubmit]);

    return {
        isOpen,
        values,
        errors,
        open,
        close,
        setValue,
        setError,
        handleSubmit,
    };
}
