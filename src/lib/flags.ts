// Self-hosted flag SVGs under public/flags/ (sourced once from the MIT-licensed
// flag-icons project — https://github.com/lipis/flag-icons — rather than a
// live third-party CDN, matching this project's self-hosted approach
// elsewhere). Adding a new opponent means dropping its {code}.svg in that
// folder and adding it to FLAG_CODES/COUNTRY_NAMES below.
const FLAG_CODES = new Set(["bh", "ph", "cn", "kz", "ir", "kr", "kw", "id", "qa"]);

const COUNTRY_NAMES: Record<string, string> = {
  bh: "Bahrain",
  ph: "Philippines",
  cn: "China",
  kz: "Kazakhstan",
  ir: "Iran",
  kr: "South Korea",
  kw: "Kuwait",
  id: "Indonesia",
  qa: "Qatar",
};

/** ISO 3166-1 alpha-2 code (any case) -> local flag SVG path, or null if we
 * don't have that flag bundled yet. */
export function flagSrc(countryCode: string | null | undefined): string | null {
  if (!countryCode) return null;
  const code = countryCode.trim().toLowerCase();
  return FLAG_CODES.has(code) ? `/flags/${code}.svg` : null;
}

/** ISO 3166-1 alpha-2 code -> display name, falling back to the raw code. */
export function countryName(countryCode: string | null | undefined): string | null {
  if (!countryCode) return null;
  const code = countryCode.trim().toLowerCase();
  return COUNTRY_NAMES[code] ?? countryCode.toUpperCase();
}
