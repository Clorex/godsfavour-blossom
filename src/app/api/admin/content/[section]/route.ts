import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { assertAdminTrustedDevice } from "@/lib/auth/api";
import { defaultAbout, defaultHome, defaultServices } from "@/lib/content/defaults";

export const runtime = "nodejs";

function getDefaults(section: string) {
  if (section === "home") return defaultHome;
  if (section === "about") return defaultAbout;
  if (section === "services") return defaultServices;
  return null;
}

async function getSectionFromContext(context: any) {
  const params = await Promise.resolve(context?.params ?? {});
  const section = String((params as any)?.section ?? "").trim();
  return section;
}

export async function GET(req: Request, context: any) {
  try {
    await assertAdminTrustedDevice();

    const section = await getSectionFromContext(context);
    const defaults = getDefaults(section);
    if (!defaults) {
      return NextResponse.json({ ok: false, message: "Invalid section" }, { status: 400 });
    }

    const snap = await adminDb.collection("siteContent").doc(section).get();
    const data = snap.exists ? snap.data() : {};

    return NextResponse.json({ ok: true, data: { ...defaults, ...data } });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request, context: any) {
  try {
    await assertAdminTrustedDevice();

    const section = await getSectionFromContext(context);
    const defaults = getDefaults(section);
    if (!defaults) {
      return NextResponse.json({ ok: false, message: "Invalid section" }, { status: 400 });
    }

    const body = await req.json();
    await adminDb.collection("siteContent").doc(section).set(
      { ...body, updatedAt: Date.now() },
      { merge: true }
    );

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Failed" }, { status: 400 });
  }
}
