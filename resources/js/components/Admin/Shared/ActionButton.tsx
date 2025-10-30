// components/Admin/Shared/ActionButton.tsx
import React from 'react';

interface ActionButtonProps {
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    onClick: (e: React.MouseEvent) => void;
    title: string;
    variant?: 'primary' | 'danger' | 'success' | 'warning';
    size?: 'sm' | 'md';
}

export function ActionButton({ icon: Icon, onClick, title, variant = 'primary', size = 'md' }: ActionButtonProps) {
    const variants = {
        primary: 'text-t-secondary hover:bg-accent/10 hover:text-accent',
        danger: 'text-t-secondary hover:bg-danger/10 hover:text-danger',
        success: 'text-t-secondary hover:bg-success/10 hover:text-success',
        warning: 'text-t-secondary hover:bg-warning/10 hover:text-warning',
    };

    const sizes = {
        sm: 'p-1.5',
        md: 'p-2',
    };

    return (
        <button
            onClick={onClick}
            className={`rounded-lg transition-colors duration-200 ${variants[variant]} ${sizes[size]}`}
            title={title}
            type="button"
        >
            <Icon className="h-4 w-4" strokeWidth={2} />
        </button>
    );
}
