import Logout from '@/components/UI/Logout';
import Settings from '@/components/UI/Settings';
import { Header, Navigation, UserCard } from './index';
interface SidebarProps {
    toggleSidebar: () => void;
}

export default function Sidebar({ toggleSidebar }: SidebarProps) {
    return (
        <div className="flex h-full w-64 flex-col rounded-md border-2 border-secondary-lighter bg-gradient-to-br from-secondary-dark via-secondary to-secondary-light text-text-primary">
            <Header toggleSidebar={toggleSidebar} />
            <div className="flex-1 overflow-y-auto">
                <Navigation />
            </div>
            <Settings />
            <Logout />
            <UserCard />
        </div>
    );
}
