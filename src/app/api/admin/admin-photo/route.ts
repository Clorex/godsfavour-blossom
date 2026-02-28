import { NextResponse } from "next/server";
import { assertAdminTrustedDevice } from "@/lib/auth/api";
import { adminDb } from "@/lib/firebase/admin";
import { uploadImageFile } from "@/lib/storage/cloudinary";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await assertAdminTrustedDevice();

    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, message: "No file uploaded" }, { status: 400 });
    }

    const uploaded = await uploadImageFile({
      file,
      folder: "godsfavourblossom/site",
      publicId: "admin-photo",
    });

    await adminDb.collection("siteContent").doc("about").set(
      { adminImageUrl: uploaded.url, updatedAt: Date.now() },
      { merge: true }
    );

    return NextResponse.json({ ok: true, url: uploaded.url });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message || "Upload failed" },
      { status: e?.message === "DEVICE_NOT_TRUSTED" ? 401 : 400 }
    );
  }
}
