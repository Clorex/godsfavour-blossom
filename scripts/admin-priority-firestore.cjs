const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

(async function main(){
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!b64) {
    console.log("SKIP: FIREBASE_SERVICE_ACCOUNT_BASE64 missing (cannot patch Firestore).");
    process.exit(0);
  }

  const sa = JSON.parse(Buffer.from(b64, "base64").toString("utf-8"));
  if (!getApps().length) initializeApp({ credential: cert(sa) });
  const db = getFirestore();

  await db.collection("siteSettings").doc("global").set({
    whatsapp: "07050966619",
    call: "07061761111",
    callAlt: "08127120909",
    updatedAt: Date.now(),
  }, { merge: true });

  await db.collection("siteContent").doc("home").set({
    heroBadge: "A NEW DAWN",
    heroSubtitle: "Savings • Friendly Loan • Overdraft",
    trustTitle: "Your money is safe with us",
    updatedAt: Date.now(),
  }, { merge: true });

  console.log("DONE: Firestore updated (settings + home).");
})().catch((e)=>{ console.error(e); process.exit(1); });
