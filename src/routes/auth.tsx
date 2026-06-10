import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageLayout } from "@/components/cine/Layout";
import { auth } from "@/lib/auth";
import { LogIn, UserPlus, Film } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Sign In or Sign Up — CINE TV" },
    { name: "description", content: "Sign in to CINE TV or create an account to save your watchlist and favorites." },
  ]}),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { auth.init(); if (auth.current()) navigate({ to: "/account" }); }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      if (mode === "signup") await auth.signUp(name, email, pw);
      else await auth.signIn(email, pw);
      navigate({ to: "/account" });
    } catch (e: any) { setErr(e?.message || "Something went wrong"); }
    finally { setBusy(false); }
  };

  return (
    <PageLayout>
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
        <div className="mb-8 text-center">
          <Film className="mx-auto size-10 text-primary" />
          <h1 className="mt-3 font-display text-4xl tracking-wide">{mode === "signin" ? "Welcome back" : "Join CINE TV"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin" ? "Sign in to access your watchlist and favorites." : "Create an account to save your picks."}
          </p>
        </div>

        <div className="mb-4 grid grid-cols-2 rounded-full border border-border bg-secondary/60 p-1">
          <button onClick={() => setMode("signin")} className={`rounded-full py-2 text-sm font-semibold ${mode === "signin" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Sign In</button>
          <button onClick={() => setMode("signup")} className={`rounded-full py-2 text-sm font-semibold ${mode === "signup" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Sign Up</button>
        </div>

        <form onSubmit={submit} className="space-y-3 rounded-2xl border border-border bg-card/40 p-6">
          {mode === "signup" && (
            <Field label="Name"><input required value={name} onChange={e => setName(e.target.value)} className={input} placeholder="Your name" /></Field>
          )}
          <Field label="Email"><input required type="email" value={email} onChange={e => setEmail(e.target.value)} className={input} placeholder="you@example.com" autoComplete="email" /></Field>
          <Field label="Password"><input required type="password" value={pw} onChange={e => setPw(e.target.value)} className={input} placeholder="At least 6 characters" autoComplete={mode === "signin" ? "current-password" : "new-password"} /></Field>

          {err && <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</p>}

          <button disabled={busy} type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {mode === "signin" ? <><LogIn className="size-4" />Sign In</> : <><UserPlus className="size-4" />Create Account</>}
          </button>

          <p className="pt-2 text-center text-xs text-muted-foreground">
            By continuing you agree to our <Link to="/terms" className="text-primary">Terms</Link> and <Link to="/privacy" className="text-primary">Privacy Policy</Link>.
          </p>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Demo admin: <span className="font-mono text-foreground">admin@cinetv.local</span> / <span className="font-mono text-foreground">admin123</span>
        </p>
      </div>
    </PageLayout>
  );
}

const input = "h-11 w-full rounded-lg border border-border bg-secondary/60 px-4 text-sm outline-none focus:border-primary";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<label className="block"><span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>{children}</label>);
}
