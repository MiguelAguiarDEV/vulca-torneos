import { Logo, Navigation, UserCard } from './index';
interface SidebarProps {
    toggleSidebar: () => void;
}

export default function Sidebar({ toggleSidebar }: SidebarProps) {
    return (
        <div className="flex h-full w-64 flex-col bg-secondary-dark text-text-primary">
            <Logo toggleSidebar={toggleSidebar} />
            <div className="flex-1 overflow-y-auto">
                <Navigation />
            </div>
            <UserCard />
        </div>
    );
}
