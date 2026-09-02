import { redirect } from "next/navigation";
import { Eye, CalendarDays, CalendarClock, TrendingUp } from "lucide-react";
import { auth } from "@/auth";
import { getTrafficSummary, getViewsByDay, getTopPages, getTopReferrers } from "@/lib/admin/analytics";
import StatCard from "@/components/admin/ui/StatCard";
import Card from "@/components/admin/ui/Card";
import ViewsChart from "@/components/admin/ViewsChart";
import RankedBarList from "@/components/admin/ui/RankedBarList";

export default async function AdminAnalyticsPage() {
  const session = await auth();
  if (session?.user.role !== "admin") redirect("/admin");

  const [summary, viewsByDay, topPages, topReferrers] = await Promise.all([
    getTrafficSummary(),
    getViewsByDay(30),
    getTopPages(8),
    getTopReferrers(8),
  ]);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">Analytics</h1>
      <p className="mb-8 text-sm text-slate-500">
        Visitor traffic on the public Team Bahrain site. No IP addresses or other
        personal data are collected — only page path, referrer and device type.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Eye} label="All-time views" value={summary.allTime} />
        <StatCard icon={CalendarDays} label="Today" value={summary.today} />
        <StatCard icon={CalendarClock} label="Last 7 days" value={summary.last7Days} />
        <StatCard icon={TrendingUp} label="Last 30 days" value={summary.last30Days} />
      </div>

      <Card className="p-5 mb-8">
        <h2 className="mb-4 text-sm font-semibold text-slate-800">Views over the last 30 days</h2>
        <ViewsChart data={viewsByDay} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">Top pages</h2>
          <RankedBarList items={topPages.map((p) => ({ label: p.path, count: p.count }))} />
        </Card>
        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-800">Top referrers</h2>
          <RankedBarList items={topReferrers.map((r) => ({ label: r.referrer, count: r.count }))} />
        </Card>
      </div>
    </div>
  );
}
