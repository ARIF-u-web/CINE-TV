import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageLayout } from "@/components/cine/Layout";
import { MediaGrid } from "@/components/cine/MediaCard";
import { tmdb } from "@/lib/tmdb";

export const Route = createFileRoute("/genres")({
  head: () => ({
    meta: [
      { title: "Genres — CINE TV" },
      { name: "description", content: "Browse movies and TV shows by genre on CINE TV." },
    ],
  }),
  component: GenresPage,
});

type Kind = "movie" | "tv";

function GenresPage() {
  const [kind, setKind] = useState<Kind>("movie");
  const [genreId, setGenreId] = useState<number | null>(null);
  const genres = useQuery({
    queryKey: ["genres", kind],
    queryFn: () => (kind === "movie" ? tmdb.genresMovie?.() ?? tmdb.genresTV() : tmdb.genresTV()),
  });
  const list = useQuery({
    queryKey: ["genre-discover", kind, genreId],
    queryFn: () =>
      kind === "movie" ? tmdb.discoverMovieByGenre(genreId!) : tmdb.discoverTVByGenre(genreId!),
    enabled: !!genreId,
  });

  return (
    <PageLayout>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="font-display text-5xl tracking-wide">Genres</h1>
        <p className="mt-2 text-muted-foreground">Filter titles by genre across movies and TV.</p>

        <div className="mt-6 inline-flex rounded-full border border-border bg-secondary/60 p-1">
          {(["movie", "tv"] as Kind[]).map((k) => (
            <button
              key={k}
              onClick={() => { setKind(k); setGenreId(null); }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                kind === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {k === "movie" ? "Movies" : "TV Shows"}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {genres.data?.genres?.map((g: any) => (
            <button
              key={g.id}
              onClick={() => setGenreId(g.id)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                genreId === g.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-secondary/60 hover:border-primary"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {genreId && list.data?.results && (
          <div className="mt-10">
            <MediaGrid items={list.data.results} type={kind} />
          </div>
        )}
        {!genreId && (
          <div className="mt-10 rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
            Select a genre to view titles.
          </div>
        )}
      </section>
    </PageLayout>
  );
}
