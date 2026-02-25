import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Only apply to /admin routes
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const res = NextResponse.next();
  const existing = req.cookies.get("deviceId")?.value;

  if (!existing) {
    const deviceId = crypto.randomUUID();
    res.cookies.set("deviceId", deviceId, {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  return res;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};