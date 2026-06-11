import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageLayout } from "@/components/cine/Layout";
import { MediaGrid } from "@/components/cine/MediaCard";
import { tmdb } from "@/lib/tmdb";
import { watchlist } from "@/lib/watchlist";

export const Route = createFileRoute("/anime")({
  head: () => ({
    meta: [
      { title: "Anime — CINE TV" },
      { name: "description", content: "Browse popular anime movies and series on CINE TV." },
    ],
  }),
  component: AnimePage,
});

type Tab = "all" | "series" | "movies" | "mylist" | "genres";

function AnimePage() {
  const [tab, setTab] = useState<Tab>("all");
  const movies = useQuery({ queryKey: ["anime", "movies"], queryFn: () => tmdb.animeMovies() });
  const series = useQuery({ queryKey: ["anime", "tv"], queryFn: () => tmdb.animeTV() });

  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: "Home" },
    { id: "series", label: "Series" },
    { id: "movies", label: "Movies" },
    { id: "genres", label: "Genres" },
    { id: "mylist", label: "My List" },
  ];

  return (
    <PageLayout>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="font-display text-5xl tracking-wide">Anime</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Japanese animation — popular series, hit movies, and trending picks.
        </p>

        <div className="mt-6 flex flex-wrap gap-2 border-b border-border">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
                tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-12">
          {(tab === "all" || tab === "series") && series.data?.results && (
            <Section title="Popular Anime Series">
              <MediaGrid items={series.data.results} type="tv" />
            </Section>
          )}
          {(tab === "all" || tab === "movies") && movies.data?.results && (
            <Section title="Popular Anime Movies">
              <MediaGrid items={movies.data.results} type="movie" />
            </Section>
          )}
          {tab === "genres" && <GenresPanel />}
          {tab === "mylist" && <MyListPanel />}
        </div>
      </section>
    </PageLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 font-display text-2xl tracking-wide">{title}</h2>
      {children}
    </div>
  );
}

function GenresPanel() {
  const g = useQuery({ queryKey: ["genres", "tv"], queryFn: () => tmdb.genresTV() });
  const [genreId, setGenreId] = useState<number | null>(null);
  const list = useQuery({
    queryKey: ["anime", "genre", genreId],
    queryFn: () => tmdb.discoverTVByGenre(genreId!),
    enabled: !!genreId,
  });
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {g.data?.genres.map(x => (
          <button
            key={x.id}
            onClick={() => setGenreId(x.id)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              genreId === x.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-secondary/60 hover:border-primary"
            }`}
          >
            {x.name}
          </button>
        ))}
      </div>
      {genreId && list.data?.results && (
        <div className="mt-8"><MediaGrid items={list.data.results} type="tv" /></div>
      )}
    </div>
  );
}

function MyListPanel() {
  const items = typeof window === "undefined" ? [] : watchlist.all();
  if (items.length === 0) {
    return <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">Your list is empty. Add titles from any anime page.</div>;
  }
  return <MediaGrid items={items.map(i => ({ ...i, overview: "", backdrop_path: null })) as any} />;
}
