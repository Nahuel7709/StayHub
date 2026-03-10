import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchAccommodationsPage } from "../api/accommodations";
import { fetchCategories } from "../api/categories";
import AccommodationCard from "../components/AccommodationCard";
import Pagination from "../components/Pagination";

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

export default function AccommodationsList() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const page = Math.max(0, Number(params.get("page") ?? 0));
  const categoryId = params.get("categoryId") || "";
  const query = params.get("query") || "";
  const startDate = params.get("startDate") || "";
  const endDate = params.get("endDate") || "";
  const size = 10;

  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState("");

  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const number = data?.number ?? page;
  const content = data?.content ?? [];

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === categoryId) || null,
    [categories, categoryId],
  );

  const hasActiveFilters =
    !!categoryId || !!query || (!!startDate && !!endDate);

  const rangeText = useMemo(() => {
    if (!totalElements) return "Mostrando 0 resultados";
    const start = number * size + 1;
    const end = Math.min((number + 1) * size, totalElements);
    return `Mostrando ${start}–${end} de ${totalElements}`;
  }, [number, size, totalElements]);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const res = await fetchAccommodationsPage({
        page,
        size,
        categoryId,
        query,
        startDate,
        endDate,
      });
      setData(res);
    } catch (e) {
      setError(e?.message ?? "Error cargando listado");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadCategories() {
      setLoadingCategories(true);
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, categoryId, query, startDate, endDate]);

  function goToPage(p) {
    const next = new URLSearchParams(params);
    next.set("page", String(p));
    setParams(next);
  }

  function clearAllFilters() {
    const next = new URLSearchParams();
    next.set("page", "0");
    setParams(next);
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-6 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-primary">
            Explorar
          </h1>

          {hasActiveFilters ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {query ? (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Búsqueda: {query}
                </span>
              ) : null}

              {categoryId && !loadingCategories && activeCategory ? (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Categoría: {activeCategory.name}
                </span>
              ) : null}

              {startDate && endDate ? (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Fechas: {formatDateLabel(startDate)} -{" "}
                  {formatDateLabel(endDate)}
                </span>
              ) : null}

              <button
                onClick={clearAllFilters}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          ) : null}

          <p className="mt-1 text-sm text-secondary/80">{rangeText}</p>
        </div>

        <Pagination
          currentPage={number}
          totalPages={totalPages}
          onChange={(p) => goToPage(p)}
        />
      </div>

      {loading && (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
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

      {!loading && !error && content.length === 0 && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-serif text-xl font-semibold text-primary">
            No se encontraron alojamientos
          </h2>
          <p className="mt-2 text-sm text-secondary/80">
            Probá con otro destino o cambiá las fechas de tu búsqueda.
          </p>
          {hasActiveFilters ? (
            <button
              onClick={clearAllFilters}
              className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Limpiar filtros
            </button>
          ) : null}
        </div>
      )}

      {!loading && !error && content.length > 0 && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
            {content.map((item) => (
              <AccommodationCard
                key={item.id}
                item={item}
                onViewDetail={(id) => navigate(`/accommodations/${id}`)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={number}
                totalPages={totalPages}
                onChange={(p) => goToPage(p)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
