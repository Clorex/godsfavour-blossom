import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { assertAdminTrustedDevice } from "@/lib/auth/api";
import { defaultSettings } from "@/lib/content/defaults";

export const runtime = "nodejs";

export async function GET() {
  try {
    await assertAdminTrustedDevice();
    const snap = await adminDb.collection("siteSettings").doc("global").get();
    const data = snap.exists ? snap.data() : {};
    return NextResponse.json({ ok: true, data: { ...defaultSettings, ...data } });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    await assertAdminTrustedDevice();
    const body = await req.json();
    await adminDb.collection("siteSettings").doc("global").set({ ...body, updatedAt: Date.now() }, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Failed" }, { status: 400 });
  }
}
