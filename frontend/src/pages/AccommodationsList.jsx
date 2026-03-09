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

export default function AccommodationsList() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const page = Math.max(0, Number(params.get("page") ?? 0));
  const categoryId = params.get("categoryId") || "";
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
      const res = await fetchAccommodationsPage({ page, size, categoryId });
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
  }, [page, categoryId]);

  function goToPage(p) {
    const next = new URLSearchParams(params);
    next.set("page", String(p));
    setParams(next);
  }

  function clearCategoryFilter() {
    const next = new URLSearchParams(params);
    next.delete("categoryId");
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

          {categoryId && !loadingCategories && activeCategory ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Categoría: {activeCategory.name}
              </span>

              <button
                onClick={clearCategoryFilter}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Limpiar filtro
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

      {!loading && !error && (
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
