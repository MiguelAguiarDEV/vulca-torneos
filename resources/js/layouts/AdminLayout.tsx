// AdminLayout.tsx - FINAL Y LIMPIO
import MobileHeader from '@/components/Admin/MobileHeader';
import Sidebar from '@/components/Admin/Sidebar';
import Background from '@/components/UI/Background';
import FlashMessages from '@/components/UI/FlashMessages';
import { useAdminLayout } from '@/hooks/useAdminLayout';
import React from 'react';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    pageTitle: string;
}

export default function AdminLayout({ children, title, pageTitle }: AdminLayoutProps) {
    const { sidebarOpen, toggleSidebar, closeSidebar, flash } = useAdminLayout();

    return (
        <>
            <title>{title ? `${title} - ${pageTitle}` : pageTitle} - Vulca Torneos</title>
            <Background />

            <div className="relative z-10 flex h-screen bg-transparent">
                {/* Sidebar */}
                <aside
                    className={`${
                        sidebarOpen ? 'translate-x-0 pl-2' : '-translate-x-full pl-0'
                    } fixed inset-y-0 left-0 z-50 w-64 py-2 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:pl-2`}
                    aria-label="Sidebar"
                >
                    <Sidebar toggleSidebar={toggleSidebar} />
                </aside>

                {/* Main Content */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Mobile Header */}
                    <MobileHeader onToggleSidebar={toggleSidebar} pageTitle={pageTitle} />

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto bg-transparent px-6 py-2">
                        <div className="max-w-8xl mx-auto">
                            <FlashMessages flash={flash} />
                            {children}
                        </div>
                    </main>
                </div>

                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden" onClick={closeSidebar} aria-label="Cerrar menú" />
                )}
            </div>
        </>
    );
}
