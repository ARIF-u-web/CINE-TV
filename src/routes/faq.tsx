import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/cine/Layout";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [
    { title: "FAQ — CINE TV" },
    { name: "description", content: "Frequently asked questions about CINE TV." },
  ]}),
  component: () => (
    <LegalPage title="Frequently Asked Questions">
      <h2>Is CINE TV free?</h2>
      <p>Yes. CINE TV is a free discovery platform. We don't host or stream any video content — we link to trailers on YouTube and surface information from TMDB.</p>
      <h2>Where does the data come from?</h2>
      <p>All movie and TV metadata comes from The Movie Database (TMDB). CINE TV is not endorsed or certified by TMDB.</p>
      <h2>Do I need an account?</h2>
      <p>No. Your profile, watchlist, and favorites are stored locally on your device. Clearing your browser data will remove them.</p>
      <h2>Can I request a feature?</h2>
      <p>Absolutely — use the <a href="/contact">contact form</a> or write a <a href="/reviews">review</a>.</p>
      <h2>How do I report a problem?</h2>
      <p>Please email us via the <a href="/contact">contact page</a>. For copyright concerns, see our <a href="/dmca">DMCA</a> policy.</p>
    </LegalPage>
  ),
});
