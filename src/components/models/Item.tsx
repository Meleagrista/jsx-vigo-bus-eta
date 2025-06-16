import React from "react";

export abstract class Item {
  id: string;

  constructor(id: string) { this.id = id; }

  abstract render(): React.ReactNode;
}