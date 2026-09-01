"use client";

import { useEffect, useState } from "react";
import { GAMES_DATE } from "@/lib/site.config";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function unitsFor(now: number) {
  const target = new Date(GAMES_DATE).getTime();
  const diff = Math.max(0, target - now);
  const s = Math.floor(diff / 1000);
  return [
    { label: "Days", value: String(Math.floor(s / 86400)) },
    { label: "Hours", value: pad(Math.floor(s / 3600) % 24) },
    { label: "Minutes", value: pad(Math.floor(s / 60) % 60) },
    { label: "Seconds", value: pad(s % 60) },
  ];
}

export default function Countdown({
  variant = "ink",
  valueClassName = "text-[46px]",
}: {
  variant?: "ink" | "white";
  valueClassName?: string;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const units = unitsFor(now);
  const borderClass = variant === "white" ? "border-white" : "border-ink";
  const labelClass = variant === "white" ? "text-white/85" : "text-ink-700";

  return (
    <div className={`flex border-2 ${borderClass} w-full max-w-[640px]`}>
      {units.map((unit, i) => (
        <div
          key={unit.label}
          className={`flex-1 px-4 py-4.5 flex flex-col gap-1.5 ${
            i < units.length - 1 ? `border-r-2 ${borderClass}` : ""
          }`}
        >
          <span
            className={`font-bold leading-[0.9] tracking-[-0.012em] tabular-nums ${valueClassName}`}
            suppressHydrationWarning
          >
            {unit.value}
          </span>
          <span className={`font-semibold text-[10px] tracking-[0.18em] uppercase ${labelClass}`}>
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
