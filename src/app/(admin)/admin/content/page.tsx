import { requireAdminTrustedDevice } from "@/lib/auth/server";
import ContentManager from "./content-manager";

export default async function AdminContentPage() {
  await requireAdminTrustedDevice("/admin/content");
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Content Editor</h1>
      <p className="text-sm text-muted-foreground mt-2">
        Edit website text and links here. Images will be uploaded in the next batch.
      </p>
      <div className="mt-6">
        <ContentManager />
      </div>
    </div>
  );
}
