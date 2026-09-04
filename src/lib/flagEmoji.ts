/** Converts an ISO 3166-1 alpha-2 code (e.g. "PH") into its flag emoji, by
 * mapping each letter to its Unicode Regional Indicator Symbol. Returns null
 * for anything that isn't exactly two letters — including codes with no
 * matching ISO country (e.g. "TPE" for Chinese Taipei, which competes under
 * a neutral Olympic flag with no Unicode equivalent — deliberately left
 * without a flag rather than showing Taiwan's). */
export function flagEmoji(countryCode: string | null | undefined): string | null {
  if (!countryCode) return null;
  const code = countryCode.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return null;
  return String.fromCodePoint(...[...code].map((c) => 127397 + c.charCodeAt(0)));
}
