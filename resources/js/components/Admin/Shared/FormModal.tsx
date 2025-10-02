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
            <div className="rounded-lg border-2 border-primary bg-secondary/95 p-6 backdrop-blur-sm">
                <h2 className="mb-4 text-xl font-semibold text-text-primary">{title}</h2>

                <div className="mb-6">{children}</div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-primary/30 bg-secondary-light px-4 py-2 text-text-primary transition-colors hover:bg-secondary-lighter"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onSubmit}
                        className="rounded-lg bg-primary px-4 py-2 font-medium text-secondary shadow-lg transition-colors hover:bg-primary-dark"
                    >
                        {submitText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
