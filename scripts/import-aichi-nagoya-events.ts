import "dotenv/config";
import { Pool } from "pg";

// Full Team Bahrain competition schedule for the 20th Asian Games,
// Aichi-Nagoya 2026, transcribed from the official schedule PDF shared by
// the user. Times are Bahrain (BH) local time. Titles fold in the athlete
// name(s) since game_edition_events has no separate athlete column.
const SPORTS = [
  "Basketball",
  "Triathlon",
  "MMA",
  "Table Tennis",
  "Swimming",
  "Handball",
  "Cycling Road",
  "Basketball 3x3",
  "Shooting",
  "Boxing",
  "Badminton",
  "Equestrian Dressage",
  "E-Sports",
  "Athletics",
  "Kurash",
  "Weightlifting",
  "Judo",
  "Jiu-Jitsu",
  "Wrestling",
  "Taekwondo",
];

interface EventRow {
  sport: string;
  title: string;
  venue: string;
  date: string;
  time: string;
  /** ISO alpha-2 opponent code for a team fixture — rendered as a flag.
   * Omitted for individual events, and deliberately omitted for Chinese
   * Taipei (no neutral flag exists in Unicode; using Taiwan's would be
   * diplomatically incorrect for an official BOC site). */
  opponentCountry?: string;
}

const AICHI_ARENA = "Aichi International Arena";
const SHOOTING_GALLERY = "Aichi Prefectural General Shooting Gallery";
const AQUATICS = "Tokyo Aquatics Centre";
const MIZUHO = "Nagoya City Mizuho Park Stadium";
const INAE = "Nagoya City Inae Sports Center";
const NISHIO = "Nishio Gymnasium";
const SKY_HALL = "SKY HALL TOYOTA";
const MARTIAL_ARTS_HALL = "Aichi Prefectural Martial Arts Hall";
const TRADE_CENTER = "Nagoya City Trade and Industry Center";

const EVENTS: EventRow[] = [
  // Sept 11
  { sport: "Basketball", title: "Bahrain vs Philippines — 1st Match", venue: AICHI_ARENA, date: "2026-09-11", time: "07:00", opponentCountry: "PH" },
  // Sept 12
  { sport: "Basketball", title: "Bahrain vs China — 2nd Match", venue: AICHI_ARENA, date: "2026-09-12", time: "10:00", opponentCountry: "CN" },
  // Sept 14
  { sport: "Basketball", title: "Bahrain vs Kazakhstan — 3rd Match", venue: AICHI_ARENA, date: "2026-09-14", time: "04:00", opponentCountry: "KZ" },
  // Sept 16
  { sport: "Basketball", title: "Bahrain vs TBC — Quarterfinal (if qualified)", venue: AICHI_ARENA, date: "2026-09-16", time: "" },
  // Sept 18
  { sport: "Basketball", title: "Bahrain vs TBC — Semifinal (if qualified)", venue: AICHI_ARENA, date: "2026-09-18", time: "" },
  // Sept 20
  { sport: "Triathlon", title: "Men's Individual Race — Omar Ali", venue: "Gamagori City Triathlon Venue", date: "2026-09-20", time: "02:30" },
  { sport: "MMA", title: "Traditional Men's -65kg — Preliminary — Mohamed Alsameea", venue: INAE, date: "2026-09-20", time: "04:00" },
  { sport: "MMA", title: "Modern Women's -54kg — Preliminary — Diana Pogosian", venue: INAE, date: "2026-09-20", time: "04:00" },
  { sport: "MMA", title: "Traditional Men's -77kg — Preliminary — Mukhammad Nabiev", venue: INAE, date: "2026-09-20", time: "10:00" },
  { sport: "MMA", title: "Modern Men's -71kg — Preliminary — Kurban Idrisov", venue: INAE, date: "2026-09-20", time: "10:00" },
  { sport: "Table Tennis", title: "Team Event — Group stage Round 1 & 2 — Team Bahrain", venue: SKY_HALL, date: "2026-09-20", time: "04:00" },
  { sport: "Swimming", title: "Women's 1500m Freestyle — Timed Final — Sana Lilian Lefalher", venue: AQUATICS, date: "2026-09-20", time: "04:24" },
  { sport: "Swimming", title: "Men's 100m Freestyle — Heat — Stepan Goncharov, Abdulla Khaled Jamal", venue: AQUATICS, date: "2026-09-20", time: "04:44" },
  { sport: "Swimming", title: "Women's 50m Breaststroke — Heat — Noor Yusuf Taha", venue: AQUATICS, date: "2026-09-20", time: "04:59" },
  { sport: "Swimming", title: "Men's 100m Backstroke — Heat — Stepan Goncharov, Ahmed Abdulnabi Helal", venue: AQUATICS, date: "2026-09-20", time: "05:05" },
  { sport: "Swimming", title: "Women's 4×100m Freestyle Relay — Heat — Team Bahrain", venue: AQUATICS, date: "2026-09-20", time: "05:19" },
  { sport: "Swimming", title: "Finals event (if qualified)", venue: AQUATICS, date: "2026-09-20", time: "11:00" },
  { sport: "Handball", title: "Bahrain vs Kazakhstan — Group Stage — Team Bahrain", venue: "ENTRIO", date: "2026-09-20", time: "06:30", opponentCountry: "KZ" },
  { sport: "Cycling Road", title: "Individual Time Trial — Ahmed Naser", venue: "Shinshiro Cycling Road Course", date: "2026-09-20", time: "07:30" },
  { sport: "Basketball", title: "Bahrain vs TBC — Final (if qualified) — Team Bahrain", venue: AICHI_ARENA, date: "2026-09-20", time: "13:40" },
  // Sept 21
  { sport: "Shooting", title: "Skeet Individual Men's & Women's (50 Targets) — Qualification Day 1 — H.H. Sh. Khalifa Alkhalifa, Tammar Ali Alwatt, Maryam Alasam, Maryam Jamal Hassani", venue: SHOOTING_GALLERY, date: "2026-09-21", time: "03:00" },
  { sport: "Swimming", title: "Men's 50m Backstroke — Heats — Stepan Goncharov, Ahmed Abdulnabi Helal", venue: AQUATICS, date: "2026-09-21", time: "04:00" },
  { sport: "Swimming", title: "Women's 50m Backstroke — Heats — Noor Yusuf Taha, Amani Abdulla Alobaidli", venue: AQUATICS, date: "2026-09-21", time: "04:08" },
  { sport: "Swimming", title: "Men's 50m Freestyle — Heats — Stepan Goncharov, Abdulla Khaled Jamal", venue: AQUATICS, date: "2026-09-21", time: "04:14" },
  { sport: "Swimming", title: "Women's 200m Freestyle — Heats — Asma Lilian Lefalher, Sana Lilian Lefalher", venue: AQUATICS, date: "2026-09-21", time: "04:26" },
  { sport: "Swimming", title: "Men's 100m Breaststroke — Heats — Abdulla Khaled Jamal", venue: AQUATICS, date: "2026-09-21", time: "04:34" },
  { sport: "Swimming", title: "Men's 4×200m Freestyle Relay — Heats — Team Bahrain", venue: AQUATICS, date: "2026-09-21", time: "05:01" },
  { sport: "Swimming", title: "Finals event (if qualified)", venue: AQUATICS, date: "2026-09-21", time: "11:00" },
  { sport: "Table Tennis", title: "Team Event — Group stage Round 3 — Team Bahrain", venue: SKY_HALL, date: "2026-09-21", time: "04:00" },
  { sport: "Table Tennis", title: "Team Event — Round of 32 (if qualified) — Team Bahrain", venue: SKY_HALL, date: "2026-09-21", time: "12:30" },
  { sport: "MMA", title: "Traditional Men's -65kg — Semifinal (if qualified) — Mohamed Alsameea", venue: INAE, date: "2026-09-21", time: "04:00" },
  { sport: "MMA", title: "Modern Women's -54kg — Semifinal (if qualified) — Diana Pogosian", venue: INAE, date: "2026-09-21", time: "04:00" },
  { sport: "MMA", title: "Traditional Men's -77kg — Semifinal (if qualified) — Mukhammad Nabiev", venue: INAE, date: "2026-09-21", time: "04:00" },
  { sport: "MMA", title: "Modern Men's -71kg — Semifinal (if qualified) — Kurban Idrisov", venue: INAE, date: "2026-09-21", time: "04:00" },
  { sport: "Boxing", title: "Men's 90kg — Preliminary — Jorge Luis Lobaina", venue: NISHIO, date: "2026-09-21", time: "06:00" },
  { sport: "Boxing", title: "Men's 70kg — Preliminary — Aly Amr Abdulla", venue: NISHIO, date: "2026-09-21", time: "11:00" },
  { sport: "Handball", title: "Bahrain vs Iran — Group Stage — Team Bahrain", venue: "ENTRIO", date: "2026-09-21", time: "08:30", opponentCountry: "IR" },
  { sport: "Basketball 3x3", title: "Bahrain vs Chinese Taipei — 1st Match — Team Bahrain", venue: "Kinjo Futo Station Square Venue", date: "2026-09-21", time: "12:55" },
  { sport: "Basketball 3x3", title: "Bahrain vs Indonesia — 2nd Match — Team Bahrain", venue: "Kinjo Futo Station Square Venue", date: "2026-09-21", time: "14:35", opponentCountry: "ID" },
  // Sept 22
  { sport: "Shooting", title: "Skeet Individual Men's & Women's (50 Targets) — Qualification Day 2 — H.H. Sh. Khalifa Alkhalifa, Tammar Ali Alwatt, Maryam Alasam, Maryam Jamal Hassani", venue: SHOOTING_GALLERY, date: "2026-09-22", time: "03:00" },
  { sport: "Table Tennis", title: "Team Event — Quarterfinal (if qualified) — Team Bahrain", venue: SKY_HALL, date: "2026-09-22", time: "04:00" },
  { sport: "Swimming", title: "Women's 100m Freestyle — Heats — Asma Lilian Gil Lefalher, Amani Abdulla Alobaidli", venue: AQUATICS, date: "2026-09-22", time: "04:00" },
  { sport: "Swimming", title: "Men's 1500m Freestyle — Timed Final 1 — Robert William Bonsall", venue: AQUATICS, date: "2026-09-22", time: "04:42" },
  { sport: "Swimming", title: "Women's 400m Freestyle — Heats — Sana Lilian Lefalher", venue: AQUATICS, date: "2026-09-22", time: "05:35" },
  { sport: "Swimming", title: "Men's 4×100m Medley Relay — Heats — Team Bahrain", venue: AQUATICS, date: "2026-09-22", time: "05:47" },
  { sport: "Swimming", title: "Finals event (if qualified)", venue: AQUATICS, date: "2026-09-22", time: "11:00" },
  { sport: "Boxing", title: "Women's 54kg — Preliminary — Maryam Khamis", venue: NISHIO, date: "2026-09-22", time: "06:00" },
  { sport: "MMA", title: "Traditional Men's -65kg — Final (if qualified) — Mohamed Alsameea", venue: INAE, date: "2026-09-22", time: "08:00" },
  { sport: "MMA", title: "Modern Women's -54kg — Final (if qualified) — Diana Pogosian", venue: INAE, date: "2026-09-22", time: "08:00" },
  { sport: "MMA", title: "Traditional Men's -77kg — Final (if qualified) — Mukhammad Nabiev", venue: INAE, date: "2026-09-22", time: "08:00" },
  { sport: "MMA", title: "Modern Men's -71kg — Final (if qualified) — Kurban Idrisov", venue: INAE, date: "2026-09-22", time: "08:00" },
  // Sept 23
  { sport: "Cycling Road", title: "Road Race competition — Ahmed Naser, Ahmed Madan", venue: "Shinshiro Cycling Road Course", date: "2026-09-23", time: "03:00" },
  { sport: "E-Sports", title: "Gran Turismo 7 — Elimination & Final — Hasan Khalil Ali", venue: "Aichi Sky Expo", date: "2026-09-23", time: "03:00" },
  { sport: "E-Sports", title: "E-football — Elimination & Final — Mohamed Alrowaihi, Mohammed Hejairi", venue: "Aichi Sky Expo", date: "2026-09-23", time: "10:00" },
  { sport: "Shooting", title: "Skeet Individual Men's & Women's (25 Targets) — Qualification Day 3 — H.H. Sh. Khalifa Alkhalifa, Tammar Ali Alwatt, Maryam Alasam, Maryam Jamal Hassani", venue: SHOOTING_GALLERY, date: "2026-09-23", time: "03:00" },
  { sport: "Shooting", title: "Skeet Individual Men's & Women's — Final (if qualified)", venue: SHOOTING_GALLERY, date: "2026-09-23", time: "07:30" },
  { sport: "Table Tennis", title: "Men's Singles — Round of 124 — Rashed Sanad Rashed, Mohamed Saleh", venue: SKY_HALL, date: "2026-09-23", time: "04:00" },
  { sport: "Table Tennis", title: "Men's Doubles — Round of 64 — Rashed Sanad Rashed/Alyas Alyassi, Mohamed Saleh/Mohamed Alaali", venue: SKY_HALL, date: "2026-09-23", time: "04:00" },
  { sport: "Swimming", title: "Women's 100m Butterfly — Heats — Asma Lilian Lefalher", venue: AQUATICS, date: "2026-09-23", time: "04:00" },
  { sport: "Swimming", title: "Men's 100m Butterfly — Heats — Mikhail Arkhangelskiy", venue: AQUATICS, date: "2026-09-23", time: "04:09" },
  { sport: "Swimming", title: "Women's 100m Backstroke — Heats — Noor Yusuf Taha, Amani Abdulla Alobaidli", venue: AQUATICS, date: "2026-09-23", time: "04:24" },
  { sport: "Swimming", title: "Mixed 4×100m Medley Relay — Heats — Team Bahrain", venue: AQUATICS, date: "2026-09-23", time: "05:10" },
  { sport: "Swimming", title: "Finals event (if qualified)", venue: AQUATICS, date: "2026-09-23", time: "11:00" },
  { sport: "Boxing", title: "Men's 60kg — Preliminary — Ali Bukhalaf", venue: NISHIO, date: "2026-09-23", time: "06:00" },
  { sport: "Boxing", title: "Men's 80kg — Preliminary — Hamsa Vogel", venue: NISHIO, date: "2026-09-23", time: "06:00" },
  { sport: "Handball", title: "Bahrain vs South Korea — Group Stage — Team Bahrain", venue: "ENTRIO", date: "2026-09-23", time: "11:30", opponentCountry: "KR" },
  { sport: "Basketball 3x3", title: "Bahrain vs Qatar — 3rd Match — Team Bahrain", venue: "Kinjo Futo Station Square Venue", date: "2026-09-23", time: "08:30", opponentCountry: "QA" },
  // Sept 24
  { sport: "Shooting", title: "Skeet Mixed Team — Qualification — Tammar Ali Alwatt, Maryam Alasam", venue: SHOOTING_GALLERY, date: "2026-09-24", time: "03:00" },
  { sport: "Shooting", title: "Skeet Mixed Team — Final (if qualified)", venue: SHOOTING_GALLERY, date: "2026-09-24", time: "09:00" },
  { sport: "Table Tennis", title: "Men's Singles — Round of 64 (if qualified) — Rashed Sanad Rashed, Mohamed Saleh", venue: SKY_HALL, date: "2026-09-24", time: "04:00" },
  { sport: "Swimming", title: "Women's 50m Freestyle — Heats — Amani Abdulla Alobaidli", venue: AQUATICS, date: "2026-09-24", time: "04:00" },
  { sport: "Swimming", title: "Men's 50m Butterfly — Heats — Mikhail Arkhangelskiy, Ahmed Abdulnabi Helal", venue: AQUATICS, date: "2026-09-24", time: "04:08" },
  { sport: "Swimming", title: "Men's 800m Freestyle — Final Timed 1 — Robert William Bonsall", venue: AQUATICS, date: "2026-09-24", time: "04:40" },
  { sport: "Swimming", title: "Men's 4×100m Freestyle Relay — Heats — Team Bahrain", venue: AQUATICS, date: "2026-09-24", time: "05:13" },
  { sport: "Swimming", title: "Women's 4×200m Freestyle Relay — Heats — Team Bahrain", venue: AQUATICS, date: "2026-09-24", time: "05:26" },
  { sport: "Swimming", title: "Finals event (if qualified)", venue: AQUATICS, date: "2026-09-24", time: "11:00" },
  { sport: "Athletics", title: "4×400m Relay Mixed — Round 1 — Team Bahrain", venue: MIZUHO, date: "2026-09-24", time: "04:20" },
  { sport: "Athletics", title: "Men's High Jump — Qualification A&B — Ahmed Sabri Mohamoud", venue: MIZUHO, date: "2026-09-24", time: "13:05" },
  { sport: "Athletics", title: "Women's 100m — Round 1 — Edidiong Odiong, Raihanah Garoubah", venue: MIZUHO, date: "2026-09-24", time: "13:33" },
  { sport: "Athletics", title: "Men's 100m — Round 1 — Ali Mohamed Haji, Abdulraof Rashed", venue: MIZUHO, date: "2026-09-24", time: "14:08" },
  { sport: "Athletics", title: "Women's 10,000m — Final — Winefred Yavi, Ruth Jebet", venue: MIZUHO, date: "2026-09-24", time: "15:25" },
  { sport: "Athletics", title: "4×400m Relay Mixed — Final (if qualified) — Team Bahrain", venue: MIZUHO, date: "2026-09-24", time: "16:15" },
  { sport: "Boxing", title: "Men's 70kg — Preliminary — Aly Amr Abdualla", venue: NISHIO, date: "2026-09-24", time: "06:00" },
  { sport: "Basketball 3x3", title: "Bahrain vs TBC — Quarterfinal (if qualified) — Team Bahrain", venue: "Kinjo Futo Station Square Venue", date: "2026-09-24", time: "12:55" },
  // Sept 25
  { sport: "E-Sports", title: "Fighting Games — Elimination & Semifinals — Husam Alansari, Mohamed Derbas, Yusuf Bahram", venue: "Aichi Sky Expo", date: "2026-09-25", time: "03:00" },
  { sport: "Badminton", title: "Men's Singles — Round 1 — Sayed Adnan Jaafar", venue: "Ichinomiya City Municipal Gymnasium", date: "2026-09-25", time: "03:00" },
  { sport: "Equestrian Dressage", title: "Individual Qualifier — Aneesa Al Mahmood, Megan Rayne O. Black", venue: "Equestrian Park", date: "2026-09-25", time: "03:30" },
  { sport: "Table Tennis", title: "Men's Doubles — Round 2 & 3 (if qualified) — Rashed Sanad Rashed/Alyas Alyassi, Mohamed Saleh/Mohamed Alaali", venue: SKY_HALL, date: "2026-09-25", time: "04:00" },
  { sport: "Table Tennis", title: "Men's Singles — Round of 32 (if qualified) — Rashed Sanad Rashed, Mohamed Saleh", venue: SKY_HALL, date: "2026-09-25", time: "04:00" },
  { sport: "Swimming", title: "Women's 50m Butterfly — Heat — Asma Lilian Gil Lefalher", venue: AQUATICS, date: "2026-09-25", time: "04:00" },
  { sport: "Swimming", title: "Men's 50m Butterfly — Heats — Mikhail Arkhangelskiy, Ahmed Abdulnabi Helal", venue: AQUATICS, date: "2026-09-25", time: "04:07" },
  { sport: "Swimming", title: "Women's 800m Freestyle — Final Timed 1 — Sana Lilian Gil Lefalher", venue: AQUATICS, date: "2026-09-25", time: "04:17" },
  { sport: "Swimming", title: "Men's 400m Freestyle — Heats — Robert William Bonsall", venue: AQUATICS, date: "2026-09-25", time: "04:40" },
  { sport: "Swimming", title: "Women's 4×100m Freestyle Relay — Heats — Team Bahrain", venue: AQUATICS, date: "2026-09-25", time: "05:16" },
  { sport: "Swimming", title: "Finals event (if qualified)", venue: AQUATICS, date: "2026-09-25", time: "11:00" },
  { sport: "Athletics", title: "Men's 400m — Round 1 — Alaa Sami, Musa Isah", venue: MIZUHO, date: "2026-09-25", time: "04:30" },
  { sport: "Athletics", title: "Women's Shot Put — Final — Noora Jasim", venue: MIZUHO, date: "2026-09-25", time: "13:05" },
  { sport: "Athletics", title: "Women's 100m — Semifinal (if qualified) — TBC", venue: MIZUHO, date: "2026-09-25", time: "13:13" },
  { sport: "Athletics", title: "Men's 100m — Semifinal (if qualified) — TBC", venue: MIZUHO, date: "2026-09-25", time: "13:33" },
  { sport: "Athletics", title: "Men's 10,000m — Final — Birhanu Balew", venue: MIZUHO, date: "2026-09-25", time: "14:32" },
  { sport: "Athletics", title: "Women's 400m — Round 1 — Salwa Naser, Oluwakemi Adekoya", venue: MIZUHO, date: "2026-09-25", time: "15:15" },
  { sport: "Athletics", title: "Men's 400m — Semifinal (if qualified) — TBC", venue: MIZUHO, date: "2026-09-25", time: "15:43" },
  { sport: "Athletics", title: "Women's 100m — Final (if qualified) — TBC", venue: MIZUHO, date: "2026-09-25", time: "16:05" },
  { sport: "Athletics", title: "Men's 100m — Final (if qualified) — TBC", venue: MIZUHO, date: "2026-09-25", time: "16:15" },
  { sport: "Boxing", title: "Men's 60kg — Preliminary — Ali Bukhalaf", venue: NISHIO, date: "2026-09-25", time: "06:00" },
  { sport: "Handball", title: "Bahrain vs Kuwait — Group Stage — Team Bahrain", venue: "Kasugai City Gymnasium", date: "2026-09-25", time: "07:30", opponentCountry: "KW" },
  { sport: "Basketball 3x3", title: "Bahrain vs TBC — Semifinal & Final (if qualified) — Team Bahrain", venue: "Kinjo Futo Station Square Venue", date: "2026-09-25", time: "12:55" },
  // Sept 26
  { sport: "Athletics", title: "Men's Marathon — Shumi Gurmu, Elhassan Elabbassi", venue: MIZUHO, date: "2026-09-26", time: "01:30" },
  { sport: "Athletics", title: "Women's Marathon — Shitaye Habte, Eunice Chumba", venue: MIZUHO, date: "2026-09-26", time: "01:50" },
  { sport: "Athletics", title: "Women's 200m — Round 1 — Edidiong Odiong, Raihanah Garoubah", venue: MIZUHO, date: "2026-09-26", time: "05:30" },
  { sport: "Athletics", title: "Men's 200m — Round 1 — Ali Mohamed Haji, Abbas Ali", venue: MIZUHO, date: "2026-09-26", time: "06:15" },
  { sport: "Athletics", title: "Men's 110m Hurdles — Round 1 — Salem Bakheet", venue: MIZUHO, date: "2026-09-26", time: "13:05" },
  { sport: "Athletics", title: "Women's 200m — Semifinal (if qualified) — TBC", venue: MIZUHO, date: "2026-09-26", time: "13:55" },
  { sport: "Athletics", title: "Men's Shot Put — Final (if qualified) — TBC", venue: MIZUHO, date: "2026-09-26", time: "14:00" },
  { sport: "Athletics", title: "Men's 200m — Semifinal (if qualified) — TBC", venue: MIZUHO, date: "2026-09-26", time: "14:16" },
  { sport: "Athletics", title: "Men's 1500m — Round 1 — Abdisamad Hirsi, Zouhair Aouad", venue: MIZUHO, date: "2026-09-26", time: "14:51" },
  { sport: "Athletics", title: "Women's 400m — Final (if qualified) — TBC", venue: MIZUHO, date: "2026-09-26", time: "15:45" },
  { sport: "Athletics", title: "Men's 400m — Final — TBC", venue: MIZUHO, date: "2026-09-26", time: "16:03" },
  { sport: "Athletics", title: "Women's 1500m — Final — Nelly Korir", venue: MIZUHO, date: "2026-09-26", time: "16:15" },
  { sport: "Badminton", title: "Men's Singles — Round 2 & 3 — Sayed Adnan Jaafar", venue: "Ichinomiya City Municipal Gymnasium", date: "2026-09-26", time: "03:00" },
  { sport: "Equestrian Dressage", title: "Individual Qualifier — Aneesa Al Mahmood, Megan Rayne O. Black", venue: "Equestrian Park", date: "2026-09-26", time: "03:30" },
  { sport: "Boxing", title: "Men's 90kg — Preliminary — Jorge Luis Lobaina", venue: NISHIO, date: "2026-09-26", time: "06:00" },
  { sport: "E-Sports", title: "Fighting Games — Elimination & Finals (if qualified) — Husam Alansari, Mohamed Derbas, Yusuf Bahram", venue: "Aichi Sky Expo", date: "2026-09-26", time: "10:00" },
  { sport: "Handball", title: "Bahrain vs TBC — Main Round — Team Bahrain", venue: "Kasugai City Gymnasium", date: "2026-09-26", time: "" },
  // Sept 27
  { sport: "Badminton", title: "Men's Singles — Quarterfinal (if qualified) — Sayed Adnan Jaafar", venue: "Ichinomiya City Municipal Gymnasium", date: "2026-09-27", time: "03:00" },
  { sport: "Shooting", title: "Trap Individual Men's & Women's (50 Targets) — Qualification Day 1 — Saeed Hasan S. Ali, Marwa Ahmed M. Buarki, Maryam Fadhel A. Sulaiti", venue: SHOOTING_GALLERY, date: "2026-09-27", time: "03:00" },
  { sport: "Equestrian Dressage", title: "Individual Final (if qualified) — Aneesa Al Mahmood, Megan Rayne O. Black", venue: "Equestrian Park", date: "2026-09-27", time: "03:30" },
  { sport: "Kurash", title: "Men's +90kg — Rasul Magomedov", venue: MARTIAL_ARTS_HALL, date: "2026-09-27", time: "03:30" },
  { sport: "Weightlifting", title: "Women's 69kg — Ingrid Vanesa Grueso", venue: TRADE_CENTER, date: "2026-09-27", time: "04:00" },
  { sport: "Boxing", title: "Men's 80kg — Preliminary — Jorge Luis Lobaina", venue: NISHIO, date: "2026-09-27", time: "06:00" },
  { sport: "Boxing", title: "Women's 54kg — Preliminary — Maryam Khamis", venue: NISHIO, date: "2026-09-27", time: "06:00" },
  { sport: "Boxing", title: "Men's 60kg — Preliminary — Ali Bukhalaf", venue: NISHIO, date: "2026-09-27", time: "11:00" },
  { sport: "Athletics", title: "Women's 400m Hurdles — Round 1 — Oluwakemi Adekoya", venue: MIZUHO, date: "2026-09-27", time: "06:35" },
  { sport: "Athletics", title: "Women's 200m — Final (if qualified) — TBC", venue: MIZUHO, date: "2026-09-27", time: "13:35" },
  { sport: "Athletics", title: "Men's 200m — Final (if qualified) — TBC", venue: MIZUHO, date: "2026-09-27", time: "13:45" },
  { sport: "Athletics", title: "Men's 110m Hurdles — Final (if qualified) — Salem Bakheet", venue: MIZUHO, date: "2026-09-27", time: "14:08" },
  { sport: "Athletics", title: "Men's High Jump — Final (if qualified) — Ahmed Sabri Mohamoud", venue: MIZUHO, date: "2026-09-27", time: "14:15" },
  { sport: "Athletics", title: "Men's 800m — Round 1 — Abdisamad Hirsi", venue: MIZUHO, date: "2026-09-27", time: "14:36" },
  { sport: "Athletics", title: "Women's 3000m Steeplechase — Final — Winefred Yavi, Tigest Mekone", venue: MIZUHO, date: "2026-09-27", time: "15:22" },
  { sport: "Athletics", title: "Women's 4×100m Relay — Round 1 — Team Bahrain", venue: MIZUHO, date: "2026-09-27", time: "15:45" },
  { sport: "Athletics", title: "Men's 4×100m Relay — Round 1 — Team Bahrain", venue: MIZUHO, date: "2026-09-27", time: "16:12" },
  // Sept 28
  { sport: "Shooting", title: "Trap Individual Men's & Women's (50 Targets) — Qualification Day 2 — Saeed Hasan S. Ali, Marwa Ahmed M. Buarki, Maryam Fadhel A. Sulaiti", venue: SHOOTING_GALLERY, date: "2026-09-28", time: "03:00" },
  { sport: "Weightlifting", title: "Men's 95kg — Jokser Quinto", venue: TRADE_CENTER, date: "2026-09-28", time: "04:00" },
  { sport: "Boxing", title: "Men's 70kg — Preliminary — Aly Amr Abdulla", venue: NISHIO, date: "2026-09-28", time: "06:00" },
  { sport: "Boxing", title: "Men's 90kg — Preliminary — Jorge Luis Lobaina", venue: NISHIO, date: "2026-09-28", time: "11:00" },
  { sport: "Athletics", title: "4×100m Relay Mixed — Round 1 — Team Bahrain", venue: MIZUHO, date: "2026-09-28", time: "12:50" },
  { sport: "Athletics", title: "Women's 400m Hurdles — Final (if qualified) — Oluwakemi Adekoya", venue: MIZUHO, date: "2026-09-28", time: "13:10" },
  { sport: "Athletics", title: "Men's 3000m Steeplechase — Final — Hamse Dhabar", venue: MIZUHO, date: "2026-09-28", time: "13:42" },
  { sport: "Athletics", title: "Men's 1500m — Final (if qualified) — TBC", venue: MIZUHO, date: "2026-09-28", time: "14:05" },
  { sport: "Athletics", title: "Women's 800m — Round 1 — Zenab Mahamat, Nelly Korir", venue: MIZUHO, date: "2026-09-28", time: "14:20" },
  { sport: "Athletics", title: "Women's 5000m — Final — Winefred Yavi, Ruth Jebet", venue: MIZUHO, date: "2026-09-28", time: "14:43" },
  { sport: "Athletics", title: "Women's 4×100m Relay — Final (if qualified) — Team Bahrain", venue: MIZUHO, date: "2026-09-28", time: "16:04" },
  { sport: "Athletics", title: "Men's 4×100m Relay — Final (if qualified) — Team Bahrain", venue: MIZUHO, date: "2026-09-28", time: "16:23" },
  { sport: "Handball", title: "Bahrain vs TBC — Semifinal — Team Bahrain", venue: "ENTRIO", date: "2026-09-28", time: "" },
  // Sept 29
  { sport: "Shooting", title: "Trap Individual Men's & Women's (25 Targets) — Qualification Day 3 — Saeed Hasan S. Ali, Marwa Ahmed M. Buarki, Maryam Fadhel A. Sulaiti", venue: SHOOTING_GALLERY, date: "2026-09-29", time: "03:00" },
  { sport: "Shooting", title: "Final (if qualified)", venue: SHOOTING_GALLERY, date: "2026-09-29", time: "07:30" },
  { sport: "Weightlifting", title: "Men's +110kg — Gor Minasyan", venue: TRADE_CENTER, date: "2026-09-29", time: "04:00" },
  { sport: "Weightlifting", title: "Women's 86kg — Alina Marushchak", venue: TRADE_CENTER, date: "2026-09-29", time: "04:00" },
  { sport: "Boxing", title: "Semifinals (if qualified) — TBC", venue: NISHIO, date: "2026-09-29", time: "07:00" },
  { sport: "Athletics", title: "Women's 800m — Final (if qualified) — TBC", venue: MIZUHO, date: "2026-09-29", time: "13:50" },
  { sport: "Athletics", title: "Men's 800m — Final (if qualified) — Abdisamad Hirsi", venue: MIZUHO, date: "2026-09-29", time: "14:05" },
  { sport: "Athletics", title: "Men's 5000m — Final — Birhanu Balew", venue: MIZUHO, date: "2026-09-29", time: "14:15" },
  { sport: "Athletics", title: "4×100m Relay Mixed — Final (if qualified) — Team Bahrain", venue: MIZUHO, date: "2026-09-29", time: "14:48" },
  { sport: "Athletics", title: "Women's 4×400m Relay — Final — Team Bahrain", venue: MIZUHO, date: "2026-09-29", time: "15:05" },
  { sport: "Handball", title: "Bahrain vs TBC — Final (if qualified) — Team Bahrain", venue: "Kasugai City Gymnasium", date: "2026-09-29", time: "" },
  // Sept 30
  { sport: "Shooting", title: "Trap Mixed Team — Qualification — Saeed Hasan S. Ali, Marwa Ahmed M. Buarki", venue: SHOOTING_GALLERY, date: "2026-09-30", time: "03:00" },
  { sport: "Shooting", title: "Trap Mixed Team — Final (if qualified)", venue: SHOOTING_GALLERY, date: "2026-09-30", time: "09:00" },
  { sport: "Judo", title: "Men's -60kg — Ruslan Poltoratskii", venue: AICHI_ARENA, date: "2026-09-30", time: "05:00" },
  { sport: "Judo", title: "Men's -66kg — Sukhrob Boqiev", venue: AICHI_ARENA, date: "2026-09-30", time: "05:00" },
  { sport: "Judo", title: "Women's -52kg — Patimat Akhmedova", venue: AICHI_ARENA, date: "2026-09-30", time: "05:00" },
  { sport: "Judo", title: "Finals (if qualified)", venue: AICHI_ARENA, date: "2026-09-30", time: "11:00" },
  { sport: "Boxing", title: "Semifinals (if qualified) — TBC", venue: NISHIO, date: "2026-09-30", time: "07:00" },
  // Oct 1
  { sport: "Jiu-Jitsu", title: "Men's -62kg — Abdulla Ali", venue: MARTIAL_ARTS_HALL, date: "2026-10-01", time: "03:00" },
  { sport: "Jiu-Jitsu", title: "Finals (if qualified)", venue: MARTIAL_ARTS_HALL, date: "2026-10-01", time: "10:30" },
  { sport: "Judo", title: "Men's -73kg — Mukhamed Aloev", venue: AICHI_ARENA, date: "2026-10-01", time: "05:00" },
  { sport: "Judo", title: "Men's -81kg — Askerbii Gerbekov", venue: AICHI_ARENA, date: "2026-10-01", time: "05:00" },
  { sport: "Judo", title: "Finals (if qualified)", venue: AICHI_ARENA, date: "2026-10-01", time: "11:00" },
  // Oct 2
  { sport: "Wrestling", title: "Men's Freestyle 65kg — Alibeg Alibegov", venue: INAE, date: "2026-10-02", time: "04:30" },
  { sport: "Wrestling", title: "Men's Freestyle 86kg — Khidir Saipudinov", venue: INAE, date: "2026-10-02", time: "04:30" },
  { sport: "Wrestling", title: "Men's Freestyle 125kg — Shamil Sharipov", venue: INAE, date: "2026-10-02", time: "04:30" },
  { sport: "Wrestling", title: "Finals (if qualified)", venue: INAE, date: "2026-10-02", time: "12:00" },
  { sport: "Judo", title: "Men's -90kg — Israpil Sagaipov", venue: AICHI_ARENA, date: "2026-10-02", time: "05:00" },
  { sport: "Judo", title: "Men's -100kg — Said Sadrudinov", venue: AICHI_ARENA, date: "2026-10-02", time: "05:00" },
  { sport: "Judo", title: "Finals (if qualified)", venue: AICHI_ARENA, date: "2026-10-02", time: "11:00" },
  { sport: "Boxing", title: "Finals (if qualified) — TBC", venue: NISHIO, date: "2026-10-02", time: "07:00" },
  { sport: "Taekwondo", title: "Women's -49kg — Fatema Kalawadh", venue: "Toyohashi Gymnasium", date: "2026-10-02", time: "07:30" },
  // Oct 3
  { sport: "Jiu-Jitsu", title: "Men's -85kg — Khaled Faraj", venue: MARTIAL_ARTS_HALL, date: "2026-10-03", time: "03:00" },
  { sport: "Jiu-Jitsu", title: "Finals (if qualified)", venue: MARTIAL_ARTS_HALL, date: "2026-10-03", time: "08:30" },
  { sport: "Wrestling", title: "Men's Freestyle 74kg — Magomedrasul Asluev", venue: INAE, date: "2026-10-03", time: "04:30" },
  { sport: "Wrestling", title: "Men's Freestyle 97kg — Magomed Sharipov", venue: INAE, date: "2026-10-03", time: "04:30" },
  { sport: "Wrestling", title: "Finals (if qualified)", venue: INAE, date: "2026-10-03", time: "12:00" },
  { sport: "Taekwondo", title: "Women's +67kg — Ola Aldoseri", venue: "Toyohashi Gymnasium", date: "2026-10-03", time: "07:30" },
];

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const edition = await pool.query<{ id: number }>(
    `SELECT id FROM game_editions WHERE slug = 'aichi-nagoya-2026'`
  );
  if (edition.rows.length === 0) {
    throw new Error("Aichi-Nagoya 2026 edition not found — check the slug.");
  }
  const editionId = edition.rows[0].id;

  // Update the edition's dates to match the earliest/latest dates actually
  // in this schedule (Sept 11 – Oct 3), replacing the earlier placeholder.
  await pool.query(
    `UPDATE game_editions SET start_date = '2026-09-11', end_date = '2026-10-03' WHERE id = $1`,
    [editionId]
  );

  // Sports: only insert ones that don't already exist for this edition.
  const existingSports = await pool.query<{ name: string }>(
    `SELECT name FROM game_edition_sports WHERE game_edition_id = $1`,
    [editionId]
  );
  const existingNames = new Set(existingSports.rows.map((r) => r.name));
  let sportSort = 0;
  let sportsAdded = 0;
  for (const name of SPORTS) {
    if (existingNames.has(name)) continue;
    await pool.query(
      `INSERT INTO game_edition_sports (game_edition_id, name, sort_order) VALUES ($1, $2, $3)`,
      [editionId, name, sportSort]
      );
    sportSort++;
    sportsAdded++;
  }

  // Events: append after whatever's already there.
  const maxSort = await pool.query<{ max: number | null }>(
    `SELECT MAX(sort_order) as max FROM game_edition_events WHERE game_edition_id = $1`,
    [editionId]
  );
  let sortOrder = (maxSort.rows[0].max ?? -1) + 1;

  for (const e of EVENTS) {
    await pool.query(
      `INSERT INTO game_edition_events (game_edition_id, sport, title, venue, event_date, event_time, opponent_country, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [editionId, e.sport, e.title, e.venue, e.date, e.time || null, e.opponentCountry ?? null, sortOrder]
    );
    sortOrder++;
  }

  console.log(
    `Added ${sportsAdded} sport(s) and ${EVENTS.length} event(s) to Aichi-Nagoya 2026 (edition id ${editionId}). Edition dates updated to 2026-09-11 – 2026-10-03.`
  );
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
