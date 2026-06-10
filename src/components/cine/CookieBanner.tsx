import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie, X } from "lucide-react";

const KEY = "cinetv:cookie-consent";

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(KEY)) setOpen(true);
  }, []);

  const decide = (v: "accept" | "reject") => {
    localStorage.setItem(KEY, v);
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-background/95 px-4 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Cookie className="size-5 shrink-0 text-primary" />
        <p className="flex-1 text-xs text-muted-foreground sm:text-sm">
          CINE TV uses local storage and third-party services (TMDB images, YouTube trailers) to power the site.
          Read our <Link to="/cookies" className="text-primary underline">Cookie Policy</Link> and{" "}
          <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>.
        </p>
        <div className="flex w-full gap-2 sm:w-auto">
          <button onClick={() => decide("reject")}
            className="flex-1 rounded-full border border-border bg-secondary/60 px-4 py-2 text-xs font-semibold hover:border-primary sm:flex-none">
            Reject
          </button>
          <button onClick={() => decide("accept")}
            className="flex-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 sm:flex-none">
            Accept all
          </button>
          <button onClick={() => setOpen(false)} aria-label="Dismiss"
            className="inline-flex size-8 items-center justify-center rounded-full border border-border hover:border-primary">
            <X className="size-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
