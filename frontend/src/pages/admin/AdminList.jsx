import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAdminAccommodations,
  deleteAccommodation,
} from "../../api/accommodations";
import ConfirmDialog from "../../components/ConfirmDialog";

export default function AdminList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminAccommodations();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message ?? "Error cargando lista");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openDelete(r) {
    setToDelete({ id: r.id, name: r.name });
    setConfirmOpen(true);
  }

  function closeDelete() {
    if (deleting) return;
    setConfirmOpen(false);
    setToDelete(null);
  }

  async function confirmDelete() {
    if (!toDelete) return;

    setDeleting(true);
    setToast("");

    try {
      await deleteAccommodation(toDelete.id);

      setConfirmOpen(false);
      setToDelete(null);

      await load();

      
      setToast("Alojamiento eliminado correctamente");
      setTimeout(() => setToast(""), 2500);
    } catch (e) {
      setToast(e?.message ?? "No se pudo eliminar");
      setTimeout(() => setToast(""), 3000);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-primary">
            Lista de alojamientos
          </h1>
          <p className="mt-1 text-sm text-secondary/80">
            Id | Nombre | Acciones
          </p>
        </div>

        <Link
          to="/administracion/agregar"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          Agregar alojamiento
        </Link>
      </div>

      {toast ? (
        <div className="mt-4 rounded-xl border border-border bg-green-200 px-4 py-3 text-sm text-secondary/90">
          {toast}
        </div>
      ) : null}

      {loading && (
        <div className="mt-5 text-sm text-secondary/80">Cargando...</div>
      )}

      {!loading && error && (
        <div className="mt-5 rounded-xl border border-border bg-background/60 p-4">
          <div className="font-semibold text-accent">No se pudo cargar</div>
          <div className="mt-1 text-sm text-secondary/90">{error}</div>
          <button
            onClick={load}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-5 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-background/60">
              <tr className="text-primary">
                <th className="px-4 py-3 font-semibold">Id</th>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-secondary/80" colSpan={3}>
                    No hay alojamientos.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="bg-card">
                    <td className="px-4 py-4 text-secondary/80">{r.id}</td>
                    <td className="px-4 py-4 font-semibold text-primary">
                      {r.name}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => alert("Sprint 1: editar (pendiente)")}
                          className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-primary hover:bg-zinc-50"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => openDelete(r)}
                          className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-accent hover:bg-background/50"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar alojamiento"
        message={
          toDelete
            ? `¿Seguro que querés eliminar "${toDelete.name}"? Esta acción no se puede deshacer.`
            : ""
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        danger
        loading={deleting}
        onClose={closeDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
