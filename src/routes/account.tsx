import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageLayout } from "@/components/cine/Layout";
import { MediaGrid } from "@/components/cine/MediaCard";
import { watchlist, favorites, profile, prefs, type SavedItem, type Profile, type Prefs } from "@/lib/watchlist";
import { User, Heart, Bookmark, Settings as SettingsIcon, Trash2, Save } from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [
    { title: "My Account — CINE TV" },
    { name: "description", content: "Manage your CINE TV profile, watchlist, favorites and preferences." },
  ]}),
  component: AccountPage,
});

function AccountPage() {
  const [tab, setTab] = useState<"profile" | "watchlist" | "favorites" | "settings">("profile");
  const [wl, setWl] = useState<SavedItem[]>([]);
  const [fav, setFav] = useState<SavedItem[]>([]);
  const [p, setP] = useState<Profile>({ name: "", email: "", avatar: "", bio: "" });
  const [pr, setPr] = useState<Prefs>({ adultContent: false, autoplay: true, emailUpdates: false, region: "US", language: "en" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const refresh = () => { setWl(watchlist.all()); setFav(favorites.all()); setP(profile.get()); setPr(prefs.get()); };
    refresh();
    window.addEventListener("cinetv:storage", refresh);
    return () => window.removeEventListener("cinetv:storage", refresh);
  }, []);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "watchlist", label: `Watchlist (${wl.length})`, icon: Bookmark },
    { id: "favorites", label: `Favorites (${fav.length})`, icon: Heart },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ] as const;

  const saveProfile = () => { profile.set(p); setSaved(true); setTimeout(() => setSaved(false), 1500); };
  const savePrefs = () => { prefs.set(pr); setSaved(true); setTimeout(() => setSaved(false), 1500); };

  return (
    <PageLayout>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full border border-border bg-secondary/60">
            {p.avatar ? <img src={p.avatar} alt="" className="size-16 rounded-full object-cover" /> : <User className="size-7 text-muted-foreground" />}
          </div>
          <div>
            <h1 className="font-display text-4xl tracking-wide">{p.name || "Guest Viewer"}</h1>
            <p className="text-sm text-muted-foreground">{p.email || "Local profile — saved on this device"}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-border">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <t.icon className="size-4" />{t.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "profile" && (
            <div className="max-w-xl space-y-4">
              <Field label="Display name"><input value={p.name} onChange={e => setP({ ...p, name: e.target.value })} className={input} placeholder="Your name" /></Field>
              <Field label="Email"><input value={p.email} onChange={e => setP({ ...p, email: e.target.value })} className={input} placeholder="you@example.com" /></Field>
              <Field label="Avatar URL"><input value={p.avatar} onChange={e => setP({ ...p, avatar: e.target.value })} className={input} placeholder="https://..." /></Field>
              <Field label="Bio"><textarea value={p.bio} onChange={e => setP({ ...p, bio: e.target.value })} rows={4} className={`${input} resize-none`} placeholder="A few words about your movie taste..." /></Field>
              <button onClick={saveProfile} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
                <Save className="size-4" />{saved ? "Saved" : "Save profile"}
              </button>
            </div>
          )}

          {tab === "watchlist" && (
            <SavedList items={wl} empty="Your watchlist is empty. Browse titles and tap Add to Watchlist." onClear={() => watchlist.clear()} />
          )}
          {tab === "favorites" && (
            <SavedList items={fav} empty="No favorites yet. Mark titles you love with the heart icon." onClear={() => favorites.clear()} />
          )}

          {tab === "settings" && (
            <div className="max-w-xl space-y-4">
              <Toggle label="Allow adult content" checked={pr.adultContent} onChange={v => setPr({ ...pr, adultContent: v })} />
              <Toggle label="Autoplay trailers" checked={pr.autoplay} onChange={v => setPr({ ...pr, autoplay: v })} />
              <Toggle label="Email me weekly picks" checked={pr.emailUpdates} onChange={v => setPr({ ...pr, emailUpdates: v })} />
              <Field label="Region"><input value={pr.region} onChange={e => setPr({ ...pr, region: e.target.value })} className={input} /></Field>
              <Field label="Language"><input value={pr.language} onChange={e => setPr({ ...pr, language: e.target.value })} className={input} /></Field>
              <button onClick={savePrefs} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
                <Save className="size-4" />{saved ? "Saved" : "Save settings"}
              </button>
              <p className="pt-4 text-xs text-muted-foreground">Need more? See <Link to="/help" className="text-primary">Help Center</Link> or <Link to="/contact" className="text-primary">contact us</Link>.</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

const input = "h-11 w-full rounded-lg border border-border bg-secondary/60 px-4 text-sm outline-none focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<label className="block"><span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>{children}</label>);
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-card/40 px-4 py-3">
      <span className="text-sm">{label}</span>
      <button type="button" onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-primary" : "bg-secondary"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </label>
  );
}
function SavedList({ items, empty, onClear }: { items: SavedItem[]; empty: string; onClear: () => void }) {
  if (items.length === 0) {
    return <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">{empty}</div>;
  }
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={onClear} className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-2 text-xs hover:border-destructive hover:text-destructive">
          <Trash2 className="size-3" />Clear all
        </button>
      </div>
      <MediaGrid items={items.map(i => ({ ...i, overview: "", backdrop_path: null })) as any} />
    </div>
  );
}
