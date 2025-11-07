import { db, PlanifyDB } from "./dexie";
import { AddTaskValue } from "../types/schema";
import { syncChange } from "../utils/sync";
import { taskStatus } from "./schema/schema";
import { PageType } from "../types";

export class TasksStore {
  private db: PlanifyDB;
  constructor(db: PlanifyDB) {
    this.db = db;
  }
  async addPage(name: string, type: PageType, userId: string) {
    const pageId = crypto.randomUUID();
    const todoStatusId = crypto.randomUUID();
    const inProgressStatusId = crypto.randomUUID();
    const doneStatusId = crypto.randomUUID();
    await this.createPage({
      name,
      userId,
      pageId,
      todoStatusId,
      doneStatusId,
      inProgressStatusId,
      type: type,
    });
    syncChange("addPage", {
      pageId: pageId,
      name,
      type,
      todoId: todoStatusId,
      inProgressId: inProgressStatusId,
      doneId: doneStatusId,
    });
    return { pageId };
  }
  async addTask(data: AddTaskValue) {
    const id = crypto.randomUUID();
    await this.createTask({
      id,
      text: data.text,
      time: data.time ?? undefined,
      tags: data.tags,
      statusId: data.statusId,
      priority: data.priority as unknown as any,
      dueDate: data.dueDate ?? undefined,
    });
    const task = await this.db.tasks.get(id);
    if (!task) throw new Error("Task not found");
    syncChange("addTask", {
      taskId: task.id,
      text: task.text,
      description: task.description,
      time: task.time,
      tags: task.tags,
      statusId: task.statusId,
      priority: task.priority as unknown as any,
      dueDate: task.dueDate,
    });
    return task;
  }
  async editTaskDescription(id: string, description: string) {
    if (!id) throw new Error("id is required");
    const task = await this.db.tasks.get(id);

    if (!task || !task.id) throw new Error("Task not found");
    await this.db.tasks.update(id, { description });
    syncChange("editTaskDescription", {
      taskId: task.id,
      description: description,
    });
  }
  async addStatus(data: { name: string; id: string }) {
    if (!data.id) throw new Error("id is required");
    const statusId = await this.db.taskStatus.add({
      categoryId: data.id,
      name: data.name,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: [],
      primaryColor: "bg-neutral-600",
      statusIndex: 0,
    });
    syncChange("addStatus", {
      statusId: statusId,
      name: data.name,
      pageId: data.id,
    });
  }
  async toggleStatus(taskId: string, statusId: string) {
    await this.db.tasks.update(taskId, { statusId });
    syncChange("toggleStatus", {
      taskId: taskId,
      statusId: statusId,
    });
  }

  async updateTaskIndex(
    tasks: { id: string; taskIndex: number }[],
    opts?: { taskId: string; statusId: string },
  ) {
    //we will update the task status
    if (opts) {
      await db.tasks.update(opts.taskId, { statusId: opts.statusId });
    }
    await this.db.transaction("rw", this.db.tasks, async () => {
      tasks.forEach((task) => {
        this.db.tasks.update(task.id, { taskIndex: task.taskIndex });
      });
    });
    syncChange("updateTaskIndex", {
      tasks: tasks.map((task) => ({
        id: task.id,
        taskIndex: task.taskIndex,
      })),
      opts: opts ? { taskId: opts.taskId, statusId: opts.statusId } : undefined,
    });
  }
  async updateStatusIndex(statuses: taskStatus[]) {
    await db.taskStatus.bulkPut(statuses);
    console.log("Statuses updated");
    syncChange("updateStatusIndex", statuses);
  }
  async editName(id: string, name: string) {
    await this.db.tasks.update(id, { text: name });
    syncChange("editTaskName", {
      id: id,
      name: name,
    });
  }

  async deleteTask(id: string) {
    await this.db.tasks.delete(id);
    syncChange("deleteTask", { id: id });
  }
  async deleteStatus(id: string) {
    await this.db.taskStatus.delete(id);
    syncChange("deleteStatus", { id: id });
  }
  async deletePage(id: string) {
    await this.db.pages.delete(id);
    syncChange("deletePage", { id: id });
  }
  async createPage({
    pageId,
    todoStatusId,
    inProgressStatusId,
    doneStatusId,
    name,
    userId,
    type,
    createdAt,
  }: {
    pageId: string;
    todoStatusId: string;
    inProgressStatusId: string;
    doneStatusId: string;
    name: string;
    userId?: string;
    type: PageType;
    createdAt?: Date | string;
  }) {
    await this.db.taskStatus.add({
      name: "TODO",
      categoryId: pageId,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      updatedAt: createdAt ? new Date(createdAt) : new Date(),
      id: todoStatusId,
      primaryColor: "bg-gray-600",
      tasks: [],
      statusIndex: 0,
    });
    await this.db.taskStatus.add({
      name: "IN PROGRESS",
      categoryId: pageId,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      updatedAt: createdAt ? new Date(createdAt) : new Date(),
      id: inProgressStatusId,
      primaryColor: "bg-blue-600",
      tasks: [],
      statusIndex: 1,
    });
    await this.db.taskStatus.add({
      name: "DONE",
      categoryId: pageId,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      updatedAt: createdAt ? new Date(createdAt) : new Date(),
      id: doneStatusId,
      primaryColor: "bg-green-600",
      tasks: [],
      statusIndex: 2,
    });
    await this.db.pages.add({
      id: pageId,
      name,
      userId: userId || "",
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      updatedAt: createdAt ? new Date(createdAt) : new Date(),
      taskStatus: [todoStatusId, inProgressStatusId, doneStatusId],
      type,
    });
  }
  async createTask(data: {
    id: string;
    text: string;
    time?: string;
    tags?: string[];
    statusId: string;
    priority: string;
    dueDate?: string;
    createdAt?: string | Date;
  }) {
    await this.db.tasks.add({
      id: data.id,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      taskIndex: 0,
      text: data.text,
      description: null,
      time: data.time ?? null,
      tags: data.tags ?? [],
      statusId: data.statusId,
      priority: (data.priority as unknown as any) ?? null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    });
  }
}

const taskStore = new TasksStore(db);

export { taskStore };
