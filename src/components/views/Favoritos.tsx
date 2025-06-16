import React, { useState } from "react";
import { Item } from "../models/Item";
import { Parada } from "../models/Parada";
import { Linea } from "../models/Linea";
import { FiFileText } from "react-icons/fi";

type Filter = "todos" | "lineas" | "paradas";

const filters: Filter[] = ["todos", "lineas", "paradas"];

const favoritos: Item[] = [
  new Parada("742", "Praza América", [
    { num: "1", color: "#982135" },
    { num: "12", color: "#0072BC" },
    { num: "23", color: "#F4971E" },
  ]),
  new Linea("L-1", "Línea 1", "Circular", "#4e75af"),
  new Parada("123", "Urzaiz 45", [
    { num: "4A", color: "#00823E" },
    { num: "5", color: "#F8443C" },
  ]),
];

const Favoritos: React.FC = () => {
  const [filter, setFilter] = useState<Filter>("todos");

  const favoritosFiltrados = favoritos.filter((f) => {
    if (filter === "todos") return true;
    if (filter === "paradas") return f instanceof Parada;
    if (filter === "lineas") return f instanceof Linea;
    return false;
  });

  return (
    <section className="">
      <nav className="flex justify-evenly py-3">
        {filters.map((f) => (
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
      <ul className="divide-y divide-gray-light">
        {favoritosFiltrados.length === 0 ? (
          <>
            {/* Add spacer to match search bar height */}
            <div className="h-6" />
            <div className="flex flex-col items-center text-gray text-sm mt-4">
              <FiFileText size={40} className="text-brandRed mb-2" />
              <p>No tiene paradas o lineas favoritas agregadas</p>
            </div>
          </>
        ) : (
          favoritosFiltrados.map((item) => item.render())
        )}
      </ul>
    </section>
  );
};

export default Favoritos;