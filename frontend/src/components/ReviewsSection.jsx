import { useEffect, useState } from "react";
import { useAuth } from "../auth/hooks/useAuth";
import AuthRequiredModal from "./AuthRequiredModal";
import ReviewStars from "./ReviewStars";
import {
  createAccommodationReview,
  fetchAccommodationReviews,
} from "../api/reviews";

function formatDateLabel(value) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatAverage(value) {
  if (value == null) return "Sin reseñas";
  return value.toFixed(1);
}

export default function ReviewsSection({
  accommodationId,
  averageRating,
  reviewsCount,
  onReviewCreated,
}) {
  const { isAuthenticated } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  async function loadReviews() {
    setLoading(true);
    setError("");

    try {
      const data = await fetchAccommodationReviews(accommodationId);
      setReviews(data);
    } catch (e) {
      setReviews([]);
      setError(e?.message ?? "No se pudieron cargar las valoraciones");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, [accommodationId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!score) {
      setSubmitError("Seleccioná un puntaje de 1 a 5 estrellas.");
      return;
    }

    setSubmitLoading(true);

    try {
      const created = await createAccommodationReview(accommodationId, {
        score,
        comment,
      });

      setReviews((prev) => [created, ...prev]);
      setScore(0);
      setComment("");
      setSubmitSuccess("Tu valoración fue publicada correctamente.");
      onReviewCreated?.(created);
    } catch (e) {
      setSubmitError(e?.message ?? "No se pudo publicar la valoración");
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <>
      <section className="mt-10 w-full rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-primary">
              Valoraciones
            </h2>
            <p className="mt-1 text-sm text-secondary/80">
              Opiniones de huéspedes que ya se alojaron.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background px-4 py-3">
            <div className="flex items-center gap-3">
              <ReviewStars
                value={Math.round(averageRating ?? 0)}
                readOnly
                size="lg"
              />
              <div>
                <div className="text-lg font-bold text-primary">
                  {formatAverage(averageRating)}
                </div>
                <div className="text-xs text-secondary/70">
                  {reviewsCount} reseña{reviewsCount === 1 ? "" : "s"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-border bg-background/40 p-5"
        >
          <div className="font-semibold text-primary">Dejá tu valoración</div>

          <div className="mt-3">
            <ReviewStars value={score} onChange={setScore} size="lg" />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-semibold text-primary">
              Comentario (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={2000}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-primary outline-none"
              placeholder="Contá tu experiencia con este alojamiento"
            />
          </div>

          {!isAuthenticated ? (
            <div className="mt-3 text-sm text-secondary/80">
              Para publicar una valoración necesitás iniciar sesión.
            </div>
          ) : null}

          {submitError ? (
            <div className="mt-3 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-accent">
              {submitError}
            </div>
          ) : null}

          {submitSuccess ? (
            <div className="mt-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {submitSuccess}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitLoading}
            className="mt-4 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitLoading ? "Publicando..." : "Publicar valoración"}
          </button>
        </form>

        <div className="mt-8">
          <div className="font-semibold text-primary">Reseñas publicadas</div>

          {loading ? (
            <div className="mt-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-background/40 p-4"
                >
                  <div className="h-4 w-32 animate-pulse rounded bg-border/60" />
                  <div className="mt-3 h-4 w-48 animate-pulse rounded bg-border/60" />
                  <div className="mt-3 h-16 w-full animate-pulse rounded bg-border/60" />
                </div>
              ))}
            </div>
          ) : null}

          {!loading && error ? (
            <div className="mt-4 rounded-xl border border-border bg-background px-4 py-3 text-sm text-secondary/90">
              {error}
            </div>
          ) : null}

          {!loading && !error && reviews.length === 0 ? (
            <div className="mt-4 rounded-xl border border-border bg-background px-4 py-3 text-sm text-secondary/90">
              Todavía no hay valoraciones para este alojamiento.
            </div>
          ) : null}

          {!loading && !error && reviews.length > 0 ? (
            <div className="mt-4 space-y-4">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-2xl border border-border bg-background/40 p-5"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="font-semibold text-primary">
                        {review.authorName}
                      </div>
                      <div className="text-xs text-secondary/70">
                        {formatDateLabel(review.createdAt)}
                      </div>
                    </div>

                    <ReviewStars value={review.score} readOnly />
                  </div>

                  {review.comment ? (
                    <p className="mt-3 whitespace-pre-line text-sm text-secondary/90">
                      {review.comment}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm italic text-secondary/70">
                      Sin comentario adicional.
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <AuthRequiredModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
