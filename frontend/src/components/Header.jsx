import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/hooks/useAuth";


export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

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

        <div className="hidden md:flex items-center gap-2">
          {isAdmin && (
            <Link
              to="/administracion"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-primary hover:bg-zinc-50"
            >
              Admin
            </Link>
          )}

          {!isAuthenticated ? (
            <>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-primary hover:bg-zinc-50"
              >
                Crear cuenta
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
              >
                Iniciar sesión
              </Link>
            </>
          ) : (
            <>
              <div className="rounded-xl border border-border bg-card px-4 py-2 text-sm">
                {`${user.firstName[0]}${user.lastName[0]} `}
                <span className="font-semibold text-primary">
                  {user.firstName}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
              >
                Cerrar sesión
              </button>
            </>
          )}
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
            {isAdmin && (
              <Link
                to="/administracion"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center rounded-xl border border-border bg-card px-4 py-3 text-center text-sm font-semibold text-primary hover:bg-zinc-50"
              >
                Admin
              </Link>
            )}

            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl border border-border bg-card px-4 py-3 text-center text-sm font-semibold text-primary hover:bg-zinc-50"
                >
                  Crear cuenta
                </Link>

                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white hover:opacity-95"
                >
                  Iniciar sesión
                </Link>
              </>
            ) : (
              <>
                <div className="rounded-xl border border-border bg-card px-4 py-3 text-center text-sm">
                  {`${user.firstName[0]}${user.lastName[0]} `}
                  <span className="font-semibold text-primary">
                    {user.firstName}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white hover:opacity-95"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
