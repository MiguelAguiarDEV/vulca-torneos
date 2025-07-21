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
            href: '/admin',
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

            <div className="fixed inset-0 w-full h-full bg-cover bg-center z-0 bg-[url('/assets/fondo2.png')] blur-sm" />
            
            <div className="relative flex h-screen bg-transparent z-10">
                {/* Sidebar */}
                <div className={`
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    lg:translate-x-0 
                    fixed lg:static 
                    inset-y-0 left-0 
                    z-50 
                    w-64 
                    bg-secondary/95 backdrop-blur-sm
                    border-r-2 border-primary
                    shadow-lg 
                    transition-transform 
                    duration-300 
                    ease-in-out
                `}>
                    {/* Logo */}
                    <div className="relative flex items-center justify-end h-16 px-6 border-b-2 border-primary bg-secondary-dark/80">
                        <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <img src="/assets/logo.png" className="h-10 w-auto" alt="Vulca Torneos" />
                        </Link>
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden text-primary hover:text-text-primary transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="mt-6 px-6">
                        <ul className="space-y-2">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.href === '/admin'
                                    ? currentPath === item.href
                                    : currentPath.startsWith(item.href);
                                
                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={`
                                                flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200
                                                ${isActive 
                                                    ? 'bg-primary text-secondary shadow-lg scale-105' 
                                                    : 'text-text-primary hover:bg-primary-alpha-20 hover:text-primary'
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
                    <div className="absolute bottom-0 left-0 right-0 p-6 border-t-2 border-primary bg-secondary-dark/80">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-secondary font-bold">
                                    {auth.user.name.charAt(0)}
                                </span>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-text-primary">{auth.user.name}</p>
                                <p className="text-xs text-primary">{auth.user.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-text-primary hover:text-primary transition-colors"
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
                    <div className="lg:hidden bg-secondary/80 backdrop-blur-sm border-b-2 border-primary">
                        <div className="flex items-center justify-between px-6 py-4">
                            <button
                                onClick={toggleSidebar}
                                className="text-text-primary hover:text-primary transition-colors"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <h1 className="text-lg font-semibold text-primary">{pageTitle}</h1>
                            <div></div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto p-6 bg-transparent">
                        <div className="max-w-7xl mx-auto">
                            {/* Flash Messages */}
                            {flash?.success && (
                                <div className="mb-6 bg-success border-l-4 border-success text-text-primary px-4 py-3 rounded">
                                    {flash.success}
                                </div>
                            )}
                            
                            {flash?.error && (
                                <div className="mb-6 bg-danger border-l-4 border-danger text-text-primary px-4 py-3 rounded">
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
