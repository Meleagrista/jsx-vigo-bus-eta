import React, { useEffect, useState } from "react";
import { Linea } from "./models/lineas/Linea";
import { fetchLineasFromAPI } from "./models/lineas/LineaController"; // adjust path if needed

const LOCAL_STORAGE_KEY = "lineasCache";

interface Props {
  onSelectLine: (line: Linea) => void;
}

const Lineas: React.FC<Props> = ({ onSelectLine }) => {
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchLineasFromAPI(true)
      .then(setLineas)
      .catch((e) => setError("Error al cargar las líneas."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      {error && <p className="text-center text-brandRed">{error}</p>}

      {!loading && !error && (
        <ul className="divide-y divide-gray-light">
         {lineas.map((linea) => linea.list(() => onSelectLine(linea)))}
        </ul>
      )}
    </section>
  );
};

export default Lineas;