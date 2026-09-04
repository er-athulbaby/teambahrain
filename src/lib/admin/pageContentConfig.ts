export type PageFieldType = "text" | "textarea" | "image" | "video" | "boolean" | "date";

export interface PageFieldConfig {
  key: string;
  label: string;
  type: PageFieldType;
  default: string;
  hint?: string;
}

export interface PageContentConfig {
  label: string;
  fields: PageFieldConfig[];
  /** Restricts this page's settings to the "admin" role (Editors are blocked). */
  adminOnly?: boolean;
}

export const PAGE_CONTENT_CONFIG: Record<string, PageContentConfig> = {
  site: {
    label: "Site settings",
    adminOnly: true,
    fields: [
      {
        key: "logo",
        label: "Logo",
        type: "image",
        default: "",
        hint: "Shown in the admin sidebar and on the login page. Falls back to the default icon when empty.",
      },
      { key: "favicon", label: "Favicon", type: "image", default: "/favicon.ico" },
      { key: "tagline", label: "Site tagline", type: "text", default: "Bahrain Olympic Committee" },
      {
        key: "loader_enabled",
        label: "Show a loading bar during page navigation",
        type: "boolean",
        default: "true",
      },
      {
        key: "games_date",
        label: "Countdown target date",
        type: "date",
        default: "2028-07-14",
        hint: "The countdown on the Home and Events pages counts down to midnight UTC on this date.",
      },
    ],
  },
  home: {
    label: "Home",
    fields: [
      { key: "hero_eyebrow", label: "Hero eyebrow", type: "text", default: "Road to Los Angeles 2028" },
      {
        key: "hero_headline",
        label: "Hero headline",
        type: "textarea",
        default: "One island.\nOne team.",
        hint: "Each line becomes its own line on the page.",
      },
      {
        key: "hero_intro",
        label: "Hero intro",
        type: "textarea",
        default:
          "The official home of Bahrain's Olympic movement — every athlete, every federation, every result on the road from Aichi–Nagoya to Los Angeles.",
      },
      { key: "hero_photo", label: "Hero photo", type: "image", default: "/images/samples/tb-hero.png" },
      { key: "hero_caption", label: "Hero photo caption", type: "text", default: "Paris 2024 · Stade de France" },
      { key: "close_eyebrow", label: "Closing band eyebrow", type: "text", default: "Support the movement" },
      {
        key: "close_headline",
        label: "Closing band headline",
        type: "textarea",
        default: "Small island.\nLong stride.",
        hint: "Each line becomes its own line on the page.",
      },
      {
        key: "close_body",
        label: "Closing band body",
        type: "textarea",
        default: "Fifteen federations, one development pathway. Follow the squad, or find a club near you.",
      },
      {
        key: "show_figures_strip",
        label: "Show the figures strip (First games / Olympic titles / Federations / Athletes)",
        type: "boolean",
        default: "true",
      },
      {
        key: "show_games_section",
        label: "Show the \"Games\" section",
        type: "boolean",
        default: "true",
      },
      {
        key: "show_calendar_section",
        label: "Show the \"Calendar\" section",
        type: "boolean",
        default: "true",
      },
      {
        key: "show_news_section",
        label: "Show \"Latest from the team\" section",
        type: "boolean",
        default: "true",
      },
      {
        key: "show_athletes_section",
        label: "Show \"Athletes to watch\" section",
        type: "boolean",
        default: "true",
      },
      {
        key: "show_medals_section",
        label: "Show \"All-time Olympic medals\" section",
        type: "boolean",
        default: "true",
      },
    ],
  },
  history: {
    label: "History",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text", default: "Since 1978" },
      { key: "headline", label: "Headline", type: "text", default: "History" },
      {
        key: "intro",
        label: "Intro",
        type: "textarea",
        default:
          "From a committee formed in Manama to an Olympic title on the track in London — five decades of Bahraini sport, in order.",
      },
      { key: "legends_heading", label: "Legends section heading", type: "text", default: "Names that opened doors" },
    ],
  },
  sports: {
    label: "Sports",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text", default: "Federations & pathways" },
      { key: "headline", label: "Headline", type: "text", default: "Sports" },
      {
        key: "intro",
        label: "Intro",
        type: "textarea",
        default:
          "Each federation runs its own national squads, domestic league and youth intake. Select a sport for fixtures, rankings and club contacts.",
      },
    ],
  },
  athletes: {
    label: "Athletes",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text", default: "National squad" },
      { key: "headline", label: "Headline", type: "text", default: "Athletes" },
      {
        key: "intro",
        label: "Intro",
        type: "textarea",
        default:
          "Current internationals and the legends who set the standard. Profiles carry personal bests, results and federation contact.",
      },
    ],
  },
  medals: {
    label: "All-time medals",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text", default: "1984 — 2024" },
      {
        key: "headline",
        label: "Headline",
        type: "textarea",
        default: "All-time\nmedals",
        hint: "Each line becomes its own line on the page.",
      },
      {
        key: "intro",
        label: "Intro",
        type: "textarea",
        default:
          "Every Olympic medal won by a Bahraini athlete, by Games, sport, event and athlete — select a row to open it. Counts reflect medals as currently awarded, including subsequent reallocations.",
      },
      { key: "gold_note", label: "Gold note", type: "text", default: "2012, 2016 and 2024 — all in athletics." },
      { key: "silver_note", label: "Silver note", type: "text", default: "Marathon, 10,000m and 400m." },
      { key: "bronze_note", label: "Bronze note", type: "text", default: "Still to come." },
      { key: "total_note", label: "Total note", type: "text", default: "Across eleven summer Games." },
      { key: "continental_eyebrow", label: "Continental section eyebrow", type: "text", default: "Beyond the Olympics" },
      {
        key: "continental_headline",
        label: "Continental section headline",
        type: "text",
        default: "Asian Games & continental record",
      },
    ],
  },
  news: {
    label: "News",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text", default: "Newsroom" },
      { key: "headline", label: "Headline", type: "text", default: "News" },
      { key: "lead_location", label: "Lead story location", type: "text", default: "Manama" },
    ],
  },
  videos: {
    label: "Videos",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text", default: "Team Bahrain TV" },
      { key: "headline", label: "Headline", type: "text", default: "Videos" },
    ],
  },
  events: {
    label: "Events",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text", default: "Season 2026 — 2028" },
      { key: "headline", label: "Headline", type: "text", default: "Events" },
      {
        key: "intro",
        label: "Intro",
        type: "textarea",
        default:
          "Every fixture where Bahrain fields a national team or qualifying entry, from continental championships to the Games themselves.",
      },
      {
        key: "closing_headline",
        label: "Closing band headline",
        type: "textarea",
        default: "Los Angeles opens\n14 July 2028.",
        hint: "Each line becomes its own line on the page. Keep in sync with the countdown target in site.config.ts.",
      },
    ],
  },
};

export function getPageConfig(page: string): PageContentConfig | undefined {
  return PAGE_CONTENT_CONFIG[page];
}
