import { z } from "zod";
export const AddTaskSchema = z.object({
  text: z.string({ required_error: "Task name is required" }).min(1).max(50),
  time: z.string().optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  dueDate: z.string().optional(),
  taskId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  statusId: z.string().uuid(),
});
export type AddTaskValue = z.infer<typeof AddTaskSchema>;

export const AddCategorySchema = z.object({
  name: z
    .string({ required_error: "Category name is required" })
    .min(1)
    .max(50),
  userId: z.string(),
});

export const addDailyTodoSchema = z.object({
  name: z
    .string({ required_error: "Daily todo name is required" })
    .min(1)
    .max(50),
  userId: z.string(),
});

export const ToggleTaskStatusSchema = z.object({
  taskId: z.string().uuid(),
  status: z.string(),
});

export const saveDrawingSchema = z.object({
  elements: z.string(),
  title: z.string().min(2),
  description: z.string().optional(),
});

export const updateDrawingSchema = z.object({
  elements: z.string(),
  drawingId: z.string().uuid(),
});

export const addPageSchema = z.object({
  name: z.string().min(2),
  pageId: z.string().uuid(),
  todoId: z.string().uuid(),
  inProgressId: z.string().uuid(),
  doneId: z.string().uuid(),
});
export const syncOptions = [
  "save-element",
  "editDrawingName",
  "addPage",
  "addTask",
  "updateTaksIndex",
  "deleteTask",
  "deleteStatus",
  "deletePage",
] as const;
export type SyncType = (typeof syncOptions)[number];
