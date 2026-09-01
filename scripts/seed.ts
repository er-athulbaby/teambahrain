/**
 * Seed data ported verbatim from the Team Bahrain design prototype
 * (`Team Bahrain.dc.html`). The handoff README explicitly flags that the
 * medal and athlete facts here were "written from memory" and MUST be
 * verified against the official BOC/IOC record before publication —
 * treat everything below as placeholder content, not verified fact.
 */
import "dotenv/config";
import { pool } from "../src/lib/db";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `TRUNCATE TABLE ticker_items, home_figures, athletes, sports, news, videos,
       events, timeline_entries, legends, instagram_posts, olympic_medals,
       olympic_games, continental_stats RESTART IDENTITY CASCADE`
    );

    // Ticker
    const ticker = [
      "Aichi–Nagoya 2026 · 71 athletes named",
      "Yavi opens season with 8:54.11",
      "Handball squad seeded second in Asia",
      "Naser to headline Manama Grand Prix",
      "LA28 qualification window now open",
    ];
    for (let i = 0; i < ticker.length; i++) {
      await client.query(
        `INSERT INTO ticker_items (text, sort_order) VALUES ($1, $2)`,
        [ticker[i], i]
      );
    }

    // Home figures
    const figures: [string, string, string][] = [
      ["1984", "First Games", "Los Angeles — and every summer Games since."],
      ["3", "Olympic titles", "London 2012, Rio 2016 and Paris 2024 — all on the track."],
      ["15", "Federations", "Recognised national governing bodies."],
      ["71", "Athletes in 2026", "The largest delegation to an Asian Games."],
    ];
    for (let i = 0; i < figures.length; i++) {
      const [value, label, note] = figures[i];
      await client.query(
        `INSERT INTO home_figures (value, label, note, sort_order) VALUES ($1, $2, $3, $4)`,
        [value, label, note, i]
      );
    }

    // Athletes
    const athletes: [string, string, string, string, string, boolean][] = [
      ["Winfred Mutile Yavi", "Athletics", "3000m steeplechase", "Olympic champion, Paris 2024. World champion, Budapest 2023.", "tb-a1", true],
      ["Salwa Eid Naser", "Athletics", "400m", "Olympic silver, Paris 2024. World champion, Doha 2019.", "tb-a2", true],
      ["Kemi Adekoya", "Athletics", "400m hurdles", "World indoor 400m champion, Glasgow 2024.", "tb-a3", true],
      ["Hamza Kooheji", "Combat", "Bantamweight MMA", "Bahrain's first professional MMA export, fighting out of Manama.", "tb-a4", false],
      ["National handball squad", "Handball", "Men's team", "Asian finalists and Olympic debutants in Tokyo.", "tb-a5", false],
      ["National football team", "Football", "Men's team", "Gulf Cup winners, chasing a first World Cup qualification.", "tb-a6", false],
      ["Bahrain Victorious", "Cycling", "Road & TT", "The Kingdom's WorldTour programme and its national feeder squad.", "tb-a7", false],
      ["Youth athletics group", "Athletics", "800m — 5000m", "Twelve juniors in the Isa Town middle-distance pathway.", "tb-a8", false],
    ];
    for (let i = 0; i < athletes.length; i++) {
      const [name, sport, event, line, slot, featured] = athletes[i];
      await client.query(
        `INSERT INTO athletes (slug, name, sport, event, line, photo_path, featured, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [slugify(name), name, sport, event, line, `/images/samples/${slot}.png`, featured, i]
      );
    }

    // Sports
    const sportDefs: [string, string, string][] = [
      ["Athletics", "6 national squads", "Track, road and combined events — the Kingdom's medal engine."],
      ["Handball", "3 national squads", "Men's, women's and youth teams in continental competition."],
      ["Football", "4 national squads", "Senior, olympic, youth and futsal programmes."],
      ["Cycling", "2 national squads", "Road and time trial, feeding the WorldTour programme."],
      ["Swimming", "3 national squads", "Pool and open water, based at Isa Town."],
      ["Basketball", "3 national squads", "Senior and 3x3 squads in Gulf and Asian competition."],
      ["Volleyball", "4 national squads", "Indoor and beach, men's and women's."],
      ["Weightlifting", "2 national squads", "Olympic lifting across seven bodyweight categories."],
      ["Combat sports", "5 national squads", "Judo, taekwondo, boxing, jiu-jitsu and wrestling."],
      ["Motorsport", "2 national squads", "Circuit racing and karting out of Sakhir."],
      ["Equestrian", "2 national squads", "Endurance and show jumping."],
      ["Esports", "3 national squads", "Recognised titles with a formal national selection."],
    ];
    for (let i = 0; i < sportDefs.length; i++) {
      const [name, squads, note] = sportDefs[i];
      await client.query(
        `INSERT INTO sports (slug, name, squads_label, note, photo_path, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [slugify(name), name, squads, note, `/images/samples/tb-s${i + 1}.png`, i]
      );
    }

    // News
    const news: [string, string, string, string, string, boolean][] = [
      ["2026-08-28", "Lead story", "Bahrain names 71 athletes for Aichi–Nagoya", "The largest delegation the Kingdom has sent to an Asian Games travels in eleven sports, with the handball squad and the middle-distance group leading the medal projections.", "tb-news-lead", true],
      ["2026-08-26", "Athletics", "Yavi opens her season with 8:54.11 in Zurich", "The Olympic champion's fastest August run to date, and a marker set eighteen months out from Los Angeles.", "tb-n1", false],
      ["2026-08-21", "Handball", "Handball squad seeded second for the Asian Games draw", "Bahrain lands in a group of four alongside Japan, with the semi-final the stated minimum target.", "tb-n2", false],
      ["2026-08-14", "Development", "Isa Town centre opens its third indoor hall", "Year-round training capacity for judo, taekwondo and volleyball, plus a 400-athlete residency programme.", "tb-n3", false],
      ["2026-08-07", "Cycling", "Four national riders join the WorldTour development squad", "A first structured route from the domestic calendar into professional road racing.", "tb-n4", false],
      ["2026-07-29", "Governance", "Committee publishes its 2026—2030 integrity framework", "Independent testing oversight, a safeguarding office and mandatory education for every carded athlete.", "tb-n5", false],
      ["2026-07-18", "Football", "Manama fixture confirmed for World Cup qualifying", "The national side returns to the National Stadium in October with a full house expected.", "tb-n6", false],
    ];
    for (let i = 0; i < news.length; i++) {
      const [date, kicker, title, blurb, slot, isLead] = news[i];
      await client.query(
        `INSERT INTO news (slug, date, kicker, title, blurb, photo_path, is_lead, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [slugify(title), date, kicker, title, blurb, `/images/samples/${slot}.png`, isLead, i]
      );
    }

    // Videos
    const videoDefs: [string, string, string, boolean][] = [
      ["The Steeplechase Hour", "22:41", "Documentary", true],
      ["Inside camp: Isa Town, week one", "5:12", "Behind the squad", false],
      ["Every Bahraini medal, 1984 — 2024", "8:47", "Archive", false],
      ["Naser on the 400m rebuild", "12:03", "Long form", false],
      ["Handball: the Asian semi-final, full replay", "1:04:20", "Full match", false],
      ["How a WorldTour rider trains in 40°C", "6:38", "Explainer", false],
      ["Junior trials, National Stadium", "9:55", "Pathways", false],
    ];
    for (let i = 0; i < videoDefs.length; i++) {
      const [title, duration, series, isFeature] = videoDefs[i];
      const slot = isFeature ? "tb-video-hero" : `tb-v${i}`;
      await client.query(
        `INSERT INTO videos (slug, title, duration, series, photo_path, is_feature, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [slugify(title), title, duration, series, `/images/samples/${slot}.png`, isFeature, i]
      );
    }

    // Events
    const events: [string, string, string, string, string, "key" | "progress" | "confirmed"][] = [
      ["2026-09-19", "Asian Games", "Aichi–Nagoya, Japan", "11 sports", "Squad named", "key"],
      ["2026-11-07", "Gulf Youth Games", "Doha, Qatar", "8 sports", "Selecting", "progress"],
      ["2027-02-12", "Manama Grand Prix", "Manama, Bahrain", "Athletics", "Tickets soon", "progress"],
      ["2027-04-09", "Formula 1 Bahrain Grand Prix", "Sakhir, Bahrain", "Motorsport", "Confirmed", "confirmed"],
      ["2027-08-28", "World Athletics Championships", "Beijing, China", "Athletics", "Qualifying", "progress"],
      ["2028-01-15", "Asian Handball Championship", "TBC", "Handball", "Qualifying", "progress"],
      ["2028-07-14", "Olympic Games", "Los Angeles, USA", "All", "Target", "key"],
    ];
    for (let i = 0; i < events.length; i++) {
      const [date, name, city, sportsLabel, statusLabel, statusType] = events[i];
      await client.query(
        `INSERT INTO events (date, name, city, sports_label, status_label, status_type, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [date, name, city, sportsLabel, statusLabel, statusType, i]
      );
    }

    // Timeline
    const timeline: [string, string, string][] = [
      ["1978", "The committee is formed in Manama", "A national olympic committee is established to organise Bahraini sport under one body, with recognition following shortly after."],
      ["1984", "Olympic debut in Los Angeles", "Bahrain competes at a summer Games for the first time — a small delegation, and the start of an unbroken run of appearances."],
      ["2004", "Athens: a first for Bahraini women", "Ruqaya Al-Ghasra runs the sprints in Athens, becoming the face of women's athletics in the Kingdom."],
      ["2008", "Beijing: through to the semi-finals", "Al-Ghasra advances in the 200m in a hijab, and the image travels far beyond athletics."],
      ["2012", "London: Bahrain's first Olympic title", "Maryam Yusuf Jamal medals in the 1500m and is later elevated to the gold — the Kingdom's first Olympic champion."],
      ["2019", "A world title on the track in Doha", "Salwa Eid Naser wins the 400m world championship in one of the fastest races ever run over the distance."],
      ["2024", "Paris: gold and silver", "Winfred Mutile Yavi takes the 3000m steeplechase title and Naser the 400m silver — Bahrain's strongest Games."],
      ["2028", "Los Angeles", "A qualification cycle built around eleven federations and a widened youth pathway. The target is a multi-sport medal haul."],
    ];
    for (let i = 0; i < timeline.length; i++) {
      const [year, title, body] = timeline[i];
      await client.query(
        `INSERT INTO timeline_entries (year, title, body, sort_order) VALUES ($1, $2, $3, $4)`,
        [year, title, body, i]
      );
    }

    // Legends
    const legends: [string, string, string, string][] = [
      ["Maryam Yusuf Jamal", "2004 — 2016", "Bahrain's first Olympic champion, and the runner who put the Kingdom on the middle-distance map.", "tb-l1"],
      ["Ruqaya Al-Ghasra", "2004 — 2012", "Two-time Olympian and the first Bahraini woman to reach an Olympic sprint semi-final.", "tb-l2"],
      ["The 1984 delegation", "1984", "The athletes who walked at the first Games — no medals, and the whole pathway built on their entry.", "tb-l3"],
    ];
    for (let i = 0; i < legends.length; i++) {
      const [name, era, line, slot] = legends[i];
      await client.query(
        `INSERT INTO legends (name, era, line, photo_path, sort_order) VALUES ($1, $2, $3, $4, $5)`,
        [name, era, line, `/images/samples/${slot}.png`, i]
      );
    }

    // Instagram
    const instagram: [string, string][] = [
      ["2,148", "Yavi crosses first in Zurich."],
      ["1,904", "Handball camp, day one in Isa Town."],
      ["3,271", "Naser back on the track."],
      ["1,336", "Junior trials, National Stadium."],
      ["2,602", "Kit reveal for Aichi–Nagoya."],
      ["4,015", "Homecoming at Bahrain International Airport."],
    ];
    for (let i = 0; i < instagram.length; i++) {
      const [likes, caption] = instagram[i];
      await client.query(
        `INSERT INTO instagram_posts (likes, caption, photo_path, sort_order) VALUES ($1, $2, $3, $4)`,
        [likes, caption, `/images/samples/tb-ig${i + 1}.png`, i]
      );
    }

    // Olympic games + medals
    const games: { year: string; city: string; medals: [string, string, string, "G" | "S" | "B"][] }[] = [
      { year: "2024", city: "Paris", medals: [
        ["Athletics", "3000m steeplechase — women", "Winfred Mutile Yavi", "G"],
        ["Athletics", "400m — women", "Salwa Eid Naser", "S"],
      ] },
      { year: "2020", city: "Tokyo", medals: [
        ["Athletics", "10,000m — women", "Kalkidan Gezahegne", "S"],
      ] },
      { year: "2016", city: "Rio de Janeiro", medals: [
        ["Athletics", "3000m steeplechase — women", "Ruth Jebet", "G"],
        ["Athletics", "Marathon — women", "Eunice Kirwa", "S"],
      ] },
      { year: "2012", city: "London", medals: [
        ["Athletics", "1500m — women", "Maryam Yusuf Jamal", "G"],
      ] },
      { year: "2008", city: "Beijing", medals: [] },
      { year: "2004", city: "Athens", medals: [] },
      { year: "2000", city: "Sydney", medals: [] },
      { year: "1996", city: "Atlanta", medals: [] },
      { year: "1992", city: "Barcelona", medals: [] },
      { year: "1988", city: "Seoul", medals: [] },
      { year: "1984", city: "Los Angeles", medals: [] },
    ];
    for (let i = 0; i < games.length; i++) {
      const g = games[i];
      const { rows } = await client.query<{ id: number }>(
        `INSERT INTO olympic_games (year, city, sort_order) VALUES ($1, $2, $3) RETURNING id`,
        [g.year, g.city, i]
      );
      const gameId = rows[0].id;
      for (const [sport, eventName, athleteName, medal] of g.medals) {
        await client.query(
          `INSERT INTO olympic_medals (game_id, sport, event_name, athlete_name, medal)
           VALUES ($1, $2, $3, $4, $5)`,
          [gameId, sport, eventName, athleteName, medal]
        );
      }
    }

    // Continental stats
    const continental: [string, string][] = [
      ["11", "Asian Games appearances since 1978"],
      ["40+", "Asian Games medals across athletics, handball and combat sports"],
      ["15", "Federations sending national squads in 2026"],
    ];
    for (let i = 0; i < continental.length; i++) {
      const [value, label] = continental[i];
      await client.query(
        `INSERT INTO continental_stats (value, label, sort_order) VALUES ($1, $2, $3)`,
        [value, label, i]
      );
    }

    await client.query("COMMIT");
    console.log("Seed complete.");
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
