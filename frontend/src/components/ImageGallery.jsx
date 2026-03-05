import { useMemo, useState } from "react";
import Modal from "./Modal";

function Img({ src, alt, className, onClick }) {
  if (!src) return <div className={`${className} bg-border/60`} />;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${className} overflow-hidden`}
      title="Ver imagen"
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </button>
  );
}

function FullImageViewer({ title, urls, index, setIndex }) {
  const total = urls.length;
  const current = urls[index] ?? "";

  function prev() {
    setIndex((i) => (i - 1 + total) % total);
  }
  function next() {
    setIndex((i) => (i + 1) % total);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm text-secondary/80">
          {index + 1} / {total}
        </div>

        <div className="flex gap-2">
          <button
            onClick={prev}
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold text-primary hover:bg-zinc-50"
          >
            ←
          </button>
          <button
            onClick={next}
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold text-primary hover:bg-zinc-50"
          >
            →
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <img
          src={current}
          alt={title}
          className="max-h-[70vh] w-full object-contain bg-black/5"
        />
      </div>
    </div>
  );
}

export default function ImageGallery({ title = "Alojamiento", images = [] }) {
  const [openMode, setOpenMode] = useState(null); 
  const [activeIndex, setActiveIndex] = useState(0);

  const urls = useMemo(
    () => images.map((i) => i.url).filter(Boolean),
    [images],
  );


  const mainUrl = urls[0] ?? "";
  const side = [urls[1], urls[2], urls[3], urls[4]];

  function openSingle(index) {
    if (!urls.length) return;
    setActiveIndex(index);
    setOpenMode("single");
  }

  function openGrid() {
    setOpenMode("grid");
  }

  function close() {
    setOpenMode(null);
  }

  return (
    <div className="w-full">
      
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        
        <div className="lg:col-span-2">
          <Img
            src={mainUrl}
            alt={title}
            onClick={() => openSingle(0)}
            className="h-[360px] w-full rounded-2xl border border-border bg-card shadow-sm"
          />
        </div>

      
        <div className="grid grid-cols-2 gap-3 lg:col-span-1">
          {side.map((u, idx) => {
            const realIndex = idx + 1; 
            return (
              <Img
                key={idx}
                src={u}
                alt={title}
                onClick={() => openSingle(realIndex)}
                className="h-[172px] w-full rounded-2xl border border-border bg-card shadow-sm"
              />
            );
          })}
        </div>
      </div>

     
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={openGrid}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Ver más
        </button>
      </div>

     
      <Modal
        open={openMode !== null}
        onClose={close}
        title={openMode === "grid" ? `Imágenes — ${title}` : title}
      >
        {urls.length === 0 ? (
          <div className="text-sm text-secondary/80">No hay imágenes.</div>
        ) : openMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {urls.map((u, i) => (
              <button
                key={i}
                onClick={() => openSingle(i)}
                className="overflow-hidden rounded-2xl border border-border bg-card text-left hover:shadow-sm"
                title="Abrir"
              >
                <img
                  src={u}
                  alt={`${title} ${i + 1}`}
                  className="h-56 w-full object-cover"
                />
              </button>
            ))}
          </div>
        ) : (
          <FullImageViewer
            title={title}
            urls={urls}
            index={activeIndex}
            setIndex={setActiveIndex}
          />
        )}
      </Modal>
    </div>
  );
}
