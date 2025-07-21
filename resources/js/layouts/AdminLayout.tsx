import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { 
    Home, 
    Gamepad2, 
    Trophy, 
    Users, 
    LogOut, 
    Menu, 
    X 
} from 'lucide-react';

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

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
    children, 
    title = 'Admin', 
    pageTitle = 'Dashboard' 
}) => {
    const { props } = usePage<PageProps>();
    const { auth, flash } = props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    const navigationItems = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: Home,
        },
        {
            name: 'Juegos',
            href: '/admin/games',
            icon: Gamepad2,
        },
        {
            name: 'Torneos',
            href: '/admin/tournaments',
            icon: Trophy,
        },
        {
            name: 'Inscripciones',
            href: '/admin/registrations',
            icon: Users,
        },
    ];

    const currentPath = usePage().url;

    return (
        <>
            <title>{title} - Vulca Torneos</title>
            
            <div className="flex h-screen bg-[#212121]">
                {/* Sidebar */}
                <div className={`
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    lg:translate-x-0 
                    fixed lg:static 
                    inset-y-0 left-0 
                    z-50 
                    w-64 
                    bg-[#212121] 
                    border-r-2 border-[#f7b134]
                    shadow-lg 
                    transition-transform 
                    duration-300 
                    ease-in-out
                `}>
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b-2 border-[#f7b134] bg-[#1a1a1a]">
                        <Link href="/" className="flex items-center">
                            <span className="text-xl font-bold text-[#f7b134]">Vulca Torneos</span>
                        </Link>
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden text-[#f7b134] hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="mt-6 px-6">
                        <ul className="space-y-2">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentPath === item.href || currentPath.startsWith(item.href);
                                
                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={`
                                                flex items-center px-4 py-3 rounded-lg transition-colors font-medium
                                                ${isActive 
                                                    ? 'bg-[#f7b134] text-[#212121]' 
                                                    : 'text-white hover:bg-[#f7b134]/20 hover:text-[#f7b134]'
                                                }
                                            `}
                                        >
                                            <Icon className="w-5 h-5 mr-3" />
                                            {item.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* User Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 border-t-2 border-[#f7b134] bg-[#1a1a1a]">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-[#f7b134] rounded-full flex items-center justify-center">
                                <span className="text-[#212121] font-bold">
                                    {auth.user.name.charAt(0)}
                                </span>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-white">{auth.user.name}</p>
                                <p className="text-xs text-[#f7b134]">{auth.user.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-white hover:text-[#f7b134] transition-colors"
                                title="Cerrar Sesión"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col lg:ml-0">
                    {/* Mobile Header */}
                    <div className="lg:hidden bg-[#212121] border-b-2 border-[#f7b134]">
                        <div className="flex items-center justify-between px-6 py-4">
                            <button
                                onClick={toggleSidebar}
                                className="text-white hover:text-[#f7b134] transition-colors"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <h1 className="text-lg font-semibold text-[#f7b134]">{pageTitle}</h1>
                            <div></div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto p-6 bg-[#2a2a2a]">
                        <div className="max-w-7xl mx-auto">
                            {/* Flash Messages */}
                            {flash?.success && (
                                <div className="mb-6 bg-green-600 border-l-4 border-green-400 text-white px-4 py-3 rounded">
                                    {flash.success}
                                </div>
                            )}
                            
                            {flash?.error && (
                                <div className="mb-6 bg-red-600 border-l-4 border-red-400 text-white px-4 py-3 rounded">
                                    {flash.error}
                                </div>
                            )}

                            {children}
                        </div>
                    </main>
                </div>

                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={toggleSidebar}
                    />
                )}
            </div>
        </>
    );
};

export default AdminLayout;
