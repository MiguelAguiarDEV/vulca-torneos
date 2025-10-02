// components/Admin/Shared/ActionButton.tsx
import React from 'react';

interface ActionButtonProps {
    icon: React.ComponentType<{ className?: string }>;
    onClick: (e: React.MouseEvent) => void;
    title: string;
    variant?: 'primary' | 'danger' | 'success' | 'warning';
    size?: 'sm' | 'md';
}

export function ActionButton({ icon: Icon, onClick, title, variant = 'primary', size = 'md' }: ActionButtonProps) {
    const variants = {
        primary: 'text-text-primary hover:bg-primary/20 hover:text-primary',
        danger: 'text-text-primary hover:bg-danger/10 hover:text-danger',
        success: 'text-text-primary hover:bg-success/10 hover:text-success',
        warning: 'text-text-primary hover:bg-warning/10 hover:text-warning',
    };

    const sizes = {
        sm: 'p-1',
        md: 'p-2',
    };

    return (
        <button
            onClick={onClick}
            className={`rounded-md transition-colors duration-200 ${variants[variant]} ${sizes[size]}`}
            title={title}
            type="button"
        >
            <Icon className="h-4 w-4" />
        </button>
    );
}
