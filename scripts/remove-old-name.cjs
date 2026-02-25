const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const oldNames = [
  "God’s Favour Farmer’s Multipurpose Co‑operative Society",
  "God's Favour Farmer's Multipurpose Co-operative Society"
];

function deepReplace(value) {
  if (typeof value === "string") {
    let out = value;
    for (const oldName of oldNames) out = out.split(oldName).join("");
    // clean up double spaces from removals
    out = out.replace(/\s{2,}/g, " ").trim();
    return out;
  }
  if (Array.isArray(value)) return value.map(deepReplace);
  if (value && typeof value === "object") {
    const next = {};
    for (const [k, v] of Object.entries(value)) next[k] = deepReplace(v);
    return next;
  }
  return value;
}

(async function main() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!b64) {
    console.log("SKIP: FIREBASE_SERVICE_ACCOUNT_BASE64 missing. (DB content not updated)");
    process.exit(0);
  }

  const json = Buffer.from(b64, "base64").toString("utf-8");
  const serviceAccount = JSON.parse(json);

  if (!getApps().length) {
    initializeApp({ credential: cert(serviceAccount) });
  }

  const db = getFirestore();

  const targets = [
    { col: "siteContent", id: "home" },
    { col: "siteContent", id: "about" },
    { col: "siteContent", id: "services" },
    { col: "siteSettings", id: "global" },
  ];

  for (const t of targets) {
    const ref = db.collection(t.col).doc(t.id);
    const snap = await ref.get();
    if (!snap.exists) continue;

    const data = snap.data();
    const cleaned = deepReplace(data);
    await ref.set(cleaned, { merge: false });
    console.log(`Updated Firestore: ${t.col}/${t.id}`);
  }

  console.log("DONE: Old name removed from Firestore content.");
})().catch((e) => {
  console.error("Firestore update failed:", e);
  process.exit(1);
});
