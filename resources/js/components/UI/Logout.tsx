import { router } from "@inertiajs/react";
import { LogIn, LogOut } from "lucide-react";


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
        },
    );
};

export default function Logout() {
    return (
        <button
            onClick={handleLogout}
            className="text-text-primary transition-colors  duration-200 hover:bg-danger/10 hover:text-danger rounded-md px-4 py-2 text-sm mx-4 flex items-center group overflow-hidden gap-4"
            title="Cerrar Sesión"
            type="button"
        >
            <LogOut className="h-4 w-4 group-hover:-translate-x-10 transform transition-transform duration-200" />
            <p className="group-hover:-translate-x-8 transform transition-transform duration-200">Cerrar sesión</p>
            <LogOut className="h-4 w-4 group-hover:translate-x-8 translate-x-30  transform transition-transform duration-200" />
        </button>
    )
}
