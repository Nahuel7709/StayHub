import { useMemo, useState } from "react";

function truncate(text, max = 140) {
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
}

export default function ShareProductModal({
  open,
  onClose,
  title,
  description,
  imageUrl,
}) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const baseMessage = useMemo(() => {
    return `${title ?? ""} - ${truncate(description ?? "", 120)}`.trim();
  }, [title, description]);

  const [feedback, setFeedback] = useState("");
  const [customMessage, setCustomMessage] = useState(baseMessage);

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(customMessage);

  async function copyText(value) {
    await navigator.clipboard.writeText(value);
  }

  function openInNewTab(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleNativeShare() {
    setFeedback("");

    if (!navigator.share) {
      setFeedback("Tu navegador no soporta compartir de forma nativa.");
      return;
    }

    try {
      await navigator.share({
        title,
        text: customMessage,
        url: shareUrl,
      });
    } catch {
      // usuario canceló
    }
  }

  async function handleCopyLink() {
    setFeedback("");

    try {
      await copyText(shareUrl);
      setFeedback("Link copiado al portapapeles.");
    } catch {
      setFeedback("No se pudo copiar el link.");
    }
  }

  async function handleCopyMessageAndLink() {
    setFeedback("");

    try {
      await copyText(`${customMessage}\n${shareUrl}`.trim());
      setFeedback("Mensaje y link copiados al portapapeles.");
    } catch {
      setFeedback("No se pudo copiar el contenido.");
    }
  }

  async function handleFacebookShare() {
    setFeedback("");

    try {
      await copyText(customMessage);
      openInNewTab(
        `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      );
      setFeedback(
        "Se abrió Facebook y copiamos tu mensaje para que lo pegues si querés personalizar la publicación.",
      );
    } catch {
      openInNewTab(
        `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      );
      setFeedback("Se abrió Facebook para compartir el producto.");
    }
  }

  function handleTwitterShare() {
    setFeedback("");
    openInNewTab(
      `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    );
  }

  function handleWhatsAppShare() {
    setFeedback("");
    openInNewTab(
      `https://wa.me/?text=${encodeURIComponent(`${customMessage} ${shareUrl}`)}`,
    );
  }

  async function handleInstagramShare() {
    setFeedback("");

    try {
      await copyText(`${customMessage}\n${shareUrl}`.trim());
      openInNewTab("https://www.instagram.com/");
      setFeedback(
        "Abrimos Instagram y copiamos el mensaje con el link para que lo pegues en tu publicación o historia.",
      );
    } catch {
      openInNewTab("https://www.instagram.com/");
      setFeedback(
        "Abrimos Instagram. Si querés, copiá manualmente el mensaje y el link.",
      );
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-primary">
              Compartir alojamiento
            </h2>
            <p className="mt-2 text-sm text-secondary/80">
              Elegí una opción para compartir este producto.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-lg text-secondary/70 hover:bg-background"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="h-48 w-full bg-border/60">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-secondary/70">
                Sin imagen
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="font-serif text-xl font-semibold text-primary">
              {title}
            </div>
            <p className="mt-2 text-sm text-secondary/80">
              {truncate(description, 160)}
            </p>

            <div className="mt-3 break-all rounded-xl border border-border bg-background px-3 py-2 text-xs text-secondary/70">
              {shareUrl}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-semibold text-primary">
            Mensaje personalizado
          </label>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-primary outline-none"
            placeholder="Escribí un mensaje para acompañar el contenido compartido"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {navigator.share ? (
            <button
              type="button"
              onClick={handleNativeShare}
              className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-95"
            >
              Compartir
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleCopyLink}
            className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-primary hover:bg-background"
          >
            Copiar link
          </button>

          <button
            type="button"
            onClick={handleCopyMessageAndLink}
            className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-primary hover:bg-background"
          >
            Copiar mensaje + link
          </button>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-primary hover:bg-background"
          >
            WhatsApp
          </button>

          <button
            type="button"
            onClick={handleFacebookShare}
            className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-primary hover:bg-background"
          >
            Facebook
          </button>

          <button
            type="button"
            onClick={handleTwitterShare}
            className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-primary hover:bg-background"
          >
            X / Twitter
          </button>

          <button
            type="button"
            onClick={handleInstagramShare}
            className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-primary hover:bg-background"
          >
            Instagram
          </button>
        </div>

        {feedback ? (
          <div className="mt-4 rounded-xl border border-border bg-card px-4 py-3 text-sm text-secondary/90">
            {feedback}
          </div>
        ) : null}
      </div>
    </div>
  );
}
