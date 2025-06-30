import { useState } from "react";
import { FiFileText } from "react-icons/fi";

interface ParadasProps {
  onSearchParada: (stopId: string) => void;
}

const Paradas: React.FC<ParadasProps> = ({ onSearchParada }) => {
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const handleSearch = () => {
    const trimmed = search.trim();
    if (trimmed) {
      setSearch("");
      console.log("Buscando parada:", trimmed);
      onSearchParada(trimmed); 
    }
  };

  return (
    <section className="max-w-xl mx-auto">
      {/* Search bar */}
      <div className="mb-3 mt-3 flex items-end gap-2">
        {/* Input container with underline */}
        <div className="flex-1 border-b border-gray-light">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Introduzca código de parada...."
            className="w-full px-2 py-1 outline-none bg-transparent"
          />
        </div>

        {/* Search button */}
        <button onClick={handleSearch} className="px-4 py-1 text-white text-base rounded shadow-sm bg-brandRed">Buscar</button>
      </div>

      {/* Recent searches */}
      <div>
        <p className="text-gray-light text-sm mb-3 text-center">
          Últimas paradas consultadas
        </p>

        {history.length === 0 ? (
          <div className="flex flex-col items-center text-gray text-sm mt-20">
            <FiFileText size={40} className="text-brandRed mb-2" />
            <p>No hay paradas recientes para mostrar</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {history.map((item, idx) => (<li key={idx} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer text-sm">{item}</li>))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Paradas;