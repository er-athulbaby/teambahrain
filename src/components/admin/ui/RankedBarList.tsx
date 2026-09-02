interface Item {
  label: string;
  count: number;
}

export default function RankedBarList({ items }: { items: Item[] }) {
  const max = Math.max(1, ...items.map((i) => i.count));

  if (items.length === 0) {
    return <p className="text-sm text-slate-400">No data yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-32 sm:w-40 flex-none text-sm text-slate-600 truncate" title={item.label}>
            {item.label}
          </span>
          <span className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
            <span
              className="block h-full bg-indigo-500 rounded-full"
              style={{ width: `${Math.max(4, (item.count / max) * 100)}%` }}
            />
          </span>
          <span className="w-10 flex-none text-right text-sm font-medium text-slate-900 tabular-nums">
            {item.count}
          </span>
        </div>
      ))}
    </div>
  );
}
