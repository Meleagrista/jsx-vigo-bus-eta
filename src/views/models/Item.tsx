import React from "react";

export abstract class Item {
  id: string;
  code: string;

  constructor(id: string, code: string) { 
    this.id = id; 
    this.code = code;
  }

  abstract render(onBack: () => void): React.ReactNode;

  abstract list(): React.ReactNode;
}