"use server";

import { revalidatePath } from "next/cache";
import { db } from "../prisma";
import {
  AddCategorySchema,
  addGroupSchema,
  AddTaskSchema,
  AddTaskValue,
  saveDrawingSchema,
  ToggleTaskStatusSchema,
  updateDrawingSchema,
} from "../types/schema";
import { TaskStatus } from "../types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function addTodo(data: AddTaskValue) {
  const validate = AddTaskSchema.safeParse(data);
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  const { text, time, priority, dueDate, categoryId } = validate.data;
  if (!categoryId) return;
  const task = await db.task.create({ data: { time, priority, categoryId, dueDate: dueDate, text } });

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
  await db.taskCategory.create({ data: validate.data });
}

export async function AddDailyTodo(formData: FormData) {
  const validate = AddCategorySchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  await db.taskCategory.create({ data: validate.data });
  revalidatePath("/")
}

export async function editName(
  data: Omit<AddTaskValue, "time" | "priority" | "dueDate" | "categoryId">
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
  await db.task.update({
    where: { id: validate.data.taskId },
    data: { text: validate.data.text },
  });
  revalidatePath("/")
}

export async function editTodo(data: AddTaskValue) {
  const validate = AddTaskSchema.safeParse(data);
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  if (!validate.data.taskId) return;
  const { text, time, priority, dueDate, taskId, categoryId } = validate.data
  await db.task.update({
    where: { id: taskId },
    data: {
      text,
      time,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      categoryId,
    }
  })
  revalidatePath("/")
}

export async function ToggleTaskStatus(taskId: string, status: TaskStatus) {
  const validate = ToggleTaskStatusSchema.safeParse({ taskId, status });
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  await db.task.update({
    where: { id: taskId },
    data: { status },
  });
  revalidatePath("/")
}

export async function DeleteTodo(taskId: string) {
  await db.task.delete({ where: { id: taskId } });
  revalidatePath("/")
}
export async function deleteTask(taskId: string) {
  await db.task.delete({ where: { id: taskId } });

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
  if (!userId) throw new Error("something went wrong");
  const { elements, title, description } = validate.data;
  const drawing = await db.drawing.create({
    data: {
      name: title,
      description,
      userId,
      elements,
    }
  })
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
  if (!userId) throw new Error("something went wrong");
  const { elements, drawingId } = validate.data;
  await db.drawing.update({
    where: { id: drawingId },
    data: {
      elements,
      userId,
    }
  })
  revalidatePath("/")
}


export async function saveTaskDescription(taskId: string, description: string) {
  await db.task.update({
    where: { id: taskId },
    data: { description },
  })
  revalidatePath("/")
}

// Group

export async function addGroup(data: { name: string, userId: string }) {
  const validate = addGroupSchema.safeParse(data);
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  await db.taskCategory.create({ data: validate.data });
  revalidatePath("/")
}

export async function deleteGroup(categoryId: string) {
  await db.taskCategory.delete({ where: { id: categoryId } });
  //revalidateTag("todos");
  revalidatePath("/")
}
export async function editGroupName(categoryId: string, name: string) {
  await db.taskCategory.update({ where: { id: categoryId }, data: { name } });
  //revalidateTag("todos");
  revalidatePath("/")
}

export async function editDrawingName(drawingId: string, name: string) {
  await db.drawing.update({ where: { id: drawingId }, data: { name } });
  //revalidateTag("drawings");
  revalidatePath("/")
}

export async function deleteDrawing(drawingId: string) {
  await db.drawing.delete({ where: { id: drawingId } });
  //revalidateTag("drawings");
  revalidatePath("/")
}
