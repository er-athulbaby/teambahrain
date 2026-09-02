import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import Card from "./Card";

export default function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  href?: string;
}) {
  const content = (
    <Card className="p-5 flex items-center gap-4 h-full">
      <span className="flex-none h-11 w-11 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
        <Icon size={22} strokeWidth={1.75} />
      </span>
      <span className="flex flex-col">
        <span className="text-2xl font-semibold text-slate-900 leading-none">{value}</span>
        <span className="text-sm text-slate-500 mt-1">{label}</span>
      </span>
    </Card>
  );

  if (!href) return content;

  return (
    <Link href={href} className="block hover:-translate-y-0.5 transition-transform">
      {content}
    </Link>
  );
}
