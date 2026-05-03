export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-surface rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        <div className="px-6 pt-6 pb-2">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="mt-1.5 text-sm text-muted leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3 px-6 py-4">
          <button
            id="modal-cancel-btn"
            onClick={onCancel}
            className="flex-1 btn-secondary"
          >
            {cancelLabel}
          </button>
          <button
            id="modal-confirm-btn"
            onClick={onConfirm}
            className={`flex-1 ${danger ? 'btn-danger' : 'btn-primary'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
