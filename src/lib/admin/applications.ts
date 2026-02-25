import { adminDb } from "@/lib/firebase/admin";

export type AdminApplicationListItem = {
  id: string;
  type: string;
  status: string;
  createdAt: number;
  updatedAt?: number;
  applicantEmail?: string;
  applicantData?: any;
};

export async function listApplications(params: {
  type?: string;
  status?: string;
  q?: string;
  limit?: number;
}) {
  const limit = Math.min(Math.max(params.limit || 200, 1), 300);

  const snap = await adminDb
    .collection("applications")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  const raw: AdminApplicationListItem[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

  const type = (params.type || "").trim();
  const status = (params.status || "").trim();
  const q = (params.q || "").trim().toLowerCase();

  let filtered = raw;

  if (type) filtered = filtered.filter((x) => (x.type || "").toLowerCase() === type.toLowerCase());
  if (status) filtered = filtered.filter((x) => (x.status || "").toLowerCase() === status.toLowerCase());

  if (q) {
    filtered = filtered.filter((x) => {
      const name = (x.applicantData?.fullName || "").toLowerCase();
      const phone = (x.applicantData?.phone || "").toLowerCase();
      const email = (x.applicantEmail || x.applicantData?.email || "").toLowerCase();
      return name.includes(q) || phone.includes(q) || email.includes(q) || x.id.toLowerCase().includes(q);
    });
  }

  return filtered;
}

export async function getApplication(id: string) {
  const snap = await adminDb.collection("applications").doc(id).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...(snap.data() as any) };
}
