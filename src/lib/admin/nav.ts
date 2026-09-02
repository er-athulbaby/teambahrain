import {
  LayoutDashboard,
  LineChart,
  Users,
  Trophy,
  Newspaper,
  Video,
  CalendarDays,
  Medal,
  History,
  Star,
  BarChart3,
  Camera,
  Rss,
  Globe2,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface AdminNavGroup {
  section: string | null;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    section: null,
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Analytics", icon: LineChart },
    ],
  },
  {
    section: "Content",
    items: [
      { href: "/admin/athletes", label: "Athletes", icon: Users },
      { href: "/admin/sports", label: "Sports", icon: Trophy },
      { href: "/admin/news", label: "News", icon: Newspaper },
      { href: "/admin/videos", label: "Videos", icon: Video },
      { href: "/admin/events", label: "Events", icon: CalendarDays },
      { href: "/admin/medals", label: "Olympic medals", icon: Medal },
    ],
  },
  {
    section: "History page",
    items: [
      { href: "/admin/timeline_entries", label: "Timeline", icon: History },
      { href: "/admin/legends", label: "Legends", icon: Star },
    ],
  },
  {
    section: "Home page",
    items: [
      { href: "/admin/home_figures", label: "Figures strip", icon: BarChart3 },
      { href: "/admin/instagram_posts", label: "Instagram", icon: Camera },
      { href: "/admin/ticker_items", label: "Ticker", icon: Rss },
    ],
  },
  {
    section: "Medals page",
    items: [{ href: "/admin/continental_stats", label: "Continental stats", icon: Globe2 }],
  },
];
