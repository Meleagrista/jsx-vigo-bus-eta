import React, { useState, useEffect } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { FiFileText } from "react-icons/fi";
import { fetchParadasFromAPI } from "./LineaController";
import { Linea } from "./Linea";

const DEFAULT_COLOR = "#6666ff";

type Filter = "Ida" | "Vuelta";

interface Props {
  linea: Linea;
}

export const LineaView: React.FC<Props> = ({ linea }) => {
  const [filter, setFilter] = useState<Filter>("Ida");
  const [line, setLine] = useState<Linea>(linea);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const updateTimestamp = () => {
      const now = new Date();
      setLastUpdate(now.toLocaleTimeString("es-ES", { hour12: false }));
    };

  const loadStops = (forceReload = false) => {
    setLoading(true);
    fetchParadasFromAPI(linea.code, forceReload)
      .then((linea) => {
        setLine(linea);
        updateTimestamp();
      })
      .catch((err) => {
        console.error(`[LineaView] Error fetching stops:`, err);
        setError("Error al cargar las paradas.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadStops(false);
  }, [linea.code]);

  const stopsToShow = (filter === "Ida" ? line?.stopsIda : line?.stopsVuelta) ?? [];

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

      {/* Última actualización */}
      <div className="flex justify-between items-center px-4 mb-1">
        <p className="text-gray-light text-sm text-left w-full">
          Última actualización {lastUpdate}
        </p>
        <button
          className="text-gray-400 hover:text-gray-600 absolute right-4"
          onClick={() => loadStops(true)}
        >
          <ReloadIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Custom dropdown full width */}
      <div className="relative bg-white">
        <button 
        onClick={() => setDropdownOpen(!dropdownOpen)} 
        className={`w-full flex items-center justify-between text-gray text-sm font-bold py-2 px-3 ${dropdownOpen ? "border-b border-gray-100 shadow-none" : "shadow-md"}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded" style={{ backgroundColor: line?.color ?? "#ccc" }}>{line?.id ?? ""}</span>
            <span>{line?.end ? `${line?.start} - ${line?.end}` : line?.start ?? "Línea desconocida"}</span>
          </div>
          <svg
            className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {dropdownOpen && (
          <ul
            className={`
              absolute left-0 right-0 overflow-hidden bg-white shadow-md z-30
              transition-[max-height,opacity] ease-in-out
              ${dropdownOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
            `}
            style={{ transitionDuration: "2000ms", willChange: "max-height, opacity" }}  // 2 seconds for example
          >
            <li className="px-3 py-2 bg-white hover:bg-gray-100 cursor-pointer text-sm text-gray-dark">Placeholder</li>
          </ul>
        )}
      </div>

      {/* Stops */}
      <ul className="relative">
        {stopsToShow.length === 0 ? (
          <>
            {/* Spacer for alignment */}
            <div className="h-6" />
            <div className="flex flex-col items-center text-gray text-sm mt-4">
              <FiFileText size={40} className="text-brandRed mb-2" />
              <p>No se encontraron paradas para esta línea</p>
            </div>
          </>
        ) : (
          stopsToShow.map((stop) => (
            <React.Fragment key={stop.id}>
              {stop.dot(line?.color ?? DEFAULT_COLOR)}
            </React.Fragment>
          ))
        )}
      </ul>
    </section>
  );
};