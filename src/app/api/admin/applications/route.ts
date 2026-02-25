import { NextResponse } from "next/server";
import { assertAdminTrustedDevice } from "@/lib/auth/api";
import { listApplications } from "@/lib/admin/applications";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    await assertAdminTrustedDevice();

    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "";
    const status = url.searchParams.get("status") || "";
    const q = url.searchParams.get("q") || "";

    const items = await listApplications({ type, status, q, limit: 250 });
    return NextResponse.json({ ok: true, items });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Unauthorized" }, { status: 401 });
  }
}
