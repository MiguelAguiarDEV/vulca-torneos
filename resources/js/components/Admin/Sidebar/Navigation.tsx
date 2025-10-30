// Navigation.tsx
import { Link, usePage } from '@inertiajs/react';
import { Gamepad2, Home, Trophy, Users } from 'lucide-react';

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const navigationItems: NavigationItem[] = [
    { name: 'Inicio', href: '/admin/dashboard', icon: Home },
    { name: 'Juegos', href: '/admin/games', icon: Gamepad2 },
    { name: 'Torneos', href: '/admin/tournaments', icon: Trophy },
    { name: 'Inscripciones', href: '/admin/registrations', icon: Users },
];

export default function Navigation() {
    const { url: currentPath } = usePage();

    return (
        <nav className="border-border-primary bg-tertiary space-y-1 rounded border p-1">
            {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === '/admin' ? currentPath === item.href : currentPath.startsWith(item.href);

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`group relative flex items-center gap-3 rounded border px-3 py-3 text-sm font-medium transition-all duration-200 ${
                            isActive
                                ? 'border-accent from-accent to-accent-dark bg-gradient-to-r text-white shadow-sm'
                                : 'border-border-primary bg-secondary text-t-secondary hover:border-border-primary hover:bg-highlight hover:text-t-primary hover:shadow-sm'
                        }`}
                    >
                        <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
                        <span className="truncate">{item.name}</span>
                        {isActive && <div className="ml-auto h-2 w-2 rounded-full bg-white" />}
                    </Link>
                );
            })}
        </nav>
    );
}
