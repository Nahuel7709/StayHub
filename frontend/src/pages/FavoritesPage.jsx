import { useEffect, useState } from "react";
import { fetchMyFavorites } from "../api/favorites";
import AccommodationCard from "../components/AccommodationCard";
import { useFavorites } from "../hooks/useFavorites";
import { useNavigate } from "react-router-dom";

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

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { favoriteIdsSet, togglingIds, toggleFavorite, reloadFavorites } =
    useFavorites();

  async function load() {
    setLoading(true);
    setError("");

    try {
      const data = await fetchMyFavorites();
      setItems(data);
    } catch (e) {
      setError(e?.message ?? "No se pudieron cargar tus favoritos");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleToggleFavorite(accommodationId) {
    try {
      await toggleFavorite(accommodationId);
      await reloadFavorites();
      setItems((prev) => prev.filter((item) => item.id !== accommodationId));
    } catch {
      // el mensaje ya lo maneja el hook o el estado de la página
    }
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-10">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold text-primary">
          Mis favoritos
        </h1>
        <p className="mt-1 text-sm text-secondary/80">
          Tus alojamientos guardados para ver después.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : null}

      {!loading && error ? (
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
      ) : null}

      {!loading && !error && items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-serif text-xl font-semibold text-primary">
            No tenés favoritos guardados
          </h2>
          <p className="mt-2 text-sm text-secondary/80">
            Explorá alojamientos y tocá el corazón para agregarlos acá.
          </p>
          <button
            onClick={() => navigate("/accommodations")}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Explorar alojamientos
          </button>
        </div>
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {items.map((item) => (
            <AccommodationCard
              key={item.id}
              item={item}
              isFavorite={favoriteIdsSet.has(item.id)}
              favoriteDisabled={togglingIds.has(item.id)}
              onToggleFavorite={handleToggleFavorite}
              onViewDetail={(id) => navigate(`/accommodations/${id}`)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
