import { redirect } from "next/navigation";
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
      <main className="flex-1 min-w-0 px-8 py-8">{children}</main>
    </div>
  );
}
