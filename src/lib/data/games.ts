import { query, queryOne } from "@/lib/db";
import type {
  GameEdition,
  GameEditionSport,
  GameEditionDelegate,
  GameEditionPlayer,
  GameEditionEvent,
  GameEditionMedalRecord,
} from "@/types";

// "announced" editions belong in listings but their micro-site isn't live
// yet (see getEditionBySlug) — the public listing components decide whether
// to render each row as a link based on edition.status themselves.
export async function getPublishedEditions() {
  const { rows } = await query<GameEdition>(
    `SELECT id, slug, name, edition_type, city, start_date, start_year, end_date, end_year, logo_path, status
     FROM game_editions WHERE status IN ('announced', 'live') ORDER BY sort_order ASC`
  );
  return rows;
}

// Used only by the micro-site's own routes (games/[slug]/...) — strictly
// "live", so an "announced" edition's micro-site 404s even if visited
// directly by URL, same as a fully hidden "draft" one.
export async function getEditionBySlug(slug: string) {
  return queryOne<GameEdition>(
    `SELECT id, slug, name, edition_type, city, start_date, start_year, end_date, end_year, logo_path, status
     FROM game_editions WHERE slug = $1 AND status = 'live'`,
    [slug]
  );
}

export async function getEditionSports(editionId: number) {
  const { rows } = await query<GameEditionSport>(
    `SELECT id, name, icon_path FROM game_edition_sports
     WHERE game_edition_id = $1 ORDER BY sort_order ASC`,
    [editionId]
  );
  return rows;
}

export async function getEditionDelegates(editionId: number) {
  const { rows } = await query<GameEditionDelegate>(
    `SELECT id, group_name, name, title, photo_path FROM game_edition_delegates
     WHERE game_edition_id = $1 ORDER BY sort_order ASC`,
    [editionId]
  );
  return rows;
}

export async function getEditionPlayers(editionId: number) {
  const { rows } = await query<GameEditionPlayer>(
    `SELECT id, name, sport, photo_path FROM game_edition_players
     WHERE game_edition_id = $1 ORDER BY sort_order ASC`,
    [editionId]
  );
  return rows;
}

export async function getEditionEvents(editionId: number, onlyResults: boolean) {
  const resultFilter = onlyResults
    ? "AND (result_time IS NOT NULL OR result_rank IS NOT NULL)"
    : "AND result_time IS NULL AND result_rank IS NULL";
  const { rows } = await query<GameEditionEvent>(
    `SELECT id, sport, title, venue, event_date, event_time, result_time, result_rank
     FROM game_edition_events
     WHERE game_edition_id = $1 ${resultFilter}
     ORDER BY sort_order ASC`,
    [editionId]
  );
  return rows;
}

export async function getEditionMedals(editionId: number) {
  const { rows } = await query<GameEditionMedalRecord>(
    `SELECT sport, event_name, athlete_name, medal FROM game_edition_medals
     WHERE game_edition_id = $1 ORDER BY sort_order ASC`,
    [editionId]
  );
  return rows;
}
