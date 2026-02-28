import { requireAdminTrustedDevice } from "@/lib/auth/server";
import SettingsManager from "./settings-manager";
import AdminPhotoManager from "./admin-photo-manager";

export default async function AdminSettingsPage() {
  await requireAdminTrustedDevice("/admin/settings");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Update contacts, addresses, and admin photo.
        </p>
      </div>

      <SettingsManager />
      <AdminPhotoManager />
    </div>
  );
}
