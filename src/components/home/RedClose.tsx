import Link from "next/link";

export default function RedClose({ content }: { content: Record<string, string> }) {
  const headlineLines = content.close_headline.split("\n");

  return (
    <section className="border-b-2 border-ink bg-accent text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-14 sm:py-18 grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] gap-10 lg:items-end">
        <div className="flex flex-col gap-6">
          <span className="font-semibold text-xs tracking-[0.2em] uppercase">{content.close_eyebrow}</span>
          <p className="m-0 font-bold text-5xl sm:text-6xl lg:text-[76px] leading-[0.9] tracking-[-0.015em] uppercase">
            {headlineLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < headlineLines.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
        <div className="flex flex-col gap-4.5">
          <p className="m-0 text-[17px] leading-[1.5]">{content.close_body}</p>
          <Link
            href="/sports"
            className="bg-white text-ink border-2 border-white px-5 py-3.5 font-semibold text-[13px] tracking-[0.12em] uppercase self-start hover:bg-surface"
          >
            Explore the sports →
          </Link>
        </div>
      </div>
    </section>
  );
}
