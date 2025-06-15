import React from "react";

type LineBadge = { num: string; color: string };

type ParadaItemProps = {
  id: string;
  name: string;
  lines: LineBadge[];
};

export const ParadaItem: React.FC<ParadaItemProps> = ({ id, name, lines }) => (
  <li className="w-full flex cursor-pointer hover:bg-gray-200 py-2 min-h-[64px]">
    <div className="w-32 shrink-0 flex items-center justify-center text-xl font-bold text-gray-800">
      {id}
    </div>
    <div className="flex-1">
      <div className="text-[#4e75af] font-bold">{name}</div>
      <div className="flex flex-wrap">
        {lines.map((l) => (
          <span
            key={l.num}
            className="text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded"
            style={{ backgroundColor: l.color }}
          >
            {l.num}
          </span>
        ))}
      </div>
    </div>
  </li>
);