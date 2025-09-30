import { db, PlanifyDB } from "./dexie";
import { AddTaskValue } from "../types/schema";
import { syncChange } from "../utils/sync";

class TasksStore {
  private db: PlanifyDB;
  constructor(db: PlanifyDB) {
    this.db = db;
  }
  async addPage(name: string, userId: string) {
    const pageId = crypto.randomUUID();
    const todoStatusId = crypto.randomUUID();
    const inProgressStatusId = crypto.randomUUID();
    const doneStatusId = crypto.randomUUID();
    const todo = await this.db.taskStatus.add({
      name: "TODO",
      categoryId: pageId,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: todoStatusId,
      primaryColor: "bg-gray-600",
      tasks: [],
    });
    const inProgress = await this.db.taskStatus.add({
      name: "IN PROGRESS",
      categoryId: pageId,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: inProgressStatusId,
      primaryColor: "bg-blue-600",
      tasks: [],
    });
    const done = await this.db.taskStatus.add({
      name: "DONE",
      categoryId: pageId,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: doneStatusId,
      primaryColor: "bg-green-600",
      tasks: [],
    });
    const page = await this.db.pages.add({
      id: pageId,
      name,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      taskStatus: [todoStatusId, inProgressStatusId, doneStatusId],
    });
    syncChange("addPage", {
      pageId: page,
      name,
      todoId: todo,
      inProgressId: inProgress,
      doneId: done,
    });
  }
  async addTask(data: AddTaskValue) {
    const task = await this.db.tasks.add({
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      taskIndex: 0,
      text: data.text,
      description: null,
      time: data.time ?? null,
      tags: data.tags ?? [],
      statusId: data.statusId,
      priority: data.priority ?? null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    });
    return task;
  }
  async addStatus(data: { name: string; id?: string | undefined }) {
    if (!data.id) throw new Error("id is required");
    await this.db.taskStatus.add({
      categoryId: data.id,
      name: data.name,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: [],
      primaryColor: "bg-gray-600",
    });
  }

  async updateTaskIndex(tasks: { id: string; taskIndex: number }[]) {
    await this.db.transaction("rw", this.db.tasks, async () => {
      tasks.forEach((task) => {
        this.db.tasks.update(task.id, { taskIndex: task.taskIndex });
      });
    });
  }

  async deleteTask(id: string) {
    await this.db.tasks.delete(id);
  }
  async deleteStatus(id: string) {
    await this.db.taskStatus.delete(id);
  }
  async deletePage(id: string) {
    await this.db.pages.delete(id);
  }
}

const taskStore = new TasksStore(db);

export { taskStore };
