"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type Tab = "home" | "about" | "services" | "settings";

async function getData(url: string) {
  const res = await fetch(url);
  const j = await res.json();
  if (!res.ok || !j.ok) throw new Error(j.message || "Failed to load");
  return j.data;
}

async function putData(url: string, data: any) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j.ok) throw new Error(j.message || "Failed to save");
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <div className="text-sm font-semibold">{label}</div>
      <input className="w-full rounded-2xl border px-4 py-3 text-sm" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function TextArea({ label, value, onChange, rows=6 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="space-y-1.5">
      <div className="text-sm font-semibold">{label}</div>
      <textarea className="w-full rounded-2xl border px-4 py-3 text-sm" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export default function ContentManager() {
  const [tab, setTab] = useState<Tab>("home");
  const [loading, setLoading] = useState(false);

  const [home, setHome] = useState<any>(null);
  const [about, setAbout] = useState<any>(null);
  const [services, setServices] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);

  async function load() {
    setLoading(true);
    try {
      if (tab === "settings") {
        setSettings(await getData("/api/admin/settings"));
      } else {
        const data = await getData(`/api/admin/content/${tab}`);
        if (tab === "home") setHome(data);
        if (tab === "about") setAbout(data);
        if (tab === "services") setServices(data);
      }
    } catch (e: any) {
      toast.error(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setLoading(true);
    try {
      if (tab === "settings") await putData("/api/admin/settings", settings);
      if (tab === "home") await putData("/api/admin/content/home", home);
      if (tab === "about") await putData("/api/admin/content/about", about);
      if (tab === "services") await putData("/api/admin/content/services", services);
      toast.success("Saved");
    } catch (e: any) {
      toast.error(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [tab]);

  const tabBtn = (k: Tab, label: string) => (
    <button
      onClick={() => setTab(k)}
      className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${
        tab === k ? "bg-slate-100" : "bg-white hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {tabBtn("home", "Home")}
        {tabBtn("about", "About")}
        {tabBtn("services", "Services")}
        {tabBtn("settings", "Settings")}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">{loading ? "Loading..." : "Edit and click Save."}</div>
        <button
          onClick={save}
          disabled={loading}
          className="rounded-2xl bg-[rgb(var(--g1))] text-white px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          Save changes
        </button>
      </div>

      {tab === "home" && home && (
        <div className="grid gap-4">
          <TextInput label="Hero badge" value={home.heroBadge || ""} onChange={(v) => setHome({ ...home, heroBadge: v })} />
          <TextInput label="Hero title" value={home.heroTitle || ""} onChange={(v) => setHome({ ...home, heroTitle: v })} />
          <TextInput label="Hero subtitle" value={home.heroSubtitle || ""} onChange={(v) => setHome({ ...home, heroSubtitle: v })} />

          <div className="grid gap-3 md:grid-cols-3">
            {[0,1,2].map((i) => (
              <TextInput
                key={i}
                label={`Step ${i+1}`}
                value={(home.steps?.[i] || "")}
                onChange={(v) => {
                  const steps = Array.isArray(home.steps) ? [...home.steps] : ["","",""];
                  steps[i] = v;
                  setHome({ ...home, steps });
                }}
              />
            ))}
          </div>

          <TextInput label="Trust title" value={home.trustTitle || ""} onChange={(v) => setHome({ ...home, trustTitle: v })} />
          <TextArea label="Trust body" value={home.trustBody || ""} onChange={(v) => setHome({ ...home, trustBody: v })} rows={6} />

          <div className="rounded-3xl border p-5 bg-slate-50">
            <div className="text-sm font-semibold">Image URLs (optional)</div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <TextInput label="Hero image URL" value={home.heroImageUrl || ""} onChange={(v) => setHome({ ...home, heroImageUrl: v })} />
              <TextInput label="Trust image URL" value={home.trustImageUrl || ""} onChange={(v) => setHome({ ...home, trustImageUrl: v })} />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              You can use /hero.jpeg etc (public folder) or Cloudinary URL later.
            </div>
          </div>
        </div>
      )}

      {tab === "about" && about && (
        <div className="grid gap-4">
          <TextInput label="About title" value={about.title || ""} onChange={(v) => setAbout({ ...about, title: v })} />
          <TextArea label="About body" value={about.body || ""} onChange={(v) => setAbout({ ...about, body: v })} rows={10} />
          <TextInput label="Trust title" value={about.trustTitle || ""} onChange={(v) => setAbout({ ...about, trustTitle: v })} />
          <TextArea label="Trust body" value={about.trustBody || ""} onChange={(v) => setAbout({ ...about, trustBody: v })} rows={6} />
          <TextInput label="Membership title" value={about.bePartTitle || ""} onChange={(v) => setAbout({ ...about, bePartTitle: v })} />
          <TextArea label="Membership body" value={about.bePartBody || ""} onChange={(v) => setAbout({ ...about, bePartBody: v })} rows={6} />

          <div className="rounded-3xl border p-5 bg-slate-50">
            <div className="text-sm font-semibold">Images</div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <TextInput label="Admin photo URL" value={about.adminImageUrl || ""} onChange={(v) => setAbout({ ...about, adminImageUrl: v })} />
              <TextInput label="CAC image URL" value={about.cacImageUrl || ""} onChange={(v) => setAbout({ ...about, cacImageUrl: v })} />
              <TextInput label="Membership image URL" value={about.joinImageUrl || ""} onChange={(v) => setAbout({ ...about, joinImageUrl: v })} />
            </div>
          </div>
        </div>
      )}

      {tab === "services" && services && (
        <div className="space-y-4">
          <TextInput label="Services title" value={services.title || ""} onChange={(v) => setServices({ ...services, title: v })} />
          <TextInput label="Services subtitle" value={services.subtitle || ""} onChange={(v) => setServices({ ...services, subtitle: v })} />

          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Service items</div>
            <button
              className="rounded-2xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              onClick={() =>
                setServices({
                  ...services,
                  items: [
                    ...(services.items || []),
                    { slug: "new", title: "New Service", summary: "", body: "", showApplyButton: false, imageUrl: "" },
                  ],
                })
              }
              type="button"
            >
              + Add service
            </button>
          </div>

          <div className="grid gap-4">
            {(services.items || []).map((it: any, idx: number) => (
              <div key={idx} className="rounded-3xl border p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-sm">#{idx + 1}</div>
                  <button
                    type="button"
                    className="text-sm font-semibold text-red-600"
                    onClick={() => {
                      const next = [...services.items];
                      next.splice(idx, 1);
                      setServices({ ...services, items: next });
                    }}
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <TextInput label="Slug (loan/overdraft/savings/osusu/sales)" value={it.slug || ""} onChange={(v) => {
                    const next = [...services.items]; next[idx] = { ...next[idx], slug: v }; setServices({ ...services, items: next });
                  }} />
                  <TextInput label="Title" value={it.title || ""} onChange={(v) => {
                    const next = [...services.items]; next[idx] = { ...next[idx], title: v }; setServices({ ...services, items: next });
                  }} />
                </div>

                <div className="mt-3">
                  <TextInput label="Summary" value={it.summary || ""} onChange={(v) => {
                    const next = [...services.items]; next[idx] = { ...next[idx], summary: v }; setServices({ ...services, items: next });
                  }} />
                </div>

                <div className="mt-3">
                  <TextArea label="Body (full rules/details)" value={it.body || ""} onChange={(v) => {
                    const next = [...services.items]; next[idx] = { ...next[idx], body: v }; setServices({ ...services, items: next });
                  }} rows={10} />
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <TextInput label="Image URL (optional)" value={it.imageUrl || ""} onChange={(v) => {
                    const next = [...services.items]; next[idx] = { ...next[idx], imageUrl: v }; setServices({ ...services, items: next });
                  }} />
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input
                      type="checkbox"
                      checked={Boolean(it.showApplyButton)}
                      onChange={(e) => {
                        const next = [...services.items]; next[idx] = { ...next[idx], showApplyButton: e.target.checked }; setServices({ ...services, items: next });
                      }}
                    />
                    Show Apply button
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "settings" && settings && (
        <div className="grid gap-4">
          <TextInput label="Public email" value={settings.publicEmail || ""} onChange={(v) => setSettings({ ...settings, publicEmail: v })} />
          <TextInput label="WhatsApp" value={settings.whatsapp || ""} onChange={(v) => setSettings({ ...settings, whatsapp: v })} />
          <TextInput label="Call line" value={settings.call || ""} onChange={(v) => setSettings({ ...settings, call: v })} />
          <TextInput label="Call line (2)" value={settings.callAlt || ""} onChange={(v) => setSettings({ ...settings, callAlt: v })} />
          <TextArea label="Head office address" value={settings.headOfficeAddress || ""} onChange={(v) => setSettings({ ...settings, headOfficeAddress: v })} rows={3} />
          <TextArea label="Branch office address" value={settings.branchOfficeAddress || ""} onChange={(v) => setSettings({ ...settings, branchOfficeAddress: v })} rows={3} />
        </div>
      )}
    </div>
  );
}
