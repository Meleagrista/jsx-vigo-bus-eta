import React, { useState } from "react";
import { ParadaItem } from "../elements/Parada";
import { LineaItem } from "../elements/Linea";

type Filter = "todos" | "lineas" | "paradas";

const filters: Filter[] = ["todos", "lineas", "paradas"];

class Favorito {
  id: string;
  type: "linea" | "parada";
  constructor(id: string, type: "linea" | "parada") {
    this.id = id;
    this.type = type;
  }
}

class Parada extends Favorito {
  name: string;
  lines: LineBadge[];
  constructor(id: string, name: string, lines: LineBadge[]) {
    super(id, "parada");
    this.name = name;
    this.lines = lines;
  }
}

class Linea extends Favorito {
  start: string;
  end: string;
  color: string;
  constructor(id: string, start: string, end: string, color: string) {
    super(id, "linea");
    this.start = start;
    this.end = end;
    this.color = color;
  }
}

type LineBadge = { num: string; color: string };

// Sample data as class instances
const favoritos: Favorito[] = [
  new Parada("742", "Praza América", [
    { num: "1", color: "#982135" },
    { num: "12", color: "#0072BC" },
    { num: "23", color: "#F4971E" },
  ]),
  new Linea("L1", "Línea 1", "Circular", "#4e75af"),
  new Parada("123", "Urzaiz 45", [
    { num: "4A", color: "#00823E" },
    { num: "5", color: "#F8443C" },
  ]),
];

const Favoritos: React.FC = () => {
  const [filter, setFilter] = useState<Filter>("todos");

  const favoritosFiltrados = favoritos.filter((f) => {
    if (filter === "todos") return true;
    const singular = filter.slice(0, -1);
    return f.type === singular;
  });

  return (
    <section className="max-w-xl mx-auto">
      {/* Internal Filter NavBar */}
      <nav className="flex justify-evenly py-3">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`uppercase text-sm px-3 py-1 hover:bg-gray-100 rounded ${
              filter === f ? "font-bold" : "font-normal"
            }`}
          >
            {f}
          </button>
        ))}
      </nav>

      {/* List of Favoritos */}
      <ul className="divide-y divide-gray-300 border-b border-gray-300">
        {favoritosFiltrados.map((fav) =>
          fav.type === "parada" && (fav as Parada).lines ? (
            <ParadaItem
              key={fav.id}
              id={fav.id}
              name={(fav as Parada).name}
              lines={(fav as Parada).lines}
            />
          ) : fav.type === "linea" && (fav as Linea).color ? (
            <LineaItem
              key={fav.id}
              id={fav.id}
              start={(fav as Linea).start}
              end={(fav as Linea).end}
              color={(fav as Linea).color}
            />
          ) : null
        )}
      </ul>
    </section>
  );
};

export default Favoritos;