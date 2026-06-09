import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/cine/Layout";

export const Route = createFileRoute("/dmca")({
  head: () => ({ meta: [{ title: "DMCA — CINE TV" }, { name: "description", content: "DMCA copyright takedown policy for CINE TV." }] }),
  component: () => (
    <LegalPage title="DMCA Notice" lastUpdated="June 2026">
      <p>CINE TV respects intellectual property rights. We do not host any movie or TV files. All metadata is provided by The Movie Database (TMDB).</p>
      <h2>Filing a Notice</h2>
      <p>If you believe content displayed via our site infringes your copyright, send a written notice including:</p>
      <ul>
        <li>Your contact information and physical or electronic signature.</li>
        <li>Identification of the copyrighted work claimed to be infringed.</li>
        <li>The URL of the material on CINE TV.</li>
        <li>A statement of good faith and accuracy.</li>
      </ul>
      <p>Send notices to: <strong>dmca@cine.tv</strong>.</p>
      <h2>Counter-Notice</h2>
      <p>If you believe content was removed by mistake, you may submit a counter-notice with the same details above.</p>
    </LegalPage>
  ),
});
