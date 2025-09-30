import Dexie, { Table } from "dexie";
import { FileRecord } from "./schema/schema";
import { ElementRecord } from "./schema/schema";
import { Page } from "./schema/schema";
import { taskStatus } from "./schema/schema";
import { Task } from "@prisma/client";
export class PlanifyDB extends Dexie {
  public files!: Table<FileRecord, string>;
  public drawings!: Table<ElementRecord, string>;
  public pages!: Table<Page>;
  public taskStatus!: Table<taskStatus>;
  public tasks!: Table<Task>;

  constructor() {
    super("planify");
    this.version(1).stores({
      files: "&key",
    });
    this.version(3).stores({
      files: "&key",
      drawings: "&id, userId, name",
    });
    this.version(4).stores({
      pages: "&id, userId",
      taskStatus: "&id, categoryId",
      tasks: "&id, statusId",
    });
  }
}
const db = new PlanifyDB();
db.drawings.hook("creating", () => {});
export { db };
