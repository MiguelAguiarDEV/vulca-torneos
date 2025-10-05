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
        <div className="mt-auto flex flex-col space-y-2 p-4">
            <div className="bg-diagonal-lines relative flex items-center space-x-3 rounded-2xl border-[3px] border-ink bg-paper p-4 shadow-[inset_2px_2px_0_rgba(255,255,255,0.6),inset_-2px_-2px_0_rgba(10,10,10,0.15),3px_3px_0_var(--color-ink)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-ink bg-brand shadow-[inset_2px_2px_0_rgba(255,255,255,0.3),inset_-2px_-2px_0_rgba(10,10,10,0.2)]">
                    <span
                        className="text-lg font-black text-ink"
                        style={{
                            textShadow: '1px 1px 0 rgba(255,255,255,0.3)',
                        }}
                    >
                        {auth.user.name.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                    <p
                        className="truncate text-sm font-black tracking-tight text-panel uppercase"
                        title={auth.user.name}
                        style={{
                            textShadow: '1px 1px 0 rgba(244,165,46,0.3)',
                        }}
                    >
                        {auth.user.name}
                    </p>
                    <p className="truncate text-xs font-semibold text-secondary-lighter" title={auth.user.email}>
                        {auth.user.email}
                    </p>
                </div>
            </div>
        </div>
    );
}
