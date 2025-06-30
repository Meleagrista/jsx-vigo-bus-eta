import { getParadaById } from "../lineas/LineaController";
import { fetchLineasFromAPI, fetchParadasFromAPI } from "../lineas/LineaController";
import { Arrival } from "./ParadaView";
import { Parada } from "./Parada";

export const fetchETAForParadaFromAPI = async (paradaId: string): Promise<Parada> => {
  if (!paradaId) throw new Error("Missing paradaId");

  let parada = getParadaById(paradaId);

  // Attempt to load missing parada from associated lineas
  if (!parada) {
    const lineas = await fetchLineasFromAPI();

    for (const linea of lineas) {
      // Load stops if missing
      if (!linea.stopsIda || linea.stopsIda.length === 0) {
        try {
          await fetchParadasFromAPI(linea.code);
        } catch (e) {
          console.warn(`Failed to fetch paradas for ${linea.code}`, e);
          continue;
        }
      }

      const maybe = [...(linea.stopsIda ?? []), ...(linea.stopsVuelta ?? [])].find(
        (p) => p.id === paradaId
      );

      if (maybe) {
        parada = maybe;
        break;
      }
    }
  }

  if (!parada) {
    throw new Error(`Parada ${paradaId} not found`);
  }

  // Fetch ETA
  const res = await fetch("/.netlify/functions/fetchParadaETA", {
    method: "POST",
    body: JSON.stringify({ stopId: paradaId }),
  });

  if (!res.ok) throw new Error("Failed to fetch ETA");

  const data: Arrival[] = await res.json();

  const lineas = await fetchLineasFromAPI();
  const enriched: Arrival[] = data.map((arrival) => {
    const match = lineas.find((l) => l.id === arrival.lineId || l.code === arrival.lineId);
    return {
      ...arrival,
      color: match?.color ?? arrival.lineColor,
    };
  });

  parada.arrivals = enriched;
  return parada;
};