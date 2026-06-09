import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { IMG, type TMDBItem } from "@/lib/tmdb";

export function MediaCard({ item, type: typeProp }: { item: TMDBItem; type?: "movie" | "tv" }) {
  const type = typeProp ?? item.media_type ?? (item.title ? "movie" : "tv");
  const title = item.title ?? item.name ?? "Untitled";
  const year = (item.release_date ?? item.first_air_date ?? "").slice(0, 4);
  return (
    <Link
      to="/title/$type/$id"
      params={{ type, id: String(item.id) }}
      className="group block overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary hover:shadow-[0_0_24px_oklch(0.72_0.18_35/0.25)]"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-secondary">
        {item.poster_path ? (
          <img
            src={IMG(item.poster_path, "w500")}
            alt={title}
            loading="lazy"
            className="size-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-muted-foreground">No image</div>
        )}
        {item.vote_average > 0 && (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-xs font-semibold text-gold backdrop-blur">
            <Star className="size-3 fill-current" />
            {item.vote_average.toFixed(1)}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{year || "—"} · {type === "tv" ? "TV" : "Movie"}</p>
      </div>
    </Link>
  );
}

export function MediaGrid({ items, type }: { items: TMDBItem[]; type?: "movie" | "tv" }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((it) => <MediaCard key={`${it.id}-${it.media_type ?? type}`} item={it} type={type} />)}
    </div>
  );
}
