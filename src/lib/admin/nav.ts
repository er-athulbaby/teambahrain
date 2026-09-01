export const ADMIN_NAV = [
  {
    section: "Content",
    items: [
      { href: "/admin/athletes", label: "Athletes" },
      { href: "/admin/sports", label: "Sports" },
      { href: "/admin/news", label: "News" },
      { href: "/admin/videos", label: "Videos" },
      { href: "/admin/events", label: "Events" },
      { href: "/admin/medals", label: "Olympic medals" },
    ],
  },
  {
    section: "History page",
    items: [
      { href: "/admin/timeline_entries", label: "Timeline" },
      { href: "/admin/legends", label: "Legends" },
    ],
  },
  {
    section: "Home page",
    items: [
      { href: "/admin/home_figures", label: "Figures strip" },
      { href: "/admin/instagram_posts", label: "Instagram" },
      { href: "/admin/ticker_items", label: "Ticker" },
    ],
  },
  {
    section: "Medals page",
    items: [{ href: "/admin/continental_stats", label: "Continental stats" }],
  },
] as const;
