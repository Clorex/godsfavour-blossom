import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

const COOKIE_NAME = process.env.FIREBASE_SESSION_COOKIE_NAME || "gb_session";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

export async function assertAdminTrustedDevice() {
  const session = (await cookies()).get(COOKIE_NAME)?.value;
  if (!session) throw new Error("NO_SESSION");

  const decoded = await adminAuth.verifySessionCookie(session, true);
  if (!decoded?.email) throw new Error("NO_EMAIL");
  if (!ADMIN_EMAIL) throw new Error("MISSING_ADMIN_EMAIL");
  if (decoded.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) throw new Error("NOT_ADMIN");

  const deviceId = (await cookies()).get("deviceId")?.value;
  if (!deviceId) throw new Error("NO_DEVICE_ID");

  const deviceSnap = await adminDb.collection("adminDevices").doc(deviceId).get();
  const trusted = deviceSnap.exists ? Boolean(deviceSnap.data()?.trusted) : false;
  if (!trusted) throw new Error("DEVICE_NOT_TRUSTED");

  return { decoded, deviceId };
}
