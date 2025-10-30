// Header.tsx
import { X } from 'lucide-react';

interface HeaderProps {
    toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
    return (
        <div className="border-border-primary relative flex h-16 items-center justify-between border-b px-2">
            {/* <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded bg-accent shadow-sm">
                    <span className="text-lg font-bold text-white">V</span>
                </div>
            </div> */}
            <div className="flex w-full items-center justify-center">
                <span className="text-md text-t-primary font-semibold">Vulca Comics</span>
            </div>
            <button
                onClick={toggleSidebar}
                className="bg-highlight text-t-secondary hover:bg-highlight-hover hover:text-t-primary flex h-8 w-8 items-center justify-center rounded-lg transition-colors lg:hidden"
            >
                <X className="h-4 w-4" strokeWidth={2} />
            </button>
        </div>
    );
}
