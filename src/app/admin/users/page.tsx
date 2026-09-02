import { redirect } from "next/navigation";
import { auth } from "@/auth";
import UsersManager from "@/components/admin/UsersManager";

export default async function AdminUsersPage() {
  const session = await auth();
  if (session?.user.role !== "admin") redirect("/admin");

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">Users</h1>
      <p className="mb-6 text-sm text-slate-500">
        Admins have full access. Editors can manage content and page text, but not users,
        analytics, or site settings.
      </p>
      <UsersManager currentUserId={session.user.id} />
    </div>
  );
}
