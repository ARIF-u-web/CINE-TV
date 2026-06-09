import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/cine/Layout";

export const Route = createFileRoute("/cookies")({
  head: () => ({ meta: [
    { title: "Cookie Policy — CINE TV" },
    { name: "description", content: "How CINE TV uses cookies and local storage." },
  ]}),
  component: () => (
    <LegalPage title="Cookie Policy" lastUpdated="June 2026">
      <h2>What we store</h2>
      <p>CINE TV uses your browser's local storage to remember your profile, watchlist, favorites, and preferences. We do not set tracking cookies of our own.</p>
      <h2>Third parties</h2>
      <p>Embedded YouTube trailers and TMDB images may set cookies governed by their own policies. Ad partners (such as Google AdSense, where enabled) may use cookies to serve relevant ads.</p>
      <h2>Your choices</h2>
      <p>You can clear local storage from your browser settings at any time. Disabling cookies may break embedded trailers.</p>
    </LegalPage>
  ),
});
