import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);

  
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setOpen(false); 
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-white/80 backdrop-blur">
      <div className="mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/StayHub-logo.svg"
            alt="StayHub"
            className="h-14 w-auto sm:h-16 md:h-20"
          />
          <span className="hidden text-sm text-secondary/80 sm:inline">
            Hoteles, casas y más
          </span>
        </Link>

        <div className="hidden md:flex gap-2">
          <Link
            to="/administracion"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-primary hover:bg-zinc-50"
          >
            Admin
          </Link>

          <button className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-primary hover:bg-zinc-50">
            Crear cuenta
          </button>

          <button className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95">
            Iniciar sesión
          </button>
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold text-primary hover:bg-zinc-50"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-white/90 backdrop-blur">
          <div className="mx-auto flex flex-col gap-2 px-6 py-4">
            <Link
              to="/administracion"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center rounded-xl border border-border bg-card px-4 py-3 text-center text-sm font-semibold text-primary hover:bg-zinc-50"
            >
              Admin
            </Link>

            <button
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center rounded-xl border border-border bg-card px-4 py-3 text-center text-sm font-semibold text-primary hover:bg-zinc-50"
            >
              Crear cuenta
            </button>

            <button
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white hover:opacity-95"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
