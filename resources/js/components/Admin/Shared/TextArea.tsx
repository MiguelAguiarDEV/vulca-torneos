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
                error ? 'border-danger' : 'border-primary/30'
            } bg-secondary-light text-text-primary focus:border-primary focus:ring-primary px-3 py-2 focus:ring-2 focus:outline-none ${className}`}
        />
    );
}
