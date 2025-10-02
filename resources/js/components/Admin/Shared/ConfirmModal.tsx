// components/Admin/Shared/ConfirmModal.tsx
import Modal from '@/components/UI/Modal';

interface ConfirmModalProps {
    show: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDestructive?: boolean;
}

export function ConfirmModal({
    show,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
    isDestructive = false,
}: ConfirmModalProps) {
    return (
        <Modal show={show} onClose={onCancel}>
            <div className="p-6">
                <h2 className="mb-4 text-lg font-semibold text-text-primary">{title}</h2>
                <p className="mb-6 text-text-primary/70">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="rounded-lg border border-primary/30 px-4 py-2 text-text-primary transition-colors duration-200 hover:bg-primary/20"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`rounded-lg px-4 py-2 text-text-primary transition-colors duration-200 ${
                            isDestructive ? 'bg-danger hover:bg-danger/90' : 'bg-primary hover:bg-primary-dark'
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
