// components/Admin/Shared/TextArea.tsx
import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
}

export function TextArea({ error, className = '', ...props }: TextAreaProps) {
    return (
        <textarea
            {...props}
            className={`w-full resize-none rounded-lg border ${
                error ? 'border-danger focus:ring-danger' : 'border-border-primary focus:ring-accent'
            } bg-tertiary text-t-primary focus:ring-offset-primary px-3 py-2 text-sm shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${className}`}
        />
    );
}
