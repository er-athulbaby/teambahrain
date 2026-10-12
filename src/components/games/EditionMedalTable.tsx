"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { groupMedalsBySport, countMedalsInEvents, countMedals } from "@/lib/medals";
import type { GameEditionMedalRecord, GameEditionSport, MedalCounts } from "@/types";

const DISC = "●";
const DASH = "–";

const GOLD = "text-[#B8860B]";
const SILVER = "text-[#71797E]";
const BRONZE = "text-[#A0522D]";

function countClass(n: number, color: string) {
  return n > 0 ? color : "text-ink-400";
}

interface Row {
  key: string;
  depth: 0 | 1 | 2;
  label: string;
  icon: string | null;
  gold: string;
  silver: string;
  bronze: string;
  total: string;
  goldClass: string;
  silverClass: string;
  bronzeClass: string;
  totalClass: string;
  chevron: string;
  onClick?: () => void;
}

function countsToCells(c: MedalCounts) {
  return {
    gold: String(c.gold),
    silver: String(c.silver),
    bronze: String(c.bronze),
    total: String(c.total),
    goldClass: countClass(c.gold, GOLD),
    silverClass: countClass(c.silver, SILVER),
    bronzeClass: countClass(c.bronze, BRONZE),
    totalClass: countClass(c.total, "text-ink font-bold"),
  };
}

export default function EditionMedalTable({
  medals,
  sports,
}: {
  medals: GameEditionMedalRecord[];
  sports: GameEditionSport[];
}) {
  const grouped = useMemo(() => groupMedalsBySport(medals), [medals]);
  const iconBySport = useMemo(() => new Map(sports.map((s) => [s.name, s.icon_path])), [sports]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setExpanded((e) => ({ ...e, [key]: !e[key] }));

  const rows: Row[] = [];
  grouped.forEach((sp) => {
    const spOpen = !!expanded[sp.name];
    rows.push({
      key: sp.name,
      depth: 0,
      label: sp.name,
      icon: iconBySport.get(sp.name) ?? null,
      chevron: spOpen ? "▲" : "▼",
      onClick: () => toggle(sp.name),
      ...countsToCells(countMedalsInEvents(sp.events)),
    });
    if (!spOpen) return;

    sp.events.forEach((ev) => {
      const evKey = `${sp.name}|${ev.name}`;
      const evOpen = !!expanded[evKey];
      rows.push({
        key: evKey,
        depth: 1,
        label: ev.name,
        icon: null,
        chevron: evOpen ? "▲" : "▼",
        onClick: () => toggle(evKey),
        ...countsToCells(countMedals(ev.athletes)),
      });
      if (!evOpen) return;

      ev.athletes.forEach((a) => {
        rows.push({
          key: `${evKey}|${a.name}`,
          depth: 2,
          label: a.name,
          icon: null,
          gold: a.medal === "G" ? DISC : DASH,
          silver: a.medal === "S" ? DISC : DASH,
          bronze: a.medal === "B" ? DISC : DASH,
          total: DASH,
          goldClass: a.medal === "G" ? GOLD : "text-ink-400",
          silverClass: a.medal === "S" ? SILVER : "text-ink-400",
          bronzeClass: a.medal === "B" ? BRONZE : "text-ink-400",
          totalClass: "text-ink-400",
          chevron: "",
        });
      });
    });
  });

  const rowFillFor = (depth: Row["depth"]) => (depth === 1 ? "bg-surface" : depth === 2 ? "bg-row-tint" : "");
  const indentPxFor = (depth: Row["depth"]) => 20 + (depth === 1 ? 28 : depth === 2 ? 56 : 0);
  const labelSizeFor = (depth: Row["depth"]) =>
    depth === 0 ? "text-lg sm:text-xl font-bold" : depth === 1 ? "text-base font-bold" : "text-base font-semibold text-accent-700";

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr className="bg-ink text-white">
            <th scope="col" className="text-left font-semibold text-[10px] tracking-[0.18em] uppercase py-3.5 px-5">
              Sport · event · athlete
            </th>
            <th className="font-semibold text-[10px] tracking-[0.16em] uppercase py-3.5 px-3 text-center">Gold</th>
            <th className="font-semibold text-[10px] tracking-[0.16em] uppercase py-3.5 px-3 text-center">Silver</th>
            <th className="font-semibold text-[10px] tracking-[0.16em] uppercase py-3.5 px-3 text-center">Bronze</th>
            <th className="font-semibold text-[10px] tracking-[0.16em] uppercase py-3.5 px-3 text-center">Total</th>
            <th className="w-11" aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.key}
              onClick={row.onClick}
              onKeyDown={
                row.onClick
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        row.onClick?.();
                      }
                    }
                  : undefined
              }
              tabIndex={row.onClick ? 0 : undefined}
              role={row.onClick ? "button" : undefined}
              aria-expanded={row.onClick ? expanded[row.key] ?? false : undefined}
              className={`border-b-2 border-divider ${rowFillFor(row.depth)} ${
                row.onClick ? "cursor-pointer hover:bg-[#eae7e7]" : ""
              }`}
            >
              <td className="py-4.5 pr-5 flex items-center gap-3" style={{ paddingLeft: `${indentPxFor(row.depth)}px` }}>
                {row.icon && (
                  <Image src={row.icon} alt="" width={28} height={28} className="h-7 w-7 object-contain flex-none" />
                )}
                <span className={`block leading-[1.1] tracking-[-0.015em] ${labelSizeFor(row.depth)}`}>{row.label}</span>
              </td>
              <td className={`text-center font-semibold text-lg tabular-nums ${row.goldClass}`}>{row.gold}</td>
              <td className={`text-center font-semibold text-lg tabular-nums ${row.silverClass}`}>{row.silver}</td>
              <td className={`text-center font-semibold text-lg tabular-nums ${row.bronzeClass}`}>{row.bronze}</td>
              <td className={`text-center text-lg tabular-nums ${row.totalClass}`}>{row.total}</td>
              <td className="text-center font-bold text-[11px] text-ink-700">{row.chevron}</td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="py-9 px-5 border-b-2 border-divider text-base text-ink-700">
                No medals recorded for this edition yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
