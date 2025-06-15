import { useState } from "react";

type Linea = {
  id: number;
  name: string;
  description?: string;
};

const mockLineas: Linea[] = [
  { id: 1, name: "Línea 21 - Este", description: "Ruta por Av. Libertad" },
  { id: 2, name: "Línea 40 - Centro", description: "Conecta barrios con el centro" },
  { id: 3, name: "Línea 10 - Norte", description: "Recorre zonas industriales" },
];

const Lineas: React.FC = () => {
  const [lineas] = useState<Linea[]>(mockLineas);

  return (
    <section className="max-w-xl mx-auto px-4 mt-4 space-y-4">
      <h2 className="text-xl font-semibold mb-2 text-center">Líneas disponibles</h2>

      <ul className="space-y-3">
        {lineas.map((linea) => (
          <li
            key={linea.id}
            className="p-4 bg-white rounded shadow hover:shadow-md transition-shadow border border-gray-200"
          >
            <h3 className="text-lg font-medium text-blue-700">{linea.name}</h3>
            {linea.description && (
              <p className="text-sm text-gray-600">{linea.description}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Lineas;