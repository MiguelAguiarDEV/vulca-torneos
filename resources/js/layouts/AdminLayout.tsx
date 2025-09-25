import Sidebar from '@/components/Sidebar';
import { usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import React, { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface PageProps extends Record<string, unknown> {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    pageTitle?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = 'Admin', pageTitle = 'Dashboard' }) => {
    const { props } = usePage<PageProps>();
    const { flash } = props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <>
            <title>{title} - Vulca Torneos</title>

            <div className="fixed inset-0 z-0 h-full w-full bg-[url('/assets/fondo2.png')] bg-cover bg-center blur-sm" />

            <div className="relative z-10 flex h-screen bg-transparent">
                {/* Sidebar */}
                <div
                    className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 border-r-2 border-primary bg-secondary/95 shadow-lg backdrop-blur-sm transition-transform duration-300 ease-in-out lg:static lg:translate-x-0`}
                >
                    <Sidebar toggleSidebar={toggleSidebar} />
                </div>

                {/* Main Content */}
                <div className="flex flex-1 flex-col lg:ml-0">
                    {/* Mobile Header */}
                    <div className="border-b-2 border-primary bg-secondary/80 backdrop-blur-sm lg:hidden">
                        <div className="flex items-center justify-between px-6 py-4">
                            <button onClick={toggleSidebar} className="text-text-primary transition-colors hover:text-primary">
                                <Menu className="h-6 w-6" />
                            </button>
                            <h1 className="text-lg font-semibold text-primary">{pageTitle}</h1>
                            <div></div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto bg-transparent p-6">
                        <div className="mx-auto max-w-7xl">
                            {/* Flash Messages */}
                            {flash?.success && (
                                <div className="mb-6 rounded border-l-4 border-success bg-success px-4 py-3 text-text-primary">{flash.success}</div>
                            )}

                            {flash?.error && (
                                <div className="mb-6 rounded border-l-4 border-danger bg-danger px-4 py-3 text-text-primary">{flash.error}</div>
                            )}

                            {children}
                        </div>
                    </main>
                </div>

                {/* Mobile Overlay */}
                {sidebarOpen && <div className="bg-opacity-50 fixed inset-0 z-40 bg-black/20 lg:hidden" onClick={toggleSidebar} />}
            </div>
        </>
    );
};

export default AdminLayout;
