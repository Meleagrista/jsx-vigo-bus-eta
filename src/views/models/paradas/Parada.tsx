import React from "react";
import { Item } from "../Item";

export type LineBadge = { id: string; num: string; color: string };

export class Parada extends Item {
  name: string;
  lines: LineBadge[];

  constructor(id: string, code:string, name: string, lines: LineBadge[]) {
    super(id, code);
    this.name = name;
    this.lines = lines;
  }

  list(): React.ReactNode {
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

  dot(lineColor: string): React.ReactNode {
    return (
      <li className="flex min-h-[48px] cursor-pointer hover:bg-gray-100 transition-colors pl-6 pr-4">
        {/* Dot and vertical line container */}
        <div className="flex flex-col items-center mr-4 relative">
          {/* Line above dot */}
          <div 
            className="flex-1 w-px" 
            style={{ backgroundColor: lineColor }}
          />
          {/* Dot */}
          <div
            className="w-4 h-4 rounded-full z-10"
            style={{ backgroundColor: lineColor }}
          />
          {/* Line below dot */}
          <div 
            className="flex-1 w-px" 
            style={{ backgroundColor: lineColor }}
          />
        </div>

        {/* Text content */}
        <div className="flex-1">
          <div className="font-bold text-brandBlue leading-tight mt-1">
            ({this.id}) {this.name}
          </div>
          {/* Line badges or empty space placeholder */}
          <div className="flex flex-wrap mt-1 mb-1">
            {this.lines.length > 0
              ? this.lines.map((line) => (
                  <span
                    key={line.num}
                    className="text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded"
                    style={{ backgroundColor: line.color }}
                  >
                    {line.num}
                  </span>
                ))
              : <div className="h-6" />} {/* Empty space if no badges */}
          </div>
        </div>
      </li>
    );
  }

  render(): React.ReactNode {
    return this.list();
  }
}