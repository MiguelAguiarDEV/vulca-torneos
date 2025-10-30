import React from 'react';

interface StatsCardProps {
    icon: React.ElementType;
    title: string;
    value: number | string;
    subtitle?: string;
}

export function StatsCard({ icon: Icon, title, value, subtitle }: StatsCardProps) {
    return (
        <div className="relative z-10 flex h-16 w-64 cursor-pointer items-center justify-between overflow-hidden rounded-full border-4 border-ink bg-paper px-6 text-ink shadow-[4px_4px_0_0_var(--color-ink)] transition-all duration-200 active:translate-y-0 active:shadow-[4px_4px_0_0_var(--color-ink)]">
            {/* Accent bar top */}
            {/* <div className="absolute top-0 right-0 left-0 h-2 bg-brand shadow-[inset_0_2px_0_rgba(255,255,255,0.3),inset_0_-2px_0_rgba(0,0,0,0.3)]" /> */}

            {/* Icon badge */}
            {/* <Icon className="absolute -bottom-8 -left-6 -z-10 h-24 w-24 rotate-20 text-panel opacity-8" /> */}

            {/* Title */}
            <div className="capitalize">
                <h3 className="text-base leading-tight font-black tracking-tight text-panel uppercase">{title}</h3>
                {subtitle && <p className="text-xs font-semibold text-brand-dark">{subtitle}</p>}
            </div>

            {/* Value badge */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-ink bg-ink text-center text-brand shadow-[3px_3px_0_0_var(--color-brand)]">
                <span className="text-2xl leading-none font-black tracking-tighter">{value}</span>
            </div>
        </div>
    );
}
