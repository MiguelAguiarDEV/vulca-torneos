// hooks/useConfirmModal.ts
import { useCallback, useState } from 'react';

export function useConfirmModal<T = any>() {
    const [isOpen, setIsOpen] = useState(false);
    const [item, setItem] = useState<T | null>(null);

    const open = useCallback((itemToDelete: T) => {
        setItem(itemToDelete);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        setItem(null);
    }, []);

    return { isOpen, item, open, close };
}
