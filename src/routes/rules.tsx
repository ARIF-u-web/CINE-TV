import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/cine/Layout";

export const Route = createFileRoute("/rules")({
  head: () => ({ meta: [{ title: "Rules & Regulations — CINE TV" }, { name: "description", content: "Community rules and content policies for CINE TV." }] }),
  component: () => (
    <LegalPage title="Rules & Regulations" lastUpdated="June 2026">
      <p>To keep CINE TV a great space for film lovers, all visitors must follow these community rules.</p>
      <h2>Content Standards</h2>
      <ul>
        <li>No hate speech, harassment, or discrimination of any kind.</li>
        <li>No spam, phishing, or misleading content.</li>
        <li>No piracy, illegal streaming links, or copyright infringement.</li>
        <li>Respect spoilers — flag them appropriately in reviews.</li>
      </ul>
      <h2>Account Conduct</h2>
      <ul>
        <li>One account per person; no impersonation.</li>
        <li>Keep discussions civil and on-topic.</li>
      </ul>
      <h2>Enforcement</h2>
      <p>Violations may result in content removal or account suspension. Repeat or severe violations may lead to permanent bans.</p>
      <h2>Reporting</h2>
      <p>To report abuse or rule violations, contact us at <a href="/contact">our contact page</a>.</p>
    </LegalPage>
  ),
});
