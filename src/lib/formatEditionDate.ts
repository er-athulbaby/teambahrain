/** Formats a Games edition's start/end date, falling back to just the year
 * when the exact date isn't confirmed yet (see game_editions.start_year/end_year). */
export function formatEditionDate(date: string | null, year: number | null): string {
  if (date) {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  return year ? String(year) : "";
}
