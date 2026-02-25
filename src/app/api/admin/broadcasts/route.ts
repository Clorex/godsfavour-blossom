import { NextResponse } from "next/server";
import crypto from "crypto";
import { assertAdminTrustedDevice } from "@/lib/auth/api";
import { adminDb } from "@/lib/firebase/admin";
import { resend, RESEND_FROM } from "@/lib/email/resend";

export const runtime = "nodejs";

type Audience =
  | "all_users"
  | "all_applicants"
  | "loan_applicants"
  | "overdraft_applicants"
  | "job_applicants"
  | "membership_applicants";

function toHtml(text: string) {
  const escaped = text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  return escaped.replace(/\n/g, "<br/>");
}

async function getRecipients(audience: Audience) {
  const emails = new Set<string>();

  if (audience === "all_users") {
    const snap = await adminDb.collection("users").limit(2000).get();
    snap.docs.forEach((d) => {
      const e = (d.data() as any)?.email;
      if (typeof e === "string" && e.includes("@")) emails.add(e.trim().toLowerCase());
    });
  } else {
    // applications-based audiences
    let query = adminDb.collection("applications").limit(3000);

    if (audience === "loan_applicants") query = adminDb.collection("applications").where("type", "==", "loan").limit(3000);
    if (audience === "overdraft_applicants") query = adminDb.collection("applications").where("type", "==", "overdraft").limit(3000);
    if (audience === "job_applicants") query = adminDb.collection("applications").where("type", "==", "job").limit(3000);
    if (audience === "membership_applicants") query = adminDb.collection("applications").where("type", "==", "membership").limit(3000);

    const snap = await query.get();
    snap.docs.forEach((d) => {
      const data = d.data() as any;
      const e = data.applicantEmail || data.applicantData?.email;
      if (typeof e === "string" && e.includes("@")) emails.add(e.trim().toLowerCase());
    });
  }

  return Array.from(emails);
}

async function sendBroadcastEmails(params: {
  subject: string;
  html: string;
  recipients: string[];
}) {
  if (!process.env.RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");
  if (!params.recipients.length) return { sentCount: 0 };

  // safe batching: send 1-by-1 (more reliable) with small concurrency
  const recipients = params.recipients;

  let sent = 0;
  for (const to of recipients) {
    try {
      await resend.emails.send({
        from: RESEND_FROM,
        to,
        subject: params.subject,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6">
            ${params.html}
            <hr style="margin:24px 0;border:none;border-top:1px solid #eee" />
            <div style="font-size:12px;color:#666">
              Godsfavour Blossom • You are receiving this because you registered/applied with us.
            </div>
          </div>
        `,
      });
      sent += 1;
    } catch {
      // continue (don’t fail entire broadcast)
    }
  }

  return { sentCount: sent };
}

export async function GET() {
  try {
    await assertAdminTrustedDevice();
    const snap = await adminDb.collection("broadcasts").orderBy("createdAt", "desc").limit(30).get();
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    return NextResponse.json({ ok: true, items });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await assertAdminTrustedDevice();

    const body = await req.json();
    const subject = (body.subject || "").trim();
    const message = (body.message || "").trim();
    const audience = (body.audience || "").trim() as Audience;

    if (!subject) return NextResponse.json({ ok: false, message: "Subject is required" }, { status: 400 });
    if (!message) return NextResponse.json({ ok: false, message: "Message is required" }, { status: 400 });

    const allowed: Audience[] = [
      "all_users",
      "all_applicants",
      "loan_applicants",
      "overdraft_applicants",
      "job_applicants",
      "membership_applicants",
    ];
    if (!allowed.includes(audience)) {
      return NextResponse.json({ ok: false, message: "Invalid audience" }, { status: 400 });
    }

    const broadcastId = crypto.randomUUID();
    const createdAt = Date.now();

    // Store draft first
    await adminDb.collection("broadcasts").doc(broadcastId).set({
      subject,
      message,
      audience,
      createdAt,
      status: "sending",
      sentCount: 0,
    });

    const recipients = await getRecipients(audience);
    const html = toHtml(message);

    const result = await sendBroadcastEmails({ subject, html, recipients });

    await adminDb.collection("broadcasts").doc(broadcastId).set(
      {
        status: "sent",
        sentAt: Date.now(),
        sentCount: result.sentCount,
        recipientCount: recipients.length,
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true, broadcastId, sentCount: result.sentCount, recipientCount: recipients.length });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Failed" }, { status: 400 });
  }
}
