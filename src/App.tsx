import { useState } from "react";
import NavBar from "./components/NavBar";
import Paradas from "./components/views/Paradas";
import Favoritos from "./components/views/Favoritos";
import Lineas from "./components/views/Lineas";

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