import { z } from "zod";
export const AddTaskSchema = z.object({
  text: z.string({ required_error: "Task name is required" }).min(1).max(50),
  time: z.string().optional(),
  emoji: z.string().optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  dueDate: z.date().optional(),
  categoryId: z.string().uuid(),
});

export const AddCategorySchema = z.object({
  name: z
    .string({ required_error: "Category name is required" })
    .min(1)
    .max(50),
  dailyTodoId: z.string().uuid(),
});

export const addDailyTodoSchema = z.object({
  name: z
    .string({ required_error: "Daily todo name is required" })
    .min(1)
    .max(50),
  userId: z.string().uuid(),
});
