import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageSquare, Send } from "lucide-react";
import { PageLayout } from "@/components/cine/Layout";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact Us — CINE TV" }, { name: "description", content: "Get in touch with the CINE TV team." }] }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-display text-5xl tracking-wide">Contact Us</h1>
        <p className="mt-3 text-muted-foreground">We'd love to hear from you. Send us a message and we'll get back as soon as we can.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <Mail className="size-6 text-primary" />
            <h3 className="mt-3 font-semibold">Email</h3>
            <p className="mt-1 text-sm text-muted-foreground">hello@cine.tv</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <MessageSquare className="size-6 text-primary" />
            <h3 className="mt-3 font-semibold">Support</h3>
            <p className="mt-1 text-sm text-muted-foreground">support@cine.tv</p>
          </div>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <input required placeholder="Your name" className="h-11 rounded-lg border border-border bg-secondary px-4 outline-none focus:border-primary" />
            <input required type="email" placeholder="Email" className="h-11 rounded-lg border border-border bg-secondary px-4 outline-none focus:border-primary" />
          </div>
          <input required placeholder="Subject" className="h-11 w-full rounded-lg border border-border bg-secondary px-4 outline-none focus:border-primary" />
          <textarea required rows={6} placeholder="Your message..." className="w-full rounded-lg border border-border bg-secondary p-4 outline-none focus:border-primary" />
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90">
            <Send className="size-4" /> Send Message
          </button>
          {sent && <p className="text-sm text-gold">Thanks — your message has been received. (Demo form)</p>}
        </form>
      </div>
    </PageLayout>
  );
}
