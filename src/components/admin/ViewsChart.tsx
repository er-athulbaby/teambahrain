"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ACCENT = "#4f46e5"; // indigo-600, matches the admin's accent
const GRID = "#e1e0d9";
const MUTED = "#898781";

interface Point {
  day: string;
  count: number;
}

function formatDay(day: string) {
  const d = new Date(day + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: Point }[] }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md">
      <div className="text-sm font-semibold text-slate-900">{point.count.toLocaleString()} views</div>
      <div className="text-xs text-slate-500">{formatDay(point.day)}</div>
    </div>
  );
}

export default function ViewsChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ACCENT} stopOpacity={0.1} />
            <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="0" />
        <XAxis
          dataKey="day"
          tickFormatter={formatDay}
          tickLine={false}
          axisLine={{ stroke: GRID }}
          tick={{ fill: MUTED, fontSize: 11 }}
          interval="preserveStartEnd"
          minTickGap={40}
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tick={{ fill: MUTED, fontSize: 11 }}
          width={32}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: GRID, strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="count"
          stroke={ACCENT}
          strokeWidth={2}
          fill="url(#viewsFill)"
          dot={false}
          activeDot={{ r: 4, fill: ACCENT, stroke: "#ffffff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
