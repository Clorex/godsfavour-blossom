import { requireAdminTrustedDevice } from "@/lib/auth/server";
import SettingsManager from "./settings-manager";

export default async function AdminSettingsPage() {
  await requireAdminTrustedDevice("/admin/settings");
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Settings</h1>
      <p className="text-sm text-muted-foreground mt-2">
        Edit public contact info and office addresses. (Admin login email remains in env.)
      </p>
      <div className="mt-6">
        <SettingsManager />
      </div>
    </div>
  );
}
