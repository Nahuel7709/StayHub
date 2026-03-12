import { Link } from "react-router-dom";

export default function AuthRequiredModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-primary">
              Iniciá sesión para continuar
            </h2>
            <p className="mt-2 text-sm text-secondary/80">
              Para guardar alojamientos en favoritos necesitás iniciar sesión o
              registrarte.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-lg text-secondary/70 hover:bg-background"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            to="/login"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
          >
            Iniciar sesión
          </Link>

          <Link
            to="/register"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-primary hover:bg-background"
          >
            Registrarme
          </Link>
        </div>
      </div>
    </div>
  );
}
