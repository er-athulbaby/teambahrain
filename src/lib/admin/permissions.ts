import type { AdminRole } from "@/auth";

interface RestrictedRoleConfig {
  /** URL path prefixes under /admin this role may visit. */
  pathPrefixes: string[];
  /** Resource keys (see resources.ts) this role may read/create/update via
   * the generic admin API. */
  resourceKeys: string[];
  /** Resource keys this role may add/edit but not delete rows from. */
  noDeleteResourceKeys: string[];
  /** Whether this role may delete items from the shared Media library. */
  canDeleteMedia: boolean;
  /** Where to send this role after login, or when it hits a blocked path. */
  landingPath: string;
}

const GAME_EDITION_RESOURCE_KEYS = [
  "game_editions",
  "game_edition_sports",
  "game_edition_delegates",
  "game_edition_players",
  "game_edition_events",
  "game_edition_medals",
];

// Only "media" and "sports_editor" are restricted here — "admin" and
// "editor" fall through to the existing broad/adminOnly-based behavior
// everywhere this module is consulted.
const RESTRICTED_ROLES: Partial<Record<AdminRole, RestrictedRoleConfig>> = {
  media: {
    pathPrefixes: ["/admin/photos", "/admin/videos", "/admin/media"],
    resourceKeys: ["photos", "videos"],
    noDeleteResourceKeys: ["photos", "videos"],
    canDeleteMedia: false,
    landingPath: "/admin/photos",
  },
  sports_editor: {
    pathPrefixes: ["/admin/game_editions", "/admin/media"],
    resourceKeys: GAME_EDITION_RESOURCE_KEYS,
    noDeleteResourceKeys: [],
    canDeleteMedia: true,
    landingPath: "/admin/game_editions",
  },
};

export function isRestrictedRole(role: AdminRole): boolean {
  return role in RESTRICTED_ROLES;
}

/** Whether this role may visit the given /admin/* pathname. */
export function canAccessAdminPath(role: AdminRole, pathname: string): boolean {
  const config = RESTRICTED_ROLES[role];
  if (!config) return true;
  return config.pathPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/** Whether this role may read/create/update rows of this resource via the
 * generic admin API. */
export function canAccessResource(role: AdminRole, resourceKey: string): boolean {
  const config = RESTRICTED_ROLES[role];
  if (!config) return true;
  return config.resourceKeys.includes(resourceKey);
}

/** Whether this role may delete rows of this resource (assumes it can
 * already access the resource at all). */
export function canDeleteResource(role: AdminRole, resourceKey: string): boolean {
  const config = RESTRICTED_ROLES[role];
  if (!config) return true;
  return !config.noDeleteResourceKeys.includes(resourceKey);
}

/** Whether this role may delete items from the shared Media library. */
export function canDeleteMediaLibraryItem(role: AdminRole): boolean {
  const config = RESTRICTED_ROLES[role];
  if (!config) return true;
  return config.canDeleteMedia;
}

/** Where to send this role after login, or when it hits a page it can't
 * access — "/admin" (the dashboard) for unrestricted roles. */
export function landingPathFor(role: AdminRole): string {
  return RESTRICTED_ROLES[role]?.landingPath ?? "/admin";
}
