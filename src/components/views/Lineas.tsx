import { useState } from "react";
import { Linea } from "../models/Linea";

const mockLineas: Linea[] = [
  new Linea("21", "Línea 21", "Este", "#4e75af"),
  new Linea("40", "Línea 40", "Centro", "#f8443c"),
  new Linea("10", "Línea 10", "Norte", "#00823E"),
];

const Lineas: React.FC = () => {
  const [lineas] = useState<Linea[]>(mockLineas);

  return (
    <section className="mx-auto space-y-4">
      <ul className="divide-y divide-gray-light">
        {lineas.map((linea) => linea.render())}
      </ul>
    </section>
  );
};

export default Lineas;