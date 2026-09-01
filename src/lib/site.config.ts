export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/history", label: "History" },
  { href: "/sports", label: "Sports" },
  { href: "/athletes", label: "Athletes" },
  { href: "/all-time-medals", label: "Medals" },
  { href: "/news", label: "News" },
  { href: "/videos", label: "Videos" },
  { href: "/events", label: "Events" },
] as const;

export const FOOTER_COLUMNS = [
  { title: "The team", links: ["Athletes", "Sports", "Results archive", "Selection policy"] },
  { title: "Media", links: ["News", "Videos", "Photo requests", "Accreditation"] },
  { title: "Committee", links: ["About the BOC", "Governance", "Integrity & safeguarding", "Careers"] },
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
