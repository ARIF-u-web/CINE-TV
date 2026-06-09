import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { PageLayout } from "@/components/cine/Layout";

export const Route = createFileRoute("/reviews")({
  head: () => ({ meta: [{ title: "Reviews — CINE TV" }, { name: "description", content: "What users are saying about CINE TV." }] }),
  component: ReviewsPage,
});

const REVIEWS = [
  { name: "Aarav S.", rating: 5, text: "CINE TV's clean interface makes finding new movies effortless. The trailer integration is fantastic." },
  { name: "Maya K.", rating: 5, text: "Love the dark cinematic theme. Feels like browsing a real cinema lobby." },
  { name: "Diego R.", rating: 4, text: "Great curation. The trending section actually surfaces shows I want to watch." },
  { name: "Yuki T.", rating: 5, text: "Detailed cast info and similar recommendations are spot on." },
  { name: "Priya M.", rating: 4, text: "Fast, smooth, and beautifully designed. Mobile experience is excellent." },
  { name: "Liam O.", rating: 5, text: "Best free movie discovery site I've used. No clutter, just content." },
];

function ReviewsPage() {
  return (
    <PageLayout>
      <div className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="font-display text-5xl tracking-wide">User Reviews</h1>
        <p className="mt-3 text-muted-foreground">Real feedback from the CINE TV community.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {REVIEWS.map((r) => (
            <article key={r.name} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{r.name[0]}</div>
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`size-4 ${i < r.rating ? "fill-gold text-gold" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
            </article>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
