// components/Admin/Shared/FormModal.tsx
import Modal from '@/components/UI/Modal';
import React from 'react';

interface FormModalProps {
    show: boolean;
    title: string;
    onClose: () => void;
    onSubmit: () => void;
    children: React.ReactNode;
    submitText?: string;
    cancelText?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function FormModal({
    show,
    title,
    onClose,
    onSubmit,
    children,
    submitText = 'Guardar',
    cancelText = 'Cancelar',
    maxWidth = 'lg',
}: FormModalProps) {
    return (
        <Modal show={show} onClose={onClose} maxWidth={maxWidth}>
            <div className="border-border-primary bg-secondary rounded-xl border p-6 shadow-lg">
                <h2 className="text-t-primary mb-6 text-xl font-semibold">{title}</h2>

                <div className="mb-6">{children}</div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="border-border-primary bg-tertiary text-t-secondary hover:bg-highlight hover:text-t-primary rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onSubmit}
                        className="bg-accent hover:bg-accent-hover rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:shadow-md"
                    >
                        {submitText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
