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
        <nav className="mt-6 px-6">
            <ul className="space-y-2">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.href === '/admin' ? currentPath === item.href : currentPath.startsWith(item.href);

                    return (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={`flex items-center rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
                                    isActive
                                        ? 'scale-105 bg-primary text-secondary shadow-lg'
                                        : 'text-text-primary hover:bg-primary-alpha-20 hover:text-primary'
                                }`}
                            >
                                <Icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
