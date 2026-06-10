import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageLayout } from "@/components/cine/Layout";
import { auth, type User } from "@/lib/auth";
import { Shield, Trash2, ShieldCheck, UserIcon as UIcon } from "lucide-react";
import { User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [
    { title: "Admin — CINE TV" },
    { name: "description", content: "Admin dashboard for CINE TV." },
    { name: "robots", content: "noindex,nofollow" },
  ]}),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [me, setMe] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    auth.init();
    const refresh = () => { setMe(auth.current()); setUsers(auth.listUsers()); };
    refresh(); setReady(true);
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

  return (
    <PageLayout>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center gap-3">
          <Shield className="size-7 text-primary" />
          <h1 className="font-display text-4xl tracking-wide">Admin Dashboard</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Signed in as {me.name} ({me.email})</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Total accounts" value={counts.total} />
          <Stat label="Admins" value={counts.admins} />
          <Stat label="New today" value={counts.today} />
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card/40">
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

        <p className="mt-6 text-xs text-muted-foreground">
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
