import Logout from '@/components/UI/Logout';
import type { User } from '@/types';
import { usePage } from '@inertiajs/react';

interface PageProps extends Record<string, unknown> {
    auth: {
        user: User;
    };
}

export default function UserCard() {
    const { props } = usePage<PageProps>();
    const { auth } = props;

    return (
        <div className="fle mt-auto flex-col space-y-2 p-4">
            <div className="relative flex items-center space-x-2 rounded-lg bg-primary/10 p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <span className="font-bold text-secondary">{auth.user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex flex-col">
                    <p className="text-xs font-medium text-text-primary">{auth.user.name}</p>
                    <p className="text-xs text-primary">{auth.user.email}</p>
                </div>
                <Logout />
            </div>
        </div>
    );
}
