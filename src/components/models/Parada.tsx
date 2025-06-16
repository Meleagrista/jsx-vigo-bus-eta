import React from "react";
import { Item } from "./Item";

type LineBadge = { num: string; color: string };

export class Parada extends Item {
  name: string;
  lines: LineBadge[];

  constructor(id: string, name: string, lines: LineBadge[]) {
    super(id);
    this.name = name;
    this.lines = lines;
  }

  render(): React.ReactNode {
    return (
      <li className="w-full cursor-pointer flex min-h-[64px] hover:bg-gray-100 transition-colors">
        <div className="w-32 shrink-0 flex items-center justify-center text-xl font-bold text-gray-800">
          {this.id}
        </div>
        <div className="flex-1 py-2 px-2">
          <div className="text-brandBlue font-bold">{this.name}</div>
          <div className="flex flex-wrap">
            {this.lines.map((line) => (
              <span
                key={line.num}
                className="text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded"
                style={{ backgroundColor: line.color }}
              >
                {line.num}
              </span>
            ))}
          </div>
        </div>
      </li>
    );
  }
}