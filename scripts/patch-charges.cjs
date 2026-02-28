const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

function fixString(s) {
  return String(s)
    .split("Charges (loan/overdraft):").join("Charges:")
    .split("• 3% insurance").join("• 5% insurance")
    .split("3% insurance").join("5% insurance")
    .split("Total: 6.6%.").join("Total: 8.6%.")
    .split("Total: 6.6%").join("Total: 8.6%");
}

(async function main(){
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!b64) {
    console.log("SKIP: FIREBASE_SERVICE_ACCOUNT_BASE64 missing. Firestore not patched.");
    process.exit(0);
  }

  const sa = JSON.parse(Buffer.from(b64, "base64").toString("utf-8"));
  if (!getApps().length) initializeApp({ credential: cert(sa) });
  const db = getFirestore();

  const ref = db.collection("siteContent").doc("services");
  const snap = await ref.get();
  if (!snap.exists) {
    console.log("No siteContent/services doc found. SKIP.");
    process.exit(0);
  }

  const data = snap.data() || {};
  const items = Array.isArray(data.items) ? data.items : [];

  const nextItems = items.map((it) => {
    if (!it || !it.slug) return it;
    if (it.slug !== "loan" && it.slug !== "overdraft") return it;

    const body = it.body ? fixString(it.body) : it.body;
    return { ...it, body };
  });

  await ref.set({ ...data, items: nextItems, updatedAt: Date.now() }, { merge: true });
  console.log("DONE: Firestore patched (loan + overdraft charges).");
})().catch((e)=>{ console.error(e); process.exit(1); });
