import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

export const runtime = "nodejs";

const COOKIE_NAME = process.env.FIREBASE_SESSION_COOKIE_NAME || "gb_session";
const EXPIRES_DAYS = Number(process.env.FIREBASE_SESSION_EXPIRES_DAYS || "7");
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "").toLowerCase();

export async function POST(req: Request) {
  try {
    const { idToken } = (await req.json()) as { idToken?: string };
    if (!idToken) {
      return NextResponse.json({ ok: false, message: "Missing idToken" }, { status: 400 });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);

    const expiresIn = EXPIRES_DAYS * 24 * 60 * 60 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const email = (decoded.email || "").toLowerCase();
    const isAdmin = Boolean(email && ADMIN_EMAIL && email === ADMIN_EMAIL);

    const res = NextResponse.json({ ok: true, isAdmin });
    res.cookies.set(COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });

    return res;
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Failed" }, { status: 401 });
  }
}
