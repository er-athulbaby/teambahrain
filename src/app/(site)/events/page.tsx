import type { Metadata } from "next";
import Countdown from "@/components/shared/Countdown";
import EventsTable from "@/components/events/EventsTable";
import { getEvents } from "@/lib/data/events";
import { getPageContent } from "@/lib/data/pageContent";

export const metadata: Metadata = {
  title: "Events — Team Bahrain",
};

export default async function EventsPage() {
  const [events, content] = await Promise.all([getEvents(), getPageContent("events")]);
  const closingLines = content.closing_headline.split("\n");

  return (
    <main>
      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-10 lg:items-end">
          <div className="flex flex-col gap-5">
            <span className="font-semibold text-xs tracking-[0.2em] uppercase text-accent-700">
              {content.eyebrow}
            </span>
            <h1 className="m-0 font-bold text-6xl sm:text-8xl leading-[0.88] tracking-[-0.015em] uppercase">
              {content.headline}
            </h1>
          </div>
          <p className="m-0 text-lg leading-[1.5] text-ink-800 text-pretty">{content.intro}</p>
        </div>
      </section>

      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-2">
          <EventsTable events={events} />
        </div>
      </section>

      <section className="border-b-2 border-ink bg-accent text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-2 gap-10 items-center">
          <p className="m-0 font-bold text-4xl sm:text-[56px] leading-[0.92] tracking-[-0.015em] uppercase">
            {closingLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < closingLines.length - 1 && <br />}
              </span>
            ))}
          </p>
          <Countdown variant="white" valueClassName="text-[42px]" />
        </div>
      </section>
    </main>
  );
}
