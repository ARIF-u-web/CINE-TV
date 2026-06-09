import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Play, Info, Star } from "lucide-react";
import { PageLayout } from "@/components/cine/Layout";
import { MediaGrid } from "@/components/cine/MediaCard";
import { tmdb, IMG, type TMDBItem } from "@/lib/tmdb";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CINE TV — Discover Movies & TV Shows" },
      { name: "description", content: "Trending movies, top-rated TV shows, upcoming releases. Welcome to CINE TV." },
    ],
  }),
  component: Home,
});

function Home() {
  const trending = useQuery({ queryKey: ["trending"], queryFn: () => tmdb.trending("week") });
  const popular = useQuery({ queryKey: ["popular-movies"], queryFn: () => tmdb.popularMovies() });
  const topTV = useQuery({ queryKey: ["top-tv"], queryFn: () => tmdb.topRatedTV() });
  const upcoming = useQuery({ queryKey: ["upcoming"], queryFn: () => tmdb.upcomingMovies() });

  const hero: TMDBItem | undefined = trending.data?.results?.find((r) => r.backdrop_path);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
          {hero?.backdrop_path && (
            <img src={IMG(hero.backdrop_path, "original")} alt="" className="size-full object-cover" />
          )}
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-12">
            {hero && (
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Star className="size-3 fill-current" /> Trending now
                </span>
                <h1 className="mt-4 font-display text-5xl tracking-wide text-foreground md:text-7xl">
                  {hero.title ?? hero.name}
                </h1>
                <p className="mt-3 line-clamp-3 max-w-xl text-sm text-muted-foreground md:text-base">{hero.overview}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/title/$type/$id"
                    params={{ type: hero.media_type === "tv" ? "tv" : "movie", id: String(hero.id) }}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                  >
                    <Play className="size-4 fill-current" /> Watch trailer
                  </Link>
                  <Link
                    to="/title/$type/$id"
                    params={{ type: hero.media_type === "tv" ? "tv" : "movie", id: String(hero.id) }}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-6 py-3 text-sm font-bold backdrop-blur transition hover:border-primary"
                  >
                    <Info className="size-4" /> More info
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Section title="Trending This Week" items={trending.data?.results} loading={trending.isLoading} />
      <Section title="Popular Movies" items={popular.data?.results} loading={popular.isLoading} type="movie" />
      <Section title="Top Rated TV Shows" items={topTV.data?.results} loading={topTV.isLoading} type="tv" />
      <Section title="Upcoming Movies" items={upcoming.data?.results} loading={upcoming.isLoading} type="movie" />
    </PageLayout>
  );
}

function Section({ title, items, loading, type }: { title: string; items?: TMDBItem[]; loading?: boolean; type?: "movie" | "tv" }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="mb-6 font-display text-3xl tracking-wide">{title}</h2>
      {loading && <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] animate-pulse rounded-xl bg-card" />
        ))}
      </div>}
      {items && <MediaGrid items={items.slice(0, 18)} type={type} />}
    </section>
  );
}
