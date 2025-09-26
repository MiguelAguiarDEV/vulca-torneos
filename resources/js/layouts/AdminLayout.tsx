import Main from '@/components/Admin/Main/Main';
import Sidebar from '@/components/Admin/Sidebar';
import Background from '@/components/Background';
import MobileHeader from '@/components/MobileHeader';
import React, { useCallback, useState } from 'react';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    pageTitle: string;
}

export default function AdminLayout({ children, title, pageTitle }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = useCallback(() => {
        setSidebarOpen((prev) => !prev);
    }, []);

    return (
        <>
            <title>{title ? `${title} - ${pageTitle}` : pageTitle}</title>
            <Background />
            <div className="relative z-10 flex h-screen bg-transparent">
                {/* Sidebar */}
                <aside
                    className={`${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } fixed inset-y-0 left-0 z-50 w-64 border-r-2 border-primary bg-secondary/95 shadow-lg backdrop-blur-sm transition-transform duration-300 ease-in-out lg:static lg:translate-x-0`}
                    aria-label="Sidebar"
                >
                    <Sidebar toggleSidebar={toggleSidebar} />
                </aside>

                {/* Main Content */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Mobile Header */}
                    <MobileHeader onToggleSidebar={toggleSidebar} pageTitle={pageTitle} />
                    {/* Main Content Area */}
                    <Main children={children} />
                </div>
            </div>
        </>
    );
}
