import { router } from "@inertiajs/react";
import { LogOut } from "lucide-react";

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
        },
    );
};

export default function Logout({ textIsActive }: LogoutProps) {
    return (
        <button
            onClick={handleLogout}
            className={`mx-4 flex items-center overflow-hidden rounded-md py-2 text-sm text-text-primary transition-colors duration-200 hover:bg-danger/10 hover:text-danger group
                ${textIsActive ? "gap-4 px-4" : "w-fit px-2"}`}
            title="Cerrar Sesión"
            type="button"
        >
        {textIsActive ? (
            <>
            <LogOut className="h-4 w-4 transform transition-transform duration-200 group-hover:-translate-x-30" />
            <p className="transform transition-transform duration-200 group-hover:-translate-x-8">
                Cerrar sesión
            </p>
            <LogOut className="h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-8 translate-x-30" />
            </>
        ) : (
            <LogOut className="h-4 w-4 transform transition-transform duration-200" />
        )}
        </button>

    )
}
