import type { HomeFigure } from "@/types";

export default function FiguresStrip({ figures }: { figures: HomeFigure[] }) {
  return (
    <section className="border-b-2 border-ink">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 grid grid-cols-2 lg:grid-cols-4">
        {figures.map((fig, i) => (
          <div
            key={fig.id}
            className={`py-9 pr-7 flex flex-col gap-2.5 border-divider lg:border-b-0 ${
              i % 2 === 0 ? "border-r-2" : ""
            } ${i < 2 ? "border-b-2" : ""} ${
              i === 3 ? "lg:border-r-0" : "lg:border-r-2"
            }`}
          >
            <span className="font-bold text-[40px] sm:text-[52px] leading-[0.9] tracking-[-0.012em] text-accent">
              {fig.value}
            </span>
            <span className="font-semibold text-[13px] tracking-[0.06em] uppercase">
              {fig.label}
            </span>
            <span className="text-sm leading-[1.45] text-ink-700">{fig.note}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
