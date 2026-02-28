import { NextResponse } from "next/server";
export const runtime = "nodejs";
const COOKIE_NAME = process.env.FIREBASE_SESSION_COOKIE_NAME || "gb_session";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
