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
  FileText,
  UserCog,
  Settings,
  Flag,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Hidden from Editors — visible to the "admin" role only. */
  adminOnly?: boolean;
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
      { href: "/admin/analytics", label: "Analytics", icon: LineChart, adminOnly: true },
    ],
  },
  {
    section: "Games",
    items: [{ href: "/admin/game_editions", label: "Games editions", icon: Flag }],
  },
  {
    section: "Settings",
    items: [
      { href: "/admin/users", label: "Users", icon: UserCog, adminOnly: true },
      { href: "/admin/pages/site", label: "Site settings", icon: Settings, adminOnly: true },
    ],
  },
  {
    section: "Page content",
    items: [
      { href: "/admin/pages/home", label: "Home", icon: FileText },
      { href: "/admin/pages/history", label: "History", icon: FileText },
      { href: "/admin/pages/sports", label: "Sports", icon: FileText },
      { href: "/admin/pages/athletes", label: "Athletes", icon: FileText },
      { href: "/admin/pages/medals", label: "All-time medals", icon: FileText },
      { href: "/admin/pages/news", label: "News", icon: FileText },
      { href: "/admin/pages/videos", label: "Videos", icon: FileText },
      { href: "/admin/pages/events", label: "Events", icon: FileText },
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
