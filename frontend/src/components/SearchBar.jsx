import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if ((startDate && !endDate) || (!startDate && endDate)) {
      setError("Debés completar check-in y check-out juntos.");
      return;
    }

    if (startDate && endDate && startDate >= endDate) {
      setError("La fecha de check-in debe ser anterior al check-out.");
      return;
    }

    const params = new URLSearchParams();

    if (query.trim()) params.set("query", query.trim());
    if (startDate && endDate) {
      params.set("startDate", startDate);
      params.set("endDate", endDate);
    }

    params.set("page", "0");

    navigate(`/accommodations?${params.toString()}`);
  }

  return (
    <section className="w-full bg-card text-primary">
      <div className="mx-auto max-w-screen-xl px-6 py-10">
        <h2 className="font-serif text-3xl font-semibold tracking-tight">
          Buscá ofertas en hoteles, casas y mucho más
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-12"
        >
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-secondary shadow-sm">
              <span className="text-secondary/70">📍</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-secondary/60"
                placeholder="Ciudad, país o alojamiento"
                aria-label="Destino"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="rounded-xl bg-white px-4 py-3 text-secondary shadow-sm">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-secondary/70">
                Check-in
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                aria-label="Check-in"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="rounded-xl bg-white px-4 py-3 text-secondary shadow-sm">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-secondary/70">
                Check-out
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                aria-label="Check-out"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
            >
              Buscar
            </button>
          </div>
        </form>

        {error ? (
          <p className="mt-3 text-sm font-medium text-accent">{error}</p>
        ) : null}
      </div>
    </section>
  );
}
