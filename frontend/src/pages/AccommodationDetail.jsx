import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  fetchAccommodationAvailability,
  fetchAccommodationById,
} from "../api/accommodations";
import ImageGallery from "../components/ImageGallery";
import FeatureIcon from "../components/FeatureIcon";
import DateRangeCalendar from "../components/DateRangeCalendar";
import { useFavorites } from "../hooks/useFavorites";
import { useAuth } from "../auth/hooks/useAuth";
import AuthRequiredModal from "../components/AuthRequiredModal";
import ShareProductModal from "../components/ShareProductModal";
import ReviewsSection from "../components/ReviewsSection";

function formatPrice(value) {
  if (value == null) return null;
  try {
    return new Intl.NumberFormat("es-AR").format(value);
  } catch {
    return String(value);
  }
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

function Skeleton() {
  return (
    <div className="mx-auto max-w-screen-xl px-6 py-10">
      <div className="h-8 w-64 animate-pulse rounded bg-border/60" />
      <div className="mt-3 h-4 w-80 animate-pulse rounded bg-border/60" />
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-[360px] animate-pulse rounded-2xl bg-border/60 lg:col-span-2" />
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

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availability, setAvailability] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [availabilityMessage, setAvailabilityMessage] = useState("");

  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite, togglingIds } = useFavorites();
  const [favoriteFeedback, setFavoriteFeedback] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const images = useMemo(() => data?.images ?? [], [data]);
  const features = useMemo(() => data?.features ?? [], [data]);
  const bookedRanges = useMemo(
    () => availability?.bookedRanges ?? [],
    [availability],
  );

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

  async function loadAvailabilityWithoutDates() {
    setAvailabilityError("");

    try {
      const res = await fetchAccommodationAvailability(id);
      setAvailability(res);
    } catch (e) {
      setAvailabilityError(e?.message ?? "No se pudo cargar la disponibilidad");
    }
  }

  useEffect(() => {
    load();
    loadAvailabilityWithoutDates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleCheckAvailability() {
    setAvailabilityError("");
    setAvailabilityMessage("");

    if ((startDate && !endDate) || (!startDate && endDate)) {
      setAvailabilityError("Debés completar check-in y check-out juntos.");
      return;
    }

    if (!startDate || !endDate) {
      setAvailabilityError("Seleccioná check-in y check-out.");
      return;
    }

    if (startDate >= endDate) {
      setAvailabilityError(
        "La fecha de check-in debe ser anterior al check-out.",
      );
      return;
    }

    setAvailabilityLoading(true);

    try {
      const res = await fetchAccommodationAvailability(id, {
        startDate,
        endDate,
      });

      setAvailability(res);

      if (res.available) {
        setAvailabilityMessage(
          `Disponible del ${formatDateLabel(startDate)} al ${formatDateLabel(endDate)}.`,
        );
      } else {
        setAvailabilityMessage(
          `No disponible del ${formatDateLabel(startDate)} al ${formatDateLabel(endDate)}.`,
        );
      }
    } catch (e) {
      setAvailabilityError(
        e?.message ?? "No se pudo consultar la disponibilidad",
      );
    } finally {
      setAvailabilityLoading(false);
    }
  }

  async function handleToggleFavorite() {
    setFavoriteFeedback("");

    try {
      const nextValue = await toggleFavorite(id);

      setFavoriteFeedback(
        nextValue
          ? "Alojamiento agregado a favoritos."
          : "Alojamiento quitado de favoritos.",
      );
    } catch (e) {
      const message = e?.message ?? "No se pudo actualizar el favorito.";

      if (message.toLowerCase().includes("iniciar sesión")) {
        setShowAuthModal(true);
        return;
      }

      setFavoriteFeedback(message);
    }
  }

  function handleReviewCreated(review) {
    setData((prev) => {
      if (!prev) return prev;

      const prevCount = prev.reviewsCount ?? 0;
      const prevAverage = prev.averageRating ?? 0;
      const nextCount = prevCount + 1;
      const nextAverage =
        prevCount === 0
          ? review.score
          : (prevAverage * prevCount + review.score) / nextCount;

      return {
        ...prev,
        averageRating: nextAverage,
        reviewsCount: nextCount,
      };
    });
  }

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

              {data?.category?.name ? (
                <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary">
                  Categoría: {data.category.name}
                </span>
              ) : null}

              {price ? (
                <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-primary">
                  {price} / noche
                </span>
              ) : null}

              {data?.reviewsCount > 0 ? (
                <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary">
                  ★ {data.averageRating?.toFixed(1)} · {data.reviewsCount}{" "}
                  reseña
                  {data.reviewsCount === 1 ? "" : "s"}
                </span>
              ) : (
                <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-secondary/70">
                  Sin reseñas
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleFavorite}
              disabled={togglingIds.has(id)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-primary hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className={isFavorite(id) ? "text-accent" : "text-primary"}>
                {isFavorite(id) ? "♥" : "♡"}
              </span>
              {isFavorite(id) ? "Favorito" : "Guardar"}
            </button>

            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-primary hover:bg-background"
            >
              ↗ Compartir
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-primary hover:bg-background"
            >
              <span aria-hidden>←</span>
              Volver
            </Link>
          </div>
        </div>
      </div>

      {favoriteFeedback ? (
        <div className="mx-auto mt-4 max-w-screen-xl px-6">
          <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-secondary/90">
            {favoriteFeedback}
            {!isAuthenticated ? " Iniciá sesión para guardar favoritos." : ""}
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-screen-xl px-6 py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <ImageGallery title={data?.name ?? "Alojamiento"} images={images} />

            <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="font-semibold text-primary">
                ¿Qué ofrece este lugar?
              </div>

              {features.length === 0 ? (
                <p className="mt-2 text-sm text-secondary/80">
                  Este alojamiento no tiene características informadas.
                </p>
              ) : (
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {features.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-4 py-3"
                    >
                      <FeatureIcon
                        name={feature.icon}
                        className="h-5 w-5 text-primary"
                      />
                      <span className="text-sm font-medium text-primary">
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="font-semibold text-primary">Descripción</div>
            <p className="mt-2 whitespace-pre-line text-sm text-secondary/90">
              {data?.description}
            </p>

            <div className="mt-6 border-t border-border pt-6">
              <div className="font-semibold text-primary">
                Consultar disponibilidad
              </div>

              <div className="mt-4">
                <DateRangeCalendar
                  startDate={startDate}
                  endDate={endDate}
                  onChange={({ startDate: nextStart, endDate: nextEnd }) => {
                    setStartDate(nextStart);
                    setEndDate(nextEnd);
                  }}
                  disabledRanges={bookedRanges}
                  minDate={new Date()}
                  compactWeekDays
                />

                <button
                  onClick={handleCheckAvailability}
                  disabled={availabilityLoading}
                  className="mt-4 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {availabilityLoading
                    ? "Consultando..."
                    : "Consultar disponibilidad"}
                </button>
              </div>

              {availabilityError ? (
                <div className="mt-3 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-accent">
                  <div>{availabilityError}</div>
                  <button
                    onClick={async () => {
                      if (startDate && endDate) {
                        await handleCheckAvailability();
                      } else {
                        await loadAvailabilityWithoutDates();
                      }
                    }}
                    className="mt-3 rounded-lg border border-accent/30 px-3 py-2 text-xs font-semibold hover:bg-accent/10"
                  >
                    Reintentar
                  </button>
                </div>
              ) : null}

              {availabilityMessage ? (
                <div
                  className={`mt-3 rounded-xl px-4 py-3 text-sm font-medium ${
                    availability?.available
                      ? "border border-green-200 bg-green-50 text-green-700"
                      : "border border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {availabilityMessage}
                </div>
              ) : null}

              <div className="mt-5">
                <div className="text-sm font-semibold text-primary">
                  Fechas ocupadas
                </div>

                {bookedRanges.length === 0 ? (
                  <p className="mt-2 text-sm text-secondary/80">
                    No hay fechas ocupadas informadas para este alojamiento.
                  </p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {bookedRanges.map((range, index) => (
                      <div
                        key={`${range.checkIn}-${range.checkOut}-${index}`}
                        className="rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-secondary/90"
                      >
                        {formatDateLabel(range.checkIn)} -{" "}
                        {formatDateLabel(range.checkOut)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
              onClick={() => alert("Sprint 4: reservar")}
            >
              Reservar
            </button>
          </aside>
        </div>

        <ReviewsSection
          accommodationId={id}
          averageRating={data?.averageRating}
          reviewsCount={data?.reviewsCount ?? 0}
          onReviewCreated={handleReviewCreated}
        />

        <section className="mt-10 w-full">
          <h2 className="font-serif text-2xl font-semibold text-primary underline decoration-2 underline-offset-4">
            Políticas
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-semibold text-primary">Normas de la casa</h3>
              <p className="mt-3 whitespace-pre-line text-sm text-secondary/90">
                {data?.houseRules || "No hay políticas informadas."}
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-semibold text-primary">Salud y seguridad</h3>
              <p className="mt-3 whitespace-pre-line text-sm text-secondary/90">
                {data?.healthAndSafety || "No hay políticas informadas."}
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-semibold text-primary">
                Política de cancelación
              </h3>
              <p className="mt-3 whitespace-pre-line text-sm text-secondary/90">
                {data?.cancellationPolicy || "No hay políticas informadas."}
              </p>
            </article>
          </div>
        </section>
      </div>

      <AuthRequiredModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <ShareProductModal
        key={`${id}-${showShareModal ? "open" : "closed"}`}
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={data?.name}
        description={data?.description}
        imageUrl={images[0]?.url || null}
      />
    </>
  );
}
