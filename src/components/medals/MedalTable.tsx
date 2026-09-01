"use client";

import { useMemo, useState } from "react";
import SportFilterChips from "./SportFilterChips";
import {
  groupMedalsByGame,
  countMedalsInEvents,
  countMedalsInSports,
  countMedals,
  type MedalGame,
} from "@/lib/medals";
import type { OlympicGame, MedalRecord, MedalCounts } from "@/types";

const DISC = "●";
const DASH = "–";

function countClass(n: number, color: string) {
  return n > 0 ? color : "text-ink-400";
}

interface Row {
  key: string;
  depth: 0 | 1 | 2 | 3;
  label: string;
  sub: string;
  gold: string;
  silver: string;
  bronze: string;
  total: string;
  goldClass: string;
  silverClass: string;
  bronzeClass: string;
  totalClass: string;
  chevron: string;
  expandable: boolean;
  onClick?: () => void;
}

function countsToCells(c: MedalCounts) {
  return {
    gold: String(c.gold),
    silver: String(c.silver),
    bronze: String(c.bronze),
    total: String(c.total),
    goldClass: countClass(c.gold, "text-accent"),
    silverClass: countClass(c.silver, "text-ink"),
    bronzeClass: countClass(c.bronze, "text-ink-700"),
    totalClass: countClass(c.total, "text-ink font-bold"),
  };
}

export default function MedalTable({
  games,
  medals,
}: {
  games: OlympicGame[];
  medals: MedalRecord[];
}) {
  const grouped = useMemo(() => groupMedalsByGame(games, medals), [games, medals]);

  const defaultExpanded = useMemo(() => {
    const first = grouped.find((g) => g.sports.length > 0) ?? grouped[0];
    if (!first) return {};
    const map: Record<string, boolean> = { [first.year]: true };
    if (first.sports[0]) map[`${first.year}|${first.sports[0].name}`] = true;
    return map;
  }, [grouped]);

  const [sportFilter, setSportFilter] = useState("All");
  const [expanded, setExpanded] = useState<Record<string, boolean> | null>(null);

  const exp = expanded ?? defaultExpanded;
  const toggle = (key: string) =>
    setExpanded({ ...exp, [key]: !exp[key] });
  const reset = () => {
    setSportFilter("All");
    setExpanded(null);
  };

  const rows: Row[] = [];
  grouped.forEach((g: MedalGame) => {
    const sports =
      sportFilter === "All" ? g.sports : g.sports.filter((s) => s.name === sportFilter);
    if (sportFilter !== "All" && sports.length === 0) return;

    const gameOpen = !!exp[g.year];
    rows.push({
      key: g.year,
      depth: 0,
      label: g.city,
      sub: g.year,
      chevron: sports.length ? (gameOpen ? "▲" : "▼") : "",
      expandable: sports.length > 0,
      onClick: sports.length ? () => toggle(g.year) : undefined,
      ...countsToCells(countMedalsInSports(sports)),
    });
    if (!gameOpen) return;

    sports.forEach((sp) => {
      const spKey = `${g.year}|${sp.name}`;
      const spOpen = !!exp[spKey];
      rows.push({
        key: spKey,
        depth: 1,
        label: sp.name,
        sub: "",
        chevron: spOpen ? "▲" : "▼",
        expandable: true,
        onClick: () => toggle(spKey),
        ...countsToCells(countMedalsInEvents(sp.events)),
      });
      if (!spOpen) return;

      sp.events.forEach((ev) => {
        const evKey = `${spKey}|${ev.name}`;
        const evOpen = !!exp[evKey];
        rows.push({
          key: evKey,
          depth: 2,
          label: ev.name,
          sub: "",
          chevron: evOpen ? "▲" : "▼",
          expandable: true,
          onClick: () => toggle(evKey),
          ...countsToCells(countMedals(ev.athletes)),
        });
        if (!evOpen) return;

        ev.athletes.forEach((a) => {
          rows.push({
            key: `${evKey}|${a.name}`,
            depth: 3,
            label: a.name,
            sub: "",
            gold: a.medal === "G" ? DISC : DASH,
            silver: a.medal === "S" ? DISC : DASH,
            bronze: a.medal === "B" ? DISC : DASH,
            total: DASH,
            goldClass: a.medal === "G" ? "text-accent" : "text-ink-400",
            silverClass: a.medal === "S" ? "text-ink" : "text-ink-400",
            bronzeClass: a.medal === "B" ? "text-ink-700" : "text-ink-400",
            totalClass: "text-ink-400",
            chevron: "",
            expandable: false,
          });
        });
      });
    });
  });

  const rowFillFor = (depth: Row["depth"]) =>
    depth === 1 ? "bg-surface" : depth === 3 ? "bg-row-tint" : "";
  const indentPxFor = (depth: Row["depth"]) =>
    20 + (depth === 1 ? 28 : depth === 2 ? 56 : depth === 3 ? 84 : 0);
  const labelSizeFor = (depth: Row["depth"]) =>
    depth === 0
      ? "text-2xl sm:text-[26px] font-bold"
      : depth === 1
        ? "text-lg sm:text-[19px] font-bold"
        : depth === 2
          ? "text-base sm:text-base font-bold"
          : "text-base font-semibold text-accent-700";

  const totals = countMedals(medals.filter((m) => sportFilter === "All" || m.sport === sportFilter));

  return (
    <>
      <SportFilterChips value={sportFilter} onChange={setSportFilter} onReset={reset} />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="bg-ink text-white">
              <th
                scope="col"
                className="text-left font-semibold text-[10px] tracking-[0.18em] uppercase py-3.5 px-5"
              >
                Games · sport · event · athlete
              </th>
              <th className="font-semibold text-[10px] tracking-[0.16em] uppercase py-3.5 px-3 text-center">
                Gold
              </th>
              <th className="font-semibold text-[10px] tracking-[0.16em] uppercase py-3.5 px-3 text-center">
                Silver
              </th>
              <th className="font-semibold text-[10px] tracking-[0.16em] uppercase py-3.5 px-3 text-center">
                Bronze
              </th>
              <th className="font-semibold text-[10px] tracking-[0.16em] uppercase py-3.5 px-3 text-center">
                Total
              </th>
              <th className="w-11" aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            <tr className="bg-accent-200 border-b-2 border-ink">
              <td className="py-5.5 px-5">
                <span className="font-bold text-2xl leading-none tracking-[-0.02em] uppercase block">
                  Total medals
                </span>
                <span className="font-semibold text-[11px] tracking-[0.16em] uppercase text-accent-800">
                  All-time · 1984 — 2024
                </span>
              </td>
              <td className="text-center font-bold text-2xl tabular-nums text-accent">
                {totals.gold}
              </td>
              <td className="text-center font-bold text-2xl tabular-nums text-ink">
                {totals.silver}
              </td>
              <td className="text-center font-bold text-2xl tabular-nums text-ink-700">
                {totals.bronze}
              </td>
              <td className="text-center font-bold text-2xl tabular-nums text-ink">
                {totals.total}
              </td>
              <td />
            </tr>

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
                aria-expanded={row.expandable ? exp[row.key] ?? false : undefined}
                className={`border-b-2 border-divider ${rowFillFor(row.depth)} ${
                  row.onClick ? "cursor-pointer hover:bg-[#eae7e7]" : ""
                }`}
              >
                <td
                  className="py-4.5 pr-5"
                  style={{ paddingLeft: `${indentPxFor(row.depth)}px` }}
                >
                  <span className={`block leading-[1.1] tracking-[-0.015em] ${labelSizeFor(row.depth)}`}>
                    {row.label}
                  </span>
                  {row.sub && (
                    <span className="font-semibold text-[11px] tracking-[0.16em] uppercase text-accent-700">
                      {row.sub}
                    </span>
                  )}
                </td>
                <td className={`text-center font-semibold text-lg tabular-nums ${row.goldClass}`}>
                  {row.gold}
                </td>
                <td className={`text-center font-semibold text-lg tabular-nums ${row.silverClass}`}>
                  {row.silver}
                </td>
                <td className={`text-center font-semibold text-lg tabular-nums ${row.bronzeClass}`}>
                  {row.bronze}
                </td>
                <td className={`text-center text-lg tabular-nums ${row.totalClass}`}>
                  {row.total}
                </td>
                <td className="text-center font-bold text-[11px] text-ink-700">{row.chevron}</td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-9 px-5 border-b-2 border-divider text-base text-ink-700">
                  No Olympic medals recorded in this sport yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pt-5.5 flex gap-4 items-baseline flex-wrap">
        <span className="font-semibold text-[11px] tracking-[0.16em] uppercase text-accent-700">
          Note
        </span>
        <span className="text-sm leading-[1.5] text-ink-700 max-w-[76ch]">
          Select a row to open it. Bahrain has competed at every summer
          Games since 1984; all medals to date have come in athletics, and
          the 2012 gold reflects a reallocation confirmed after those
          Games.
        </span>
      </div>
    </>
  );
}
