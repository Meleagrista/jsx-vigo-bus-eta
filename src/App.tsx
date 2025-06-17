import { useState } from "react";
import NavBar from "./views/components/NavBar";
import Paradas from "./views/Paradas";
import Favoritos from "./views/Favoritos";
import Lineas from "./views/Lineas";

type View = "paradas" | "favoritos" | "lineas";

function App() {
  const [view, setView] = useState<View>("paradas");

  return (
    <div className="pt-16"> {/* to offset fixed navbar */}
      <NavBar currentView={view} onNavigate={setView} />
      <main>
        {view === "paradas" && <Paradas />}
        {view === "favoritos" && <Favoritos />}
        {view === "lineas" && <Lineas />}
      </main>
    </div>
  );
}

export default App;