// components/Admin/Shared/FileInput.tsx
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
        <div>
            {preview && (
                <div className="mb-4">
                    <img src={preview} alt="Preview" className="border-primary/30 h-24 w-24 rounded-lg border-2 object-cover" />
                </div>
            )}
            <input
                type="file"
                accept={accept}
                onChange={handleChange}
                className="text-text-primary/70 file:bg-primary file:text-secondary hover:file:bg-primary-dark w-full text-sm file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium file:shadow-lg"
            />
        </div>
    );
}
