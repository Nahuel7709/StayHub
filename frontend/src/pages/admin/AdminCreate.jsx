import { useState } from "react";
import { createAccommodation } from "../../api/accommodations";

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
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "HOTEL",
    city: "",
    country: "Argentina",
    pricePerNight: "",
    imageUrlsText: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState(null);
  const [createdId, setCreatedId] = useState("");

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setServerError("");
    setFieldErrors(null);
    setCreatedId("");

    
    const imageUrls = form.imageUrlsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      type: form.type,
      city: form.city.trim(),
      country: form.country.trim(),
      pricePerNight:
        form.pricePerNight === "" ? null : Number(form.pricePerNight),
      imageUrls,
    };

    try {
      const created = await createAccommodation(payload);
      setCreatedId(created?.id || "");
      setForm((p) => ({
        ...p,
        name: "",
        description: "",
        city: "",
        pricePerNight: "",
        imageUrlsText: "",
      }));
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
            <Field
              label="Imágenes (1 URL por línea)"
              error={fieldErrors?.imageUrls}
            >
              <textarea
                className="min-h-[120px] w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary/40"
                value={form.imageUrlsText}
                onChange={(e) => set("imageUrlsText", e.target.value)}
                placeholder={`https://...\nhttps://...`}
              />
            </Field>
           
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
                setCreatedId("");
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
          </ul>

          {createdId ? (
            <div className="mt-5 rounded-xl border border-border bg-background/60 p-4">
              <div className="font-semibold text-primary">Creado</div>
              <div className="mt-1 break-all text-xs text-secondary/80">
                ID: {createdId}
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
