import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/:path*",
    "/universities/:path*",
    "/students/:path*",
    "/analytics/:path*",
    "/reports/:path*",
    "/notifications/:path*",
    "/audit-logs/:path*",
    "/system-health/:path*",
    "/settings/:path*",
  ],
};
