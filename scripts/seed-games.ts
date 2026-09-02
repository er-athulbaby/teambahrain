/**
 * Seeds one example Games edition ("Paris 2024"), content ported loosely
 * from the reference site the user shared when requesting this feature.
 * Placeholder — verify names/results against the official record before
 * publishing, same caveat as scripts/seed.ts.
 */
import "dotenv/config";
import { pool } from "../src/lib/db";

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const existing = await client.query(`SELECT id FROM game_editions WHERE slug = 'paris-2024'`);
    if (existing.rows.length > 0) {
      console.log("paris-2024 already exists, skipping.");
      await client.query("ROLLBACK");
      return;
    }

    const edition = await client.query(
      `INSERT INTO game_editions (slug, name, edition_type, city, start_date, end_date, logo_path, is_published, sort_order)
       VALUES ('paris-2024', 'Paris 2024', 'Olympic Games', 'Paris, France', '2024-07-26', '2024-08-11', '/boc-logo.png', TRUE, 0)
       RETURNING id`
    );
    const editionId = edition.rows[0].id;

    const sports: [string, string][] = [
      ["Athletics", "tb-s1"],
      ["Judo", "tb-s9"],
      ["Wrestling", "tb-s9"],
      ["Weightlifting", "tb-s8"],
      ["Swimming", "tb-s5"],
    ];
    for (let i = 0; i < sports.length; i++) {
      const [name, slot] = sports[i];
      await client.query(
        `INSERT INTO game_edition_sports (game_edition_id, name, icon_path, sort_order) VALUES ($1, $2, $3, $4)`,
        [editionId, name, `/images/samples/${slot}.png`, i]
      );
    }

    const officialDelegates: [string, string][] = [["Faris Mustafa Al-Kooheji", "Secretary General"]];
    const administrativeDelegates: [string, string][] = [
      ["Ahmed Mohamed Abdulghaffar", "Director of Mission"],
      ["Fajer Jassim Mohamed", "Deputy Director of Mission"],
      ["Lounes Madene", "Member"],
      ["Yousif Hussain", "Member"],
      ["Fay Buallay", "Member"],
      ["Maryam Mardana", "Member"],
      ["Hasan Juma", "Member"],
      ["Ali Hamona", "Member"],
    ];
    let dOrder = 0;
    for (const [name, title] of officialDelegates) {
      await client.query(
        `INSERT INTO game_edition_delegates (game_edition_id, group_name, name, title, photo_path, sort_order)
         VALUES ($1, 'official', $2, $3, $4, $5)`,
        [editionId, name, title, "/images/samples/tb-l1.png", dOrder++]
      );
    }
    dOrder = 0;
    for (const [name, title] of administrativeDelegates) {
      await client.query(
        `INSERT INTO game_edition_delegates (game_edition_id, group_name, name, title, photo_path, sort_order)
         VALUES ($1, 'administrative', $2, $3, $4, $5)`,
        [editionId, name, title, "/images/samples/tb-l2.png", dOrder++]
      );
    }

    const players: [string, string][] = [
      ["Winfred Mutile Yavi", "Athletics"],
      ["Salwa Eid Naser", "Athletics"],
      ["Tigist Gashaw Belay", "Athletics"],
      ["Rose Chelimo", "Athletics"],
      ["Eunice Chebichii Paul Kiprugut Chumba", "Athletics"],
    ];
    for (let i = 0; i < players.length; i++) {
      const [name, sport] = players[i];
      await client.query(
        `INSERT INTO game_edition_players (game_edition_id, name, sport, photo_path, sort_order) VALUES ($1, $2, $3, $4, $5)`,
        [editionId, name, sport, `/images/samples/tb-a${(i % 8) + 1}.png`, i]
      );
    }

    const events: [string, string, string, string, string, string | null, string | null][] = [
      ["Women's 5000m Round 1", "Athletics", "Stade de France - Track", "2024-08-02", "18:10", null, null],
      ["Women's 800m Round 1", "Athletics", "Stade de France - Track", "2024-08-02", "19:45", null, null],
      ["Women's 3000m Steeplechase Final", "Athletics", "Stade de France - Track", "2024-08-06", "21:10", "8:50:66", "1"],
      ["Women's 400m Final", "Athletics", "Stade de France - Track", "2024-08-09", "20:00", "48.53s", "2"],
    ];
    for (let i = 0; i < events.length; i++) {
      const [title, sport, venue, date, time, resultTime, resultRank] = events[i];
      await client.query(
        `INSERT INTO game_edition_events
           (game_edition_id, sport, title, venue, event_date, event_time, result_time, result_rank, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [editionId, sport, title, venue, date, time, resultTime, resultRank, i]
      );
    }

    const medals: [string, string, string, string][] = [
      ["Athletics", "3000m Steeplechase Final", "Winfred Mutile Yavi", "G"],
      ["Athletics", "400m Final", "Salwa Eid Naser", "S"],
    ];
    for (let i = 0; i < medals.length; i++) {
      const [sport, eventName, athleteName, medal] = medals[i];
      await client.query(
        `INSERT INTO game_edition_medals (game_edition_id, sport, event_name, athlete_name, medal, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [editionId, sport, eventName, athleteName, medal, i]
      );
    }

    await client.query("COMMIT");
    console.log("Seeded Games edition: Paris 2024.");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
