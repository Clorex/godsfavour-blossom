import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase/admin";
import { resend, RESEND_FROM } from "@/lib/email/resend";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

export const runtime = "nodejs";

const COOKIE_NAME = process.env.FIREBASE_SESSION_COOKIE_NAME || "gb_session";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const OTP_PEPPER = process.env.OTP_PEPPER || "";

function hashOtp(code: string) {
  return crypto.createHash("sha256").update(code + OTP_PEPPER).digest("hex");
}

async function requireAdminFromRequest() {
  const session = (await cookies()).get(COOKIE_NAME)?.value;
  if (!session) return null;
  const decoded = await adminAuth.verifySessionCookie(session, true);
  if (!decoded?.email) return null;
  if (decoded.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) return null;
  return decoded;
}

export async function POST(req: Request) {
  try {
    if (!ADMIN_EMAIL) {
      return NextResponse.json({ ok: false, message: "Missing ADMIN_EMAIL" }, { status: 500 });
    }
    if (!OTP_PEPPER) {
      return NextResponse.json({ ok: false, message: "Missing OTP_PEPPER" }, { status: 500 });
    }

    const admin = await requireAdminFromRequest();
    if (!admin) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const { action, code } = (await req.json()) as {
      action?: "request" | "verify";
      code?: string;
    };

    const deviceId = (await cookies()).get("deviceId")?.value;
    if (!deviceId) {
      return NextResponse.json({ ok: false, message: "Missing deviceId cookie" }, { status: 400 });
    }

    const deviceRef = adminDb.collection("adminDevices").doc(deviceId);
    const otpRef = adminDb.collection("adminDeviceOtps").doc(deviceId);

    // If already trusted, short-circuit
    const deviceSnap = await deviceRef.get();
    if (deviceSnap.exists && deviceSnap.data()?.trusted === true && action === "request") {
      return NextResponse.json({ ok: true, alreadyTrusted: true });
    }

    if (action === "request") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpHash = hashOtp(otp);
      const expiresAt = Date.now() + 10 * 60 * 1000;

      await otpRef.set({
        otpHash,
        expiresAt,
        attempts: 0,
        createdAt: Date.now(),
      });

      // Send email
      await resend.emails.send({
        from: RESEND_FROM,
        to: ADMIN_EMAIL,
        subject: "Godsfavour Blossom Admin Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Your verification code</h2>
            <p>Use this code to verify your admin device:</p>
            <p style="font-size: 28px; font-weight: bold; letter-spacing: 2px;">${otp}</p>
            <p>This code expires in 10 minutes.</p>
          </div>
        `,
      });

      // In dev only, also return OTP to unblock testing if email delivery delays
      const devOtp = process.env.NODE_ENV !== "production" ? otp : undefined;

      return NextResponse.json({ ok: true, devOtp });
    }

    if (action === "verify") {
      const submitted = (code || "").trim();
      if (!/^\d{6}$/.test(submitted)) {
        return NextResponse.json({ ok: false, message: "Enter a valid 6-digit code" }, { status: 400 });
      }

      const otpSnap = await otpRef.get();
      if (!otpSnap.exists) {
        return NextResponse.json({ ok: false, message: "No code found. Request a new one." }, { status: 400 });
      }

      const data = otpSnap.data() as any;
      if (Date.now() > Number(data.expiresAt)) {
        await otpRef.delete();
        return NextResponse.json({ ok: false, message: "Code expired. Request a new one." }, { status: 400 });
      }

      const attempts = Number(data.attempts || 0);
      if (attempts >= 5) {
        return NextResponse.json({ ok: false, message: "Too many attempts. Request a new code." }, { status: 429 });
      }

      const ok = hashOtp(submitted) === data.otpHash;

      if (!ok) {
        await otpRef.set({ attempts: attempts + 1 }, { merge: true });
        return NextResponse.json({ ok: false, message: "Incorrect code" }, { status: 400 });
      }

      // Trust this device
      await deviceRef.set(
        {
          trusted: true,
          createdAt: deviceSnap.exists ? deviceSnap.data()?.createdAt || Date.now() : Date.now(),
          lastUsedAt: Date.now(),
        },
        { merge: true }
      );

      await otpRef.delete();
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, message: "Invalid action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message || "Server error" },
      { status: 500 }
    );
  }
}