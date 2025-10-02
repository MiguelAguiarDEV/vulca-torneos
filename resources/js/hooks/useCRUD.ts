// hooks/useCRUD.ts
import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';

interface UseCRUDOptions {
    resourceName: string; // 'games', 'tournaments', 'registrations'
    routePrefix: string; // 'admin.games', 'admin.tournaments'
}

export function useCRUD({ resourceName, routePrefix }: UseCRUDOptions) {
    const [isLoading, setIsLoading] = useState(false);

    const create = useCallback(
        (data: FormData, onSuccess?: () => void) => {
            setIsLoading(true);
            router.post(route(`${routePrefix}.store`), data, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    console.log(`${resourceName} creado exitosamente`);
                    onSuccess?.();
                },
                onError: (errors) => {
                    console.error(`Error al crear ${resourceName}:`, errors);
                    let errorMessage = `Error al crear ${resourceName}:\n`;
                    Object.keys(errors).forEach((key) => {
                        errorMessage += `${key}: ${errors[key]}\n`;
                    });
                    alert(errorMessage);
                },
                onFinish: () => setIsLoading(false),
            });
        },
        [resourceName, routePrefix],
    );

    const update = useCallback(
        (id: number, data: FormData, onSuccess?: () => void) => {
            setIsLoading(true);
            data.append('_method', 'PUT');
            router.post(route(`${routePrefix}.update`, id), data, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    console.log(`${resourceName} actualizado exitosamente`);
                    onSuccess?.();
                },
                onError: (errors) => {
                    console.error(`Error al actualizar ${resourceName}:`, errors);
                    let errorMessage = `Error al actualizar ${resourceName}:\n`;
                    Object.keys(errors).forEach((key) => {
                        errorMessage += `${key}: ${errors[key]}\n`;
                    });
                    alert(errorMessage);
                },
                onFinish: () => setIsLoading(false),
            });
        },
        [resourceName, routePrefix],
    );

    const destroy = useCallback(
        (id: number, onSuccess?: () => void) => {
            setIsLoading(true);
            router.delete(route(`${routePrefix}.destroy`, id), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    console.log(`${resourceName} eliminado exitosamente`);
                    onSuccess?.();
                },
                onError: (errors) => {
                    console.error(`Error al eliminar ${resourceName}:`, errors);
                    alert(`Error al eliminar ${resourceName}. Intenta nuevamente.`);
                },
                onFinish: () => setIsLoading(false),
            });
        },
        [resourceName, routePrefix],
    );

    const navigateTo = useCallback((routeName: string, params?: any) => {
        router.get(route(routeName, params));
    }, []);

    return {
        isLoading,
        create,
        update,
        destroy,
        navigateTo,
    };
}
