import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageLayout } from "@/components/cine/Layout";
import { MediaGrid } from "@/components/cine/MediaCard";
import { tmdb } from "@/lib/tmdb";

export const Route = createFileRoute("/movies")({
  head: () => ({
    meta: [
      { title: "Movies — CINE TV" },
      { name: "description", content: "Browse popular, top rated and upcoming movies on CINE TV." },
    ],
  }),
  component: MoviesPage,
});

const TABS = [
  { id: "popular", label: "Popular" },
  { id: "top_rated", label: "Top Rated" },
  { id: "upcoming", label: "Upcoming" },
] as const;

function MoviesPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("popular");
  const q = useQuery({
    queryKey: ["movies", tab],
    queryFn: () =>
      tab === "popular" ? tmdb.popularMovies() : tab === "top_rated" ? tmdb.topRatedMovies() : tmdb.upcomingMovies(),
  });
  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="font-display text-5xl tracking-wide">Movies</h1>
        <div className="mt-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${tab === t.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-secondary text-muted-foreground hover:border-primary hover:text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="mt-8">
          {q.isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 18 }).map((_, i) => <div key={i} className="aspect-[2/3] animate-pulse rounded-xl bg-card" />)}
            </div>
          ) : q.data ? <MediaGrid items={q.data.results} type="movie" /> : null}
        </div>
      </div>
    </PageLayout>
  );
}
