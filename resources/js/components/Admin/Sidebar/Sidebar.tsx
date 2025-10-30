// Sidebar.tsx
import Logout from '@/components/UI/Logout';
import Settings from '@/components/UI/Settings';
import ThemeToggle from '@/components/UI/ThemeToggle';
import { Header, Navigation, UserCard } from './index';

interface SidebarProps {
    toggleSidebar: () => void;
}

export default function Sidebar({ toggleSidebar }: SidebarProps) {
    return (
        <div className="border-border-primary from-primary to-tertiary flex h-full w-64 flex-col overflow-hidden rounded-md border bg-gradient-to-b shadow-sm">
            <Header toggleSidebar={toggleSidebar} />
            <div className="flex-1 overflow-y-auto px-2 py-3">
                <Navigation />
            </div>
            <div className="border-border-primary bg-secondary border-t p-1">
                <div className="flex items-center justify-end gap-1">
                    <Settings textIsActive={false} />
                    <ThemeToggle textIsActive={false} />
                    <Logout textIsActive={false} />
                </div>
            </div>
            <UserCard />
        </div>
    );
}
