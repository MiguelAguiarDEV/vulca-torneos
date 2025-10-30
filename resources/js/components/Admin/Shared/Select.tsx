// components/Admin/Shared/Select.tsx
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    error?: boolean;
    options: Array<{ value: string | number; label: string }>;
}

export function Select({ error, options, className = '', ...props }: SelectProps) {
    return (
        <select
            {...props}
            className={`w-full rounded-lg border ${
                error ? 'border-danger focus:ring-danger' : 'border-border-primary focus:ring-accent'
            } bg-tertiary text-t-primary focus:ring-offset-primary px-3 py-2 text-sm shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${className}`}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}
