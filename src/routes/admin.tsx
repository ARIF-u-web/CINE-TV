import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageLayout } from "@/components/cine/Layout";
import { auth, type User } from "@/lib/auth";
import { getSettings, saveSettings, resetSettings, type SiteSettings } from "@/lib/siteSettings";
import {
  Shield, Trash2, ShieldCheck, Users, Settings as SettingsIcon, Share2, Save, RotateCcw,
  Instagram, Facebook, Twitter, Youtube, Linkedin, MessageCircle, Send, Music2, Mail, Phone, MapPin,
} from "lucide-react";
import { User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Admin — CINE TV" },
    { name: "description", content: "Admin dashboard for CINE TV." },
    { name: "robots", content: "noindex,nofollow" },
  ]}),
  component: AdminPage,
});

type Tab = "overview" | "users" | "site" | "social" | "seo" | "features";

function AdminPage() {
  const navigate = useNavigate();
  const [me, setMe] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [settings, setSettings] = useState<SiteSettings>(getSettings());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    auth.init();
    const refresh = () => { setMe(auth.current()); setUsers(auth.listUsers()); };
    refresh(); setReady(true);
    setSettings(getSettings());
    window.addEventListener("cinetv:auth", refresh);
    return () => window.removeEventListener("cinetv:auth", refresh);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!me) navigate({ to: "/auth" });
    else if (me.role !== "admin") navigate({ to: "/account" });
  }, [ready, me, navigate]);

  if (!me || me.role !== "admin") return null;

  const counts = {
    total: users.length,
    admins: users.filter(u => u.role === "admin").length,
    today: users.filter(u => Date.now() - u.createdAt < 86_400_000).length,
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (!confirm("Reset all settings to defaults?")) return;
    resetSettings();
    setSettings(getSettings());
  };

  const tabs: { id: Tab; label: string; icon: typeof Shield }[] = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "users", label: "Users", icon: Users },
    { id: "site", label: "Site Info", icon: SettingsIcon },
    { id: "social", label: "Social Links", icon: Share2 },
    { id: "seo", label: "SEO", icon: SettingsIcon },
    { id: "features", label: "Features", icon: SettingsIcon },
  ];

  return (
    <PageLayout>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center gap-3">
          <Shield className="size-7 text-primary" />
          <h1 className="font-display text-4xl tracking-wide">Admin Dashboard</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Signed in as {me.name} ({me.email})</p>

        <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${tab === t.id ? "bg-primary text-primary-foreground" : "border border-border bg-secondary/60 text-muted-foreground hover:text-foreground"}`}>
              <t.icon className="size-4" />{t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Stat label="Total accounts" value={counts.total} />
            <Stat label="Admins" value={counts.admins} />
            <Stat label="New today" value={counts.today} />
          </div>
        )}

        {tab === "users" && (
          <div className="mt-6 rounded-2xl border border-border bg-card/40">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-display text-2xl tracking-wide">Users</h2>
            </div>
            <div className="divide-y divide-border">
              {users.map(u => (
                <div key={u.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-secondary"><UserIcon className="size-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm font-semibold">{u.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{u.email}</div>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${u.role === "admin" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>{u.role}</span>
                  {u.id !== me.id && (
                    <div className="flex gap-1">
                      <button onClick={() => auth.setRole(u.id, u.role === "admin" ? "user" : "admin")}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs hover:border-primary">
                        <ShieldCheck className="size-3" />{u.role === "admin" ? "Demote" : "Promote"}
                      </button>
                      <button onClick={() => { if (confirm(`Delete ${u.email}?`)) auth.deleteUser(u.id); }}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs hover:border-destructive hover:text-destructive">
                        <Trash2 className="size-3" />Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "site" && (
          <Section title="Site Information">
            <Field label="Site Name" icon={SettingsIcon} value={settings.siteName}
              onChange={v => setSettings({ ...settings, siteName: v })} />
            <Field label="Tagline" value={settings.tagline}
              onChange={v => setSettings({ ...settings, tagline: v })} />
            <Field label="Contact Email" icon={Mail} type="email" value={settings.contactEmail}
              onChange={v => setSettings({ ...settings, contactEmail: v })} />
            <Field label="Support Email" icon={Mail} type="email" value={settings.supportEmail}
              onChange={v => setSettings({ ...settings, supportEmail: v })} />
            <Field label="Phone" icon={Phone} value={settings.phone}
              onChange={v => setSettings({ ...settings, phone: v })} />
            <Field label="Address" icon={MapPin} value={settings.address}
              onChange={v => setSettings({ ...settings, address: v })} />
          </Section>
        )}

        {tab === "social" && (
          <Section title="Social Media Links">
            <Field label="Instagram" icon={Instagram} placeholder="https://instagram.com/yourname"
              value={settings.social.instagram} onChange={v => setSettings({ ...settings, social: { ...settings.social, instagram: v } })} />
            <Field label="TikTok" icon={Music2} placeholder="https://tiktok.com/@yourname"
              value={settings.social.tiktok} onChange={v => setSettings({ ...settings, social: { ...settings.social, tiktok: v } })} />
            <Field label="Facebook" icon={Facebook} placeholder="https://facebook.com/yourpage"
              value={settings.social.facebook} onChange={v => setSettings({ ...settings, social: { ...settings.social, facebook: v } })} />
            <Field label="Twitter / X" icon={Twitter} placeholder="https://x.com/yourname"
              value={settings.social.twitter} onChange={v => setSettings({ ...settings, social: { ...settings.social, twitter: v } })} />
            <Field label="YouTube" icon={Youtube} placeholder="https://youtube.com/@yourchannel"
              value={settings.social.youtube} onChange={v => setSettings({ ...settings, social: { ...settings.social, youtube: v } })} />
            <Field label="Discord" icon={MessageCircle} placeholder="https://discord.gg/invite"
              value={settings.social.discord} onChange={v => setSettings({ ...settings, social: { ...settings.social, discord: v } })} />
            <Field label="Telegram" icon={Send} placeholder="https://t.me/yourchannel"
              value={settings.social.telegram} onChange={v => setSettings({ ...settings, social: { ...settings.social, telegram: v } })} />
            <Field label="LinkedIn" icon={Linkedin} placeholder="https://linkedin.com/in/yourname"
              value={settings.social.linkedin} onChange={v => setSettings({ ...settings, social: { ...settings.social, linkedin: v } })} />
          </Section>
        )}

        {tab === "seo" && (
          <Section title="SEO Settings">
            <Field label="Meta Title" value={settings.seo.metaTitle}
              onChange={v => setSettings({ ...settings, seo: { ...settings.seo, metaTitle: v } })} />
            <Field label="Meta Description" value={settings.seo.metaDescription} multiline
              onChange={v => setSettings({ ...settings, seo: { ...settings.seo, metaDescription: v } })} />
            <Field label="Keywords (comma separated)" value={settings.seo.keywords}
              onChange={v => setSettings({ ...settings, seo: { ...settings.seo, keywords: v } })} />
          </Section>
        )}

        {tab === "features" && (
          <Section title="Feature Toggles">
            <Toggle label="Show cookie consent banner" checked={settings.features.showCookieBanner}
              onChange={v => setSettings({ ...settings, features: { ...settings.features, showCookieBanner: v } })} />
            <Toggle label="Allow new user signups" checked={settings.features.allowSignups}
              onChange={v => setSettings({ ...settings, features: { ...settings.features, allowSignups: v } })} />
            <Toggle label="Maintenance mode" checked={settings.features.maintenanceMode}
              onChange={v => setSettings({ ...settings, features: { ...settings.features, maintenanceMode: v } })} />
          </Section>
        )}

        {tab !== "overview" && tab !== "users" && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
              <Save className="size-4" />Save Changes
            </button>
            <button onClick={handleReset} className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-5 py-2 text-sm font-medium hover:border-destructive hover:text-destructive">
              <RotateCcw className="size-4" />Reset Defaults
            </button>
            {saved && <span className="text-sm text-primary">✓ Saved</span>}
          </div>
        )}

        <p className="mt-8 text-xs text-muted-foreground">
          Tip: profile editing lives in your <Link to="/account" className="text-primary">Account</Link> page.
        </p>
      </div>
    </PageLayout>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-4xl text-primary">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-2xl border border-border bg-card/40 p-5">
      <h2 className="font-display text-2xl tracking-wide">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, icon: Icon, type = "text", placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void;
  icon?: typeof Shield; type?: string; placeholder?: string; multiline?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="size-3.5" />}{label}
      </span>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
          className="rounded-lg border border-border bg-secondary/60 px-3 py-2 text-sm outline-none focus:border-primary" />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="h-10 rounded-lg border border-border bg-secondary/60 px-3 text-sm outline-none focus:border-primary" />
      )}
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-secondary/40 p-3 sm:col-span-2">
      <span className="text-sm font-medium">{label}</span>
      <button type="button" onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-primary" : "bg-muted"}`}>
        <span className={`absolute top-0.5 size-5 rounded-full bg-background transition ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </label>
  );
}
