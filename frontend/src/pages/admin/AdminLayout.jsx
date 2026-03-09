import { NavLink, Outlet, Link } from "react-router-dom";

const itemClass = ({ isActive }) =>
  [
    "rounded-xl px-4 py-3 text-sm font-semibold transition border",
    isActive
      ? "bg-background text-primary border-border"
      : "bg-card text-primary border-border hover:bg-zinc-50",
  ].join(" ");

export default function AdminLayout() {
  return (
    <div className="w-full">
      <div className="mx-auto max-w-screen-xl px-6 py-10 md:hidden">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h1 className="font-serif text-2xl font-semibold text-primary">
            Administración
          </h1>
          <p className="mt-2 text-sm text-secondary/80">
            El panel de administración no está disponible en dispositivos
            móviles. Abrilo desde una computadora.
          </p>

          <Link
            to="/"
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Volver al inicio
          </Link>
        </div>
      </div>

      <div className="mx-auto hidden max-w-screen-xl px-6 py-10 md:block">
        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="font-semibold text-primary">Panel</div>

            <div className="mt-3 flex flex-col gap-2">
              <NavLink to="agregar" className={itemClass}>
                Agregar alojamiento
              </NavLink>
              <NavLink to="lista" className={itemClass}>
                Lista de alojamientos
              </NavLink>
              <NavLink to="categorias" className={itemClass}>
                Categorías
              </NavLink>
              <NavLink to="caracteristicas" className={itemClass}>
                Características
              </NavLink>
            </div>
          </aside>

          <section className="col-span-9">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}
