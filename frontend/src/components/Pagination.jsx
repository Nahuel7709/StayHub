function range(start, end) {
  const out = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

export default function Pagination({ currentPage, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const lastPage = totalPages - 1;

  const windowSize = 2;

  const start = Math.max(1, currentPage - windowSize);
  const end = Math.min(lastPage - 1, currentPage + windowSize);

  const pages = [];

  pages.push(0);

  if (start > 1) pages.push("...");

  pages.push(...range(start, end));

  if (end < lastPage - 1) pages.push("...");

  if (lastPage !== 0) pages.push(lastPage);

  function go(p) {
    if (p === "...") return;
    if (p < 0 || p > lastPage) return;
    onChange(p);
  }

  const btnBase =
    "min-w-10 h-10 px-3 rounded-xl border text-sm font-semibold transition";
  const btn =
    btnBase +
    " border-border bg-card text-primary hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed";
  const btnActive = btnBase + " border-primary bg-primary text-white";

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Paginación"
    >
      <button
        className={btn}
        onClick={() => go(currentPage - 1)}
        disabled={currentPage === 0}
        aria-label="Anterior"
      >
        ‹
      </button>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`dots-${idx}`} className="px-2 text-secondary/70">
            …
          </span>
        ) : (
          <button
            key={p}
            className={p === currentPage ? btnActive : btn}
            onClick={() => go(p)}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p + 1}
          </button>
        ),
      )}

      <button
        className={btn}
        onClick={() => go(currentPage + 1)}
        disabled={currentPage === lastPage}
        aria-label="Siguiente"
      >
        ›
      </button>
    </nav>
  );
}
