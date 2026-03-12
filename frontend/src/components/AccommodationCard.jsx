import { useState } from "react";
import AuthRequiredModal from "./AuthRequiredModal";

function formatPrice(value) {
  if (value == null) return null;
  try {
    return new Intl.NumberFormat("es-AR").format(value);
  } catch {
    return String(value);
  }
}

function formatAverageRating(value) {
  if (value == null) return null;
  return value.toFixed(1);
}

export default function AccommodationCard({
  item,
  onViewDetail,
  isFavorite = false,
  onToggleFavorite,
  favoriteDisabled = false,
}) {
  const [favoriteFeedback, setFavoriteFeedback] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  async function handleFavoriteClick() {
    if (!onToggleFavorite) return;

    setFavoriteFeedback("");

    try {
      await onToggleFavorite(item.id);
    } catch (e) {
      const message = e?.message ?? "No se pudo actualizar el favorito.";

      if (message.toLowerCase().includes("iniciar sesión")) {
        setShowAuthModal(true);
        return;
      }

      setFavoriteFeedback(message);
    }
  }

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="relative h-44 w-full bg-border/60">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-secondary/70">
              Sin imagen
            </div>
          )}

          {onToggleFavorite ? (
            <button
              type="button"
              onClick={handleFavoriteClick}
              disabled={favoriteDisabled}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl shadow-sm transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label={
                isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
              }
              title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
              <span className={isFavorite ? "text-accent" : "text-primary"}>
                {isFavorite ? "♥" : "♡"}
              </span>
            </button>
          ) : null}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 font-serif text-lg font-semibold leading-snug text-primary">
              {item.name}
            </h3>

            {item.pricePerNight != null && (
              <div className="shrink-0 text-right">
                <div className="text-base font-extrabold text-primary">
                  ${formatPrice(item.pricePerNight)}
                </div>
                <div className="text-xs text-secondary/70">por noche</div>
              </div>
            )}
          </div>

          <div className="mt-2 text-sm text-secondary/80">
            {item.city}, {item.country}
          </div>

          <div className="mt-3 text-sm">
            {item.reviewsCount > 0 ? (
              <div className="flex items-center gap-2 text-primary">
                <span className="text-amber-500">★</span>
                <span className="font-semibold">
                  {formatAverageRating(item.averageRating)}
                </span>
                <span className="text-secondary/70">
                  ({item.reviewsCount} reseña
                  {item.reviewsCount === 1 ? "" : "s"})
                </span>
              </div>
            ) : (
              <div className="text-secondary/70">Sin reseñas</div>
            )}
          </div>

          {favoriteFeedback ? (
            <div className="mt-3 rounded-xl border border-accent/20 bg-accent/5 px-3 py-2 text-xs text-accent">
              {favoriteFeedback}
            </div>
          ) : null}

          <button
            onClick={() => onViewDetail?.(item.id)}
            className="mt-4 w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Ver detalle
          </button>
        </div>
      </article>

      <AuthRequiredModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
