import { useEffect, useState } from "react";
import {
  fetchAccommodationAvailability,
  fetchAccommodationSuggestions,
} from "../api/accommodations";
import DateRangeCalendar from "./DateRangeCalendar";

function formatDateSummary(startDate, endDate) {
  if (!startDate && !endDate) return "Seleccioná fechas";
  if (startDate && !endDate) return `Check-in: ${startDate}`;
  return `${startDate} - ${endDate}`;
}

export default function SearchBar({
  initialQuery = "",
  initialStartDate = "",
  initialEndDate = "",
  onSearch,
}) {
  const [query, setQuery] = useState(initialQuery);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [error, setError] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [disabledRanges, setDisabledRanges] = useState([]);
  const [loadingRanges, setLoadingRanges] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setStartDate(initialStartDate);
  }, [initialStartDate]);

  useEffect(() => {
    setEndDate(initialEndDate);
  }, [initialEndDate]);

  useEffect(() => {
    if (!selectedSuggestion) return;

    if (query !== selectedSuggestion.value) {
      setSelectedSuggestion(null);
      setDisabledRanges([]);
    }
  }, [query, selectedSuggestion]);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setSuggestions([]);
      setSuggestionsOpen(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoadingSuggestions(true);
        const data = await fetchAccommodationSuggestions(trimmed, 8);
        setSuggestions(data);
        setSuggestionsOpen(true);
      } catch {
        setSuggestions([]);
        setSuggestionsOpen(false);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  async function loadRangesForAccommodation(accommodationId) {
    try {
      setLoadingRanges(true);
      const data = await fetchAccommodationAvailability(accommodationId);
      setDisabledRanges(data?.bookedRanges ?? []);
    } catch {
      setDisabledRanges([]);
    } finally {
      setLoadingRanges(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if ((startDate && !endDate) || (!startDate && endDate)) {
      setError("Debés completar check-in y check-out juntos.");
      return;
    }

    if (startDate && endDate && startDate >= endDate) {
      setError("La fecha de check-in debe ser anterior al check-out.");
      return;
    }

    setSuggestionsOpen(false);
    setCalendarOpen(false);

    onSearch?.({
      query: query.trim(),
      startDate,
      endDate,
    });
  }

  async function handleSelectSuggestion(item) {
    setQuery(item.value);
    setSelectedSuggestion(item);
    setSuggestionsOpen(false);

    if (item.type === "ALOJAMIENTO" && item.id) {
      await loadRangesForAccommodation(item.id);
    } else {
      setDisabledRanges([]);
    }
  }

  function handleDateChange({ startDate: nextStart, endDate: nextEnd }) {
    setStartDate(nextStart);
    setEndDate(nextEnd);
  }

  const shouldShowBlockedRanges =
    selectedSuggestion?.type === "ALOJAMIENTO" && selectedSuggestion?.id;

  return (
    <section className="w-full bg-card text-primary">
      <div className="mx-auto max-w-screen-xl px-6 py-10">
        <h2 className="font-serif text-3xl font-semibold tracking-tight">
          Buscá ofertas en hoteles, casas y mucho más
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-12"
        >
          <div className="relative md:col-span-4">
            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-secondary shadow-sm">
              <span className="text-secondary/70">📍</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setSuggestionsOpen(true);
                }}
                onBlur={() => {
                  setTimeout(() => setSuggestionsOpen(false), 150);
                }}
                className="w-full bg-transparent text-sm outline-none placeholder:text-secondary/60"
                placeholder="Ciudad, país o alojamiento"
                aria-label="Destino"
              />
            </div>

            {suggestionsOpen &&
            (suggestions.length > 0 || loadingSuggestions) ? (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
                {loadingSuggestions ? (
                  <div className="px-4 py-3 text-sm text-secondary/70">
                    Buscando sugerencias...
                  </div>
                ) : (
                  suggestions.map((item, index) => (
                    <button
                      key={`${item.type}-${item.value}-${index}`}
                      type="button"
                      onMouseDown={() => handleSelectSuggestion(item)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-background"
                    >
                      <span className="text-primary">{item.label}</span>
                      <span className="text-xs font-semibold uppercase tracking-wide text-secondary/60">
                        {item.type}
                      </span>
                    </button>
                  ))
                )}
              </div>
            ) : null}
          </div>

          <div className="relative md:col-span-6">
            <button
              type="button"
              onClick={() => setCalendarOpen((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 text-left text-sm text-secondary shadow-sm"
            >
              <span>📅 {formatDateSummary(startDate, endDate)}</span>
              <span className="text-secondary/60">
                {calendarOpen ? "▲" : "▼"}
              </span>
            </button>

            {calendarOpen ? (
              <div className="absolute z-20 mt-2 w-full">
                <DateRangeCalendar
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleDateChange}
                  disabledRanges={shouldShowBlockedRanges ? disabledRanges : []}
                  minDate={new Date()}
                />
              </div>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
            >
              Buscar
            </button>
          </div>
        </form>

        {shouldShowBlockedRanges ? (
          <p className="mt-3 text-sm text-secondary/80">
            {loadingRanges
              ? "Cargando fechas ocupadas del alojamiento..."
              : "Se marcaron en rojo las fechas ocupadas del alojamiento seleccionado."}
          </p>
        ) : query ? (
          <p className="mt-3 text-sm text-secondary/70">
            Para ver fechas ocupadas en el calendario, elegí un alojamiento
            específico de las sugerencias.
          </p>
        ) : null}

        {error ? (
          <p className="mt-2 text-sm font-medium text-accent">{error}</p>
        ) : null}
      </div>
    </section>
  );
}
