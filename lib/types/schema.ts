import { z } from "zod";
export const AddTaskSchema = z.object({
  text: z.string({ error: "Task name is required" }).min(1).max(50),
  time: z.string().optional().nullable(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  dueDate: z.string().optional().nullable(),
  taskId: z.uuid().optional(),
  tags: z.array(z.string()).optional(),
  statusId: z.uuid(),
});
export type AddTaskValue = z.infer<typeof AddTaskSchema>;

export const ToggleTaskStatusSchema = z.object({
  taskId: z.uuid(),
  status: z.string(),
});

export const addDrawingSchema = z.object({
  elements: z.array(z.any()),
  id: z.string(),
});

export const saveElement = z.object({
  elements: z.array(z.any()),
  id: z.uuid(),
});

export const addPageSchema = z.object({
  name: z.string().min(2),
  pageId: z.uuid(),
  todoId: z.uuid(),
  inProgressId: z.uuid(),
  doneId: z.uuid(),
  type: z.enum(["TASK", "PROJECT"]),
});

export const addStatusSchema = z.object({
  name: z.string().min(2),
  statusId: z.uuid(),
  pageId: z.uuid(),
  statusIndex: z.number(),
});

export const updateTaksIndexSchema = z.object({
  tasks: z.array(z.object({ id: z.uuid(), taskIndex: z.number().min(0) })),
  opts: z
    .object({
      taskId: z.uuid(),
      statusId: z.uuid(),
    })
    .optional(),
});

export const updateStatusIndexSchema = z.array(
  z.object({
    id: z.uuid(),
    statusIndex: z.number().min(0),
  }),
);

export const editDrawingNameSchema = z.object({
  id: z.uuid(),
  name: z.string().min(2),
});
export const changeStatusSchema = z.object({
  statusId: z.uuid(),
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
  "updateStatusIndex",
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
  members: z.array(z.email()).min(1),
});

export type TeamData = z.infer<typeof teamSchema>;
