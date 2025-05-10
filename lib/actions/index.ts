"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import db from "../drizzle";
import { categories, drawings, tasks } from "../drizzle/schema";
import {
  AddCategorySchema,
  AddTaskSchema,
  AddTaskValue,
  saveDrawingSchema,
  ToggleTaskStatusSchema,
  updateDrawingSchema,
} from "../types/schema";
import { eq } from "drizzle-orm";
import { TaskStatus } from "../types";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";

export async function AddTodo(data: AddTaskValue) {
  const validate = AddTaskSchema.safeParse(data);
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  const { text, time, priority, dueDate, categoryId } = validate.data;
  await db.insert(tasks).values({ time, priority, dueDate, categoryId, text });

  // revalidateTag("todos");
  revalidatePath("/")
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
  data: Omit<AddTaskValue, "time" | "priority" | "dueDate">
) {
  const validate = AddTaskSchema.omit({
    time: true,
    priority: true,
    dueDate: true,
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

export async function EditTodo(data: AddTaskValue) {
  const validate = AddTaskSchema.safeParse(data);
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  if (!validate.data.taskId) return;
  await db
    .update(tasks)
    .set(validate.data)
    .where(eq(tasks.id, validate.data.taskId));
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