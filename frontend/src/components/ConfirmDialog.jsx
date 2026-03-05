import Modal from "./Modal";

export default function ConfirmDialog({
  open,
  title = "Confirmar",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  danger = false,
  loading = false,
  onConfirm,
  onClose,
}) {
  return (
    <Modal open={open} onClose={loading ? undefined : onClose} title={title}>
      <div className="text-sm text-secondary/90">{message}</div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-primary hover:bg-zinc-50 disabled:opacity-60"
        >
          {cancelText}
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={[
            "rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-60",
            danger
              ? "bg-accent hover:opacity-95"
              : "bg-primary hover:opacity-95",
          ].join(" ")}
        >
          {loading ? "Eliminando..." : confirmText}
        </button>
      </div>
    </Modal>
  );
}
