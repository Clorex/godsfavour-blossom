import { requireAdminTrustedDevice } from "@/lib/auth/server";
import ContentManager from "./content-manager";

export default async function AdminContentPage() {
  await requireAdminTrustedDevice("/admin/content");
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Website Content</h1>
      <p className="text-sm text-muted-foreground mt-2">
        Edit anything on the website here (text and image URLs). No coding.
      </p>
      <div className="mt-6">
        <ContentManager />
      </div>
    </div>
  );
}
