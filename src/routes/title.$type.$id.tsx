import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star, Calendar, Clock, Play } from "lucide-react";
import { PageLayout } from "@/components/cine/Layout";
import { MediaGrid } from "@/components/cine/MediaCard";
import { tmdb, IMG } from "@/lib/tmdb";

export const Route = createFileRoute("/title/$type/$id")({
  beforeLoad: ({ params }) => {
    if (params.type !== "movie" && params.type !== "tv") throw notFound();
  },
  head: ({ params }) => ({
    meta: [{ title: `Title #${params.id} — CINE TV` }],
  }),
  component: TitlePage,
});

function TitlePage() {
  const { type, id } = Route.useParams();
  const q = useQuery({
    queryKey: ["title", type, id],
    queryFn: () => (type === "movie" ? tmdb.movie(id) : tmdb.tv(id)),
  });

  if (q.isLoading) {
    return (
      <PageLayout>
        <div className="mx-auto max-w-7xl px-4 py-20 text-muted-foreground">Loading...</div>
      </PageLayout>
    );
  }
  if (!q.data) return null;
  const d = q.data;
  const title = d.title ?? d.name;
  const year = (d.release_date ?? d.first_air_date ?? "").slice(0, 4);
  const runtime = d.runtime ?? (d.episode_run_time?.[0]);
  const trailer = d.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube")
    ?? d.videos?.results?.find((v: any) => v.site === "YouTube");
  const cast = d.credits?.cast?.slice(0, 12) ?? [];
  const similar = d.similar?.results ?? [];
  const reviews = d.reviews?.results?.slice(0, 4) ?? [];

  return (
    <PageLayout>
      <section className="relative">
        <div className="relative h-[60vh] min-h-[420px] overflow-hidden">
          {d.backdrop_path && <img src={IMG(d.backdrop_path, "original")} alt="" className="size-full object-cover" />}
          <div className="absolute inset-0 hero-gradient" />
        </div>
        <div className="mx-auto -mt-48 max-w-7xl px-4 pb-12">
          <div className="grid gap-8 md:grid-cols-[260px_1fr]">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
              {d.poster_path ? (
                <img src={IMG(d.poster_path, "w500")} alt={title} className="w-full" />
              ) : <div className="aspect-[2/3]" />}
            </div>
            <div>
              <h1 className="font-display text-4xl tracking-wide text-foreground md:text-6xl">{title}</h1>
              {d.tagline && <p className="mt-2 text-lg italic text-muted-foreground">{d.tagline}</p>}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {d.vote_average > 0 && (
                  <span className="inline-flex items-center gap-1 text-gold">
                    <Star className="size-4 fill-current" /> {d.vote_average.toFixed(1)}
                  </span>
                )}
                {year && <span className="inline-flex items-center gap-1"><Calendar className="size-4" /> {year}</span>}
                {runtime && <span className="inline-flex items-center gap-1"><Clock className="size-4" /> {runtime}m</span>}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {d.genres?.map((g: any) => (
                  <span key={g.id} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium">{g.name}</span>
                ))}
              </div>
              <p className="mt-6 max-w-3xl leading-relaxed text-foreground/90">{d.overview}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#watch"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
                >
                  <Play className="size-4 fill-current" /> Watch Now
                </a>
                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-6 py-3 text-sm font-bold transition hover:border-primary hover:text-primary"
                  >
                    <Play className="size-4" /> Watch Trailer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {trailer && (
        <section className="mx-auto max-w-5xl px-4 pb-12">
          <h2 className="mb-4 font-display text-3xl tracking-wide">Trailer</h2>
          <div className="aspect-video overflow-hidden rounded-xl border border-border bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="size-full"
            />
          </div>
        </section>
      )}

      {cast.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-12">
          <h2 className="mb-6 font-display text-3xl tracking-wide">Cast</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {cast.map((c: any) => (
              <div key={c.cast_id ?? c.credit_id} className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="aspect-[2/3] bg-secondary">
                  {c.profile_path
                    ? <img src={IMG(c.profile_path, "w300")} alt={c.name} loading="lazy" className="size-full object-cover" />
                    : <div className="flex size-full items-center justify-center text-xs text-muted-foreground">No photo</div>}
                </div>
                <div className="p-3">
                  <p className="line-clamp-1 text-sm font-semibold">{c.name}</p>
                  <p className="line-clamp-1 text-xs text-muted-foreground">{c.character}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-12">
          <h2 className="mb-6 font-display text-3xl tracking-wide">Reviews</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((r: any) => (
              <article key={r.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {r.author?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <p className="font-semibold">{r.author}</p>
                    <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="mt-4 line-clamp-6 text-sm leading-relaxed text-muted-foreground">{r.content}</p>
              </article>
            ))}
          </div>
          <div className="mt-4">
            <Link to="/reviews" className="text-sm font-semibold text-primary hover:underline">See all reviews →</Link>
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <h2 className="mb-6 font-display text-3xl tracking-wide">You Might Also Like</h2>
          <MediaGrid items={similar.slice(0, 12)} type={type as "movie" | "tv"} />
        </section>
      )}
    </PageLayout>
  );
}
