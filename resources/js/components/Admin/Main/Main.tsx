import FlashMessages from '@/components/FlashMessages';
import { usePage } from '@inertiajs/react';

interface MainProps extends Record<string, unknown> {
    children: React.ReactNode;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Main({ children }: { children: React.ReactNode }) {
    const { props } = usePage<MainProps>();
    const { flash } = props;
    return (
        <main className="flex-1 overflow-y-auto bg-transparent p-6">
            <div className="mx-auto max-w-7xl">
                {/* Flash Messages */}
                <FlashMessages flash={flash} />
                {/* Page Content */}
                {children}
            </div>
        </main>
    );
}
