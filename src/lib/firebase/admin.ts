import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getServiceAccount() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!b64) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_BASE64");

  const json = Buffer.from(b64, "base64").toString("utf-8");
  return JSON.parse(json);
}

const app =
  getApps().length > 0
    ? getApps()[0]!
    : initializeApp({
        credential: cert(getServiceAccount()),
      });

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);