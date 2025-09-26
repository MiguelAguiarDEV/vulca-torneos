import { Link } from '@inertiajs/react';
import { X } from 'lucide-react';

interface LogoProps {
    toggleSidebar: () => void;
}

export default function Logo({ toggleSidebar }: LogoProps) {
    return (
        <div className="relative flex h-16 items-center justify-end border-b-2 border-primary bg-secondary-dark/80 px-6">
            <Link href="/" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <img src="/assets/logo.png" className="h-10 w-auto" alt="Vulca Torneos" />
            </Link>
            <button onClick={toggleSidebar} className="text-primary transition-colors hover:text-text-primary lg:hidden">
                <X className="h-6 w-6" />
            </button>
        </div>
    );
}
