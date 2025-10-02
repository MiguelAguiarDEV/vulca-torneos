// components/Admin/Shared/EmptyState.tsx
import React from 'react';

interface EmptyStateProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    actionText?: string;
    onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionText, onAction }: EmptyStateProps) {
    return (
        <div className="py-20 text-center">
            <div className="mx-auto max-w-md rounded-lg border-2 border-primary/30 bg-secondary/95 p-12 shadow-lg backdrop-blur-sm">
                <Icon className="mx-auto mb-6 h-16 w-16 text-primary/50" />
                <h3 className="mb-3 text-xl font-semibold text-text-primary">{title}</h3>
                <p className="mb-6 text-text-primary/70">{description}</p>
                {actionText && onAction && (
                    <button
                        onClick={onAction}
                        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-secondary shadow-lg transition-all duration-200 hover:bg-primary-dark hover:shadow-xl"
                    >
                        {actionText}
                    </button>
                )}
            </div>
        </div>
    );
}
