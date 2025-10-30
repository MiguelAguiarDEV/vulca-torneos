import { SettingsIcon } from 'lucide-react';

interface SettingsProps {
    textIsActive?: boolean;
}

export default function Settings({ textIsActive }: SettingsProps) {
    return (
        <button
            className={`text-text-primary hover:bg-info/10 bg-tertiary hover:text-info group flex w-full cursor-pointer items-center overflow-hidden rounded-md py-4 text-sm transition-colors duration-200 ${textIsActive ? 'gap-4 px-4' : 'justify-center px-2'}`}
            title="Configuración"
            type="button"
        >
            <SettingsIcon className="h-4 w-4 transform transition-transform duration-200 group-hover:rotate-90" />
            {textIsActive && <p className="transform transition-transform duration-200">Configuración</p>}
        </button>
    );
}
