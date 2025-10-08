import { Events } from "@prisma/client";
import { db, PlanifyDB } from "./dexie";
import {
  addPageSchema,
  addStatusSchema,
  AddTaskSchema,
  editDrawingNameSchema,
  saveElement,
  updateTaksIndexSchema,
} from "../types/schema";
import { TasksStore, taskStore } from "./tasks-store";
import { createDrawingStorage, DrawingStorage } from "./excali-store";
import z from "zod";
import { updateTaskIndex } from "../actions/task";

class SyncManager {
  private apiUrl: string;
  private db: PlanifyDB;
  private taskStore: TasksStore;
  constructor(apiUrl: string, db: PlanifyDB, taskStore: TasksStore) {
    this.apiUrl = apiUrl;
    this.db = db;
    this.taskStore = taskStore;
  }
  async sync() {
    try {
      const isFirstRun = await this.isLocalDBEmpty();
      if (isFirstRun) {
        console.log("attemping full sync");
        await this.fullSync();
        return;
      }
      const lastSyncedAt = await this.db.metadata.get("lastSync");
      console.log("lastSyncedAt", lastSyncedAt);
      const res = await fetch(
        `${this.apiUrl}/api/bsync?sync=${lastSyncedAt?.lastSyncedAt?.toUTCString()}`,
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const events = (await res.json()) as Events[];
      console.log("events", events);
      for (const event of events) {
        //TODO:change this to use extends class for one fxn
        switch (event.type) {
          case "addPage": {
            const data = addPageSchema.parse(event.data);
            await this.taskStore.createPage({
              pageId: data.pageId,
              doneStatusId: data.doneId,
              inProgressStatusId: data.inProgressId,
              name: data.name,
              todoStatusId: data.todoId,
            });
            break;
          }
          case "addTask": {
            const data = AddTaskSchema.parse(event.data);
            if (!data.taskId) {
              throw new Error("Task ID is required");
            }
            await this.taskStore.createTask({
              id: data.taskId,
              statusId: data.statusId,
              text: data.text,
              tags: data.tags,
              time: data.time,
              priority: data.priority ?? "",
              dueDate: data.dueDate,
            });
            break;
          }
          case "addStatus": {
            const data = addStatusSchema.parse(event.data);
            await this.db.taskStatus.add({
              categoryId: data.pageId,
              name: data.name,
              id: data.statusId,
              createdAt: new Date(), // TODO:Add All fields
              updatedAt: new Date(),
              primaryColor: "bg-gray-600",
              tasks: [],
            });
          }
          case "toggleStatus": {
            const data = z
              .object({
                id: z.string().uuid(),
                status: z.string().uuid(),
              })
              .parse(event.data);
            await this.db.tasks.update(data.id, { statusId: data.status });
          }
          case "updateTaskIndex": {
            const data = updateTaksIndexSchema.parse(event.data);
            if (data.opts) {
              await db.tasks.update(data.opts.taskId, {
                statusId: data.opts.statusId,
              });
            }
            await this.db.transaction("rw", this.db.tasks, async () => {
              data.tasks.forEach((task) => {
                this.db.tasks.update(task.id, { taskIndex: task.taskIndex });
              });
            });
          }
          case "save_element": {
            const data = saveElement.parse(event.data);
            const exist = await this.db.drawings.get(data.id);
            if (!exist) {
              await this.db.drawings.put({
                id: data.id,
                elements: data.elements,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
            } else {
              await this.db.drawings.update(data.id, {
                elements: data.elements,
                updatedAt: new Date(),
              });
            }
          }
          case "editDrawingName": {
            const data = editDrawingNameSchema.parse(event.data);
            await this.db.drawings.update(data.id, {
              name: data.name,
              updatedAt: new Date(),
            });
          }
          case "editTaskDescription": {
            const data = z
              .object({
                id: z.string().uuid(),
                description: z.string().min(1),
              })
              .parse(event.data);
            await this.db.tasks.update(data.id, {
              description: data.description,
              updatedAt: new Date(),
            });
          }
          case "editTaskName": {
            const data = z
              .object({
                id: z.string().uuid(),
                name: z.string().min(1),
              })
              .parse(event.data);
            await this.db.tasks.update(data.id, {
              text: data.name,
              updatedAt: new Date(),
            });
          }
          case "deleteTask": {
            const data = z.string().uuid().parse(event.data);
            await this.db.tasks.delete(data);
          }
          case "deleteStatus": {
            const data = z.string().uuid().parse(event.data);
            await this.db.taskStatus.delete(data);
          }
          case "deleteDrawing": {
            const data = z.string().uuid().parse(event.data);
            await this.db.drawings.delete(data);
          }
          case "deletePage": {
            const data = z.string().uuid().parse(event.data);
            await this.taskStore.deletePage(data);
          }
        }
      }
    } catch (err) {
      console.error("Error during full sync:", err);
    }
  }
  private async isLocalDBEmpty() {
    const lastSync = await this.db.metadata.get("lastSync");
    return !lastSync;
  }
  private async fullSync() {
    const res = await fetch(`${this.apiUrl}/api/bsync`);
    if (!res.ok) {
      throw new Error(`Failed to sync: ${res.status} ${res.statusText}`);
    }
    const { tables, metadata } = await res.json();
    for (const [table, data] of Object.entries(tables)) {
      if (table === "pages") {
        await this.db.pages.bulkAdd(
          data.map((page) => ({
            id: page.id,
            name: page.name,
            createdAt: page.createdAt,
            updatedAt: page.updatedAt,
            userId: page.userId,
            taskStatus: page.taskStatus.map((status) => status.id),
          })),
        );
      }
      if (table === "taskStatus") {
        await this.db.taskStatus.bulkAdd(
          data.map((status) => ({
            id: status.id,
            name: status.name,
            primaryColor: status.primaryColor,
            createdAt: status.createdAt,
            updatedAt: status.updatedAt,
            userId: status.userId,
            categoryId: status.categoryId,
          })),
        );
      }
      if (table === "tasks") {
        await this.db.tasks.bulkAdd(
          data.map((task) => ({
            id: task.id,
            text: task.text,
            description: task.description,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
            tags: task.tags,
            taskIndex: task.taskIndex,
            statusId: task.statusId,
            time: task.time ?? null,
            dueDate: task.dueDate ?? null,
            priority: task.priority ?? null,
          })),
        );
      }
      if (table === "drawings") {
        await this.db.drawings.bulkAdd(
          data.map((drawing) => ({
            id: drawing.id,
            name: drawing.name,
            createdAt: drawing.createdAt,
            updatedAt: drawing.updatedAt,
            elements: drawing.elements ?? [],
            userId: drawing.userId,
          })),
        );
      }
      await this.db.metadata.put({
        key: "lastSync",
        lastSyncedAt: new Date(metadata.lastSyncedAt),
      });
    }
  }
}

const syncManager = new SyncManager(
  process.env.NEXT_PUBLIC_BASE_URL!,
  db,
  taskStore,
);

export { syncManager };
