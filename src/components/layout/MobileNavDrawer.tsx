"use client";

import Link from "next/link";
import { NAV_ITEMS } from "@/lib/site.config";

export default function MobileNavDrawer({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  if (!open) return null;

  return (
    <div className="md:hidden fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40"
      />
      <div className="absolute top-0 right-0 h-full w-[78%] max-w-[320px] bg-ground border-l-2 border-ink flex flex-col">
        <div className="flex items-center justify-between border-b-2 border-ink px-5 py-4">
          <span className="font-semibold text-[13px] tracking-[0.12em] uppercase">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="font-semibold text-xl leading-none px-1"
          >
            ×
          </button>
        </div>
        <nav className="flex flex-col">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`px-5 py-4 border-b-2 border-divider font-semibold text-[13px] tracking-[0.12em] uppercase ${
                  active ? "text-ink bg-surface" : "text-ink-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
