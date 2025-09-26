interface FlashMessagesProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function FlashMessages({ flash }: FlashMessagesProps) {
    if (!flash?.success && !flash?.error) return null;

    return (
        <>
            {flash.success && <div className="mb-6 rounded border-l-4 border-success bg-success/10 px-4 py-3 text-success">{flash.success}</div>}
            {flash.error && <div className="mb-6 rounded border-l-4 border-danger bg-danger/10 px-4 py-3 text-danger">{flash.error}</div>}
        </>
    );
}
