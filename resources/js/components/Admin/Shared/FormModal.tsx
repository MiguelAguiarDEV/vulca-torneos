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
            <div className="border-primary bg-secondary/95 rounded-lg border-2 p-6 backdrop-blur-sm">
                <h2 className="text-text-primary mb-4 text-xl font-semibold">{title}</h2>

                <div className="mb-6">{children}</div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="border-primary/30 bg-secondary-light text-text-primary hover:bg-secondary-lighter rounded-lg border px-4 py-2 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onSubmit}
                        className="bg-primary text-secondary hover:bg-primary-dark rounded-lg px-4 py-2 font-medium shadow-lg transition-colors"
                    >
                        {submitText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
