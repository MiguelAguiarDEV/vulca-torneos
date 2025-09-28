import { SettingsIcon } from "lucide-react";

interface SettingsProps {
  textIsActive?: boolean;
}

export default function Settings({ textIsActive }: SettingsProps) {
return (
    <button
        className={`mx-4 flex items-center overflow-hidden rounded-md py-2 text-sm text-text-primary transition-colors duration-200 hover:bg-secondary-lighter group
            ${textIsActive ? "gap-4 px-4" : "w-fit px-2"}`}
        title="Configuración"
        type="button"
    >
    <SettingsIcon className="h-4 w-4 transform transition-transform duration-200 group-hover:rotate-90" />
    {textIsActive && (
        <p className="transform transition-transform duration-200">
        Configuración
        </p>
    )}
    </button>
);
}
