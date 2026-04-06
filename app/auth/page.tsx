import { redirect } from "next/navigation";
import { AuthPage } from "@/components/auth/AuthPage";
import { auth } from "@/lib/auth";

export default async function AuthRoute({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string };
}) {
  const session = await auth();

  if (session?.user) {
    redirect(searchParams?.callbackUrl ?? "/dashboard");
  }

  return (
    <AuthPage
      callbackUrl={searchParams?.callbackUrl ?? "/dashboard"}
      googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)}
    />
  );
}
