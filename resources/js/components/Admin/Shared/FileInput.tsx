// components/Admin/Shared/FileInput.tsx
import { Upload } from 'lucide-react';
import React from 'react';

interface FileInputProps {
    onChange: (file: File | null) => void;
    accept?: string;
    preview?: string;
}

export function FileInput({ onChange, accept = 'image/*', preview }: FileInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onChange(file);
    };

    return (
        <div className="space-y-3">
            {preview && (
                <div className="flex h-64 w-full">
                    <img src={preview} alt="Preview" className="border-border-primary h-full w-full rounded-lg border object-cover shadow-sm" />
                </div>
            )}
            <div className="group flex items-center justify-center">
                <label className="border-border-primary bg-tertiary hover:border-accent flex w-full cursor-pointer flex-col items-center rounded-lg border border-dashed px-4 py-6 transition-colors">
                    <Upload className="group-hover:text-accent text-t-muted mb-2 h-6 w-6 duration-200 group-hover:-translate-y-1" strokeWidth={2} />
                    <span className="text-t-primary mb-1 text-sm font-medium">Haz clic para subir</span>
                    <span className="text-t-muted text-xs">PNG, JPG hasta 10MB</span>
                    <input type="file" accept={accept} onChange={handleChange} className="hidden" />
                </label>
            </div>
        </div>
    );
}
