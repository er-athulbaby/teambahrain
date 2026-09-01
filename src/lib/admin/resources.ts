export type FieldType = "text" | "textarea" | "number" | "boolean" | "date" | "image" | "select";

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
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
    label: "Instagram post",
    pluralLabel: "Instagram",
    titleField: "caption",
    fields: [
      { key: "likes", label: "Likes", type: "text", required: true },
      { key: "caption", label: "Caption", type: "textarea", required: true },
      { key: "photo_path", label: "Photo", type: "image" },
      { key: "permalink", label: "Link", type: "text", required: true },
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
