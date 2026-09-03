"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Flame } from "lucide-react";
import { signOut } from "next-auth/react";
import { ADMIN_NAV } from "@/lib/admin/nav";
import type { AdminRole } from "@/auth";

export default function AdminSidebar({
  adminName,
  role,
  logoUrl,
}: {
  adminName: string;
  role: AdminRole;
  logoUrl?: string;
}) {
  const pathname = usePathname();

  const visibleNav = ADMIN_NAV.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.adminOnly || role === "admin"),
  })).filter((group) => group.items.length > 0);

  return (
    <aside className="w-64 flex-none border-r border-slate-200 bg-white flex flex-col">
      <div className="px-5 py-5 border-b border-slate-200 flex items-center gap-2.5">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt=""
            className="h-10 w-10 object-contain flex-none"
          />
        ) : (
          <span className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-none">
            <Flame size={17} strokeWidth={2} />
          </span>
        )}
        <div>
          <Link href="/admin" className="font-semibold text-slate-900 leading-tight block">
            Team Bahrain
          </Link>
          <p className="text-xs text-slate-500 leading-tight">Admin</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5">
        {visibleNav.map((group, i) => (
          <div key={group.section ?? `group-${i}`}>
            {group.section && (
              <p className="px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {group.section}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium ${
                      active
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon size={17} strokeWidth={1.75} className="flex-none" />
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
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-600"
        >
          <LogOut size={13} strokeWidth={2} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
