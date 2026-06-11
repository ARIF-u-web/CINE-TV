import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LegalPage } from "@/components/cine/Layout";
import { Check } from "lucide-react";

const KEY = "cinetv:terms-accepted";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Use — CINE TV" }, { name: "description", content: "Terms governing your use of CINE TV." }] }),
  component: TermsPage,
});

function TermsPage() {
  const [accepted, setAccepted] = useState(false);
  const [checked, setChecked] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const v = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    if (v) { setAccepted(true); setChecked(true); setSavedAt(v); }
  }, []);

  const accept = () => {
    if (!checked) return;
    const ts = new Date().toISOString();
    localStorage.setItem(KEY, ts);
    setAccepted(true); setSavedAt(ts);
  };

  return (
    <LegalPage title="Terms of Use" lastUpdated="June 2026">
      <p>By accessing CINE TV, you agree to these Terms of Use. If you do not agree, please discontinue use of the site.</p>
      <h2>1. Use of the Service</h2>
      <p>CINE TV provides movie and TV show information for personal, non-commercial use. You may not scrape, redistribute, or resell content from this site.</p>
      <h2>2. Third-Party Content</h2>
      <p>All movie metadata, posters, and images are provided by The Movie Database (TMDB). All trademarks and copyrights belong to their respective owners.</p>
      <h2>3. User Conduct</h2>
      <ul>
        <li>Do not attempt to disrupt or harm the service.</li>
        <li>Do not submit unlawful, harassing, or infringing content.</li>
        <li>Do not impersonate others.</li>
      </ul>
      <h2>4. Disclaimer</h2>
      <p>CINE TV is provided "as is" without warranty of any kind. We do not guarantee accuracy, availability, or uninterrupted access.</p>
      <h2>5. Limitation of Liability</h2>
      <p>CINE TV shall not be liable for any indirect, incidental, or consequential damages arising from your use of the site.</p>
      <h2>6. Changes</h2>
      <p>We may update these Terms at any time. Continued use after changes constitutes acceptance.</p>

      <div className="not-prose mt-10 rounded-xl border border-border bg-card/60 p-6">
        <h3 className="mb-3 font-display text-2xl tracking-wide text-foreground">Your Agreement</h3>
        <label className="flex cursor-pointer items-start gap-3">
          <button
            type="button"
            onClick={() => setChecked(c => !c)}
            aria-pressed={checked}
            className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded border transition ${
              checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-secondary"
            }`}
          >
            {checked && <Check className="size-3.5" />}
          </button>
          <span className="text-sm text-foreground">
            I have read and agree to the CINE TV Terms of Use, Privacy Policy and Rules &amp; Regulations.
          </span>
        </label>
        <button
          onClick={accept}
          disabled={!checked}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {accepted ? "Agreement saved" : "I Agree"}
        </button>
        {accepted && savedAt && (
          <p className="mt-3 text-xs text-muted-foreground">Accepted on {new Date(savedAt).toLocaleString()}</p>
        )}
      </div>
    </LegalPage>
  );
}

