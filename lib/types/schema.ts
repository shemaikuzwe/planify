import { z } from "zod";
export const AddTaskSchema = z.object({
  text: z.string({ required_error: "Task name is required" }).min(1).max(50),
  time: z.string().optional().nullable(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  dueDate: z.string().optional().nullable(),
  taskId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  statusId: z.string().uuid(),
});
export type AddTaskValue = z.infer<typeof AddTaskSchema>;

export const ToggleTaskStatusSchema = z.object({
  taskId: z.string().uuid(),
  status: z.string(),
});

export const addDrawingSchema = z.object({
  elements: z.array(z.any()),
  id: z.string(),
});

export const saveElement = z.object({
  elements: z.array(z.any()),
  id: z.string().uuid(),
});

export const addPageSchema = z.object({
  name: z.string().min(2),
  pageId: z.string().uuid(),
  todoId: z.string().uuid(),
  inProgressId: z.string().uuid(),
  doneId: z.string().uuid(),
});

export const addStatusSchema = z.object({
  name: z.string().min(2),
  statusId: z.string().uuid(),
  pageId: z.string().uuid(),
});

export const updateTaksIndexSchema = z.object({
  tasks: z.array(
    z.object({ id: z.string().uuid(), taskIndex: z.number().min(0) }),
  ),
  opts: z
    .object({
      taskId: z.string().uuid(),
      statusId: z.string().uuid(),
    })
    .optional(),
});

export const editDrawingNameSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
});
export const changeStatusSchema = z.object({
  statusId: z.string().uuid(),
  color: z.string(),
});

export const syncOptions = [
  "save_element",
  "editDrawingName",
  "editTaskDescription",
  "addPage",
  "addTask",
  "addStatus",
  "toggleStatus",
  "updateTaskIndex",
  "deleteTask",
  "deleteStatus",
  "deletePage",
  "deleteDrawing",
  "editTaskName",
  "editPageName",
  "changeStatusColor",
] as const;
export type SyncType = (typeof syncOptions)[number];
export const teamSchema = z.object({
  name: z.string().min(2).max(100),
  slogan: z.string().min(2).optional(),
  members: z.array(z.string().email()).min(1),
});

export type TeamData = z.infer<typeof teamSchema>;
