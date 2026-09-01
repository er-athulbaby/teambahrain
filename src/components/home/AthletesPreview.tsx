import Link from "next/link";
import SectionHead from "@/components/shared/SectionHead";
import ImageTile from "@/components/shared/ImageTile";
import type { Athlete } from "@/types";

export default function AthletesPreview({ athletes }: { athletes: Athlete[] }) {
  return (
    <section className="border-b-2 border-ink bg-surface">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
        <SectionHead title="Athletes to watch" href="/athletes" linkLabel="Full roster →" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {athletes.map((a) => (
            <Link
              key={a.id}
              href="/athletes"
              className="border-2 border-ink bg-ground flex flex-col text-ink"
            >
              <ImageTile
                src={a.photo_path}
                alt={a.name}
                aspect="3/4"
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="border-b-2 border-ink"
              />
              <div className="p-5 flex flex-col gap-2.5">
                <span className="font-semibold text-[11px] tracking-[0.16em] uppercase text-accent-700">
                  {a.sport}
                </span>
                <h3 className="m-0 font-bold text-[28px] leading-[0.98] tracking-[-0.01em] uppercase">
                  {a.name}
                </h3>
                <p className="m-0 text-sm leading-[1.5] text-ink-800">{a.line}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
