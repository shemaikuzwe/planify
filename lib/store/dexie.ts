import Dexie, { Table } from "dexie";
import { FileRecord } from "./schema/schema";
import { ElementRecord } from "./schema/schema";
import { Page } from "./schema/schema";
import { taskStatus } from "./schema/schema";
import { Task } from "@prisma/client";
class PlanifyDB extends Dexie {
  public files!: Table<FileRecord, string>;
  public elements!: Table<ElementRecord, string>;
  public pages!: Table<Page>;
  public taskStatus!: Table<taskStatus>;
  public tasks!: Table<Task>;

  constructor() {
    super("planify");
    this.version(1).stores({
      files: "&key",
    });
    this.version(2).stores({
      files: "&key",
      elements: "&key",
    });
    this.version(3).stores({
      pages:"@id",
      taskStatus:"@id",
      tasks:"@id"
    })
  }
}
const db = new PlanifyDB();
export { db };