export default function Ticker({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  const line = (hidden: boolean) => (
    <div
      className="flex gap-12 w-max flex-none pr-12 whitespace-nowrap font-semibold text-xs tracking-[0.16em] uppercase"
      aria-hidden={hidden || undefined}
    >
      {items.map((text, i) => (
        <span key={i}>{text}</span>
      ))}
    </div>
  );

  return (
    <div className="bg-accent text-white overflow-hidden border-b-2 border-ink py-2.5">
      <div className="ticker-track flex w-max animate-ticker">
        {line(false)}
        {line(true)}
      </div>
    </div>
  );
}
