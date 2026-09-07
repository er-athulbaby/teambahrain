import Link from "next/link";
import ImageTile from "@/components/shared/ImageTile";
import type { NewsItem } from "@/types";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function NewsCard({
  item,
  headingLevel: Heading = "h2",
}: {
  item: NewsItem;
  /** "h2" on /news (page has its own h1); "h3" in the Home page section (nested under SectionHead's h2). */
  headingLevel?: "h2" | "h3";
}) {
  return (
    <Link href={`/news/${item.slug}`} className="flex flex-col gap-4 text-ink">
      <ImageTile
        src={item.photo_path}
        alt={item.title}
        aspect="4/3"
        sizes="(max-width: 1024px) 100vw, 33vw"
        className="border-2 border-ink"
      />
      <div className="flex gap-2.5 items-center">
        <span className="bg-accent-200 text-accent-800 px-2.5 py-1 font-semibold text-[10px] tracking-[0.14em] uppercase">
          {item.kicker}
        </span>
        <span className="font-medium text-xs tracking-[0.08em] uppercase text-ink-700">
          {formatDate(item.date)}
        </span>
      </div>
      <Heading className="m-0 font-semibold text-2xl leading-[1.12] tracking-[-0.015em]">
        {item.title}
      </Heading>
      <p className="m-0 text-[15px] leading-[1.5] text-ink-800 text-pretty">{item.blurb}</p>
    </Link>
  );
}
