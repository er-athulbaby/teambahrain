import Link from "next/link";
import { ADMIN_NAV } from "@/lib/admin/nav";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mb-8 text-sm text-slate-500">
        Manage the content shown on the public Team Bahrain site.
      </p>

      <div className="flex flex-col gap-8">
        {ADMIN_NAV.map((group) => (
          <div key={group.section}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {group.section}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 hover:border-slate-400"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
