import Dexie, { Table } from "dexie";
import { BinaryFiles } from "@excalidraw/excalidraw/types";
import { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";

export interface FileRecord {
  key: string;
  files: BinaryFiles;
  drawingId?: string;
}
export interface ElementRecord {
  key: string;
  elements: OrderedExcalidrawElement[];
}

class PlanifyDB extends Dexie {
  public files!: Table<FileRecord, string>;
  public elements!: Table<ElementRecord, string>;

  constructor() {
    super("planify");
    this.version(1).stores({
      files: "&key",
    });
    this.version(2).stores({
      files: "&key",
      elements: "&key",
    });
  }
}
const db = new PlanifyDB();

export { db };