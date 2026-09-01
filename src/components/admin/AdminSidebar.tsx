"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ADMIN_NAV } from "@/lib/admin/nav";

export default function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-none border-r border-slate-200 bg-white flex flex-col">
      <div className="px-5 py-5 border-b border-slate-200">
        <Link href="/admin" className="font-semibold text-slate-900">
          Team Bahrain
        </Link>
        <p className="text-xs text-slate-500">Admin</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5">
        {ADMIN_NAV.map((group) => (
          <div key={group.section}>
            <p className="px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {group.section}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-md px-2 py-1.5 text-sm ${
                      active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200 px-4 py-4 flex items-center justify-between gap-2">
        <span className="text-xs text-slate-500 truncate">{adminName}</span>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-xs font-medium text-slate-500 hover:text-red-600"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
