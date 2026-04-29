import { redirect } from "next/navigation";
import { Editor } from "@/components/dashboard/Editor";
import { auth } from "@/lib/auth";
import { getDashboardConfig } from "@/lib/btouch";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect(`/auth?callbackUrl=${encodeURIComponent("/dashboard")}`);
  }

  const config = await getDashboardConfig(session.user.email);
  if (!config) {
    redirect("/auth");
  }

  return <Editor initialConfig={config} />;
}
