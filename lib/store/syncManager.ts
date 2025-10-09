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
import z from "zod";

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
      const { events, metadata } = (await res.json()) as {
        events: Events[];
        metadata: any;
      };
      console.log("attempt events sync", events);
      if (!events.length) {
        await this.db.metadata.put({
          key: "lastSync",
          lastSyncedAt: new Date(metadata.lastSyncedAt),
        });
        return;
      }
      for (const event of events) {
        //TODO:change this to use extends class for one fxnI
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
              createdAt: event.createdAt,
              updatedAt: event.createdAt,
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
            await this.db.tasks.update(data.id, {
              statusId: data.status,
              updatedAt: event.createdAt,
            });
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
                elements: data.elements as unknown as any,
                createdAt: new Date(),
                updatedAt: new Date(),
                name: "Untitled",
                userId: (event as any).userId,
              });
            } else {
              await this.db.drawings.update(data.id, {
                elements: data.elements as unknown as any,
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
            const data = z
              .object({
                id: z.string().uuid(),
              })
              .parse(event.data);
            await this.db.tasks.delete(data.id);
          }
          case "deleteStatus": {
            const data = z
              .object({
                id: z.string().uuid(),
              })
              .parse(event.data);
            await this.db.taskStatus.delete(data.id);
          }
          case "deleteDrawing": {
            const data = z
              .object({
                id: z.string().uuid(),
              })
              .parse(event.data);
            await this.db.drawings.delete(data.id);
          }
          case "deletePage": {
            const data = z
              .object({
                id: z.string().uuid(),
              })
              .parse(event.data);
            await this.taskStore.deletePage(data.id);
          }
        }
        await this.db.metadata.put({
          key: "lastSync",
          lastSyncedAt: new Date(metadata.lastSyncedAt),
        });
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
    await this.db.delete(); //delete all data locally
    await this.db.open();
    const res = await fetch(`${this.apiUrl}/api/bsync`);
    if (!res.ok) {
      throw new Error(`Failed to sync: ${res.status} ${res.statusText}`);
    }
    const { tables, metadata } = await res.json();
    for (const [table, data] of Object.entries(tables)) {
      if (!Array.isArray(data)) {
        continue;
      }
      switch (table) {
        case "pages":
          await this.db.pages.bulkAdd(
            data.map((page: any) => ({
              id: page.id,
              name: page.name,
              createdAt: page.createdAt,
              updatedAt: page.updatedAt,
              userId: page.userId,
              taskStatus: page.taskStatus.map((status: any) => status.id),
            })),
          );
          break;
        case "taskStatus":
          await this.db.taskStatus.bulkAdd(
            data.map((status: any) => ({
              id: status.id,
              name: status.name,
              primaryColor: status.primaryColor,
              createdAt: status.createdAt,
              updatedAt: status.updatedAt,
              userId: status.userId,
              categoryId: status.categoryId,
              tasks: [],
            })),
          );
          break;
        case "tasks":
          await this.db.tasks.bulkAdd(
            data.map((task: any) => ({
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
          break;
        case "drawings":
          await this.db.drawings.bulkAdd(
            data.map((drawing: any) => ({
              id: drawing.id,
              name: drawing.name,
              createdAt: drawing.createdAt,
              updatedAt: drawing.updatedAt,
              elements: drawing.elements ?? [],
              userId: drawing.userId,
            })),
          );
          break;
      }
    }
    await this.db.metadata.put({
      key: "lastSync",
      lastSyncedAt: new Date(metadata.lastSyncedAt),
    });
  }
}

const syncManager = new SyncManager(
  process.env.NEXT_PUBLIC_BASE_URL!,
  db,
  taskStore,
);

export { syncManager };
