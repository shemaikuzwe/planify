"use server";

import db from "../drizzle";
import { categories, tasks } from "../drizzle/schema";
import { AddCategorySchema, AddTaskSchema } from "../types/schema";

export async function AddTodo(formData: FormData) {
  const validate = AddTaskSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  const { text, time, emoji, priority, dueDate, categoryId } = validate.data;
  await db
    .insert(tasks)
    .values({ text, time, emoji, priority, dueDate, categoryId });
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
