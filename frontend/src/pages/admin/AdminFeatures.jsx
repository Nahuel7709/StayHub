import { useEffect, useState } from "react";
import {
  createFeature,
  deleteFeature,
  fetchFeatures,
  updateFeature,
} from "../../api/features";
import ConfirmDialog from "../../components/ConfirmDialog";
import FeatureIcon from "../../components/FeatureIcon";
import { FEATURE_ICON_OPTIONS } from "../../utils/featureIconOptions";

function Field({ label, error, children }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-semibold text-primary">{label}</div>
      {children}
      {error ? <div className="mt-1 text-xs text-accent">{error}</div> : null}
    </label>
  );
}

export default function AdminFeatures() {
  const [form, setForm] = useState({
    name: "",
    icon: "wifi",
  });

  const [features, setFeatures] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [editingId, setEditingId] = useState("");

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState(null);

  const [featureToDelete, setFeatureToDelete] = useState(null);

  async function loadFeatures() {
    setLoadingList(true);
    try {
      const data = await fetchFeatures();
      setFeatures(data);
    } catch (err) {
      setServerError(
        err.message || "No se pudieron cargar las características",
      );
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadFeatures();
  }, []);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setForm({
      name: "",
      icon: "wifi",
    });
    setEditingId("");
    setFieldErrors(null);
  }

  function clearAlerts() {
    setServerError("");
    setSuccessMessage("");
    setFieldErrors(null);
  }

  function startEdit(feature) {
    clearAlerts();
    setEditingId(feature.id);
    setForm({
      name: feature.name,
      icon: feature.icon,
    });
  }

  function cancelEdit() {
    resetForm();
    clearAlerts();
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    clearAlerts();

    try {
      if (editingId) {
        const updated = await updateFeature(editingId, {
          name: form.name.trim(),
          icon: form.icon,
        });

        setSuccessMessage(
          `Característica "${updated.name}" actualizada con éxito.`,
        );
      } else {
        const created = await createFeature({
          name: form.name.trim(),
          icon: form.icon,
        });

        setSuccessMessage(`Característica "${created.name}" creada con éxito.`);
      }

      resetForm();
      await loadFeatures();
    } catch (err) {
      setServerError(
        err.message ||
          (editingId
            ? "Error al actualizar característica"
            : "Error al crear característica"),
      );
      setFieldErrors(err.fields || null);
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDeleteFeature() {
    if (!featureToDelete) return;

    setDeletingId(featureToDelete.id);
    setServerError("");
    setSuccessMessage("");

    try {
      await deleteFeature(featureToDelete.id);
      setSuccessMessage(
        `Característica "${featureToDelete.name}" eliminada con éxito.`,
      );
      setFeatureToDelete(null);

      if (editingId === featureToDelete.id) {
        resetForm();
      }

      await loadFeatures();
    } catch (err) {
      setServerError(err.message || "No se pudo eliminar la característica");
    } finally {
      setDeletingId("");
    }
  }

  const isEditing = !!editingId;

  return (
    <div className="mx-auto max-w-screen-xl px-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-semibold text-primary">
          Características
        </h1>
        <p className="text-sm text-secondary/80">
          Creá, editá, visualizá y eliminá características del catálogo.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form
          onSubmit={onSubmit}
          className="lg:col-span-1 rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="mb-4">
            <div className="text-sm font-semibold text-primary">
              {isEditing ? "Editando característica" : "Nueva característica"}
            </div>
            <div className="mt-1 text-sm text-secondary/80">
              {isEditing
                ? "Modificá el nombre o el icono y guardá los cambios."
                : "Completá los datos para agregar una nueva característica."}
            </div>
          </div>

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
                placeholder="Ej: Wifi"
              />
            </Field>

            <Field label="Icono" error={fieldErrors?.icon}>
              <select
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary/40"
                value={form.icon}
                onChange={(e) => set("icon", e.target.value)}
              >
                {FEATURE_ICON_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.value})
                  </option>
                ))}
              </select>
            </Field>

            <div className="rounded-2xl border border-border bg-background/40 p-4">
              <div className="text-sm font-semibold text-primary">
                Vista previa
              </div>

              <div className="mt-3 flex items-center gap-3">
                <FeatureIcon
                  name={form.icon}
                  className="h-6 w-6 text-primary"
                />
                <span className="text-sm text-secondary/90">
                  {form.name || "Nombre de la característica"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              disabled={submitting}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
              type="submit"
            >
              {isEditing
                ? submitting
                  ? "Guardando cambios..."
                  : "Guardar cambios"
                : submitting
                  ? "Guardando..."
                  : "Agregar característica"}
            </button>

            {isEditing ? (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-primary hover:bg-zinc-50"
              >
                Cancelar edición
              </button>
            ) : null}

            <button
              type="button"
              onClick={clearAlerts}
              className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-primary hover:bg-zinc-50"
            >
              Limpiar alertas
            </button>
          </div>
        </form>

        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="font-serif text-2xl font-semibold text-primary">
              Lista de características
            </h2>
            <p className="text-sm text-secondary/80">
              {loadingList
                ? "Cargando características..."
                : `${features.length} características registradas`}
            </p>
          </div>

          {loadingList ? (
            <div className="text-sm text-secondary/70">Cargando...</div>
          ) : features.length === 0 ? (
            <div className="rounded-xl border border-border bg-background/60 p-4 text-sm text-secondary/80">
              No hay características cargadas todavía.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {features.map((feature) => {
                const isBeingEdited = editingId === feature.id;

                return (
                  <article
                    key={feature.id}
                    className={[
                      "rounded-2xl border p-4 transition",
                      isBeingEdited
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-background/40",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <FeatureIcon
                          name={feature.icon}
                          className="mt-0.5 h-5 w-5 text-primary"
                        />

                        <div>
                          <div className="font-semibold text-primary">
                            {feature.name}
                          </div>

                          <div className="mt-1 text-sm text-secondary/80">
                            Icono:{" "}
                            <span className="font-mono">{feature.icon}</span>
                          </div>

                          {isBeingEdited ? (
                            <div className="mt-2 inline-flex rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-white">
                              Editando
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(feature)}
                        className="rounded-xl border border-border px-3 py-2 text-xs font-semibold text-primary hover:bg-zinc-50"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => setFeatureToDelete(feature)}
                        disabled={deletingId === feature.id}
                        className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                      >
                        {deletingId === feature.id
                          ? "Eliminando..."
                          : "Eliminar"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={!!featureToDelete}
        title="Eliminar característica"
        message={
          featureToDelete
            ? `¿Seguro que querés eliminar la característica "${featureToDelete.name}"? Los alojamientos que la usen quedarán sin esa característica.`
            : ""
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        danger
        loading={!!deletingId}
        onConfirm={confirmDeleteFeature}
        onClose={() => {
          if (!deletingId) setFeatureToDelete(null);
        }}
      />
    </div>
  );
}
