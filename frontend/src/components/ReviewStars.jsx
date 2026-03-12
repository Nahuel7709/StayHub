export default function ReviewStars({
  value = 0,
  onChange,
  readOnly = false,
  size = "base",
}) {
  const stars = [1, 2, 3, 4, 5];

  const sizeClass =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-lg";

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => {
        const active = star <= value;

        if (readOnly) {
          return (
            <span
              key={star}
              className={`${sizeClass} ${active ? "text-amber-500" : "text-secondary/30"}`}
            >
              ★
            </span>
          );
        }

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            className={`${sizeClass} transition ${
              active
                ? "text-amber-500"
                : "text-secondary/30 hover:text-amber-400"
            }`}
            aria-label={`Puntuar con ${star} estrella${star > 1 ? "s" : ""}`}
            title={`${star} estrella${star > 1 ? "s" : ""}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
