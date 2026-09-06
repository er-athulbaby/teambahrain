import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { canAccessAdminPath, landingPathFor } from "@/lib/admin/permissions";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute && !req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && req.auth && !canAccessAdminPath(req.auth.user.role, pathname)) {
    const landingUrl = new URL(landingPathFor(req.auth.user.role), req.nextUrl.origin);
    return NextResponse.redirect(landingUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
