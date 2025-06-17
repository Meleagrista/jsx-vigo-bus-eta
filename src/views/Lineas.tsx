import React, { useEffect, useState } from "react";
import { Linea } from "./models/Linea";
import { fetchLineasFromAPI } from "../services/Lineas"; // adjust path if needed

const LOCAL_STORAGE_KEY = "lineasCache";

const Lineas: React.FC = () => {
  const [lineas, setLineas] = useState<Linea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchLineasFromAPI()
      .then(setLineas)
      .catch((e) => setError("Error al cargar las líneas"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      {error && <p className="text-center text-brandRed">{error}</p>}

      {!loading && !error && (
        <ul className="divide-y divide-gray-light">
          {lineas.map((linea) => linea.render())}
        </ul>
      )}
    </section>
  );
};

export default Lineas;