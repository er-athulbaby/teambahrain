import Link from "next/link";
import { Eye, CalendarClock, TrendingUp } from "lucide-react";
import { auth } from "@/auth";
import { ADMIN_NAV } from "@/lib/admin/nav";
import { getContentCounts, getTrafficSummary } from "@/lib/admin/analytics";
import StatCard from "@/components/admin/ui/StatCard";
import Card from "@/components/admin/ui/Card";

export default async function AdminDashboard() {
  const session = await auth();
  const isAdmin = session?.user.role === "admin";

  const [contentCounts, traffic] = await Promise.all([
    getContentCounts(),
    isAdmin ? getTrafficSummary() : null,
  ]);

  const quickLinkGroups = ADMIN_NAV.filter((group) => group.section)
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.adminOnly || isAdmin),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mb-8 text-sm text-slate-500">
        Manage the content shown on the public Team Bahrain site.
      </p>

      {traffic && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Site traffic</h2>
            <Link href="/admin/analytics" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
              View analytics →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={Eye} label="Views today" value={traffic.today} />
            <StatCard icon={CalendarClock} label="Last 7 days" value={traffic.last7Days} />
            <StatCard icon={TrendingUp} label="Last 30 days" value={traffic.last30Days} />
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Content overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {contentCounts.map((c) => (
            <Card key={c.href} className="p-4">
              <Link href={c.href} className="block hover:opacity-80">
                <span className="block text-2xl font-semibold text-slate-900">{c.count}</span>
                <span className="block text-sm text-slate-500 mt-1">{c.label}</span>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {quickLinkGroups.map((group) => (
          <div key={group.section}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {group.section}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Card className="px-4 py-3.5 flex items-center gap-3 hover:border-indigo-300">
                      <Icon size={17} strokeWidth={1.75} className="text-indigo-600 flex-none" />
                      <span className="text-sm font-medium text-slate-800">{item.label}</span>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
