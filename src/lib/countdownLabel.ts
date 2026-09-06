function startOfUTCDay(d: Date) {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/** Parses a "YYYY-MM-DD" string (as returned by the DB, see db.ts's DATE
 * type parser) into a UTC-midnight timestamp, avoiding any local-timezone
 * shift from `new Date(dateStr)`. */
function parseISODateUTC(dateStr: string): number {
  const [year, month, day] = dateStr.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

/**
 * Days remaining until a Games edition starts, for the /calendar page.
 * - Exact dates are used as-is; year-only editions are estimated from
 *   Jan 1 (start) / Dec 31 (end) of their year, per the user's choice.
 * - Returns `{ live: true }` while today falls within the edition's window,
 *   and `null` once the window has passed (nothing to show) or there's no
 *   date information at all.
 */
export function getCountdownLabel(edition: {
  start_date: string | null;
  end_date: string | null;
  start_year: number | null;
  end_year: number | null;
}): { live: boolean; daysToGo?: number } | null {
  const start = edition.start_date
    ? parseISODateUTC(edition.start_date)
    : edition.start_year
      ? Date.UTC(edition.start_year, 0, 1)
      : null;

  if (start === null) return null;

  const end = edition.end_date
    ? parseISODateUTC(edition.end_date)
    : edition.end_year
      ? Date.UTC(edition.end_year, 11, 31)
      : edition.start_year && !edition.start_date
        ? Date.UTC(edition.start_year, 11, 31)
        : start;

  const today = startOfUTCDay(new Date());

  if (today > end) return null;
  if (today >= start) return { live: true };

  const daysToGo = Math.ceil((start - today) / 86400000);
  return { live: false, daysToGo };
}
