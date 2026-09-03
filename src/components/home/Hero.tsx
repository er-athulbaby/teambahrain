import Link from "next/link";
import Countdown from "@/components/shared/Countdown";
import ImageTile from "@/components/shared/ImageTile";

export default function Hero({
  content,
  targetDate,
}: {
  content: Record<string, string>;
  targetDate?: string;
}) {
  const headlineLines = content.hero_headline.split("\n");

  return (
    <section className="border-b-2 border-ink">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="order-2 lg:order-1 py-10 sm:py-14 lg:pr-12 lg:py-14 flex flex-col gap-7">
          <div className="flex items-center gap-3">
            <span className="w-7 h-1 bg-accent" />
            <span className="font-semibold text-xs tracking-[0.2em] uppercase text-accent-700">
              {content.hero_eyebrow}
            </span>
          </div>
          <h1 className="m-0 font-bold text-6xl sm:text-8xl lg:text-[104px] leading-[0.88] tracking-[-0.015em] uppercase">
            {headlineLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < headlineLines.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className="m-0 max-w-[44ch] text-lg sm:text-[19px] leading-[1.5] text-ink-800 text-pretty">
            {content.hero_intro}
          </p>
          <Countdown targetDate={targetDate} />
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/athletes"
              className="bg-accent text-white border-2 border-accent px-5 py-3.5 font-semibold text-[13px] tracking-[0.12em] uppercase text-left min-w-[210px] hover:bg-accent-600 hover:border-accent-600"
            >
              Meet the squad →
            </Link>
            <Link
              href="/events"
              className="border-2 border-ink px-5 py-3.5 font-semibold text-[13px] tracking-[0.12em] uppercase text-left min-w-[210px] hover:bg-surface"
            >
              Competition calendar
            </Link>
          </div>
        </div>
        <div className="order-1 lg:order-2 border-t-2 lg:border-t-0 lg:border-l-2 border-ink relative min-h-[320px] sm:min-h-[460px] lg:min-h-[660px]">
          <div className="absolute inset-0">
            <ImageTile
              src={content.hero_photo}
              alt="Hero portrait — flagbearer, Paris 2024"
              aspect="auto"
              className="h-full"
            />
          </div>
          <div className="absolute left-0 bottom-0 bg-ground border-t-2 border-r-2 border-ink px-5 py-3.5 pointer-events-none">
            <span className="font-semibold text-[11px] tracking-[0.16em] uppercase text-ink-700">
              {content.hero_caption}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
