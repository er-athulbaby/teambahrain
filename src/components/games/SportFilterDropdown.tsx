"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import type { GameEditionSport } from "@/types";

export default function SportFilterDropdown({
  sports,
  value,
  onChange,
}: {
  sports: GameEditionSport[];
  value: string;
  onChange: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selected = sports.find((s) => s.name === value);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function select(name: string) {
    onChange(name);
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-2.5 border-2 border-ink px-5 py-3 font-semibold text-xs tracking-[0.14em] uppercase hover:bg-surface min-w-[240px]"
      >
        {selected?.icon_path && (
          <Image src={selected.icon_path} alt="" width={20} height={20} className="h-5 w-5 object-contain flex-none" />
        )}
        <span className="flex-1 text-left">{value}</span>
        <ChevronDown size={14} strokeWidth={2} className={`flex-none transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full bg-ground border-2 border-t-0 border-ink min-w-[240px] z-40 max-h-80 overflow-y-auto">
          <button
            type="button"
            onClick={() => select("All")}
            className={`flex w-full items-center gap-2.5 text-left px-5 py-3 font-semibold text-xs tracking-[0.14em] uppercase hover:bg-surface border-b-2 border-divider ${
              value === "All" ? "text-accent-700" : "text-ink"
            }`}
          >
            All
          </button>
          {sports.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => select(s.name)}
              className={`flex w-full items-center gap-2.5 text-left px-5 py-3 font-semibold text-xs tracking-[0.14em] uppercase hover:bg-surface border-b-2 border-divider last:border-0 ${
                value === s.name ? "text-accent-700" : "text-ink"
              }`}
            >
              {s.icon_path && (
                <Image src={s.icon_path} alt="" width={20} height={20} className="h-5 w-5 object-contain flex-none" />
              )}
              {s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
