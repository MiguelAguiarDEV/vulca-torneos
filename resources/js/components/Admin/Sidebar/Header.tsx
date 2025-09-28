import { X } from 'lucide-react';

interface HeaderProps {
    toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
    return (
        <div className="relative flex h-16 items-center justify-between px-4 pl-8">
            <div className="flex items-center space-x-2">
                <img src="/images/vulcalogo.svg" alt="" className="h-6" />
                <p className="text-base font-medium capitalize">vulca comics</p>
            </div>
            <button
                onClick={toggleSidebar}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-black/30 text-gray-300 transition-all duration-200 hover:bg-black/50 hover:text-primary lg:hidden"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
