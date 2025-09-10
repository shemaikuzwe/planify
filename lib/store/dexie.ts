import Dexie, { Table } from "dexie";
import { BinaryFiles } from "@excalidraw/excalidraw/types";

export interface FileRecord {
  key: string;
  files: BinaryFiles;
  drawingId?: string;
}

export interface DrawingElementsRecord {
  key: string;
  data: Record<string, { element: any; lastUpdated: string }>;
  drawingId?: string;
}

class PlanifyDB extends Dexie {
  public files!: Table<FileRecord, string>;
  public elements!: Table<DrawingElementsRecord, string>;

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

export const db = new PlanifyDB();