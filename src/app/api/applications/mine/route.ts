import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

export const runtime = "nodejs";

const COOKIE_NAME = process.env.FIREBASE_SESSION_COOKIE_NAME || "gb_session";

export async function GET() {
  const session = (await cookies()).get(COOKIE_NAME)?.value;
  if (!session) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });

  let decoded: any = null;
  try {
    decoded = await adminAuth.verifySessionCookie(session, true);
  } catch {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const snap = await adminDb
    .collection("applications")
    .where("userId", "==", decoded.uid)
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json({ ok: true, items });
}
