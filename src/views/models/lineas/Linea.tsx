import React from "react";
import { Item } from "../Item";
import { Parada } from "../paradas/Parada";
import { LineaView } from "./LineaView";

export class Linea extends Item {
  start: string;
  end: string;
  color: string;
  stopsIda: Parada[];
  stopsVuelta: Parada[];

  constructor(
    id: string,
    code: string,
    start: string,
    end: string,
    color: string,
    stopsIda: Parada[] = [],
    stopsVuelta: Parada[] = []
  ) {
    super(id, code);
    this.start = start;
    this.end = end;
    this.color = color;
    this.stopsIda = stopsIda;
    this.stopsVuelta = stopsVuelta;
  }

  toJSON() {
    return {
      id: this.id,
      code: this.code,
      start: this.start,
      end: this.end,
      color: this.color,
    };
  }

  render(): React.ReactNode {
    return (<LineaView linea={this} />);
  }

  list(onClick?: () => void): React.ReactNode {
    const transparentBg = `${this.color}2A`;

    return (
      <li
        key={this.id}
        onClick={onClick}
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