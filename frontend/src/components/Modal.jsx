import { useEffect } from "react";

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">

      <button
        className="absolute inset-0 h-full w-full bg-black/50"
        onClick={onClose}
        aria-label="Cerrar"
      />

  
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="min-w-0">
              <div className="truncate font-semibold text-primary">{title}</div>
              <div className="text-xs text-secondary/70">Galería</div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold text-primary hover:bg-zinc-50"
            >
              ✕
            </button>
          </div>

          <div className="max-h-[75vh] overflow-auto p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
