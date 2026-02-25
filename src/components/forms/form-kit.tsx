"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function useApplicationSubmit() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [ref, setRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setLoading(true);
    setError(null);
    setRef(null);

    try {
      const res = await fetch("/api/applications/submit", {
        method: "POST",
        body: formData,
      });

      if (res.status === 401) {
        router.push(`/auth/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.ok) throw new Error(j.message || "Submission failed");

      setRef(j.applicationId);
    } catch (e: any) {
      setError(e.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, ref, error };
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="text-sm font-semibold text-slate-900">{label}</div>
      {children}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const base =
    "w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(0,110,55,0.25)]";

  // better file input look
  const file =
    "file:mr-3 file:rounded-xl file:border-0 file:bg-[rgb(var(--g1))] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:opacity-95";

  return <input {...props} className={`${base} ${file} ${props.className || ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(0,110,55,0.25)] ${props.className || ""}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgba(0,110,55,0.25)] ${props.className || ""}`}
    />
  );
}
