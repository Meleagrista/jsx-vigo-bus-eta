import { Linea } from "../views/models/Linea";

const LOCAL_STORAGE_KEY = "cachedLineas";

let cache: Linea[] | null = null;
let fetching: Promise<Linea[]> | null = null;

export const fetchLineasFromAPI = async (forceReload = false): Promise<Linea[]> => {
  // If we have cache in memory and no forceReload, return it immediately
  if (cache && !forceReload) {  return cache; }

  // Try loading from localStorage if cache not set yet
  if (!cache && !forceReload) {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached).map((l: any) => new Linea(l.id, l.start, l.end, l.color));
        cache = parsed;
        if (cache == null) { throw new Error("Cache is null after parsing"); }
        return cache;
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }

  // If fetch is already running, return the same promise to avoid duplicate requests
  if (fetching) { return fetching; }

  // Else fetch fresh data from API
  fetching = fetch("/.netlify/functions/fetchLineas")
    .then(async (res) => {
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const parsed = data.map((l: any) => new Linea(l.id, l.start, l.end, l.color));
      cache = parsed;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
      return parsed;
    })
    .finally(() => {
      fetching = null;
    });

  return fetching;
};