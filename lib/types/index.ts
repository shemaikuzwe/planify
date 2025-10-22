import { Task, TaskStatus } from "@prisma/client";

export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type Drawing = {
  lastUpdated: Date | null;
  elements: string | null;
};

export interface TaskStatusTask extends TaskStatus {
  tasks: Task[];
}
export type PageType = "TASK" | "PROJECT";
