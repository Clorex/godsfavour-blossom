import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { uploadImageFile } from "@/lib/storage/cloudinary";
import { resend, RESEND_FROM } from "@/lib/email/resend";
import { cookies } from "next/headers";

export const runtime = "nodejs";

const COOKIE_NAME = process.env.FIREBASE_SESSION_COOKIE_NAME || "gb_session";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "itabitamiracle090@gmail.com";

async function getUserFromSession() {
  const session = (await cookies()).get(COOKIE_NAME)?.value;
  if (!session) return null;
  try {
    return await adminAuth.verifySessionCookie(session, true);
  } catch {
    return null;
  }
}

function pick(form: FormData, key: string) {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user?.uid) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const type = pick(form, "type"); // loan|overdraft|membership|savings|osusu|sales (job removed from focus)

    const allowed = ["loan", "overdraft", "membership", "savings", "osusu", "sales"];
    if (!allowed.includes(type)) {
      return NextResponse.json({ ok: false, message: "Invalid application type" }, { status: 400 });
    }

    const applicationId = crypto.randomUUID();
    const createdAt = Date.now();

    const applicantData: any = {
      fullName: pick(form, "fullName"),
      phone: pick(form, "phone"),
      email: pick(form, "email") || user.email || "",
      address: pick(form, "address"),
    };

    if (!applicantData.fullName) return NextResponse.json({ ok: false, message: "Full name is required" }, { status: 400 });
    if (!applicantData.phone) return NextResponse.json({ ok: false, message: "Phone number is required" }, { status: 400 });
    if (!applicantData.address) return NextResponse.json({ ok: false, message: "Address is required" }, { status: 400 });

    // Type-specific data
    if (type === "savings") {
      applicantData.savingsType = pick(form, "savingsType");
      applicantData.amount = pick(form, "amount");
      applicantData.note = pick(form, "note");
    }

    if (type === "osusu") {
      applicantData.packageId = pick(form, "packageId");
      applicantData.packageAmount = pick(form, "packageAmount");
      applicantData.dailyAmount = pick(form, "dailyAmount");
      applicantData.duration = pick(form, "duration");
      applicantData.planType = pick(form, "planType");
      applicantData.groupSize = pick(form, "groupSize");
      applicantData.preferredNumber = pick(form, "preferredNumber");
      applicantData.note = pick(form, "note");
    }

    if (type === "sales") {
      applicantData.itemName = pick(form, "itemName");
      applicantData.targetAmount = pick(form, "targetAmount");
      applicantData.savingsType = pick(form, "savingsType");
      applicantData.amount = pick(form, "amount");
      applicantData.note = pick(form, "note");
    }

    if (type === "loan") {
      // keep existing fields if present (older UI)
      applicantData.dob = pick(form, "dob");
      applicantData.stateOfOrigin = pick(form, "stateOfOrigin");
      applicantData.lga = pick(form, "lga");
      applicantData.stateOfResidence = pick(form, "stateOfResidence");
      applicantData.occupation = pick(form, "occupation");
      applicantData.amountRequested = pick(form, "amountRequested");
      applicantData.tenor = pick(form, "tenor");
    }

    if (type === "overdraft") {
      applicantData.dob = pick(form, "dob");
      applicantData.stateOfOrigin = pick(form, "stateOfOrigin");
      applicantData.lga = pick(form, "lga");
      applicantData.stateOfResidence = pick(form, "stateOfResidence");
      applicantData.occupation = pick(form, "occupation");
      applicantData.amountRequested = pick(form, "amountRequested");
      applicantData.reason = pick(form, "reason");
    }

    // Uploads
    const uploads: any = {};
    const folder = `godsfavourblossom/applications/${applicationId}`;

    const passport = form.get("passport");
    const idCard = form.get("idCard");
    const proof = form.get("proofOfAddress");
    const savingsCard = form.get("savingsCard");

    if (type === "loan") {
      if (!(passport instanceof File)) return NextResponse.json({ ok: false, message: "Passport is required" }, { status: 400 });
      if (!(idCard instanceof File)) return NextResponse.json({ ok: false, message: "ID card is required" }, { status: 400 });
      if (!(proof instanceof File)) return NextResponse.json({ ok: false, message: "Proof of address is required" }, { status: 400 });

      uploads.passport = (await uploadImageFile({ file: passport, folder, publicId: "passport" })).url;
      uploads.idCard = (await uploadImageFile({ file: idCard, folder, publicId: "idCard" })).url;
      uploads.proofOfAddress = (await uploadImageFile({ file: proof, folder, publicId: "proofOfAddress" })).url;
    }

    if (type === "overdraft") {
      if (!(passport instanceof File)) return NextResponse.json({ ok: false, message: "Passport is required" }, { status: 400 });
      if (!(idCard instanceof File)) return NextResponse.json({ ok: false, message: "ID card is required" }, { status: 400 });
      if (!(proof instanceof File)) return NextResponse.json({ ok: false, message: "Proof of address is required" }, { status: 400 });
      if (!(savingsCard instanceof File)) return NextResponse.json({ ok: false, message: "Savings card photo is required" }, { status: 400 });

      uploads.passport = (await uploadImageFile({ file: passport, folder, publicId: "passport" })).url;
      uploads.idCard = (await uploadImageFile({ file: idCard, folder, publicId: "idCard" })).url;
      uploads.proofOfAddress = (await uploadImageFile({ file: proof, folder, publicId: "proofOfAddress" })).url;
      uploads.savingsCard = (await uploadImageFile({ file: savingsCard, folder, publicId: "savingsCard" })).url;
    }

    const doc = {
      type,
      userId: user.uid,
      applicantEmail: applicantData.email,
      status: "submitted",
      adminNotes: [],
      createdAt,
      updatedAt: createdAt,
      applicantData,
      uploads,
    };

    await adminDb.collection("applications").doc(applicationId).set(doc);

    // Emails
    const subjectMap: any = {
      loan: "Loan Application Received",
      overdraft: "Overdraft Application Received",
      membership: "Membership/Shareholder Application Received",
      savings: "Savings Request Received",
      osusu: "Osusu Application Received",
      sales: "Sales of Goods & Services Request Received",
    };

    const subject = subjectMap[type] || "Request Received";

    const applicantTo = applicantData.email || user.email;
    if (process.env.RESEND_API_KEY && applicantTo) {
      await resend.emails.send({
        from: RESEND_FROM,
        to: applicantTo,
        subject,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6">
            <h2>We received your request</h2>
            <p>Your reference number is:</p>
            <p style="font-size:18px;font-weight:700">${applicationId}</p>
          </div>
        `,
      });

      await resend.emails.send({
        from: RESEND_FROM,
        to: ADMIN_EMAIL,
        subject: `[Admin] ${subject} - ${applicationId}`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6">
            <h2>New submission received</h2>
            <p><b>Type:</b> ${type}</p>
            <p><b>Reference:</b> ${applicationId}</p>
            <p><b>Name:</b> ${applicantData.fullName}</p>
            <p><b>Phone:</b> ${applicantData.phone}</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ ok: true, applicationId });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Failed" }, { status: 500 });
  }
}
