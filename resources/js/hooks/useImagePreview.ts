// hooks/useImagePreview.ts
import { useCallback, useState } from 'react';

export function useImagePreview(initialPreview?: string) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>(initialPreview || '');

    const handleFileChange = useCallback((newFile: File | null) => {
        setFile(newFile);
        if (newFile) {
            const url = URL.createObjectURL(newFile);
            setPreview(url);
        }
    }, []);

    const reset = useCallback(() => {
        setFile(null);
        setPreview(initialPreview || '');
    }, [initialPreview]);

    return {
        file,
        preview,
        handleFileChange,
        reset,
        setPreview,
    };
}
