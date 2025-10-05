import Logout from '@/components/UI/Logout';
import Settings from '@/components/UI/Settings';
import { Header, Navigation, UserCard } from './index';

interface SidebarProps {
    toggleSidebar: () => void;
}

export default function Sidebar({ toggleSidebar }: SidebarProps) {
    return (
        <div className="flex h-full w-64 flex-col overflow-hidden rounded-2xl border-4 border-ink bg-secondary shadow-[6px_6px_0_var(--color-ink)]">
            <Header toggleSidebar={toggleSidebar} />
            <div className="flex-1 overflow-y-auto">
                <Navigation />
            </div>
            <Settings textIsActive />
            <Logout textIsActive />
            <UserCard />
        </div>
    );
}
