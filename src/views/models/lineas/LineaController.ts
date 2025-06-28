import { Linea } from "./Linea";
import { LineBadge, Parada } from "../paradas/Parada";

const LOCAL_STORAGE_KEY = "lineas";
const DEFAULT_COLOR = "#6666ff";

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

  // Load cache from localStorage if not loaded yet
  if (!cache) {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        // Parse cached lines and reconstruct Linea instances
        cache = JSON.parse(cached).map(
          (l: any) => new Linea(l.id, l.code, l.start, l.end, l.color, l.stopsIda, l.stopsVuelta)
        );
        if (!cache) throw new Error("Cache is null after parsing.");
      } catch (err) {
        console.warn("[fetchParadasFromAPI] Failed to parse cache, clearing localStorage", err);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        cache = [];
      }
    } else {
      cache = [];
    }
  }

  // Find the Linea by id
  const linea = cache.find((l) => l.code === lineaId);
  if (!linea) {
    throw new Error(`Linea ${lineaId} not found in cache`);
  }

  // Return cached stops if they exist and no forceReload requested
  if (!forceReload && linea.stopsIda && linea.stopsIda.length > 0 && linea.stopsVuelta && linea.stopsVuelta.length > 0) {
    return linea;
  }

  // Initialize stopPromises if it doesn't exist
  if (!stopPromises) {
    stopPromises = {};
  }

  // If already fetching stops for this line, return that promise
  if (stopPromises && stopPromises[lineaId]) {
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

      // Ensure we have Linea metadata (with color) to enrich LineBadge
      const lineas = cache && cache.length > 0 ? cache : await fetchLineasFromAPI();

      const stops: Parada[] = data.map((s: { 
        id: string; 
        code: string; 
        name: string; 
        lines: LineBadge[]; 
      }) => {
        const enrichedLines = s.lines.map((badge) => {
          const matchingLinea = lineas.find(l => l.id === badge.id || l.code === badge.id);
          return {
            ...badge,
            color: matchingLinea?.color ?? DEFAULT_COLOR,
          };
        });

        return new Parada(s.id, s.code, s.name, enrichedLines);
      });

      linea.stopsIda = [...stops];
      linea.stopsVuelta = [...stops].reverse();

      // Save cache in localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cache));

      return linea;
    })
    .catch(err => {
      console.error(`[fetchParadasFromAPI] Fetch error:`, err);
      return linea;
    })
    .finally(() => {
      // Remove promise so next fetch can run
      delete stopPromises[lineaId];
    });

  return stopPromises[lineaId];
};