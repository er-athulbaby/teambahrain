import { query, queryOne } from "@/lib/db";

export interface TrafficSummary {
  allTime: number;
  today: number;
  last7Days: number;
  last30Days: number;
}

export async function getTrafficSummary(): Promise<TrafficSummary> {
  const row = await queryOne<{
    all_time: string;
    today: string;
    last_7_days: string;
    last_30_days: string;
  }>(`
    SELECT
      COUNT(*) AS all_time,
      COUNT(*) FILTER (WHERE created_at >= date_trunc('day', now())) AS today,
      COUNT(*) FILTER (WHERE created_at >= now() - interval '7 days') AS last_7_days,
      COUNT(*) FILTER (WHERE created_at >= now() - interval '30 days') AS last_30_days
    FROM page_views
  `);
  return {
    allTime: Number(row?.all_time ?? 0),
    today: Number(row?.today ?? 0),
    last7Days: Number(row?.last_7_days ?? 0),
    last30Days: Number(row?.last_30_days ?? 0),
  };
}

export async function getViewsByDay(days: number) {
  const { rows } = await query<{ day: string; count: string }>(
    `
    SELECT to_char(d.day, 'YYYY-MM-DD') AS day, COUNT(pv.id) AS count
    FROM generate_series(
      date_trunc('day', now()) - ($1::int - 1) * interval '1 day',
      date_trunc('day', now()),
      interval '1 day'
    ) AS d(day)
    LEFT JOIN page_views pv ON date_trunc('day', pv.created_at) = d.day
    GROUP BY d.day
    ORDER BY d.day ASC
    `,
    [days]
  );
  return rows.map((r) => ({ day: r.day, count: Number(r.count) }));
}

export async function getTopPages(limit: number) {
  const { rows } = await query<{ path: string; count: string }>(
    `SELECT path, COUNT(*) AS count FROM page_views GROUP BY path ORDER BY count DESC LIMIT $1`,
    [limit]
  );
  return rows.map((r) => ({ path: r.path, count: Number(r.count) }));
}

export async function getTopReferrers(limit: number) {
  const { rows } = await query<{ referrer: string | null; count: string }>(
    `
    SELECT
      CASE WHEN referrer IS NULL OR referrer = '' THEN 'Direct' ELSE referrer END AS referrer,
      COUNT(*) AS count
    FROM page_views
    GROUP BY referrer
    ORDER BY count DESC
    LIMIT $1
    `,
    [limit]
  );
  return rows.map((r) => ({ referrer: r.referrer ?? "Direct", count: Number(r.count) }));
}

export interface ContentCount {
  label: string;
  count: number;
  href: string;
}

export async function getContentCounts(): Promise<ContentCount[]> {
  const tables: { table: string; label: string; href: string }[] = [
    { table: "athletes", label: "Athletes", href: "/admin/athletes" },
    { table: "sports", label: "Sports", href: "/admin/sports" },
    { table: "news", label: "News", href: "/admin/news" },
    { table: "events", label: "Events", href: "/admin/events" },
    { table: "videos", label: "Videos", href: "/admin/videos" },
    { table: "olympic_medals", label: "Medal records", href: "/admin/medals" },
  ];

  const counts = await Promise.all(
    tables.map((t) => queryOne<{ count: string }>(`SELECT COUNT(*) AS count FROM ${t.table}`))
  );

  return tables.map((t, i) => ({
    label: t.label,
    href: t.href,
    count: Number(counts[i]?.count ?? 0),
  }));
}
