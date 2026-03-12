import { useEffect, useState } from "react";
import { fetchRandomAccommodations } from "../api/accommodations";
import AccommodationCard from "./AccommodationCard";
import { Link, useNavigate } from "react-router-dom";

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="h-44 w-full animate-pulse bg-border/60" />
      <div className="p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-border/60" />
        <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-border/60" />
        <div className="mt-4 h-10 w-full animate-pulse rounded-xl bg-border/60" />
      </div>
    </div>
  );
}

export default function Recommendations({
  favoriteIdsSet,
  togglingIds,
  onToggleFavorite,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchRandomAccommodations(10);
      setItems(data);
    } catch (e) {
      setError(e?.message ?? "Error cargando alojamientos");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const navigate = useNavigate();

  return (
    <section className="px-6 py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-primary">
            Recomendados
          </h1>
          <p className="mt-1 text-sm text-secondary/80">
            Selección de alojamientos para explorar.
          </p>
        </div>

        <div className="flex gap-2">
          <Link to="/accommodations">
            <button className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-primary hover:bg-background/60">
              Explorar todos
            </button>
          </Link>
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-primary hover:bg-background/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Cargando..." : "Recargar"}
          </button>
        </div>
      </div>

      {!loading && error && (
        <div className="rounded-2xl border border-border bg-card p-5">
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

      {!error && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            : items.map((item) => (
                <AccommodationCard
                  key={item.id}
                  item={item}
                  isFavorite={favoriteIdsSet?.has(item.id)}
                  favoriteDisabled={togglingIds?.has(item.id)}
                  onToggleFavorite={onToggleFavorite}
                  onViewDetail={(id) => navigate(`/accommodations/${id}`)}
                />
              ))}
        </div>
      )}
    </section>
  );
}
