import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchAccommodationById } from "../api/accommodations";
import ImageGallery from "../components/ImageGallery";

function formatPrice(value) {
  if (value == null) return null;
  try {
    return new Intl.NumberFormat("es-AR").format(value);
  } catch {
    return String(value);
  }
}

function Skeleton() {
  return (
    <div className="mx-auto max-w-screen-xl px-6 py-10">
      <div className="h-8 w-64 animate-pulse rounded bg-border/60" />
      <div className="mt-3 h-4 w-80 animate-pulse rounded bg-border/60" />
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 h-[360px] animate-pulse rounded-2xl bg-border/60" />
        <div className="h-[360px] animate-pulse rounded-2xl bg-border/60" />
      </div>
    </div>
  );
}

export default function AccommodationDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const images = useMemo(() => data?.images ?? [], [data]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetchAccommodationById(id);
      setData(res);
    } catch (e) {
      setError(e?.message ?? "Error cargando detalle");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="mx-auto max-w-screen-xl px-6 py-10">
        <Link
          to="/"
          className="text-sm font-semibold text-primary hover:underline"
        >
          ← Volver
        </Link>

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
      </div>
    );
  }

  const price =
    data?.pricePerNight != null ? `$${formatPrice(data.pricePerNight)}` : null;

  return (
    <>
      <div className="w-full border-b border-border bg-white">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-5">
          <div className="min-w-0">
            <h1 className="truncate font-serif text-3xl font-semibold text-primary">
              {data?.name}
            </h1>

            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-secondary/80">
              <span>
                {data?.city}, {data?.country}
              </span>

              {data?.type ? (
                <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary">
                  {data.type}
                </span>
              ) : null}

              {price ? (
                <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-primary">
                  {price} / noche
                </span>
              ) : null}
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-primary hover:bg-background"
          >
            <span aria-hidden>←</span>
            Volver
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-screen-xl px-6 py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <ImageGallery title={data?.name ?? "Alojamiento"} images={images} />
          </section>

          <aside className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="font-semibold text-primary">Descripción</div>
            <p className="mt-2 whitespace-pre-line text-sm text-secondary/90">
              {data?.description}
            </p>

            <button
              className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
              onClick={() => alert("Sprint 1: reservar (UI)")}
            >
              Reservar
            </button>

            <div className="mt-3 text-xs text-secondary/70"></div>
          </aside>
        </div>
      </div>
    </>
  );
}
