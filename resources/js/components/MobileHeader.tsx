import { Menu } from 'lucide-react';

interface MobileHeaderProps {
    onToggleSidebar: () => void;
    pageTitle: string;
}

export default function MobileHeader({ onToggleSidebar, pageTitle }: MobileHeaderProps) {
    return (
        <div className="border-b-2 border-primary bg-secondary/80 backdrop-blur-sm lg:hidden">
            <div className="flex items-center justify-between px-6 py-4">
                <button
                    onClick={onToggleSidebar}
                    className="text-text-primary transition-colors hover:text-primary"
                    type="button"
                    aria-label="Abrir menú"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-semibold text-primary">{pageTitle}</h1>
                <div className="w-6" /> {/* Spacer para centrar el título */}
            </div>
        </div>
    );
}
