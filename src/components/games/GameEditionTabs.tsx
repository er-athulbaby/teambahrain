"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { segment: "delegation", label: "Delegation" },
  { segment: "sports", label: "Sports" },
  { segment: "players", label: "Players" },
  { segment: "events", label: "Events" },
  { segment: "results", label: "Results" },
  { segment: "medals", label: "Medals" },
] as const;

export default function GameEditionTabs({ slug }: { slug: string }) {
  const pathname = usePathname();

  return (
    <nav className="flex items-stretch overflow-x-auto scroll-hidden">
      {TABS.map((tab) => {
        const href = `/games/${slug}/${tab.segment}`;
        const active = pathname === href;
        return (
          <Link
            key={tab.segment}
            href={href}
            className={`flex flex-col justify-end gap-0 px-4 flex-none hover:bg-surface ${
              active ? "text-ink" : "text-ink-700"
            }`}
          >
            <span className="font-semibold text-[11px] tracking-[0.12em] uppercase pb-3.5 whitespace-nowrap">
              {tab.label}
            </span>
            <span className={`h-1 w-full ${active ? "bg-accent" : "bg-transparent"}`} />
          </Link>
        );
      })}
    </nav>
  );
}
