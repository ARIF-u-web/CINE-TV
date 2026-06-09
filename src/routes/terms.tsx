import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/cine/Layout";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Use — CINE TV" }, { name: "description", content: "Terms governing your use of CINE TV." }] }),
  component: () => (
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
    </LegalPage>
  ),
});
