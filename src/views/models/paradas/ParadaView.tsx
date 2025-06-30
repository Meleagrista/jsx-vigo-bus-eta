import React, { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { FiFileText } from "react-icons/fi";
import { fetchETAForParadaFromAPI } from "../paradas/ParadaController";
import { Parada } from "../paradas/Parada";


export interface Arrival {
  lineId: string;
  lineName: string;
  lineColor: string;
  arrivals: number[];
}

interface Props {
  paradaId: string;
}

export const ParadaView: React.FC<Props> = ({ paradaId }) => {
  const [parada, setParada] = useState<Parada | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const updateTimestamp = () => {
    const now = new Date();
    setLastUpdate(now.toLocaleTimeString("es-ES", { hour12: false }));
  };

  const loadStops = (forceReload = false) => {
    setLoading(true);
    fetchETAForParadaFromAPI(paradaId)
      .then((parada) => {
        setParada(parada);
        updateTimestamp();
      })
      .catch((err) => {
        console.error(`[ParadasView] Error fetching stops:`, err);
        setError("Error al cargar las paradas.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {loadStops(false);}, [paradaId]);

  return (
    <section>
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

      {/* Custom dropdown */}
      <div className="relative bg-white">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`w-full flex items-center justify-between text-gray text-sm font-bold py-2 px-3 ${dropdownOpen ? "border-b border-gray-100 shadow-none" : "shadow-md"}`}
        >
          <div className="flex items-center gap-2"><span>{`${parada?.code} - ${parada?.name}`}</span></div>
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
            style={{ transitionDuration: "2000ms", willChange: "max-height, opacity" }}
          >
            <li className="px-3 py-2 bg-white hover:bg-gray-100 cursor-pointer text-sm text-gray-dark">Placeholder</li>
          </ul>
        )}
      </div>

      {/* Stops List */}
      <ul className="relative">
        {parada?.arrivals.length === 0 ? (
          <>
            <div className="h-6" />
            <div className="flex flex-col items-center text-gray text-sm mt-4">
              <FiFileText size={40} className="text-brandRed mb-2" />
              <p>No se encontraron paradas para esta línea</p>
            </div>
          </>
        ) : (
          parada?.arrivals.map((arrival) => (<li key={arrival.lineId}>{arrival.lineName}</li>))
        )}
      </ul>
    </section>
  );
};