import { notFound } from "next/navigation";
import { getResource, RESOURCES } from "@/lib/admin/resources";
import AdminResourceManager from "@/components/admin/AdminResourceManager";

export function generateStaticParams() {
  return Object.keys(RESOURCES).map((resource) => ({ resource }));
}

export default async function AdminResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const resource = getResource((await params).resource);
  if (!resource) notFound();

  return <AdminResourceManager resource={resource} />;
}
