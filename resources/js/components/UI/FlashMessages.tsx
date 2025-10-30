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
            {flash.success && <div className="border-success bg-success/10 text-success mb-6 rounded border-l-4 px-4 py-3">{flash.success}</div>}
            {flash.error && <div className="border-danger bg-danger/10 text-danger mb-6 rounded border-l-4 px-4 py-3">{flash.error}</div>}
        </>
    );
}
