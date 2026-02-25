import { requireAdminTrustedDevice } from "@/lib/auth/server";
import ApplicationsManager from "./applications-manager";

export default async function AdminApplicationsPage() {
  await requireAdminTrustedDevice("/admin/applications");
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Applications</h1>
      <p className="text-sm text-muted-foreground mt-2">
        View submissions, review details, approve/reject, and send notes.
      </p>
      <div className="mt-6">
        <ApplicationsManager />
      </div>
    </div>
  );
}
