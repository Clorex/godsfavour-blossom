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
  const jar = await cookies();
  const session = jar.get(COOKIE_NAME)?.value;
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
    if (!user?.uid) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });

    const form = await req.formData();
    const type = pick(form, "type");

    const allowed = ["loan", "overdraft", "membership", "savings", "osusu", "sales"];
    if (!allowed.includes(type)) {
      return NextResponse.json({ ok: false, message: "Invalid application type" }, { status: 400 });
    }

    const applicationId = crypto.randomUUID();
    const createdAt = Date.now();
    const folder = `godsfavourblossom/applications/${applicationId}`;

    const applicantData: any = {
      fullName: pick(form, "fullName"),
      phone: pick(form, "phone"),
      email: pick(form, "email") || user.email || "",
      address: pick(form, "address"),
    };

    if (!applicantData.fullName) return NextResponse.json({ ok: false, message: "Full name is required" }, { status: 400 });
    if (!applicantData.phone) return NextResponse.json({ ok: false, message: "Phone number is required" }, { status: 400 });
    if (!applicantData.address) return NextResponse.json({ ok: false, message: "Address is required" }, { status: 400 });

    // Extra fields by type
    if (type === "loan") {
      applicantData.computerNumber = pick(form, "computerNumber");
      applicantData.dateOfMembership = pick(form, "dateOfMembership");
      applicantData.sex = pick(form, "sex");
      applicantData.age = pick(form, "age");
      applicantData.businessActivities = pick(form, "businessActivities");
      applicantData.amountRequested = pick(form, "amountRequested");
      applicantData.lastLoan = pick(form, "lastLoan");
      applicantData.currentLoanDate = pick(form, "currentLoanDate");
      applicantData.completionDate = pick(form, "completionDate");
      applicantData.collateral = pick(form, "collateral");

      if (!applicantData.computerNumber) {
        return NextResponse.json({ ok: false, message: "Computer number is required" }, { status: 400 });
      }
      if (!applicantData.collateral) {
        return NextResponse.json({ ok: false, message: "Collateral is required" }, { status: 400 });
      }
    }

    if (type === "overdraft") {
      applicantData.amountRequested = pick(form, "amountRequested");
      applicantData.reason = pick(form, "reason");
    }

    if (type === "savings") {
      applicantData.savingsType = pick(form, "savingsType");
      applicantData.amount = pick(form, "amount");
      applicantData.note = pick(form, "note");
    }

    if (type === "osusu") {
      applicantData.osusuPlan = pick(form, "osusuPlan");
      applicantData.paymentMode = pick(form, "paymentMode");
      applicantData.packageId = pick(form, "packageId");
      applicantData.packageLabel = pick(form, "packageLabel");
      applicantData.packageAmount = pick(form, "packageAmount");
      applicantData.dailyPayment = pick(form, "dailyPayment");
      applicantData.weeklyPayment = pick(form, "weeklyPayment");
      applicantData.monthlyPayment = pick(form, "monthlyPayment");
      applicantData.totalPayment = pick(form, "totalPayment");
      applicantData.amountPerMode = pick(form, "amountPerMode");
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

    // Uploads
    const uploads: any = {};

    const passport = form.get("passport");
    const idCard = form.get("idCard");
    const proof = form.get("proofOfAddress");

    // overdraft extra
    const savingsCard = form.get("savingsCard");

    // loan extra
    const guarantorPassport1 = form.get("guarantorPassport1");
    const guarantorPassport2 = form.get("guarantorPassport2");

    if (type === "loan") {
      if (!(passport instanceof File)) return NextResponse.json({ ok: false, message: "Borrower passport is required" }, { status: 400 });
      if (!(idCard instanceof File)) return NextResponse.json({ ok: false, message: "ID card is required" }, { status: 400 });
      if (!(proof instanceof File)) return NextResponse.json({ ok: false, message: "Proof of address is required" }, { status: 400 });
      if (!(guarantorPassport1 instanceof File)) return NextResponse.json({ ok: false, message: "Guarantor 1 passport is required" }, { status: 400 });
      if (!(guarantorPassport2 instanceof File)) return NextResponse.json({ ok: false, message: "Guarantor 2 passport is required" }, { status: 400 });

      uploads.passport = (await uploadImageFile({ file: passport, folder, publicId: "borrowerPassport" })).url;
      uploads.idCard = (await uploadImageFile({ file: idCard, folder, publicId: "idCard" })).url;
      uploads.proofOfAddress = (await uploadImageFile({ file: proof, folder, publicId: "proofOfAddress" })).url;
      uploads.guarantorPassport1 = (await uploadImageFile({ file: guarantorPassport1, folder, publicId: "guarantorPassport1" })).url;
      uploads.guarantorPassport2 = (await uploadImageFile({ file: guarantorPassport2, folder, publicId: "guarantorPassport2" })).url;
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

    const subjectMap: any = {
      loan: "Loan Application Received",
      overdraft: "Overdraft Application Received",
      membership: "Membership/Shareholder Application Received",
      savings: "Savings Request Received",
      osusu: "Osusu Application Received",
      sales: "Sales Request Received",
    };

    const subject = subjectMap[type] || "Request Received";

    if (process.env.RESEND_API_KEY) {
      const to = applicantData.email || user.email;
      if (to) {
        await resend.emails.send({
          from: RESEND_FROM,
          to,
          subject,
          html: `<div style="font-family:Arial,sans-serif;line-height:1.6"><h2>We received your request</h2><p>Reference: <b>${applicationId}</b></p></div>`,
        });
      }

      await resend.emails.send({
        from: RESEND_FROM,
        to: ADMIN_EMAIL,
        subject: `[Admin] ${subject} - ${applicationId}`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6"><p><b>Type:</b> ${type}</p><p><b>Ref:</b> ${applicationId}</p><p><b>Name:</b> ${applicantData.fullName}</p><p><b>Phone:</b> ${applicantData.phone}</p></div>`,
      });
    }

    return NextResponse.json({ ok: true, applicationId });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Failed" }, { status: 500 });
  }
}
