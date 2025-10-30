// components/Admin/Shared/StatsCard.tsx
import React from 'react';

interface StatsCardProps {
    icon: React.ElementType;
    title: string;
    value: number | string;
    subtitle?: string;
}

export function StatsCard({ icon: Icon, title, value, subtitle }: StatsCardProps) {
    return (
        <div className="border-border-primary bg-secondary flex items-center gap-4 rounded-xl border p-4 shadow-sm transition-all hover:shadow-md">
            {/* Icon */}
            <div className="bg-accent-subtle text-accent flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
                <Icon className="h-6 w-6" strokeWidth={2} />
            </div>

            {/* Content */}
            <div className="flex-1">
                <h3 className="text-t-muted text-sm font-medium">{title}</h3>
                <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-t-primary text-2xl font-bold">{value}</span>
                    {subtitle && <span className="text-t-muted text-xs">{subtitle}</span>}
                </div>
            </div>
        </div>
    );
}
