import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
    textIsActive?: boolean;
}

export default function ThemeToggle({ textIsActive }: ThemeToggleProps) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = useState(false);

    // Establece el tema desde localStorage o sistema al cargar
    useEffect(() => {
        const saved =
            (localStorage.getItem('theme') as 'light' | 'dark') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

        setTheme(saved);
        const html = document.documentElement;
        html.dataset.theme = saved;
        html.style.colorScheme = saved;
        setMounted(true);
    }, []);

    // Función para alternar el tema con View Transition API si está disponible
    const toggleTheme = () => {
        const next = theme === 'light' ? 'dark' : 'light';
        const html = document.documentElement;

        const applyTheme = () => {
            setTheme(next);
            html.dataset.theme = next;
            html.style.colorScheme = next;
            localStorage.setItem('theme', next);
        };

        if ('startViewTransition' in document) {
            document.startViewTransition(() => applyTheme());
        } else {
            applyTheme();
        }
    };

    if (!mounted) return null;

    const isLight = theme === 'light';

    return (
        <button
            onClick={toggleTheme}
            className={`group bg-tertiary text-text-primary hover:bg-accent/10 hover:text-accent flex w-full cursor-pointer items-center overflow-hidden rounded-md py-4 text-sm transition-colors duration-200 ${textIsActive ? 'gap-4 px-4' : 'justify-center px-2'}`}
            title={isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
            type="button"
        >
            {textIsActive ? (
                <>
                    {isLight ? (
                        <>
                            <Sun className="h-4 w-4 transform transition-transform duration-200 group-hover:-translate-x-3" />
                            <p className="transform transition-transform duration-200 group-hover:-translate-x-2">Modo claro</p>
                            <Moon className="h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-3" />
                        </>
                    ) : (
                        <>
                            <Moon className="h-4 w-4 transform transition-transform duration-200 group-hover:-translate-x-3" />
                            <p className="transform transition-transform duration-200 group-hover:-translate-x-2">Modo oscuro</p>
                            <Sun className="h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-3" />
                        </>
                    )}
                </>
            ) : (
                <div className="relative h-4 w-4">
                    <Sun
                        className={`absolute inset-0 h-4 w-4 transition-all duration-300 ease-in-out group-hover:scale-110 ${
                            isLight ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-180 opacity-0'
                        }`}
                    />
                    <Moon
                        className={`absolute inset-0 h-4 w-4 transition-all duration-300 ease-in-out group-hover:scale-110 ${
                            isLight ? 'scale-0 -rotate-180 opacity-0' : 'scale-100 rotate-0 opacity-100'
                        }`}
                    />
                </div>
            )}
        </button>
    );
}
