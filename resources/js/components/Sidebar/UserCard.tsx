import type { User } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { LogOut } from 'lucide-react';

const handleLogout = () => {
    router.post('/logout');
};

interface PageProps extends Record<string, unknown> {
    auth: {
        user: User;
    };
}

export default function UserCard() {
    const { props } = usePage<PageProps>();
    const { auth } = props;

    return (
        <div className="absolute right-0 bottom-0 left-0 border-t-2 border-primary bg-secondary-dark/80 p-6">
            <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                    <span className="font-bold text-secondary">{auth.user.name.charAt(0)}</span>
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-text-primary">{auth.user.name}</p>
                    <p className="text-xs text-primary">{auth.user.email}</p>
                </div>
                <button onClick={handleLogout} className="text-text-primary transition-colors hover:text-primary" title="Cerrar Sesión">
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
