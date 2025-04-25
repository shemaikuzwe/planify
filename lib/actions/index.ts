"use server";

import { revalidateTag } from "next/cache";
import db from "../drizzle";
import { categories, tasks } from "../drizzle/schema";
import {
  AddCategorySchema,
  AddTaskSchema,
  AddTaskValue,
} from "../types/schema";

export async function AddTodo(data: AddTaskValue) {
  const validate = AddTaskSchema.safeParse(data);
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  const { text, time, priority, dueDate, categoryId } = validate.data;
  await db.insert(tasks).values({ time, priority, dueDate, categoryId, text });

  revalidateTag("todos");
}

export async function AddCategory(formData: FormData) {
  const validate = AddCategorySchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  await db.insert(categories).values(validate.data);
}

export async function AddDailyTodo(formData: FormData) {
  const validate = AddCategorySchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  await db.insert(categories).values(validate.data);
}
