import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import { z } from "zod";
import { PageLayout } from "@/components/cine/Layout";
import { MediaGrid } from "@/components/cine/MediaCard";
import { tmdb } from "@/lib/tmdb";

const searchSchema = z.object({ q: z.string().optional().default("") });

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Search — CINE TV" },
      { name: "description", content: "Search movies and TV shows on CINE TV." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [input, setInput] = useState(q);

  useEffect(() => { setInput(q); }, [q]);

  const query = useQuery({
    queryKey: ["search", q],
    queryFn: () => tmdb.search(q),
    enabled: !!q,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ search: { q: input.trim() } });
  };

  const results = query.data?.results.filter((r: any) => r.media_type !== "person") ?? [];

  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="font-display text-5xl tracking-wide">Search</h1>
        <form onSubmit={submit} className="mt-6 max-w-2xl">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search for movies or TV shows..."
              className="h-14 w-full rounded-full border border-border bg-secondary pl-12 pr-4 text-base outline-none transition focus:border-primary"
            />
          </div>
        </form>
        <div className="mt-8">
          {!q && <p className="text-muted-foreground">Type a title to start searching.</p>}
          {q && query.isLoading && <p className="text-muted-foreground">Searching for "{q}"...</p>}
          {q && !query.isLoading && results.length === 0 && (
            <p className="text-muted-foreground">No results for "{q}".</p>
          )}
          {results.length > 0 && <MediaGrid items={results} />}
        </div>
      </div>
    </PageLayout>
  );
}
