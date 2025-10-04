import Logout from '@/components/UI/Logout';
import Settings from '@/components/UI/Settings';
import { Header, Navigation, UserCard } from './index';
interface SidebarProps {
    toggleSidebar: () => void;
}

export default function Sidebar({ toggleSidebar }: SidebarProps) {
    return (
        <div className="border-secondary-lighter from-secondary-dark via-secondary to-secondary-light flex h-full w-64 flex-col rounded-md border-2 bg-gradient-to-br text-text-primary">
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
