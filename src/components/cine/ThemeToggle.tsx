import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { getTheme, setTheme, type Theme } from "@/lib/theme";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [t, setT] = useState<Theme>("dark");
  useEffect(() => {
    setT(getTheme());
    const h = (e: Event) => setT((e as CustomEvent).detail as Theme);
    window.addEventListener("cinetv:theme", h);
    return () => window.removeEventListener("cinetv:theme", h);
  }, []);

  const opts: { v: Theme; icon: typeof Sun; label: string }[] = [
    { v: "light", icon: Sun, label: "Light" },
    { v: "dark", icon: Moon, label: "Dark" },
    { v: "system", icon: Monitor, label: "System" },
  ];

  if (compact) {
    const next: Theme = t === "dark" ? "light" : t === "light" ? "system" : "dark";
    const Icon = t === "dark" ? Moon : t === "light" ? Sun : Monitor;
    return (
      <button
        onClick={() => setTheme(next)}
        aria-label={`Theme: ${t}. Switch to ${next}`}
        title={`Theme: ${t}`}
        className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-secondary/60 transition hover:border-primary hover:text-primary"
      >
        <Icon className="size-4" />
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/60 p-1">
      {opts.map(o => (
        <button key={o.v} onClick={() => setTheme(o.v)}
          aria-label={o.label}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${t === o.v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          <o.icon className="size-3.5" />{o.label}
        </button>
      ))}
    </div>
  );
}
