import { requireAdminTrustedDevice } from "@/lib/auth/server";
import BroadcastManager from "./broadcast-manager";

export default async function AdminMessagesPage() {
  await requireAdminTrustedDevice("/admin/messages");
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Messages (Bulk Email)</h1>
      <p className="text-sm text-muted-foreground mt-2">
        Send bulk emails to users/customers (e.g. Happy New Year).
      </p>
      <div className="mt-6">
        <BroadcastManager />
      </div>
    </div>
  );
}
