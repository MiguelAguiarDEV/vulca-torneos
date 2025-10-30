// UserCard.tsx
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
        <div className="border-border-primary bg-secondary border-t p-1">
            <div className="border-border-primary bg-tertiary hover:bg-highlight flex items-center gap-3 rounded border px-3 py-2.5 shadow-sm transition-all">
                <div className="bg-accent flex h-9 w-9 shrink-0 items-center justify-center rounded shadow-sm">
                    <span className="text-sm font-semibold text-white">{auth.user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-t-primary truncate text-sm font-medium" title={auth.user.name}>
                        {auth.user.name}
                    </p>
                    <p className="text-t-muted truncate text-xs" title={auth.user.email}>
                        {auth.user.email}
                    </p>
                </div>
            </div>
        </div>
    );
}
