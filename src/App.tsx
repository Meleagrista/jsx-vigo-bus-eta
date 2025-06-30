import { useState } from "react";
import NavBar from "./views/components/NavBar";
import Paradas from "./views/Paradas";
import Favoritos from "./views/Favoritos";
import Lineas from "./views/Lineas";
import { ParadaView } from "./views/models/paradas/ParadaView";
import { Linea } from "./views/models/lineas/Linea";
import { Parada } from "./views/models/paradas/Parada";

type AppState =
  | { view: "paradas" }
  | { view: "favoritos" }
  | { view: "lineas" }
  | { view: "lineDetail"; line: Linea }
  | { view: "paradaDetail"; paradaId: string };

function App() {
  const [state, setState] = useState<AppState>({ view: "favoritos" });

  return (
    <div className="pt-16">
      <NavBar
        currentView={state.view === "lineDetail" || state.view === "paradaDetail" ? "paradas" : state.view}
        onNavigate={(v) => setState({ view: v })}
      />

      <main>
        {state.view === "paradas" && (<Paradas onSearchParada={(stopId) => { setState({ view: "paradaDetail", paradaId: stopId });}} />)}
        {state.view === "favoritos" && <Favoritos />}
        {state.view === "lineas" && (<Lineas onSelectLine={(line) => setState({ view: "lineDetail", line })} />)}
        {state.view === "lineDetail" && (state.line.render())}
        {state.view === "paradaDetail" && (<ParadaView paradaId={state.paradaId} />)}
      </main>
    </div>
  );
}

export default App;