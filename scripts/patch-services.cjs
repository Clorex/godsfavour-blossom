const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

(async function main(){
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!b64) {
    console.log("SKIP: FIREBASE_SERVICE_ACCOUNT_BASE64 missing (cannot patch Firestore).");
    process.exit(0);
  }

  const serviceAccount = JSON.parse(Buffer.from(b64, "base64").toString("utf-8"));
  if (!getApps().length) initializeApp({ credential: cert(serviceAccount) });

  const db = getFirestore();
  const ref = db.collection("siteContent").doc("services");
  const snap = await ref.get();
  if (!snap.exists) {
    console.log("No siteContent/services doc yet. Skipping patch.");
    process.exit(0);
  }

  const data = snap.data() || {};
  const items = Array.isArray(data.items) ? data.items : [];

  const next = items.map((it) => {
    if (!it || !it.slug) return it;

    if (it.slug === "savings") {
      return {
        ...it,
        title: "Savings",
        summary: "Daily savings is our core. Weekly and monthly savings are also available.",
        body:
          "Savings is the foundation of what we do.\n\nDaily savings (our core):\n• You save small small every day as you work.\n• We record it for you as you save.\n\nWeekly savings:\n• You can also choose to save weekly if that is easier for you.\n\nMonthly savings:\n• You can save monthly based on what you agree with us.\n\nIf you want to withdraw, we follow the agreed plan with you.",
      };
    }

    if (it.slug === "osusu") {
      return {
        ...it,
        title: "Osusu / Asset Financing",
        body:
          "If you are new with us, we can place you from number 5 downward (e.g. number 5, 6, 7, 9 or 10) depending on the group.\n\nYou don’t have to pay everything at once — you will be saving small small from your daily savings as you work.\n\nPackages (examples):\n• ₦100,000 package: ₦350 daily for 10 months\n• ₦200,000 package: ₦750 daily for 10 months\n• ₦1,000,000 package: ₦3,500 daily for 10 months\n\n5-number plan (example):\n• ₦100,000 package: ₦750 daily for 5 months\n\nOther rules will be explained to you after you apply.",
      };
    }

    if (it.slug === "sales") {
      return {
        ...it,
        title: "Sales of Goods & Services",
        body:
          "This means you can save with us towards an item and we will purchase it for you.\n\nExample: you can save and buy AC, car, or any item you want — once the saving plan is completed.",
      };
    }

    return it;
  });

  await ref.set({ ...data, items: next, updatedAt: Date.now() }, { merge: true });
  console.log("DONE: Firestore services content patched.");
})().catch((e)=>{ console.error(e); process.exit(1); });
