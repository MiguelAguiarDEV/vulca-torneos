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
                <h2 className="text-text-primary mb-4 text-lg font-semibold">{title}</h2>
                <p className="text-text-primary/70 mb-6">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="border-primary/30 text-text-primary hover:bg-primary/20 rounded-lg border px-4 py-2 transition-colors duration-200"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`text-text-primary rounded-lg px-4 py-2 transition-colors duration-200 ${
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
