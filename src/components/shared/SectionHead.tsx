import Link from "next/link";
import type { ReactNode } from "react";

export default function SectionHead({
  title,
  href,
  linkLabel,
  rightSlot,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  rightSlot?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-6 pb-6 border-b-2 border-ink mb-8 flex-wrap">
      <h2 className="m-0 font-bold text-[32px] sm:text-[44px] leading-[0.95] tracking-[-0.012em] uppercase">
        {title}
      </h2>
      {rightSlot}
      {!rightSlot && href && linkLabel && (
        <Link
          href={href}
          className="font-semibold text-xs tracking-[0.14em] uppercase text-accent-700 hover:text-accent"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
