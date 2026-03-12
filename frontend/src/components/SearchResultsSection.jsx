import { Link, useNavigate } from "react-router-dom";
import AccommodationCard from "./AccommodationCard";

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

function formatDateLabel(value) {
  if (!value) return "";

  try {
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(`${value}T00:00:00`));
  } catch {
    return value;
  }
}

export default function SearchResultsSection({
  query,
  startDate,
  endDate,
  loading,
  error,
  results,
  onClear,
  favoriteIdsSet,
  togglingIds,
  onToggleFavorite,
}) {
  const navigate = useNavigate();

  const items = results?.content ?? [];
  const totalElements = results?.totalElements ?? 0;

  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (startDate && endDate) {
    params.set("startDate", startDate);
    params.set("endDate", endDate);
  }

  const listHref = `/accommodations?${params.toString()}`;

  return (
    <section className="px-6 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-primary">
            Resultados de búsqueda
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {query ? (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Búsqueda: {query}
              </span>
            ) : null}

            {startDate && endDate ? (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Fechas: {formatDateLabel(startDate)} -{" "}
                {formatDateLabel(endDate)}
              </span>
            ) : null}

            <button
              onClick={onClear}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Limpiar búsqueda
            </button>
          </div>

          {!loading && !error ? (
            <p className="mt-2 text-sm text-secondary/80">
              {totalElements > 0
                ? `Se encontraron ${totalElements} alojamientos`
                : "No se encontraron alojamientos"}
            </p>
          ) : null}
        </div>

        {totalElements > items.length ? (
          <Link
            to={listHref}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-primary hover:bg-background"
          >
            Ver todos los resultados
          </Link>
        ) : null}
      </div>

      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : null}

      {!loading && error ? (
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <div className="font-semibold text-accent">No se pudo cargar</div>
          <div className="mt-1 text-sm text-secondary/90">{error}</div>
        </div>
      ) : null}

      {!loading && !error && items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h3 className="font-serif text-xl font-semibold text-primary">
            No encontramos resultados para esta búsqueda
          </h3>
          <p className="mt-2 text-sm text-secondary/80">
            Probá cambiando el destino o el rango de fechas.
          </p>
        </div>
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {items.map((item) => (
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
      ) : null}
    </section>
  );
}
