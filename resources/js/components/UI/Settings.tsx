import { Settings } from "lucide-react";

export default function Logout() {
    return (
        <button
            // onClick={}
            className="text-text-primary transition-colors  duration-200 hover:bg-secondary-lighter gap-4 rounded-md px-4 py-2 text-sm mx-4 flex items-center group overflow-hidden"
            title="Configuración"
            type="button"
        >
            <Settings className="h-4 w-4 group-hover:rotate-90  transform transition-transform duration-200" />
            <p className=" transform transition-transform duration-200">Configuración</p>
        </button>
    )
}
