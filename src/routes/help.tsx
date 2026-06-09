import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/cine/Layout";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [
    { title: "Help Center — CINE TV" },
    { name: "description", content: "Get help using CINE TV — guides and support." },
  ]}),
  component: () => (
    <LegalPage title="Help Center">
      <p>Welcome to the CINE TV Help Center. Find quick answers below or reach out directly.</p>
      <h2>Getting Started</h2>
      <ul>
        <li>Browse trending titles on the <Link to="/">home page</Link>.</li>
        <li>Use the search bar in the header to find any movie or show.</li>
        <li>Open a title for trailers, cast, reviews, and similar recommendations.</li>
      </ul>
      <h2>Account & Watchlist</h2>
      <p>Visit <Link to="/account">My Account</Link> to manage your profile, watchlist, and favorites. Everything is stored on your device — no sign-up required.</p>
      <h2>Still stuck?</h2>
      <p>Email us via the <Link to="/contact">contact page</Link>. We typically respond within 48 hours.</p>
    </LegalPage>
  ),
});
