export type FieldType = "text" | "textarea" | "number" | "boolean" | "date" | "image" | "video" | "select";

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  hint?: string;
}

export interface ResourceConfig {
  key: string;
  table: string;
  label: string;
  pluralLabel: string;
  fields: FieldConfig[];
  /** When set, a `slug` column is auto-generated from this field on create. */
  slugSource?: string;
  titleField: string;
  /** When set, rows are scoped to a parent (e.g. "game_edition_id") — the
   * API requires a `?scope=<id>` query param, filtered on list and injected on create. */
  scopeField?: string;
  /** URL template (with `{id}`) for a "Manage content →" link per row, e.g. a
   * parent resource whose rows each own further scoped child resources. */
  detailHref?: string;
}

export const RESOURCES: Record<string, ResourceConfig> = {
  athletes: {
    key: "athletes",
    table: "athletes",
    label: "Athlete",
    pluralLabel: "Athletes",
    slugSource: "name",
    titleField: "name",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "sport", label: "Sport", type: "text", required: true },
      { key: "event", label: "Event", type: "text", required: true },
      { key: "line", label: "Bio line", type: "textarea", required: true },
      { key: "photo_path", label: "Photo", type: "image" },
      { key: "featured", label: "Featured on Home", type: "boolean" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  sports: {
    key: "sports",
    table: "sports",
    label: "Sport",
    pluralLabel: "Sports",
    slugSource: "name",
    titleField: "name",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "squads_label", label: "Squads label", type: "text", required: true },
      { key: "note", label: "Note", type: "textarea", required: true },
      { key: "photo_path", label: "Photo", type: "image" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  news: {
    key: "news",
    table: "news",
    label: "News item",
    pluralLabel: "News",
    slugSource: "title",
    titleField: "title",
    fields: [
      { key: "date", label: "Date", type: "date", required: true },
      { key: "kicker", label: "Kicker", type: "text", required: true },
      { key: "title", label: "Title", type: "text", required: true },
      { key: "blurb", label: "Blurb", type: "textarea", required: true },
      { key: "photo_path", label: "Photo", type: "image" },
      { key: "is_lead", label: "Lead story (News page)", type: "boolean" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  videos: {
    key: "videos",
    table: "videos",
    label: "Video",
    pluralLabel: "Videos",
    slugSource: "title",
    titleField: "title",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "duration", label: "Duration", type: "text", required: true },
      { key: "series", label: "Series", type: "text", required: true },
      { key: "photo_path", label: "Thumbnail", type: "image" },
      {
        key: "video_path",
        label: "Video file",
        type: "video",
        hint: "Optional — without one, the public page just shows the thumbnail (today's behavior).",
      },
      { key: "is_feature", label: "Feature video (top of page)", type: "boolean" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  events: {
    key: "events",
    table: "events",
    label: "Event",
    pluralLabel: "Events",
    titleField: "name",
    fields: [
      { key: "date", label: "Date", type: "date", required: true },
      { key: "name", label: "Name", type: "text", required: true },
      { key: "city", label: "Host city", type: "text", required: true },
      { key: "sports_label", label: "Sports", type: "text", required: true },
      { key: "status_label", label: "Status label", type: "text", required: true },
      {
        key: "status_type",
        label: "Status style",
        type: "select",
        required: true,
        options: ["key", "progress", "confirmed"],
      },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  timeline_entries: {
    key: "timeline_entries",
    table: "timeline_entries",
    label: "Timeline entry",
    pluralLabel: "History timeline",
    titleField: "title",
    fields: [
      { key: "year", label: "Year", type: "text", required: true },
      { key: "title", label: "Title", type: "text", required: true },
      { key: "body", label: "Body", type: "textarea", required: true },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  legends: {
    key: "legends",
    table: "legends",
    label: "Legend",
    pluralLabel: "Legends",
    titleField: "name",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "era", label: "Era", type: "text", required: true },
      { key: "line", label: "Bio line", type: "textarea", required: true },
      { key: "photo_path", label: "Photo", type: "image" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  instagram_posts: {
    key: "instagram_posts",
    table: "instagram_posts",
    label: "Instagram reel",
    pluralLabel: "Instagram",
    titleField: "reel_url",
    fields: [
      {
        key: "reel_url",
        label: "Instagram post/reel URL",
        type: "text",
        required: true,
        hint: "Paste the full instagram.com/reel/... or instagram.com/p/... link — the real post embeds automatically, no caption or like count needed.",
      },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  home_figures: {
    key: "home_figures",
    table: "home_figures",
    label: "Figure",
    pluralLabel: "Home figures",
    titleField: "label",
    fields: [
      { key: "value", label: "Value", type: "text", required: true },
      { key: "label", label: "Label", type: "text", required: true },
      { key: "note", label: "Note", type: "textarea", required: true },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  continental_stats: {
    key: "continental_stats",
    table: "continental_stats",
    label: "Stat",
    pluralLabel: "Continental stats",
    titleField: "label",
    fields: [
      { key: "value", label: "Value", type: "text", required: true },
      { key: "label", label: "Label", type: "textarea", required: true },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  ticker_items: {
    key: "ticker_items",
    table: "ticker_items",
    label: "Ticker item",
    pluralLabel: "Ticker",
    titleField: "text",
    fields: [
      { key: "text", label: "Text", type: "text", required: true },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  game_editions: {
    key: "game_editions",
    table: "game_editions",
    label: "Games edition",
    pluralLabel: "Games editions",
    slugSource: "name",
    titleField: "name",
    detailHref: "/admin/game_editions/{id}/manage",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "edition_type", label: "Type", type: "text", required: true },
      { key: "city", label: "Host city", type: "text", required: true },
      { key: "start_date", label: "Start date", type: "date", required: true },
      { key: "end_date", label: "End date", type: "date" },
      { key: "logo_path", label: "Logo", type: "image" },
      { key: "is_published", label: "Published (visible on the public site)", type: "boolean" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  game_edition_sports: {
    key: "game_edition_sports",
    table: "game_edition_sports",
    label: "Sport",
    pluralLabel: "Sports",
    titleField: "name",
    scopeField: "game_edition_id",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "icon_path", label: "Icon", type: "image" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  game_edition_delegates: {
    key: "game_edition_delegates",
    table: "game_edition_delegates",
    label: "Delegate",
    pluralLabel: "Delegation",
    titleField: "name",
    scopeField: "game_edition_id",
    fields: [
      {
        key: "group_name",
        label: "Group",
        type: "select",
        required: true,
        options: ["official", "administrative"],
      },
      { key: "name", label: "Name", type: "text", required: true },
      { key: "title", label: "Title", type: "text", required: true },
      { key: "photo_path", label: "Photo", type: "image" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  game_edition_players: {
    key: "game_edition_players",
    table: "game_edition_players",
    label: "Player",
    pluralLabel: "Players",
    titleField: "name",
    scopeField: "game_edition_id",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "sport", label: "Sport", type: "text", required: true },
      { key: "photo_path", label: "Photo", type: "image" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  game_edition_events: {
    key: "game_edition_events",
    table: "game_edition_events",
    label: "Event",
    pluralLabel: "Events & results",
    titleField: "title",
    scopeField: "game_edition_id",
    fields: [
      { key: "sport", label: "Sport", type: "text", required: true },
      { key: "title", label: "Title", type: "text", required: true },
      { key: "venue", label: "Venue", type: "text", required: true },
      { key: "event_date", label: "Date", type: "date", required: true },
      { key: "event_time", label: "Time", type: "text" },
      {
        key: "result_time",
        label: "Result — time/score",
        type: "text",
        hint: "Leave blank until the event has happened; filling this in moves it from Events to Results.",
      },
      { key: "result_rank", label: "Result — rank", type: "text" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  game_edition_medals: {
    key: "game_edition_medals",
    table: "game_edition_medals",
    label: "Medal record",
    pluralLabel: "Medals",
    titleField: "athlete_name",
    scopeField: "game_edition_id",
    fields: [
      { key: "sport", label: "Sport", type: "text", required: true },
      { key: "event_name", label: "Event", type: "text", required: true },
      { key: "athlete_name", label: "Athlete", type: "text", required: true },
      { key: "medal", label: "Medal", type: "select", required: true, options: ["G", "S", "B"] },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
};

export function getResource(key: string): ResourceConfig | undefined {
  return RESOURCES[key];
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
