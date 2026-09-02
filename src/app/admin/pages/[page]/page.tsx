import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { PAGE_CONTENT_CONFIG, getPageConfig } from "@/lib/admin/pageContentConfig";
import PageContentManager from "@/components/admin/PageContentManager";

export function generateStaticParams() {
  return Object.keys(PAGE_CONTENT_CONFIG).map((page) => ({ page }));
}

export default async function AdminPageContentPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const config = getPageConfig(page);
  if (!config) notFound();

  if (config.adminOnly) {
    const session = await auth();
    if (session?.user.role !== "admin") redirect("/admin");
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">{config.label}</h1>
      <p className="mb-6 text-sm text-slate-500">
        {page === "site"
          ? "Site-wide settings: favicon, tagline, and navigation loading bar."
          : "Edit the headline, intro text and images for this page's design."}
      </p>
      <PageContentManager page={page} config={config} />
    </div>
  );
}
