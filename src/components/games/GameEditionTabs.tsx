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
            className={`relative flex items-center justify-center px-4 py-4 flex-none hover:bg-surface ${
              active ? "text-ink" : "text-ink-700"
            }`}
          >
            <span className="font-semibold text-[13px] tracking-[0.12em] uppercase whitespace-nowrap">
              {tab.label}
            </span>
            <span className={`absolute left-0 bottom-0 h-1 w-full ${active ? "bg-accent" : "bg-transparent"}`} />
          </Link>
        );
      })}
    </nav>
  );
}
