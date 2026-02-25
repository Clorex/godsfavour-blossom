const fs = require("fs");
const path = require("path");

const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

function cleanText(s) {
  if (!s) return s;
  return String(s)
    .replace(/physical office/ig, "")
    .replace(/we have been doing this for many years/ig, "")
    .replace(/many years/ig, "")
    .replace(/treat your details.*?\./ig, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

(async function main() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!b64) {
    console.log("SKIP Firestore patch: FIREBASE_SERVICE_ACCOUNT_BASE64 missing in env (load .env.local).");
    process.exit(0);
  }

  const serviceAccount = JSON.parse(Buffer.from(b64, "base64").toString("utf-8"));
  if (!getApps().length) initializeApp({ credential: cert(serviceAccount) });
  const db = getFirestore();

  // Ensure services items exist
  const required = [
    { slug: "savings", title: "Monthly Savings", summary: "Save steadily and build up.", body: "We encourage monthly savings. Save consistently and withdraw based on the agreed terms.", showApplyButton: false },
    { slug: "loan", title: "Friendly Loan", summary: "Loan support based on your savings history with us.", body: "Loan is available after you’ve been saving with us for at least 3 months. Interest is 5% monthly on the outstanding balance (as you pay, it reduces). After you apply, we will contact you and explain your breakdown clearly.", showApplyButton: true },
    { slug: "overdraft", title: "Overdraft", summary: "Short-term support based on your savings pattern.", body: "Overdraft is available after you’ve been saving with us for at least 2 months. Your overdraft is based on your saving pattern with us. We don’t collect times two of what you took. After you apply, we will contact you and explain your exact breakdown and repayment clearly.", showApplyButton: true },
    { slug: "osusu", title: "Osusu / Asset Financing", summary: "Group savings and asset support (where applicable).", body: "Osusu and asset financing support can be discussed based on the cooperative rules. After you indicate interest, we will explain the rules and requirements.", showApplyButton: false },
    { slug: "sales", title: "Sales of Goods & Services", summary: "Support services for members (where applicable).", body: "We also support members through sales of goods and services where applicable. Contact us for details.", showApplyButton: false },
    { slug: "estate", title: "Estate Management", summary: "Estate management support (where applicable).", body: "Estate management support is available based on the cooperative arrangement. Contact us for details.", showApplyButton: false },
  ];

  const servicesRef = db.collection("siteContent").doc("services");
  const servicesSnap = await servicesRef.get();
  const servicesData = servicesSnap.exists ? (servicesSnap.data() || {}) : {};

  const existing = Array.isArray(servicesData.items) ? servicesData.items : [];
  const bySlug = new Map(existing.filter(x => x && x.slug).map(x => [x.slug, x]));

  const merged = required.map(r => ({ ...r, ...(bySlug.get(r.slug) || {}) }));
  // keep extras too
  const extras = existing.filter(x => x && x.slug && !required.some(r => r.slug === x.slug));

  await servicesRef.set(
    {
      title: servicesData.title || "Services",
      subtitle: servicesData.subtitle || "Savings, friendly loan, overdraft, and other cooperative support.",
      items: merged.concat(extras),
      updatedAt: Date.now(),
    },
    { merge: true }
  );

  // Clean home/about wording if exists
  for (const key of ["home", "about"]) {
    const ref = db.collection("siteContent").doc(key);
    const snap = await ref.get();
    if (!snap.exists) continue;
    const data = snap.data() || {};
    const next = { ...data };

    for (const k of Object.keys(next)) {
      if (typeof next[k] === "string") next[k] = cleanText(next[k]);
    }

    await ref.set({ ...next, updatedAt: Date.now() }, { merge: true });
  }

  console.log("DONE: Firestore services seeded + copy cleaned.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
