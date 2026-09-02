import { redirect } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { auth } from "@/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900">
      <AdminSidebar adminName={session.user.name} />
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="border-b border-slate-200 bg-white px-8 py-3 flex justify-end">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600"
          >
            View public site
            <ExternalLink size={13} strokeWidth={2} />
          </Link>
        </div>
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
