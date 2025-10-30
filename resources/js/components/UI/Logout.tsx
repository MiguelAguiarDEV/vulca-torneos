import { router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';

interface LogoutProps {
    textIsActive?: boolean;
}

const handleLogout = () => {
    router.post(
        '/logout',
        {},
        {
            preserveState: false,
            preserveScroll: false,
            onError: (errors) => {
                console.error('Error en logout:', errors);
            },
        }
    );
};

export default function Logout({ textIsActive }: LogoutProps) {
    return (
        <button
            onClick={handleLogout}
            className={`text-text-primary hover:bg-danger/10 bg-tertiary hover:text-danger group flex w-full cursor-pointer items-center overflow-hidden rounded-md py-4 text-sm transition-colors duration-200 ${textIsActive ? 'gap-4 px-4' : 'justify-center px-2'}`}
            title="Cerrar Sesión"
            type="button"
        >
            {textIsActive ? (
                <>
                    <LogOut className="h-4 w-4 transform transition-transform duration-200 group-hover:-translate-x-30" />
                    <p className="transform transition-transform duration-200 group-hover:-translate-x-8">Cerrar sesión</p>
                    <LogOut className="h-4 w-4 translate-x-30 transform transition-transform duration-200 group-hover:translate-x-18" />
                </>
            ) : (
                <LogOut className="h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-4" />
            )}
        </button>
    );
}
