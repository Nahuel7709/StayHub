import { useEffect, useMemo, useState } from "react";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
} from "../../api/categories";
import ConfirmDialog from "../../components/ConfirmDialog";

function Field({ label, error, children }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-semibold text-primary">{label}</div>
      {children}
      {error ? <div className="mt-1 text-xs text-accent">{error}</div> : null}
    </label>
  );
}

export default function AdminCategories() {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const previewUrl = useMemo(() => {
    if (!imageFile) return "";
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function loadCategories() {
    setLoadingList(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setServerError(err.message || "No se pudieron cargar las categorías");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handlePickImage(e) {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  }

  function clearImage() {
    setImageFile(null);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setServerError("");
    setSuccessMessage("");
    setFieldErrors(null);

    if (!imageFile) {
      setSubmitting(false);
      setServerError("Debés seleccionar una imagen para la categoría.");
      return;
    }

    try {
      const created = await createCategory({
        name: form.name.trim(),
        description: form.description.trim(),
        file: imageFile,
      });

      setSuccessMessage(`Categoría "${created.name}" creada con éxito.`);
      setForm({
        name: "",
        description: "",
      });
      setImageFile(null);

      await loadCategories();
    } catch (err) {
      setServerError(err.message || "Error al crear categoría");
      setFieldErrors(err.fields || null);
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDeleteCategory() {
    if (!categoryToDelete) return;

    setDeletingId(categoryToDelete.id);
    setServerError("");
    setSuccessMessage("");

    try {
      await deleteCategory(categoryToDelete.id);
      setSuccessMessage(
        `Categoría "${categoryToDelete.name}" eliminada con éxito.`,
      );
      setCategoryToDelete(null);
      await loadCategories();
    } catch (err) {
      setServerError(err.message || "No se pudo eliminar la categoría");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="mx-auto max-w-screen-xl px-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-semibold text-primary">
          Categorías
        </h1>
        <p className="text-sm text-secondary/80">
          Creá, visualizá y eliminá categorías del catálogo.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form
          onSubmit={onSubmit}
          className="lg:col-span-1 rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          {serverError ? (
            <div className="mb-4 rounded-xl border border-border bg-background/60 p-4">
              <div className="font-semibold text-accent">
                No se pudo completar
              </div>
              <div className="mt-1 text-sm text-secondary/90">
                {serverError}
              </div>
            </div>
          ) : null}

          {successMessage ? (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="font-semibold text-green-700">Listo</div>
              <div className="mt-1 text-sm text-green-700">
                {successMessage}
              </div>
            </div>
          ) : null}

          <div className="space-y-4">
            <Field label="Nombre" error={fieldErrors?.name}>
              <input
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary/40"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Ej: Playa"
              />
            </Field>

            <Field label="Descripción" error={fieldErrors?.description}>
              <textarea
                className="min-h-[120px] w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary/40"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Ej: Alojamientos cerca del mar."
              />
            </Field>

            <Field label="Imagen" error={fieldErrors?.image}>
              <input
                type="file"
                accept="image/*"
                onChange={handlePickImage}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary/40"
              />
            </Field>

            {imageFile && (
              <div className="overflow-hidden rounded-2xl border border-border bg-background/40">
                <img
                  src={previewUrl}
                  alt={imageFile.name}
                  className="h-44 w-full object-cover"
                />
                <div className="flex items-center justify-between gap-3 p-3">
                  <div
                    className="truncate text-xs text-secondary/80"
                    title={imageFile.name}
                  >
                    {imageFile.name}
                  </div>
                  <button
                    type="button"
                    onClick={clearImage}
                    className="rounded-xl border border-border px-3 py-2 text-xs font-semibold text-primary hover:bg-zinc-50"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              disabled={submitting}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
              type="submit"
            >
              {submitting ? "Guardando..." : "Agregar categoría"}
            </button>

            <button
              type="button"
              onClick={() => {
                setServerError("");
                setSuccessMessage("");
                setFieldErrors(null);
              }}
              className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-primary hover:bg-zinc-50"
            >
              Limpiar alertas
            </button>
          </div>
        </form>

        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="font-serif text-2xl font-semibold text-primary">
              Lista de categorías
            </h2>
            <p className="text-sm text-secondary/80">
              {loadingList
                ? "Cargando categorías..."
                : `${categories.length} categorías registradas`}
            </p>
          </div>

          {loadingList ? (
            <div className="text-sm text-secondary/70">Cargando...</div>
          ) : categories.length === 0 ? (
            <div className="rounded-xl border border-border bg-background/60 p-4 text-sm text-secondary/80">
              No hay categorías cargadas todavía.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {categories.map((category) => (
                <article
                  key={category.id}
                  className="overflow-hidden rounded-2xl border border-border bg-background/40"
                >
                  <div className="flex items-center justify-end border-b border-border px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setCategoryToDelete(category)}
                      disabled={deletingId === category.id}
                      className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      {deletingId === category.id
                        ? "Eliminando..."
                        : "Eliminar"}
                    </button>
                  </div>

                  <div className="h-40 w-full bg-border/60">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="font-semibold text-primary">
                      {category.name}
                    </div>
                    <div className="mt-1 text-sm text-secondary/80">
                      {category.description}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={!!categoryToDelete}
        title="Eliminar categoría"
        message={
          categoryToDelete
            ? `¿Seguro que querés eliminar la categoría "${categoryToDelete.name}"? Los alojamientos que la usen quedarán sin categoría.`
            : ""
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        danger
        loading={!!deletingId}
        onConfirm={confirmDeleteCategory}
        onClose={() => {
          if (!deletingId) setCategoryToDelete(null);
        }}
      />
    </div>
  );
}
