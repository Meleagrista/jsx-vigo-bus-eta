import React from "react";

type LineaItemProps = {
  id: string;
  start: string;
  end: string;
  color: string;
};

export const LineaItem: React.FC<LineaItemProps> = ({ id, start, end, color }) => {
  // Base transparent background (10% opacity)
  const transparentBg = `${color}1A`; // 1A hex = ~10% opacity

  // Slightly darker transparent bg for hover (20% opacity)
  const hoverBg = `${color}33`; // 33 hex = ~20% opacity

  return (
    <li
      className="w-full flex min-h-[64px] cursor-pointer"
      style={{ backgroundColor: transparentBg }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = hoverBg)}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = transparentBg)}
    >
      <div
        className="w-32 shrink-0 flex items-center justify-center text-xl font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {id}
      </div>
      <div className="flex-1 flex flex-col justify-center items-center text-[#4e75af] text-base font-bold">
        <span>{start}</span>
        <span>{end}</span>
      </div>
    </li>
  );
};