const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

(async function main(){
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!b64) {
    console.log("SKIP: FIREBASE_SERVICE_ACCOUNT_BASE64 missing (cannot update Firestore).");
    process.exit(0);
  }

  const sa = JSON.parse(Buffer.from(b64, "base64").toString("utf-8"));
  if (!getApps().length) initializeApp({ credential: cert(sa) });

  const db = getFirestore();
  await db.collection("siteSettings").doc("global").set(
    { callAlt: "08127120909", updatedAt: Date.now() },
    { merge: true }
  );

  console.log("DONE: Firestore siteSettings/global updated with callAlt.");
})().catch((e)=>{ console.error(e); process.exit(1); });
