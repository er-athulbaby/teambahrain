export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/calendar", label: "Calendar" },
  { href: "/videos", label: "Videos" },
] as const;

export const FOOTER_COLUMNS = [
  { title: "The team", links: ["Athletes", "Sports", "Results archive"] },
  { title: "Media", links: ["News", "Videos"] },
  { title: "Committee", links: ["Integrity & safeguarding"] },
] as const;

export const ATHLETE_FILTERS = ["All", "Athletics", "Handball", "Football", "Cycling", "Combat"] as const;

export const MEDAL_SPORT_FILTERS = [
  "All",
  "Athletics",
  "Handball",
  "Football",
  "Cycling",
  "Swimming",
  "Weightlifting",
] as const;

export const GAMES_DATE = "2028-07-14T20:00:00Z";

export const EVENT_STATUS_STYLES = {
  key: { bg: "#ec3013", fg: "#ffffff" },
  progress: { bg: "#ffe0d9", fg: "#7c1405" },
  confirmed: { bg: "#eae7e7", fg: "#444141" },
} as const;
