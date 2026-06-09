import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/cine/Layout";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About Us — CINE TV" }, { name: "description", content: "About CINE TV — what we do and who we are." }] }),
  component: () => (
    <LegalPage title="About CINE TV">
      <p>CINE TV is a free movie and TV discovery platform. We help film lovers find what to watch next — from blockbuster releases to hidden gems, complete with trailers, ratings, cast info, and community reviews.</p>
      <h2>Our Mission</h2>
      <p>To make great cinema easier to discover. We surface trending titles, top-rated classics, and upcoming releases in one cinematic interface.</p>
      <h2>Our Data</h2>
      <p>Movie and TV metadata is provided by The Movie Database (TMDB), a community-built database. CINE TV is not endorsed or certified by TMDB.</p>
      <h2>Get In Touch</h2>
      <p>Questions, feedback, or partnership ideas? Visit our <a href="/contact">contact page</a>.</p>
    </LegalPage>
  ),
});
