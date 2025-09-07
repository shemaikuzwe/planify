import Dexie, { Table } from "dexie";
import { BinaryFiles } from "@excalidraw/excalidraw/types";

export interface FileRecord {
  key: string;
  files: BinaryFiles;
  drawingId?: string;
}

class PlanifyDB extends Dexie {
  public files!: Table<FileRecord, string>;

  constructor() {
    super("planify");
    this.version(1).stores({
      files: "&key",
    });
  }
}

export const db = new PlanifyDB();