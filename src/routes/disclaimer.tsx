import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/cine/Layout";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({ meta: [
    { title: "Disclaimer — CINE TV" },
    { name: "description", content: "CINE TV disclaimer." },
  ]}),
  component: () => (
    <LegalPage title="Disclaimer" lastUpdated="June 2026">
      <p>CINE TV provides movie and TV information sourced from The Movie Database (TMDB) and other public sources. All trademarks, posters, and trailers belong to their respective owners.</p>
      <h2>No streaming</h2>
      <p>CINE TV does not host, upload, or stream any video files. Trailers are embedded from YouTube under their terms of service.</p>
      <h2>Accuracy</h2>
      <p>While we strive for accuracy, metadata may be incomplete or out of date. Use the information at your own discretion.</p>
      <h2>External links</h2>
      <p>We are not responsible for the content of any external sites linked from CINE TV.</p>
    </LegalPage>
  ),
});
