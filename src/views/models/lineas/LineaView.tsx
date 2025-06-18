import React, { useState, useEffect } from "react";
import { Parada } from "../paradas/Parada";
import { fetchParadasFromAPI } from "./LineaController";

type Filter = "Ida" | "Vuelta";

interface Props {
  lineColor: string;
  lineaId: string;
}

export const LineaView: React.FC<Props> = ({ lineColor, lineaId }) => {
  const [filter, setFilter] = useState<Filter>("Ida");
  const [stopsIda, setStopsIda] = useState<Parada[]>([]);
  const [stopsVuelta, setStopsVuelta] = useState<Parada[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(`[LineaView] useEffect triggered for lineaId=${lineaId}`);
    setLoading(true);
    fetchParadasFromAPI(lineaId, true)
      .then((linea) => {
        console.log(`[LineaView] Got ${linea.stopsIda.length} stopsIda, ${linea.stopsVuelta.length} stopsVuelta`);
        setStopsIda(linea.stopsIda);
        setStopsVuelta(linea.stopsVuelta);
      })
      .catch((err) => {
        console.error(`[LineaView] Error fetching stops:`, err);
        setError("Error al cargar las paradas.");
      })
      .finally(() => {
        console.log(`[LineaView] Promise settled`);
        setLoading(false);}
      );
  }, [lineaId]);

  const stopsToShow = filter === "Ida" ? stopsIda : stopsVuelta;

  console.log(`[LineaView] Rendering ${stopsToShow.length} stops (${filter})`);

    return (
    <section>
      <nav className="flex justify-evenly py-3">
        {(["Ida", "Vuelta"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`uppercase text-base px-3 py-1 hover:bg-gray-100 rounded ${
              filter === f ? "text-gray-dark" : "text-gray-light"
            }`}
          >
            {f}
          </button>
        ))}
      </nav>

      <ul className="relative">
        <div
          className="absolute top-0 bottom-0 left-14 w-1"
          style={{ backgroundColor: lineColor }}
        />
        {stopsToShow.map((stop) => (
          <React.Fragment key={stop.id}>{stop.dot(lineColor)}</React.Fragment>
        ))}
      </ul>
    </section>
  );
};