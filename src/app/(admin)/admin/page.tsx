import { requireAdminTrustedDevice } from "@/lib/auth/server";

export default async function AdminDashboardPage() {
  await requireAdminTrustedDevice("/admin");
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <p className="text-sm text-muted-foreground mt-2">Welcome. Applications and content tools will appear here.</p>
    </div>
  );
}