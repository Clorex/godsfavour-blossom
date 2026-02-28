"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminPhotoManager() {
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadCurrent() {
    try {
      const res = await fetch("/api/admin/content/about", { method: "GET" });
      const j = await res.json();
      if (res.ok && j.ok) setCurrentUrl(j.data.adminImageUrl || "");
    } catch {}
  }

  async function upload() {
    if (!file) {
      toast.error("Please choose an image first");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);

      const res = await fetch("/api/admin/admin-photo", {
        method: "POST",
        body: fd,
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.ok) throw new Error(j.message || "Upload failed");

      toast.success("Admin photo updated");
      setCurrentUrl(j.url);
      setFile(null);
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCurrent();
  }, []);

  return (
    <div className="rounded-3xl border p-6 bg-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">Admin Photo</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Upload a new admin image. It will update on the About page immediately.
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[260px_1fr] lg:items-start">
        <div className="rounded-3xl border bg-slate-50 p-3">
          <div className="text-xs text-muted-foreground mb-2">Preview</div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-white border">
            {currentUrl ? (
              <img src={currentUrl} alt="Admin" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full grid place-items-center text-sm text-muted-foreground">
                No image yet
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border bg-white p-5">
            <div className="text-sm font-semibold">Choose image</div>
            <input
              className="mt-3 w-full rounded-2xl border bg-white px-4 py-3 text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-[rgb(var(--g1))] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div className="mt-2 text-xs text-muted-foreground">
              Recommended: clear portrait, good lighting. Max 5MB.
            </div>
          </div>

          <button
            onClick={upload}
            disabled={loading}
            className="rounded-2xl bg-[rgb(var(--g1))] text-white px-5 py-3 text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Upload & Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
