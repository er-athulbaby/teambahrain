export interface Athlete {
  id: number;
  slug: string;
  name: string;
  sport: string;
  event: string;
  line: string;
  photo_path: string;
  featured: boolean;
}

export interface Sport {
  id: number;
  slug: string;
  name: string;
  squads_label: string;
  note: string;
  photo_path: string;
}

export interface NewsItem {
  id: number;
  slug: string;
  date: string;
  kicker: string;
  title: string;
  blurb: string;
  photo_path: string;
  is_lead: boolean;
}

export interface Video {
  id: number;
  slug: string;
  title: string;
  duration: string;
  series: string;
  photo_path: string;
  video_path: string | null;
  is_feature: boolean;
}

export type EventStatusType = "key" | "progress" | "confirmed";

export interface EventItem {
  id: number;
  date: string;
  name: string;
  city: string;
  sports_label: string;
  status_label: string;
  status_type: EventStatusType;
}

export interface TimelineEntry {
  id: number;
  year: string;
  title: string;
  body: string;
}

export interface Legend {
  id: number;
  name: string;
  era: string;
  line: string;
  photo_path: string;
}

export interface InstagramPost {
  id: number;
  reel_url: string;
}

export interface HomeFigure {
  id: number;
  value: string;
  label: string;
  note: string;
}

export interface ContinentalStat {
  id: number;
  value: string;
  label: string;
}

export type Medal = "G" | "S" | "B";

export interface MedalRecord {
  game_id: number;
  year: string;
  city: string;
  sport: string;
  event_name: string;
  athlete_name: string;
  medal: Medal;
}

export interface OlympicGame {
  id: number;
  year: string;
  city: string;
}

export interface MedalCounts {
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export interface GameEdition {
  id: number;
  slug: string;
  name: string;
  edition_type: string;
  city: string;
  /** Exactly one of start_date/start_year is set — start_year is the
   * fallback for an edition whose exact dates aren't announced yet. */
  start_date: string | null;
  start_year: number | null;
  end_date: string | null;
  end_year: number | null;
  logo_path: string | null;
  /** draft: hidden. announced: shows in listings but isn't a link yet
   * (no micro-site content). live: fully clickable. */
  status: "draft" | "announced" | "live";
}

export interface GameEditionSport {
  id: number;
  name: string;
  icon_path: string | null;
}

export type DelegateGroup = "official" | "administrative";

export interface GameEditionDelegate {
  id: number;
  group_name: DelegateGroup;
  name: string;
  title: string;
  photo_path: string | null;
}

export interface GameEditionPlayer {
  id: number;
  name: string;
  sport: string;
  photo_path: string | null;
}

export interface GameEditionEvent {
  id: number;
  sport: string;
  title: string;
  venue: string;
  event_date: string;
  event_time: string | null;
  result_time: string | null;
  result_rank: string | null;
}

export interface GameEditionMedalRecord {
  sport: string;
  event_name: string;
  athlete_name: string;
  medal: Medal;
}
