// hooks/useAdminLayout.ts
import { User } from '@/types';
import { usePage } from '@inertiajs/react';
import { useCallback, useState } from 'react';

// 1. Definir los tipos que necesitamos
interface PageProps extends Record<string, unknown> {
    auth: { user: User };
    flash?: { success?: string; error?: string };
}

// 2. Definir qué devuelve nuestro hook
interface UseAdminLayoutReturn {
    // Estado del sidebar
    sidebarOpen: boolean;

    // Funciones para manejar el sidebar
    toggleSidebar: () => void;
    closeSidebar: () => void;

    // Datos de la página
    user: User;
    flash?: { success?: string; error?: string };
}

// 3. Crear el hook personalizado
export function useAdminLayout(): UseAdminLayoutReturn {
    // PASO A: Obtener datos de la página usando usePage (hook de Inertia)
    const { props } = usePage<PageProps>();
    const { auth, flash } = props;

    // PASO B: Estado local para el sidebar
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // PASO C: Funciones memorizadas con useCallback
    const toggleSidebar = useCallback(() => {
        setSidebarOpen((prev) => !prev);
    }, []); // Array vacío = nunca cambia

    const closeSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    // PASO D: Retornar todo lo que necesita el componente
    return {
        // Estado
        sidebarOpen,

        // Funciones
        toggleSidebar,
        closeSidebar,

        // Datos
        user: auth.user,
        flash,
    };
}
