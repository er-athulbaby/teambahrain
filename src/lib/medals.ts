import type { MedalRecord, OlympicGame, MedalCounts } from "@/types";

export interface MedalEvent {
  name: string;
  athletes: { name: string; medal: MedalRecord["medal"] }[];
}

export interface MedalSport {
  name: string;
  events: MedalEvent[];
}

export interface MedalGame {
  id: number;
  year: string;
  city: string;
  sports: MedalSport[];
}

type LeafMedal = { sport: string; event_name: string; athlete_name: string; medal: MedalRecord["medal"] };

/** Nests a flat list of leaf-level medal records under their sport, then
 * event. Shared by the all-time table (per game) and the per-edition table
 * (already scoped to one edition, so no game level needed). */
export function groupMedalsBySport(medals: LeafMedal[]): MedalSport[] {
  const sportNames = [...new Set(medals.map((m) => m.sport))];
  return sportNames.map((sportName) => {
    const sportMedals = medals.filter((m) => m.sport === sportName);
    const eventNames = [...new Set(sportMedals.map((m) => m.event_name))];
    const events: MedalEvent[] = eventNames.map((eventName) => ({
      name: eventName,
      athletes: sportMedals
        .filter((m) => m.event_name === eventName)
        .map((m) => ({ name: m.athlete_name, medal: m.medal })),
    }));
    return { name: sportName, events };
  });
}

/** Nests the flat leaf-level medal records under their games, mirroring the
 * design prototype's `games` shape. Games with no medals keep an empty
 * `sports` array so they still render (and stay non-expandable). */
export function groupMedalsByGame(games: OlympicGame[], medals: MedalRecord[]): MedalGame[] {
  return games.map((g) => ({
    id: g.id,
    year: g.year,
    city: g.city,
    sports: groupMedalsBySport(medals.filter((m) => m.game_id === g.id)),
  }));
}

export function countMedals(athletes: { medal: MedalRecord["medal"] }[]): MedalCounts {
  const counts = { gold: 0, silver: 0, bronze: 0 };
  athletes.forEach((a) => {
    if (a.medal === "G") counts.gold++;
    else if (a.medal === "S") counts.silver++;
    else counts.bronze++;
  });
  return { ...counts, total: counts.gold + counts.silver + counts.bronze };
}

export function countMedalsInEvents(events: MedalEvent[]): MedalCounts {
  return countMedals(events.flatMap((e) => e.athletes));
}

export function countMedalsInSports(sports: MedalSport[]): MedalCounts {
  return countMedals(sports.flatMap((s) => s.events.flatMap((e) => e.athletes)));
}
