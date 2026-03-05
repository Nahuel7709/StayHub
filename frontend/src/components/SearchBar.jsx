export default function SearchBar() {
  return (
    <section className="w-full bg-card text-primary">
      <div className="mx-auto max-w-screen-xl px-6 py-10">
        <h2 className="font-serif text-3xl font-semibold tracking-tight">
          Buscá ofertas en hoteles, casas y mucho más
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-12">
         
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-secondary shadow-sm">
              <span className="text-secondary/70">📍</span>
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-secondary/60"
                placeholder="¿A dónde vamos?"
                aria-label="Destino"
              />
            </div>
          </div>

        
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-secondary shadow-sm">
              <span className="text-secondary/70">📅</span>
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-secondary/60"
                placeholder="Check in - Check out"
                aria-label="Fechas"
              />
            </div>
          </div>

          
          <div className="md:col-span-2">
            <button
              className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
              onClick={() => alert("Sprint 1: buscador solo UI")}
            >
              Buscar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
