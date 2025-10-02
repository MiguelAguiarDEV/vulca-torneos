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
                error ? 'border-danger' : 'border-primary/30'
            } bg-secondary-light px-3 py-2 text-text-primary focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none ${className}`}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}
