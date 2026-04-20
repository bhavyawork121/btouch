import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((request) => {
  if (!request.auth?.user) {
    const redirectUrl = new URL("/auth", request.url);
    redirectUrl.searchParams.set("callbackUrl", request.nextUrl.href);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
