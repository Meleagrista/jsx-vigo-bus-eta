import { Linea } from "./Linea";
import { Parada } from "../paradas/Parada";

const LOCAL_STORAGE_KEY = "lineas";

let cache: Linea[] | null = null;
let fetching: Promise<Linea[]> | null = null;
let stopPromises: Record<string, Promise<Linea> | undefined> = {};

export const fetchLineasFromAPI = async (forceReload = false): Promise<Linea[]> => {
  // If we have cache in memory and no forceReload, return it immediately
  if (cache && !forceReload) {  return cache; }

  // Try loading from localStorage if cache not set yet
  if (!cache && !forceReload) {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached).map((l: any) => new Linea(l.id, l.code, l.start, l.end, l.color));
        cache = parsed;
        if (cache == null) { throw new Error("Cache is null after parsing."); }
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
      const parsed = data.map((l: Linea) => new Linea(l.id, l.code, l.start, l.end, l.color));
      cache = parsed;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
      return parsed;
    })
    .finally(() => {
      fetching = null;
    });

  return fetching;
};

export const fetchParadasFromAPI = async (lineaId: string, forceReload = false): Promise<Linea> => {
  console.log(`[fetchParadasFromAPI] Fetching stops for idBusLine=${lineaId}, forceReload=${forceReload}`);

  // Load cache from localStorage if not loaded yet
  if (!cache) {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    console.log(`[fetchParadasFromAPI] Cached data found: ${cached ? "yes" : "no"}`);
    if (cached) {
      try {
        // Parse cached lines and reconstruct Linea instances
        cache = JSON.parse(cached).map(
          (l: any) => new Linea(l.id, l.code, l.start, l.end, l.color, l.stopsIda, l.stopsVuelta)
        );
        if (!cache) throw new Error("Cache is null after parsing.");
        console.log(`[fetchParadasFromAPI] Loaded ${cache.length} lineas from cache`);
      } catch (err) {
        console.warn("[fetchParadasFromAPI] Failed to parse cache, clearing localStorage", err);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        cache = [];
      }
    } else {
      cache = [];
    }
  }

  console.log(`[fetchParadasFromAPI] Cache loaded with ${cache.length} lineas`);

  // Find the Linea by id
  const linea = cache.find((l) => l.code === lineaId);
  if (!linea) {
    throw new Error(`Linea ${lineaId} not found in cache`);
  }

  console.log(`[fetchParadasFromAPI] Found Linea with ${linea.stopsIda?.length ?? 0} cached stops.`);

  // Return cached stops if they exist and no forceReload requested
  if (!forceReload && linea.stopsIda && linea.stopsIda.length > 0 && linea.stopsVuelta && linea.stopsVuelta.length > 0) {
    console.log(`[fetchParadasFromAPI] Returning cached Linea with ${linea.stopsIda.length} stops`);
    return linea;
  }

  console.log(`[fetchParadasFromAPI] Fetching stops for Linea ${lineaId} from API`);

  // Initialize stopPromises if it doesn't exist
  if (!stopPromises) {
    stopPromises = {};
  }

  // If already fetching stops for this line, return that promise
  if (stopPromises && stopPromises[lineaId]) {
    console.log(`[fetchParadasFromAPI] Returning ongoing fetch promise for idBusLine=${lineaId}`);
    return stopPromises[lineaId];
  }

  // Fetch stops from API
  stopPromises[lineaId] = fetch("/.netlify/functions/fetchParadas", {
    method: "POST",
    body: JSON.stringify({ idBusLine: lineaId }),
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("Failed to fetch stops");

      const data = await res.json();
      const stops: Parada[] = data.map(s => new Parada(s.id, s.code, s.name, s.lines));

      // Update the cache object
      linea.stopsIda = stops;
      linea.stopsVuelta = [...stops].reverse();

      // Save cache in localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cache));

      console.log(`[fetchParadasFromAPI] Updated Linea stops with ${stops.length} stops`);

      return linea;
    })
    .catch(err => {
      console.error(`[fetchParadasFromAPI] Fetch error:`, err);
      throw err;
    })
    .finally(() => {
      // Remove promise so next fetch can run
      delete stopPromises[lineaId];
    });

  return stopPromises[lineaId];
};