import { BinaryFiles } from "@excalidraw/excalidraw/types";
import { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { TaskCategory, TaskStatus, Task } from "@prisma/client";
import { StoredFiles } from "@/lib/types";

export interface FileRecord {
  key: string;
  files: StoredFiles;
}
export interface ElementRecord {
  userId: string;
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  elements: OrderedExcalidrawElement[];
}

export interface Page extends TaskCategory {
  taskStatus: string[];
}
export interface taskStatus extends TaskStatus {
  tasks: Task[];
}

export interface Metadata {
  key: string;
  lastSyncedAt: Date;
}
