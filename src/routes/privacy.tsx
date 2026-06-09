import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/cine/Layout";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — CINE TV" }, { name: "description", content: "How CINE TV handles your data." }] }),
  component: () => (
    <LegalPage title="Privacy Policy" lastUpdated="June 2026">
      <p>Your privacy matters. This policy explains what data CINE TV collects and how it is used.</p>
      <h2>Information We Collect</h2>
      <ul>
        <li><strong>Usage data:</strong> Pages visited, browser type, device, and referral source.</li>
        <li><strong>Cookies:</strong> Used for site functionality, analytics, and advertising.</li>
      </ul>
      <h2>How We Use Information</h2>
      <ul>
        <li>Improve site performance and content quality.</li>
        <li>Display relevant advertising via partners such as Google AdSense.</li>
        <li>Respond to support inquiries.</li>
      </ul>
      <h2>Third-Party Services</h2>
      <p>We use Google AdSense, which may use cookies to serve ads based on your visits to this and other sites. You can opt out of personalized advertising at <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</p>
      <h2>Your Rights</h2>
      <p>You may request data deletion or restrict cookies via your browser settings. Contact us via the <a href="/contact">contact page</a> for any requests.</p>
      <h2>Children's Privacy</h2>
      <p>CINE TV is not directed to children under 13. We do not knowingly collect data from minors.</p>
    </LegalPage>
  ),
});
