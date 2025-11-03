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
            <div className="bg-primary p-6">
                <h2 className="text-t-primary mb-4 text-lg font-semibold">{title}</h2>
                <p className="text-t-secondary mb-6 text-sm">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="border-border-primary bg-secondary text-t-secondary hover:bg-highlight hover:text-t-primary rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
                            isDestructive ? 'bg-danger hover:bg-danger/90' : 'bg-accent hover:bg-accent-hover'
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
