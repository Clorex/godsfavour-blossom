const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

function hasAny(s, arr){ return arr.some(x => (s||"").toLowerCase().includes(x.toLowerCase())); }

(async function main(){
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!b64) {
    console.log("SKIP Firestore patch: FIREBASE_SERVICE_ACCOUNT_BASE64 missing.");
    process.exit(0);
  }

  const serviceAccount = JSON.parse(Buffer.from(b64, "base64").toString("utf-8"));
  if (!getApps().length) initializeApp({ credential: cert(serviceAccount) });
  const db = getFirestore();

  // Patch services copy safely (only if it contains CV/placeholder-ish wording)
  const servicesRef = db.collection("siteContent").doc("services");
  const servicesSnap = await servicesRef.get();
  if (servicesSnap.exists) {
    const data = servicesSnap.data() || {};
    const items = Array.isArray(data.items) ? data.items : [];
    const next = items.map((it) => {
      if (!it || !it.slug) return it;

      if (it.slug === "jobs") {
        const s = (it.summary || "") + " " + (it.body || "");
        if (hasAny(s, ["cv", "no cv required"])) {
          return {
            ...it,
            summary: "Apply for available roles.",
            body: (it.body || "").replace(/no\s*cv\s*required\.?/ig, "").trim(),
          };
        }
      }

      if (it.slug === "overdraft") {
        const s = (it.body || "");
        if (hasAny(s, ["placeholder", "short-term support", "clear next steps"])) {
          return {
            ...it,
            summary: "Available after 2 months with us.",
            body: "Overdraft is available after you’ve been saving with us for at least 2 months. Your overdraft is based on your saving pattern with us. We don’t collect times two of what you took. After you apply, we will contact you and explain your exact breakdown and repayment clearly.",
          };
        }
      }

      if (it.slug === "loan") {
        const s = (it.body || "");
        if (hasAny(s, ["placeholder", "simple requirements"])) {
          return {
            ...it,
            summary: "Available after 3 months with us.",
            body: "Loan is available after you’ve been saving with us for at least 3 months. We give loan based on your saving history with us. Interest is 5% monthly on the outstanding balance (as you pay, it reduces). After you apply, we will contact you and explain your breakdown clearly.",
          };
        }
      }

      return it;
    });

    await servicesRef.set({ ...data, items: next, updatedAt: Date.now() }, { merge: true });
    console.log("Patched Firestore: siteContent/services (safe patch).");
  }
})().catch((e)=>{ console.error(e); process.exit(1); });
