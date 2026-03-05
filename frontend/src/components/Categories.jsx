const categories = [
  {
    key: "HOTEL",
    title: "Hoteles",
    subtitle: "Descubrí hoteles",
    seed: "stayhub-cat-hotel",
  },
  {
    key: "HOSTEL",
    title: "Hostels",
    subtitle: "Ideal para viajeros",
    seed: "stayhub-cat-hostel",
  },
  {
    key: "APARTMENT",
    title: "Departamentos",
    subtitle: "Como en casa",
    seed: "stayhub-cat-apartment",
  },
  {
    key: "BNB",
    title: "Bed & breakfast",
    subtitle: "Con desayuno",
    seed: "stayhub-cat-bnb",
  },
];

export default function Categories() {
  return (
    <section className=" px-6 pt-10">
      <h3 className="text-lg font-semibold text-primary">
        Buscar por tipo de alojamiento
      </h3>

      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => (
          <button
            key={c.key}
            className="overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            onClick={() => alert(`Sprint 1: filtro por ${c.key} (UI)`)}
          >
            <div className="h-36 w-full bg-border/60">
              <img
                src={`https://picsum.photos/seed/${c.seed}/800/500`}
                alt={c.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="p-4">
              <div className="font-semibold text-primary">{c.title}</div>
              <div className="mt-1 text-sm text-secondary/80">{c.subtitle}</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
