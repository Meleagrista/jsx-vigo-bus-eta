import React from "react";
import { Item } from "../Item";

type LineBadge = { num: string; color: string };

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
      <li className="flex items-center min-h-[64px] relative cursor-pointer hover:bg-gray-100 transition-colors pl-20">
        <div
          className="absolute left-14"
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            backgroundColor: lineColor,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
          }}
        />
        <div className="flex-1">
          <div className="font-bold text-brandBlue">
            ({this.id}) {this.name}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
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

  render(): React.ReactNode {
    return this.list();
  }
}