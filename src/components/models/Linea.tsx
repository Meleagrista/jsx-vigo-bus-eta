import React from "react";
import { Item } from "./Item";

export class Linea extends Item {
  start: string;
  end: string;
  color: string;

  constructor(id: string, start: string, end: string, color: string) {
    super(id);
    this.start = start;
    this.end = end;
    this.color = color;
  }

  render(): React.ReactNode {
    const transparentBg = `${this.color}2A`;

    return (
      <li
        className="w-full cursor-pointer flex min-h-[64px] hover:brightness-95 transition-all"
        style={{ backgroundColor: transparentBg }}
      >
        <div
          className="w-32 shrink-0 flex items-center justify-center text-xl font-bold text-white"
          style={{ backgroundColor: this.color }}
        >
          {this.id}
        </div>
        <div className="flex-1 flex flex-col justify-center items-center text-brandBlue text-base font-bold">
          <span>{this.start}</span>
          <span>{this.end}</span>
        </div>
      </li>
    );
  }
}