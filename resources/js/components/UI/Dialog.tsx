// resources/js/components/ui/dialog.tsx
import { ReactNode, useEffect } from 'react';

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    );
}

export function DialogContent({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <div className={`border-border-primary bg-primary rounded-xl border shadow-xl ${className}`}>{children}</div>;
}

export function DialogHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <div className={className}>{children}</div>;
}

export function DialogTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <h2 className={className}>{children}</h2>;
}
