// components/Admin/Shared/StatsCard.tsx - ACTUALIZAR
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    icon: LucideIcon;
    title: string;
    value: number | string;
    subtitle: string;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export function StatsCard({ icon: Icon, title, value, subtitle, variant = 'default' }: StatsCardProps) {
    const variantColors = {
        default: 'border-primary text-primary',
        success: 'border-success text-success',
        warning: 'border-warning text-warning',
        error: 'border-error text-error',
        info: 'border-info text-info',
    };

    const colorClass = variantColors[variant];

    return (
        <div className={`rounded-lg border-2 ${colorClass} bg-secondary/95 p-6 shadow-lg backdrop-blur-sm`}>
            <div className="mb-2 flex items-center">
                <Icon className={`mr-3 h-6 w-6 ${colorClass.split(' ')[1]}`} />
                <h3 className={`text-lg font-semibold ${colorClass.split(' ')[1]}`}>{title}</h3>
            </div>
            <p className="text-3xl font-bold text-text-primary">{value}</p>
            <p className="mt-1 text-sm text-text-primary/70">{subtitle}</p>
        </div>
    );
}
