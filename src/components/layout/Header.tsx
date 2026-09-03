"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { NAV_ITEMS } from "@/lib/site.config";
import MobileNavDrawer from "./MobileNavDrawer";

interface GamesNavEdition {
  slug: string;
  name: string;
}

export default function Header({
  tagline,
  gamesEditions,
}: {
  tagline: string;
  gamesEditions: GamesNavEdition[];
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const gamesWrapperRef = useRef<HTMLDivElement>(null);
  const gamesActive = pathname.startsWith("/games");

  function openGamesDropdown() {
    const rect = gamesWrapperRef.current?.getBoundingClientRect();
    if (rect) setDropdownPos({ top: rect.bottom, left: rect.left });
    setGamesOpen(true);
  }

  return (
    <>
      <div className="border-b-2 border-ink bg-ground sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex items-stretch justify-between gap-6 flex-wrap">
          <Link
            href="/"
            className="flex items-center gap-3.5 py-4 text-left hover:no-underline"
          >
            <Image
              src="/boc-logo.png"
              alt="Bahrain Olympic Committee"
              width={60}
              height={60}
              className="h-[60px] w-auto block"
              priority
            />
            <span className="flex flex-col gap-0.5">
              <span className="font-semibold text-[21px] leading-none capitalize whitespace-nowrap text-ink">
                Team Bahrain
              </span>
              <span className="font-medium text-[10px] leading-none tracking-[0.18em] uppercase text-ink-700 whitespace-nowrap">
                {tagline}
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-stretch gap-0 flex-1 min-w-0 justify-end overflow-x-auto scroll-hidden">
            {gamesEditions.length > 0 && (
              <div
                ref={gamesWrapperRef}
                className="relative flex-none"
                onMouseEnter={openGamesDropdown}
                onMouseLeave={() => setGamesOpen(false)}
              >
                <Link
                  href="/games"
                  className={`flex items-center gap-1 flex-col justify-end px-[13px] h-full hover:bg-surface ${
                    gamesActive ? "text-ink" : "text-ink-700"
                  }`}
                >
                  <span className="flex items-center gap-1 pb-3.5">
                    <span className="font-semibold text-[11px] tracking-[0.12em] uppercase whitespace-nowrap">
                      Games
                    </span>
                    <ChevronDown size={12} strokeWidth={2} />
                  </span>
                  <span className={`h-1 w-full ${gamesActive ? "bg-accent" : "bg-transparent"}`} />
                </Link>
              </div>
            )}
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col justify-end gap-0 px-[13px] flex-none hover:bg-surface ${
                    active ? "text-ink" : "text-ink-700"
                  }`}
                >
                  <span className="font-semibold text-[11px] tracking-[0.12em] uppercase pb-3.5 whitespace-nowrap">
                    {item.label}
                  </span>
                  <span
                    className={`h-1 w-full ${active ? "bg-accent" : "bg-transparent"}`}
                  />
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="md:hidden flex items-center gap-2 px-2 font-semibold text-[11px] tracking-[0.12em] uppercase"
            aria-label="Open menu"
          >
            Menu
            <span className="text-lg leading-none">☰</span>
          </button>
        </div>
      </div>

      {gamesOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            onMouseEnter={openGamesDropdown}
            onMouseLeave={() => setGamesOpen(false)}
            className="fixed bg-ground border-2 border-ink min-w-[220px] z-50"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
          >
            {gamesEditions.map((e) => (
              <Link
                key={e.slug}
                href={`/games/${e.slug}`}
                onClick={() => setGamesOpen(false)}
                className="block px-4 py-3 font-semibold text-xs tracking-[0.08em] uppercase text-ink hover:bg-surface border-b-2 border-divider last:border-0"
              >
                {e.name}
              </Link>
            ))}
          </div>,
          document.body
        )}

      <MobileNavDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pathname={pathname}
        showGames={gamesEditions.length > 0}
      />
    </>
  );
}
