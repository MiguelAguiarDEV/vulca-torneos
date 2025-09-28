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
        <div className="mt-auto flex flex-col space-y-2 p-4 selection:text-accent">
            <div className="relative flex items-center space-x-2 rounded-lg bg-secondary-lighter p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                    <span className="font-bold text-secondary">{auth.user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex max-w-[120px] flex-col">
                    <p className="truncate text-xs font-medium text-white" title={auth.user.name}>
                        {auth.user.name}
                    </p>
                    <p className="truncate text-xs text-white/50" title={auth.user.email}>
                        {auth.user.email}
                    </p>
                </div>
            </div>
        </div>
    );
}
