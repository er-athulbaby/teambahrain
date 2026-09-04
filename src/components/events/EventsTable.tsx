import { EVENT_STATUS_STYLES } from "@/lib/site.config";
import type { EventItem } from "@/types";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function EventsTable({ events }: { events: EventItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] border-collapse">
        <thead>
          <tr className="border-b-2 border-ink">
            {["Date", "Event", "Host", "Bahrain entry", "Status"].map((c) => (
              <th
                key={c}
                scope="col"
                className="text-left font-semibold text-[10px] tracking-[0.18em] uppercase text-ink-700 py-4 px-0 pr-5"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {events.map((e) => {
            const style = EVENT_STATUS_STYLES[e.status_type];
            return (
              <tr key={e.id} className="border-b-2 border-divider">
                <td className="py-6 pr-5 font-bold text-[15px] tracking-[0.02em] tabular-nums align-middle">
                  {formatDate(e.date)}
                </td>
                <td className="py-6 pr-5 font-semibold text-[22px] leading-[1.1] tracking-[-0.02em] align-middle">
                  {e.name}
                </td>
                <td className="py-6 pr-5 text-[15px] text-ink-800 align-middle">{e.city}</td>
                <td className="py-6 pr-5 text-[15px] text-ink-800 align-middle">
                  {e.sports_label}
                </td>
                <td className="py-6 align-middle">
                  <span
                    className="font-semibold text-[10px] tracking-[0.14em] uppercase px-2.5 py-1.5 inline-block"
                    style={{ background: style.bg, color: style.fg }}
                  >
                    {e.status_label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
