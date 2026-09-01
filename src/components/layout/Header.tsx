"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/site.config";
import MobileNavDrawer from "./MobileNavDrawer";

export default function Header() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

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
              width={46}
              height={46}
              className="h-[46px] w-auto block"
              priority
            />
            <span className="flex flex-col gap-0.5">
              <span className="font-semibold text-[21px] leading-none capitalize whitespace-nowrap text-ink">
                Team Bahrain
              </span>
              <span className="font-medium text-[10px] leading-none tracking-[0.18em] uppercase text-ink-700 whitespace-nowrap">
                Bahrain Olympic Committee
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-stretch gap-0 flex-1 min-w-0 justify-end overflow-x-auto scroll-hidden">
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

      <MobileNavDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pathname={pathname}
      />
    </>
  );
}
