// components/Admin/Shared/EmptyState.tsx
import React from 'react';

interface EmptyStateProps {
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    title: string;
    description: string;
    actionText?: string;
    onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionText, onAction }: EmptyStateProps) {
    return (
        <div className="text-center">
            <Icon className="text-t-muted mx-auto mb-4 h-12 w-12" strokeWidth={1.5} />
            <h3 className="text-t-primary mb-2 text-base font-semibold">{title}</h3>
            <p className="text-t-muted mb-4 text-sm">{description}</p>
            {actionText && onAction && (
                <button
                    onClick={onAction}
                    className="border-border-primary bg-accent hover:bg-accent-hover rounded-lg border px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
                >
                    {actionText}
                </button>
            )}
        </div>
    );
}
