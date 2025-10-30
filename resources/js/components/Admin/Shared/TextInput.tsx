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
                error ? 'border-danger focus:ring-danger' : 'border-border-primary focus:ring-accent'
            } bg-tertiary text-t-primary focus:ring-offset-primary px-3 py-2 text-sm shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${className}`}
        />
    );
}
