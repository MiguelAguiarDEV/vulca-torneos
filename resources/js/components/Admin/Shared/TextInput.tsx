// components/Admin/Shared/TextInput.tsx
import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

export function TextInput({ error, className = '', ...props }: TextInputProps) {
    return (
        <input
            {...props}
            className={`w-full rounded-lg border ${
                error ? 'border-danger' : 'border-primary/30'
            } bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none ${className}`}
        />
    );
}
