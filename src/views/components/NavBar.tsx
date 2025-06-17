import React from "react";
import { IoStarOutline, IoSyncOutline } from "react-icons/io5";
import { FaBus } from "react-icons/fa";

type NavBarProps = {
  currentView: "paradas" | "favoritos" | "lineas";
  onNavigate: (view: "paradas" | "favoritos" | "lineas") => void;
};

const NavBar: React.FC<NavBarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
  { view: "paradas", icon: <FaBus size={18} /> },
  { view: "favoritos", icon: <IoStarOutline size={18} /> },
  { view: "lineas", icon: <IoSyncOutline size={18} /> },
];

  return (
  <nav className="fixed top-0 left-0 right-0 bg-white shadow-md flex items-center px-8 py-2 z-50">
    <div className="flex justify-evenly w-full max-w-4xl mx-auto">
      {navItems.map(({ view, icon }) => (
        <button
          key={view}
          onClick={() => onNavigate(view as "paradas" | "favoritos" | "lineas")}
          className="flex flex-col items-center text-xs uppercase px-3 py-1 rounded-md text-gray-700 hover:bg-gray-200"
        >
          {React.cloneElement(icon, { size: 18 })}
          <span className="mt-1">{view}</span>
        </button>
      ))}
    </div>
  </nav>
  );
};

export default NavBar;