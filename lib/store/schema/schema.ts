import { BinaryFiles } from "@excalidraw/excalidraw/types";
import { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { TaskCategory, TaskStatus, Task } from "@prisma/client"

export interface FileRecord {
    key: string;
    files: BinaryFiles;
    drawingId?: string;
}
export interface ElementRecord {
    key: string;
    elements: OrderedExcalidrawElement[];
}

export interface Page extends TaskCategory {
    taskStatus: string[]
}
export interface taskStatus extends TaskStatus {
  tasks: Task[]
}