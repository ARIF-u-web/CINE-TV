export const TMDB_KEY = "be1eabf0eee39ed618f1029898202dfb";
export const TMDB_BASE = "https://api.themoviedb.org/3";
export const IMG = (path: string | null, size: "w200" | "w300" | "w500" | "w780" | "original" = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "";

async function get<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", TMDB_KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json() as Promise<T>;
}

export type TMDBItem = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv";
};

export const tmdb = {
  trending: (window: "day" | "week" = "week") =>
    get<{ results: TMDBItem[] }>(`/trending/all/${window}`),
  popularMovies: (page = 1) => get<{ results: TMDBItem[] }>("/movie/popular", { page }),
  topRatedMovies: (page = 1) => get<{ results: TMDBItem[] }>("/movie/top_rated", { page }),
  upcomingMovies: (page = 1) => get<{ results: TMDBItem[] }>("/movie/upcoming", { page }),
  popularTV: (page = 1) => get<{ results: TMDBItem[] }>("/tv/popular", { page }),
  topRatedTV: (page = 1) => get<{ results: TMDBItem[] }>("/tv/top_rated", { page }),
  search: (query: string, page = 1) =>
    get<{ results: TMDBItem[] }>("/search/multi", { query, page, include_adult: "false" }),
  movie: (id: string | number) =>
    get<any>(`/movie/${id}`, { append_to_response: "credits,videos,similar,reviews" }),
  tv: (id: string | number) =>
    get<any>(`/tv/${id}`, { append_to_response: "credits,videos,similar,reviews" }),
  genresMovie: () => get<{ genres: { id: number; name: string }[] }>("/genre/movie/list"),
};
