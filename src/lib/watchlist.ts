// Simple localStorage-backed watchlist + favorites + profile
export type SavedItem = {
  id: number;
  type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  addedAt: number;
};

const WL = "cinetv:watchlist";
const FAV = "cinetv:favorites";
const PROF = "cinetv:profile";
const PREFS = "cinetv:prefs";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key) ?? "") as T; } catch { return fallback; }
}
function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("cinetv:storage", { detail: { key } }));
}

export const watchlist = {
  all: () => read<SavedItem[]>(WL, []),
  has: (id: number, type: "movie" | "tv") => read<SavedItem[]>(WL, []).some(i => i.id === id && i.type === type),
  toggle: (item: SavedItem) => {
    const list = read<SavedItem[]>(WL, []);
    const exists = list.find(i => i.id === item.id && i.type === item.type);
    write(WL, exists ? list.filter(i => !(i.id === item.id && i.type === item.type)) : [{ ...item, addedAt: Date.now() }, ...list]);
  },
  remove: (id: number, type: "movie" | "tv") =>
    write(WL, read<SavedItem[]>(WL, []).filter(i => !(i.id === id && i.type === type))),
  clear: () => write(WL, []),
};

export const favorites = {
  all: () => read<SavedItem[]>(FAV, []),
  has: (id: number, type: "movie" | "tv") => read<SavedItem[]>(FAV, []).some(i => i.id === id && i.type === type),
  toggle: (item: SavedItem) => {
    const list = read<SavedItem[]>(FAV, []);
    const exists = list.find(i => i.id === item.id && i.type === item.type);
    write(FAV, exists ? list.filter(i => !(i.id === item.id && i.type === item.type)) : [{ ...item, addedAt: Date.now() }, ...list]);
  },
  remove: (id: number, type: "movie" | "tv") =>
    write(FAV, read<SavedItem[]>(FAV, []).filter(i => !(i.id === id && i.type === type))),
  clear: () => write(FAV, []),
};

export type Profile = { name: string; email: string; avatar: string; bio: string };
export const profile = {
  get: (): Profile => read<Profile>(PROF, { name: "", email: "", avatar: "", bio: "" }),
  set: (p: Profile) => write(PROF, p),
};

export type Prefs = { adultContent: boolean; autoplay: boolean; emailUpdates: boolean; region: string; language: string };
export const prefs = {
  get: (): Prefs => read<Prefs>(PREFS, { adultContent: false, autoplay: true, emailUpdates: false, region: "US", language: "en" }),
  set: (p: Prefs) => write(PREFS, p),
};
