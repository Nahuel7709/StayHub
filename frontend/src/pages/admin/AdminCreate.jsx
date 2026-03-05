import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAccommodationMultipart } from "../../api/accommodations";
import useImagePicker from "../../hooks/useImagePicker";

const TYPES = [
  { value: "HOTEL", label: "Hotel" },
  { value: "HOSTEL", label: "Hostel" },
  { value: "APARTMENT", label: "Departamento" },
  { value: "HOUSE", label: "Casa" },
  { value: "BNB", label: "Bed & Breakfast" },
];

function Field({ label, error, children }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-semibold text-primary">{label}</div>
      {children}
      {error ? <div className="mt-1 text-xs text-accent">{error}</div> : null}
    </label>
  );
}

export default function AdminCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "HOTEL",
    city: "",
    country: "Argentina",
    pricePerNight: "",
  });

  const {
    files,
    previewUrls,
    fileInputRef,
    onPickFiles,
    removeFileAt,
    clearFiles,
  } = useImagePicker();

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState(null);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setServerError("");
    setFieldErrors(null);

    if (!files.length) {
      setSubmitting(false);
      setServerError("Debés subir al menos 1 imagen.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      type: form.type,
      city: form.city.trim(),
      country: form.country.trim(),
      pricePerNight:
        form.pricePerNight === "" ? null : Number(form.pricePerNight),
      files,
    };

    try {
      await createAccommodationMultipart(payload);
      navigate("/administracion/lista");
    } catch (err) {
      setServerError(err.message || "Error al crear");
      setFieldErrors(err.fields || null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-screen-xl px-6 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-semibold text-primary">
          Alta de alojamiento
        </h1>
        <p className="text-sm text-secondary/80">
          Cargá un alojamiento nuevo para mantener actualizado el catálogo.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form
          onSubmit={onSubmit}
          className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          {serverError ? (
            <div className="mb-4 rounded-xl border border-border bg-background/60 p-4">
              <div className="font-semibold text-accent">No se pudo crear</div>
              <div className="mt-1 text-sm text-secondary/90">
                {serverError}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Nombre" error={fieldErrors?.name}>
              <input
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary/40"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Ej: Hotel Palermo Deluxe"
              />
            </Field>

            <Field label="Tipo" error={fieldErrors?.type}>
              <select
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary/40"
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Ciudad" error={fieldErrors?.city}>
              <input
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary/40"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Ej: Buenos Aires"
              />
            </Field>

            <Field label="País" error={fieldErrors?.country}>
              <input
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary/40"
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
                placeholder="Ej: Argentina"
              />
            </Field>

            <Field
              label="Precio por noche (opcional)"
              error={fieldErrors?.pricePerNight}
            >
              <input
                type="number"
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary/40"
                value={form.pricePerNight}
                onChange={(e) => set("pricePerNight", e.target.value)}
                placeholder="Ej: 120000"
                min="0"
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Descripción" error={fieldErrors?.description}>
              <textarea
                className="min-h-[120px] w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary/40"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Descripción del alojamiento..."
              />
            </Field>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold text-primary">
              Imágenes (1 o más)
            </label>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={onPickFiles}
              className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm"
            />

            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-xs text-secondary/70">
                Se permiten múltiples imágenes. Formatos: jpg/png/webp.
              </p>

              {files.length > 0 && (
                <button
                  type="button"
                  onClick={clearFiles}
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  Limpiar
                </button>
              )}
            </div>

            {files.length ? (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {files.map((file, idx) => (
                  <div
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="relative overflow-hidden rounded-xl border border-border bg-card"
                  >
                    <img
                      src={previewUrls[idx]}
                      alt={file.name}
                      className="h-28 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeFileAt(idx)}
                      className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/75"
                      title="Quitar imagen"
                    >
                      ×
                    </button>

                    <div className="px-2 py-2 text-[11px] text-secondary/80">
                      <div className="truncate" title={file.name}>
                        {file.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              disabled={submitting}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
              type="submit"
            >
              {submitting ? "Guardando..." : "Crear alojamiento"}
            </button>

            <button
              type="button"
              onClick={() => {
                setServerError("");
                setFieldErrors(null);
              }}
              className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-primary hover:bg-zinc-50"
            >
              Limpiar alertas
            </button>
          </div>
        </form>

        <aside className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="font-semibold text-primary">Tips</div>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-secondary/80">
            <li>El nombre debe ser único.</li>
            <li>Debe incluir al menos 1 imagen.</li>
            <li>Al guardar, vas a volver a la lista del panel.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
