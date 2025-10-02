// components/Admin/Shared/FormField.tsx
import React from 'react';

interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
    fullWidth?: boolean;
}

export function FormField({ label, required, error, children, fullWidth = false }: FormFieldProps) {
    return (
        <div className={fullWidth ? 'md:col-span-2' : ''}>
            <label className="mb-2 block text-sm font-medium text-text-primary">
                {label} {required && <span className="text-danger">*</span>}
            </label>
            {children}
            {error && <p className="mt-1 text-sm text-danger">{error}</p>}
        </div>
    );
}
