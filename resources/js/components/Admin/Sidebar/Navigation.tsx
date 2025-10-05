import { Link, usePage } from '@inertiajs/react';
import { Gamepad2, Home, Trophy, Users } from 'lucide-react';

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
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
        <nav className="px-4 py-4">
            <ul className="space-y-3">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.href === '/admin' ? currentPath === item.href : currentPath.startsWith(item.href);

                    return (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={`group relative flex items-center gap-3 rounded-xl border-[3px] border-ink px-4 py-3 text-sm font-black tracking-tight uppercase transition-all duration-200 ${
                                    isActive
                                        ? 'bg-diagonal-lines text-panel shadow-[inset_2px_2px_0_rgba(255,255,255,0.4),inset_-2px_-2px_0_rgba(10,10,10,0.15),3px_3px_0_var(--color-ink)]'
                                        : 'bg-soft text-panel shadow-[2px_2px_0_var(--color-ink)] hover:translate-y-[1px] hover:bg-brand hover:text-ink hover:shadow-[inset_2px_2px_0_rgba(255,255,255,0.2),2px_2px_0_var(--color-ink)]'
                                } `}
                            >
                                <Icon className="h-5 w-5" />
                                {item.name}
                                {isActive && (
                                    <span className="relative ml-auto flex h-3 w-3">
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-ink opacity-75" />
                                        <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-ink bg-brand" />
                                    </span>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
