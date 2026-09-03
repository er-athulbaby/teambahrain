import LoginForm from "@/components/auth/LoginForm";
import { getPageContent } from "@/lib/data/pageContent";

// The logo must reflect the latest admin edit without a redeploy — same reason
// (site)/layout.tsx forces this for the rest of the editable public content.
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const site = await getPageContent("site");
  return <LoginForm logoUrl={site.logo} />;
}
