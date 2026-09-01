import Link from "next/link";
import SectionHead from "@/components/shared/SectionHead";
import ImageTile from "@/components/shared/ImageTile";
import type { NewsItem } from "@/types";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function NewsPreview({ news }: { news: NewsItem[] }) {
  return (
    <section className="border-b-2 border-ink">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
        <SectionHead title="Latest from the team" href="/news" linkLabel="All news →" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((n) => (
            <Link key={n.id} href="/news" className="flex flex-col gap-4 text-ink">
              <ImageTile
                src={n.photo_path}
                alt={n.title}
                aspect="4/3"
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="border-2 border-ink"
              />
              <div className="flex gap-2.5 items-center">
                <span className="bg-accent-200 text-accent-800 px-2.5 py-1 font-semibold text-[10px] tracking-[0.14em] uppercase">
                  {n.kicker}
                </span>
                <span className="font-medium text-xs tracking-[0.08em] uppercase text-ink-700">
                  {formatDate(n.date)}
                </span>
              </div>
              <h3 className="m-0 font-semibold text-2xl leading-[1.12] tracking-[-0.015em]">
                {n.title}
              </h3>
              <p className="m-0 text-[15px] leading-[1.5] text-ink-800 text-pretty">
                {n.blurb}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
