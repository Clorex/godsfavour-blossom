const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

function deepFix(v) {
  if (typeof v === "string") {
    return v.replace(/7\.7\.5%/g, "7.5%").replace(/7\.7\.5/g, "7.5");
  }
  if (Array.isArray(v)) return v.map(deepFix);
  if (v && typeof v === "object") {
    const out = {};
    for (const [k, val] of Object.entries(v)) out[k] = deepFix(val);
    return out;
  }
  return v;
}

(async function main(){
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!b64) {
    console.log("SKIP Firestore fix: FIREBASE_SERVICE_ACCOUNT_BASE64 missing.");
    process.exit(0);
  }

  const sa = JSON.parse(Buffer.from(b64, "base64").toString("utf-8"));
  if (!getApps().length) initializeApp({ credential: cert(sa) });
  const db = getFirestore();

  const targets = [
    ["siteContent", "home"],
    ["siteContent", "about"],
    ["siteContent", "services"],
    ["siteSettings", "global"],
  ];

  for (const [col, id] of targets) {
    const ref = db.collection(col).doc(id);
    const snap = await ref.get();
    if (!snap.exists) continue;
    const fixed = deepFix(snap.data());
    fixed.updatedAt = Date.now();
    await ref.set(fixed, { merge: true });
    console.log(`Fixed: ${col}/${id}`);
  }

  console.log("DONE: Firestore content fixed (7.7.5 -> 7.5).");
})().catch((e)=>{ console.error(e); process.exit(1); });
