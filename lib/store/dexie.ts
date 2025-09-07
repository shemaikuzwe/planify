import Dexie, { Table } from "dexie";
import { BinaryFiles } from "@excalidraw/excalidraw/types";

export interface FileRecord {
  key: string;
  files: BinaryFiles;
  drawingId?: string;
}

// Elements table record type needs to be declared before class usage
export interface DrawingElementsRecord {
  key: string; // e.g., `drawing-<id>` or `drawing-new`
  data: Record<string, { element: any; lastUpdated: string }>;
  drawingId?: string;
}

class PlanifyDB extends Dexie {
  public files!: Table<FileRecord, string>;
  public elements!: Table<DrawingElementsRecord, string>;

  constructor() {
    super("planify");
    // v1: files store
    this.version(1).stores({
      files: "&key",
    });
    // v2: add elements store
    this.version(2).stores({
      files: "&key",
      elements: "&key",
    });
  }
}

export const db = new PlanifyDB();