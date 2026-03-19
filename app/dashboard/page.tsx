import { redirect } from "next/navigation";
import { DashboardEditor } from "@/components/dashboard/DashboardEditor";
import { auth } from "@/lib/auth";
import { getDashboardPreviewData } from "@/lib/card-service";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent("/dashboard")}`);
  }

  const preview = await getDashboardPreviewData(session.user.email);

  return <DashboardEditor preview={preview} />;
}
