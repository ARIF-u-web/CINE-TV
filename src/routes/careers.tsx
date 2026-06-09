import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/cine/Layout";

export const Route = createFileRoute("/careers")({
  head: () => ({ meta: [
    { title: "Careers — CINE TV" },
    { name: "description", content: "Join the CINE TV team." },
  ]}),
  component: () => (
    <LegalPage title="Careers">
      <p>We're a small team building the most enjoyable way to discover movies and TV shows. We're not hiring full-time roles right now, but we welcome introductions from designers, engineers, and writers who love cinema.</p>
      <h2>How to reach us</h2>
      <p>Send a short note and links to your work via the <Link to="/contact">contact page</Link>. We read every message.</p>
    </LegalPage>
  ),
});
