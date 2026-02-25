import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

const COOKIE_NAME = process.env.FIREBASE_SESSION_COOKIE_NAME || "gb_session";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

export async function getSessionUser() {
  const jar = await cookies();
  const session = jar.get(COOKIE_NAME)?.value;
  if (!session) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    return decoded;
  } catch {
    return null;
  }
}

export async function requireUser(nextPath = "/account") {
  const user = await getSessionUser();
  if (!user) redirect(`/auth/login?next=${encodeURIComponent(nextPath)}`);
  return user;
}

export async function requireAdminSession() {
  const user = await requireUser("/admin");
  const email = (user.email || "").toLowerCase();

  if (!ADMIN_EMAIL) throw new Error("Missing ADMIN_EMAIL in env");
  if (email !== ADMIN_EMAIL.toLowerCase()) redirect("/account");

  return user;
}

export async function requireAdminTrustedDevice(nextPath = "/admin") {
  await requireAdminSession();

  const jar = await cookies();
  const deviceId = jar.get("deviceId")?.value;

  if (!deviceId) {
    redirect(`/admin/verify-device?next=${encodeURIComponent(nextPath)}`);
  }

  const snap = await adminDb.collection("adminDevices").doc(deviceId!).get();
  const trusted = snap.exists ? Boolean(snap.data()?.trusted) : false;

  if (!trusted) {
    redirect(`/admin/verify-device?next=${encodeURIComponent(nextPath)}`);
  }

  return true;
}

export async function getUserAgent() {
  const h = await headers();
  return (h.get("user-agent") || "").slice(0, 500);
}
