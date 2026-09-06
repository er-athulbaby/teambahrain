"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function HeaderDropdown({
  label,
  linkHref,
  active,
  items,
}: {
  label: string;
  linkHref: string;
  active: boolean;
  items: { key: string; href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);

  function openDropdown() {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (rect) setPos({ top: rect.bottom, left: rect.left });
    setOpen(true);
  }

  if (items.length === 0) return null;

  return (
    <>
      <div
        ref={wrapperRef}
        className="relative flex-none"
        onMouseEnter={openDropdown}
        onMouseLeave={() => setOpen(false)}
      >
        <Link
          href={linkHref}
          className={`flex flex-col justify-end gap-0 px-[13px] h-full flex-none hover:bg-surface ${
            active ? "text-ink" : "text-ink-700"
          }`}
        >
          <span className="font-semibold text-[11px] tracking-[0.12em] uppercase pb-3.5 flex items-center gap-1 whitespace-nowrap">
            {label}
            <ChevronDown size={12} strokeWidth={2} />
          </span>
          <span className={`h-1 w-full ${active ? "bg-accent" : "bg-transparent"}`} />
        </Link>
      </div>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            onMouseEnter={openDropdown}
            onMouseLeave={() => setOpen(false)}
            className="fixed bg-ground border-2 border-ink min-w-[220px] z-50"
            style={{ top: pos.top, left: pos.left }}
          >
            {items.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 font-semibold text-xs tracking-[0.08em] uppercase text-ink hover:bg-surface border-b-2 border-divider last:border-0"
              >
                {item.label}
              </Link>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
