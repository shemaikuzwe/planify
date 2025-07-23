"use server";

import {revalidatePath} from "next/cache";
import {db} from "../prisma";
import {addGroupSchema, AddTaskSchema, AddTaskValue, ToggleTaskStatusSchema,} from "../types/schema";
import {TaskStatus} from "../types";

export async function addTask(data: AddTaskValue) {
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

export async function editTask(data: AddTaskValue) {
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

export async function toggleStatus(taskId: string, status: TaskStatus) {
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
export async function deleteTask(taskId: string) {
  await db.task.delete({ where: { id: taskId } });

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

