import { Pool, types, type QueryResultRow } from "pg";

// pg's default DATE parser returns a JS Date object at local midnight, which
// then serializes with the server's timezone offset applied — silently
// shifting the calendar date by a day, and producing a format
// <input type="date"> can't parse anyway (it needs exactly "YYYY-MM-DD").
// Returning the raw wire string sidesteps both problems entirely.
types.setTypeParser(1082, (value) => value);

declare global {
  var _pgPool: Pool | undefined;
}

export const pool =
  global._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  global._pgPool = pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
) {
  const result = await pool.query<T>(text, params);
  return result;
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
) {
  const result = await pool.query<T>(text, params);
  return result.rows[0] as T | undefined;
}
