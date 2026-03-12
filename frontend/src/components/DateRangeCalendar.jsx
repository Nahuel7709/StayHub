import { useMemo, useState } from "react";

const WEEK_DAYS_FULL = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const WEEK_DAYS_SHORT = ["D", "L", "M", "M", "J", "V", "S"];
const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function parseLocalDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toMonthInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function isSameDay(a, b) {
  return (
    a?.getFullYear() === b?.getFullYear() &&
    a?.getMonth() === b?.getMonth() &&
    a?.getDate() === b?.getDate()
  );
}

function isBeforeDay(a, b) {
  return a.getTime() < b.getTime();
}

function isAfterDay(a, b) {
  return a.getTime() > b.getTime();
}

function isWithinRange(day, start, end) {
  if (!start || !end) return false;
  return isAfterDay(day, start) && isBeforeDay(day, end);
}

function isBlockedByRanges(day, disabledRanges = []) {
  return disabledRanges.some((range) => {
    const start = parseLocalDate(range.checkIn);
    const end = parseLocalDate(range.checkOut);
    if (!start || !end) return false;

  
    return day.getTime() >= start.getTime() && day.getTime() < end.getTime();
  });
}

function rangeHasBlockedDates(start, end, disabledRanges = []) {
  let current = addDays(start, 1);

  while (isBeforeDay(current, end) || isSameDay(current, end)) {
    if (isBlockedByRanges(current, disabledRanges)) {
      return true;
    }
    current = addDays(current, 1);
  }

  return false;
}

function getMonthGrid(monthDate) {
  const firstDayOfMonth = startOfMonth(monthDate);
  const startOffset = firstDayOfMonth.getDay();
  const gridStart = addDays(firstDayOfMonth, -startOffset);

  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}

function formatMonthLabel(date) {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

function formatSelectedRange(startDate, endDate) {
  if (!startDate && !endDate) return "Seleccioná check-in y check-out";
  if (startDate && !endDate) return `Check-in: ${startDate}`;
  return `${startDate} → ${endDate}`;
}

export default function DateRangeCalendar({
  startDate,
  endDate,
  onChange,
  disabledRanges = [],
  minDate,
  className = "",
  compactWeekDays = false,
}) {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const effectiveMinDate = useMemo(() => {
    if (!minDate) return null;

    if (minDate instanceof Date) {
      return new Date(
        minDate.getFullYear(),
        minDate.getMonth(),
        minDate.getDate(),
      );
    }

    return parseLocalDate(minDate);
  }, [minDate]);

  const parsedStart = useMemo(() => parseLocalDate(startDate), [startDate]);
  const parsedEnd = useMemo(() => parseLocalDate(endDate), [endDate]);

  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(parsedStart || today),
  );

  const months = [visibleMonth, addMonths(visibleMonth, 1)];

  function handleMonthJump(value) {
    if (!value) return;
    const [year, month] = value.split("-").map(Number);
    setVisibleMonth(new Date(year, month - 1, 1));
  }

  function handleClear() {
    onChange?.({ startDate: "", endDate: "" });
  }

  function handleDayClick(day, isOutsideMonth) {
    if (isOutsideMonth) return;
    if (effectiveMinDate && isBeforeDay(day, effectiveMinDate)) return;
    if (isBlockedByRanges(day, disabledRanges)) return;

    const clickedIso = toIsoDate(day);

    if (!startDate || (startDate && endDate)) {
      onChange?.({ startDate: clickedIso, endDate: "" });
      return;
    }

    if (startDate && !endDate) {
      if (!parsedStart || !isAfterDay(day, parsedStart)) {
        onChange?.({ startDate: clickedIso, endDate: "" });
        return;
      }

      if (rangeHasBlockedDates(parsedStart, day, disabledRanges)) {
        return;
      }

      onChange?.({
        startDate,
        endDate: clickedIso,
      });
    }
  }

  const weekDays = compactWeekDays ? WEEK_DAYS_SHORT : WEEK_DAYS_FULL;

  return (
    <div
      className={`rounded-2xl border border-border bg-white p-4 shadow-sm ${className}`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setVisibleMonth((prev) => addMonths(prev, -1))}
          className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-primary hover:bg-background"
        >
          ←
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="month"
            value={toMonthInputValue(visibleMonth)}
            onChange={(e) => handleMonthJump(e.target.value)}
            className="rounded-lg border border-border px-3 py-2 text-sm text-primary"
          />

          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-primary hover:bg-background"
          >
            Limpiar
          </button>
        </div>

        <button
          type="button"
          onClick={() => setVisibleMonth((prev) => addMonths(prev, 1))}
          className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-primary hover:bg-background"
        >
          →
        </button>
      </div>

      <div className="mb-4 text-center text-sm font-medium text-secondary/80">
        {formatSelectedRange(startDate, endDate)}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {months.map((monthDate, monthIndex) => {
          const days = getMonthGrid(monthDate);

          return (
            <div
              key={`${monthDate.getFullYear()}-${monthDate.getMonth()}-${monthIndex}`}
            >
              <div className="mb-3 text-center font-semibold text-primary">
                {formatMonthLabel(monthDate)}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-secondary/60">
                {weekDays.map((dayName, index) => (
                  <div key={`${dayName}-${index}`} className="py-2">
                    {dayName}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                  const isOutsideMonth =
                    day.getMonth() !== monthDate.getMonth();
                  const isBlocked = isBlockedByRanges(day, disabledRanges);
                  const isSelectedStart =
                    parsedStart && isSameDay(day, parsedStart);
                  const isSelectedEnd = parsedEnd && isSameDay(day, parsedEnd);
                  const isInRange = isWithinRange(day, parsedStart, parsedEnd);
                  const isToday = isSameDay(day, today);
                  const isBeforeMin =
                    effectiveMinDate && isBeforeDay(day, effectiveMinDate);

                  const isDisabled = isOutsideMonth || isBlocked || isBeforeMin;

                  let classes =
                    "flex h-10 items-center justify-center rounded-xl text-sm transition ";

                  if (isSelectedStart || isSelectedEnd) {
                    classes += "bg-primary font-semibold text-white ";
                  } else if (isInRange) {
                    classes += "bg-primary/10 font-medium text-primary ";
                  } else if (isDisabled) {
                    classes += "text-secondary/35 ";
                  } else if (isToday) {
                    classes +=
                      "border border-primary font-semibold text-primary ";
                  } else {
                    classes += "text-primary hover:bg-background ";
                  }

                  if (isBlocked && !isOutsideMonth) {
                    classes += "bg-red-50 text-red-400 line-through ";
                  }

                  return (
                    <button
                      key={toIsoDate(day)}
                      type="button"
                      onClick={() => handleDayClick(day, isOutsideMonth)}
                      disabled={isDisabled}
                      className={classes}
                    >
                      {isOutsideMonth ? "" : day.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-secondary/70">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-primary" />
          Selección
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-primary/10" />
          Rango
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-red-50 ring-1 ring-red-200" />
          Ocupado
        </div>
      </div>
    </div>
  );
}
