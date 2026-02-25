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
      if (tab === "settings") {
        await putData("/api/admin/settings", settings);
      } else {
        const payload = tab === "home" ? home : tab === "about" ? about : services;
        await putData(`/api/admin/content/${tab}`, payload);
      }
      toast.success("Saved");
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const btn = (key: Tab, label: string) => (
    <button
      onClick={() => setTab(key)}
      className={`rounded-xl px-4 py-2 text-sm font-semibold border ${
        tab === key ? "bg-slate-100 text-slate-900 border-slate-200" : "bg-white hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {btn("home", "Home")}
        {btn("about", "About")}
        {btn("services", "Services")}
        {btn("settings", "Global Settings")}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">{loading ? "Loading..." : "Edit and click Save."}</div>
        <button
          onClick={save}
          disabled={loading}
          className="rounded-xl bg-[rgb(var(--g1))] text-white px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          Save changes
        </button>
      </div>

      {tab === "home" && home && (
        <div className="grid gap-3">
          <input className="rounded-xl border p-3" value={home.heroBadge} onChange={(e) => setHome({ ...home, heroBadge: e.target.value })} placeholder="Hero badge" />
          <input className="rounded-xl border p-3" value={home.heroTitle} onChange={(e) => setHome({ ...home, heroTitle: e.target.value })} placeholder="Hero title" />
          <input className="rounded-xl border p-3" value={home.heroSubtitle} onChange={(e) => setHome({ ...home, heroSubtitle: e.target.value })} placeholder="Hero subtitle" />

          <div className="grid gap-3 sm:grid-cols-3">
            {(home.steps || ["", "", ""]).slice(0, 3).map((v: string, idx: number) => (
              <input
                key={idx}
                className="rounded-xl border p-3"
                value={v}
                onChange={(e) => {
                  const next = [...(home.steps || ["", "", ""])];
                  next[idx] = e.target.value;
                  setHome({ ...home, steps: next });
                }}
                placeholder={`Step ${idx + 1}`}
              />
            ))}
          </div>

          <input className="rounded-xl border p-3" value={home.trustBadge} onChange={(e) => setHome({ ...home, trustBadge: e.target.value })} placeholder="Trust badge (short)" />
          <input className="rounded-xl border p-3" value={home.trustTitle} onChange={(e) => setHome({ ...home, trustTitle: e.target.value })} placeholder="Trust title" />
          <textarea className="rounded-xl border p-3 min-h-[120px]" value={home.trustBody} onChange={(e) => setHome({ ...home, trustBody: e.target.value })} placeholder="Trust body" />
        </div>
      )}

      {tab === "about" && about && (
        <div className="grid gap-3">
          <input className="rounded-xl border p-3" value={about.title} onChange={(e) => setAbout({ ...about, title: e.target.value })} placeholder="About title" />
          <textarea className="rounded-xl border p-3 min-h-[180px]" value={about.body} onChange={(e) => setAbout({ ...about, body: e.target.value })} placeholder="About write-up" />

          <input className="rounded-xl border p-3" value={about.trustTitle} onChange={(e) => setAbout({ ...about, trustTitle: e.target.value })} placeholder="Trust title" />
          <textarea className="rounded-xl border p-3 min-h-[120px]" value={about.trustBody} onChange={(e) => setAbout({ ...about, trustBody: e.target.value })} placeholder="Trust body" />

          <input className="rounded-xl border p-3" value={about.adminImageUrl} onChange={(e) => setAbout({ ...about, adminImageUrl: e.target.value })} placeholder="Admin image URL (e.g. /admin.png)" />
          <input className="rounded-xl border p-3" value={about.cacImageUrl} onChange={(e) => setAbout({ ...about, cacImageUrl: e.target.value })} placeholder="CAC image URL (e.g. /cac.png)" />

          <input className="rounded-xl border p-3" value={about.bePartTitle} onChange={(e) => setAbout({ ...about, bePartTitle: e.target.value })} placeholder="Be a part title" />
          <textarea className="rounded-xl border p-3 min-h-[120px]" value={about.bePartBody} onChange={(e) => setAbout({ ...about, bePartBody: e.target.value })} placeholder="Be a part body" />
        </div>
      )}

      {tab === "services" && services && (
        <div className="space-y-4">
          <div className="grid gap-3">
            <input className="rounded-xl border p-3" value={services.title} onChange={(e) => setServices({ ...services, title: e.target.value })} placeholder="Services title" />
            <input className="rounded-xl border p-3" value={services.subtitle} onChange={(e) => setServices({ ...services, subtitle: e.target.value })} placeholder="Services subtitle" />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Services list</div>
            <button
              className="rounded-xl border px-4 py-2 text-sm font-semibold bg-white hover:bg-slate-50"
              onClick={() =>
                setServices({
                  ...services,
                  items: [
                    ...(services.items || []),
                    { slug: "new-service", title: "New Service", summary: "Short summary", body: "Detailed description", showApplyButton: false },
                  ],
                })
              }
            >
              + Add service
            </button>
          </div>

          <div className="grid gap-4">
            {(services.items || []).map((it: any, idx: number) => (
              <div key={idx} className="rounded-2xl border bg-white p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm">Item #{idx + 1}</div>
                  <button
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

                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="rounded-xl border p-3" value={it.slug} onChange={(e) => {
                    const next = [...services.items]; next[idx] = { ...next[idx], slug: e.target.value }; setServices({ ...services, items: next });
                  }} placeholder="slug (loan/overdraft/jobs)" />

                  <input className="rounded-xl border p-3" value={it.title} onChange={(e) => {
                    const next = [...services.items]; next[idx] = { ...next[idx], title: e.target.value }; setServices({ ...services, items: next });
                  }} placeholder="title" />
                </div>

                <input className="rounded-xl border p-3" value={it.summary} onChange={(e) => {
                  const next = [...services.items]; next[idx] = { ...next[idx], summary: e.target.value }; setServices({ ...services, items: next });
                }} placeholder="short summary" />

                <textarea className="rounded-xl border p-3 min-h-[120px]" value={it.body} onChange={(e) => {
                  const next = [...services.items]; next[idx] = { ...next[idx], body: e.target.value }; setServices({ ...services, items: next });
                }} placeholder="detailed description" />

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(it.showApplyButton)}
                    onChange={(e) => {
                      const next = [...services.items]; next[idx] = { ...next[idx], showApplyButton: e.target.checked }; setServices({ ...services, items: next });
                    }}
                  />
                  Show “Apply” button for this service (Loan/Overdraft/Jobs)
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "settings" && settings && (
        <div className="grid gap-3">
          <input className="rounded-xl border p-3" value={settings.publicEmail} onChange={(e) => setSettings({ ...settings, publicEmail: e.target.value })} placeholder="Public contact email" />
          <input className="rounded-xl border p-3" value={settings.whatsapp} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} placeholder="WhatsApp number" />
          <input className="rounded-xl border p-3" value={settings.call} onChange={(e) => setSettings({ ...settings, call: e.target.value })} placeholder="Call number" />
          <textarea className="rounded-xl border p-3 min-h-[90px]" value={settings.headOfficeAddress} onChange={(e) => setSettings({ ...settings, headOfficeAddress: e.target.value })} placeholder="Head office address" />
          <textarea className="rounded-xl border p-3 min-h-[90px]" value={settings.branchOfficeAddress} onChange={(e) => setSettings({ ...settings, branchOfficeAddress: e.target.value })} placeholder="Branch office address" />
        </div>
      )}
    </div>
  );
}

