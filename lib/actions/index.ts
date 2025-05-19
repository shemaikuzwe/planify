"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import db from "../drizzle";
import { categories, drawings, tasks } from "../drizzle/schema";
import {
  AddCategorySchema,
  addGroupSchema,
  AddTaskSchema,
  AddTaskValue,
  saveDrawingSchema,
  ToggleTaskStatusSchema,
  updateDrawingSchema,
} from "../types/schema";
import { eq } from "drizzle-orm";
import { TaskStatus } from "../types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function addTodo(data: AddTaskValue) {
  const validate = AddTaskSchema.safeParse(data);
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  const { text, time, priority, dueDate, categoryId } = validate.data;
  const [task] = await db.insert(tasks).values({ time, priority, dueDate, categoryId, text }).returning({ id: tasks.id });

  // revalidateTag("todos");
  revalidatePath("/")
  return task.id
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
  revalidatePath("/")
}

export async function editName(
  data: Omit<AddTaskValue, "time" | "priority" | "dueDate"|"categoryId">
) {
  const validate = AddTaskSchema.omit({
    time: true,
    priority: true,
    dueDate: true,
    categoryId: true,
  }).safeParse(data);
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  if (!validate.data.taskId) return;
  await db
    .update(tasks)
    .set({ text: validate.data.text })
    .where(eq(tasks.id, validate.data.taskId));
  //revalidateTag("todos");
  revalidatePath("/")
}

export async function editTodo(data: AddTaskValue) {
  const validate = AddTaskSchema.safeParse(data);
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  if (!validate.data.taskId) return;
  const { text, time, priority, dueDate, taskId, categoryId } = validate.data
  await db
    .update(tasks)
    .set({
      text,
      time,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      categoryId,
    })
    .where(eq(tasks.id, taskId));
  //revalidateTag("todos");
  revalidatePath("/")
}

export async function ToggleTaskStatus(taskId: string, status: TaskStatus) {
  const validate = ToggleTaskStatusSchema.safeParse({ taskId, status });
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  await db.update(tasks).set({ status }).where(eq(tasks.id, taskId));
  //revalidateTag("todos");
  revalidatePath("/")
}

export async function DeleteTodo(taskId: string) {
  await db.delete(tasks).where(eq(tasks.id, taskId));
  //revalidateTag("todos");
  revalidatePath("/")
}
export async function deleteTask(taskId: string) {
  await db.delete(tasks).where(eq(tasks.id, taskId));
  //revalidateTag("todos");
  revalidatePath("/")
}

export async function saveDrawing(formData: FormData): Promise<void> {
  const validate = saveDrawingSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validate.success) {
    throw validate.error.flatten().fieldErrors;
  }
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) throw new Error("something wnet wrong");
  const { elements, title, description } = validate.data;
  const [drawing] = await db.insert(drawings).values({
    name: title,
    description,
    userId,
    elements
  }).returning({ id: drawings.id })
  //revalidateTag("drawings");
  revalidatePath("/")
  redirect(`/excalidraw/${drawing.id}`)
}

export async function UpdateDrawing(formData: FormData): Promise<void> {
  const validate = updateDrawingSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validate.success) {
    throw validate.error.flatten().fieldErrors;
  }
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) throw new Error("something wnet wrong");
  const { elements, drawingId } = validate.data;
  await db.update(drawings).set({
    elements,
    userId,

  }).where(eq(drawings.id, drawingId))
  //revalidateTag("drawings");
  revalidatePath("/")
}


export async function saveTaskDescription(taskId: string, description: string) {
  await db.update(tasks).set({ description }).where(eq(tasks.id, taskId));
  //revalidateTag("todos");
  revalidatePath("/")
}

// Group

export async function addGroup(data: { name: string, dailyTodoId: string }) {
  const validate = addGroupSchema.safeParse(data);
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  await db.insert(categories).values(validate.data);
  //revalidateTag("todos");
  revalidatePath("/")
}

export async function deleteGroup(categoryId: string) {
  await db.delete(categories).where(eq(categories.id, categoryId));
  //revalidateTag("todos");
  revalidatePath("/")
}
export async function editGroupName(categoryId: string, name: string) {
  await db.update(categories).set({ name }).where(eq(categories.id, categoryId));
  //revalidateTag("todos");
  revalidatePath("/")
}