import { HomePageClient } from "@/components/home/HomePageClient";
import { auth } from "@/lib/auth";
import { getHomepageUsers, getIdentityQuoteOfDay } from "@/lib/homepage";

export default async function HomePage() {
  const session = await auth();
  const users = await getHomepageUsers();
  const { quote, dateLabel } = getIdentityQuoteOfDay();
  const isAuthed = !!session?.user;
  const dashHref = isAuthed ? "/dashboard" : "/auth?callbackUrl=/dashboard";

  return (
    <HomePageClient
      isAuthed={isAuthed}
      dashHref={dashHref}
      quote={quote}
      dateLabel={dateLabel}
      users={users}
    />
  );
}
