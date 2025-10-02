// components/Admin/Shared/StatsCard.tsx
import React from 'react';

interface StatsCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string | number;
    subtitle?: string;
    iconColor?: string;
    borderColor?: string;
}

export function StatsCard({ icon: Icon, title, value, subtitle, iconColor = 'text-primary', borderColor = 'border-primary' }: StatsCardProps) {
    return (
        <div className={`rounded-lg border-2 ${borderColor} bg-secondary/95 p-6 shadow-lg backdrop-blur-sm`}>
            <div className="mb-2 flex items-center">
                <Icon className={`mr-3 h-6 w-6 ${iconColor}`} />
                <h3 className={`text-lg font-semibold ${iconColor}`}>{title}</h3>
            </div>
            <p className="text-3xl font-bold text-text-primary">{value}</p>
            {subtitle && <p className="mt-1 text-sm text-text-primary/70">{subtitle}</p>}
        </div>
    );
}
