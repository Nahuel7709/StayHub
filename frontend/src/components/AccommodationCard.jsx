function formatPrice(value) {
  if (value == null) return null;
  try {
    return new Intl.NumberFormat("es-AR").format(value);
  } catch {
    return String(value);
  }
}

export default function AccommodationCard({ item, onViewDetail }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="h-44 w-full bg-border/60">
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

        <button
          onClick={() => onViewDetail?.(item.id)}
          className="mt-4 w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          Ver detalle
        </button>
      </div>
    </article>
  );
}
