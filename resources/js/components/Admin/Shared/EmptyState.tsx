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
            <div className="border-primary/30 bg-secondary/95 mx-auto max-w-md rounded-lg border-2 p-12 shadow-lg backdrop-blur-sm">
                <Icon className="text-primary/50 mx-auto mb-6 h-16 w-16" />
                <h3 className="text-text-primary mb-3 text-xl font-semibold">{title}</h3>
                <p className="text-text-primary/70 mb-6">{description}</p>
                {actionText && onAction && (
                    <button
                        onClick={onAction}
                        className="bg-primary text-secondary hover:bg-primary-dark inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
                    >
                        {actionText}
                    </button>
                )}
            </div>
        </div>
    );
}
