import { useState } from "react";
import NavBar from "./views/components/NavBar";
import Paradas from "./views/Paradas";
import Favoritos from "./views/Favoritos";
import Lineas from "./views/Lineas";
import { Linea } from "./views/models/lineas/Linea";

type AppState =
  | { view: "paradas" }
  | { view: "favoritos" }
  | { view: "lineas" }
  | { view: "lineDetail"; line: Linea };

function App() {
  const [state, setState] = useState<AppState>({ view: "paradas" });

  return (
    <div className="pt-16">
      <NavBar currentView={state.view === "lineDetail" ? "lineas" : state.view} onNavigate={(v) => setState({ view: v })}/>

      <main>
        {state.view === "paradas" && <Paradas />}
        {state.view === "favoritos" && <Favoritos />}
        {state.view === "lineas" && (<Lineas onSelectLine={(line) => setState({ view: "lineDetail", line })} />)}
        {state.view === "lineDetail" && (state.line.render())}
      </main>
    </div>
  );
}

export default App;