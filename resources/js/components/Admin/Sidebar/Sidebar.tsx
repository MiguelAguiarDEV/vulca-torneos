import { Logo, NavItem, UserCard } from './index';

interface SidebarProps {
    toggleSidebar: () => void;
}

export default function Sidebar({ toggleSidebar }: SidebarProps) {
    return (
        <div className="flex h-screen w-64 flex-col bg-secondary-dark text-text-primary">
            <Logo toggleSidebar={toggleSidebar} />
            <NavItem />
            <UserCard />
        </div>
    );
}
