import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../api/categories";

function CategorySkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="h-36 w-full animate-pulse bg-border/60" />
      <div className="p-4">
        <div className="h-5 w-1/2 animate-pulse rounded bg-border/60" />
        <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-border/60" />
      </div>
    </div>
  );
}

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message || "No se pudieron cargar las categorías");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function handleCategoryClick(category) {
    navigate(`/accommodations?categoryId=${category.id}`);
  }

  return (
    <section className="px-6 pt-10">
      <h3 className="text-lg font-semibold text-primary">
        Buscar por categorías
      </h3>

      {loading && (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CategorySkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          <div className="font-semibold text-accent">No se pudieron cargar</div>
          <div className="mt-1 text-sm text-secondary/80">{error}</div>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <button
              key={category.id}
              className="overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="h-36 w-full bg-border/60">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
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
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
