import { z } from "zod";
export const AddTaskSchema = z.object({
  text: z.string({ required_error: "Task name is required" }).min(1).max(50),
  time: z.string().optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  dueDate: z.string().optional(),
  taskId: z.string().uuid().optional(),
  tags:z.array(z.string()).optional(),
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
  status: z.enum(["COMPLETED", "IN_PROGRESS", "NOT_STARTED", "FAILED"]),
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

export const addGroupSchema = z.object({
  name: z.string().min(2),
  id: z.string().uuid().optional(),
});

export const meetSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(2).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, { message: "Invalid datetime" }).optional(),
});

export type MeetData = z.infer<typeof meetSchema>;

export const teamSchema = z.object({
  name: z.string().min(2).max(100),
  slogan: z.string().min(2).optional(),
  members: z.array(z.string().email()).min(1),
});

export type TeamData = z.infer<typeof teamSchema>;

