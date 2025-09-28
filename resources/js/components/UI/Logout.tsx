import { router } from "@inertiajs/react";
import { LogOut } from "lucide-react";


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
            className="absolute top-2 right-2 text-text-primary transition-colors hover:text-primary"
            title="Cerrar Sesión"
            type="button"
        >
            <LogOut className="h-4 w-4" />
        </button>
    )
}
