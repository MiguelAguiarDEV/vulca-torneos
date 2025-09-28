import { Link, usePage } from '@inertiajs/react';
import { Gamepad2, Home, Trophy, Users } from 'lucide-react';

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavigationItem[] = [
    { name: 'Inicio', href: '/admin', icon: Home },
    { name: 'Juegos', href: '/admin/games', icon: Gamepad2 },
    { name: 'Torneos', href: '/admin/tournaments', icon: Trophy },
    { name: 'Inscripciones', href: '/admin/registrations', icon: Users },
];

export default function Navigation() {
    const { url: currentPath } = usePage();

    return (
        <nav className="px-4">
            <ul className="space-y-2">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.href === '/admin' ? currentPath === item.href : currentPath.startsWith(item.href);

                    return (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={`flex items-center rounded-md px-4 py-2 text-sm ${
                                    isActive
                                        ? 'bg-gradient-to-r from-primary to-accent font-medium text-secondary'
                                        : 'text-text-primary transition-colors duration-200 ease-in-out hover:bg-primary/10 hover:text-primary'
                                }`}
                            >
                                <Icon className="mr-3 h-4 w-4" />
                                {item.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
