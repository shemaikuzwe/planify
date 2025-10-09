"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { db } from "../prisma";
import {
  AddTaskSchema,
  AddTaskValue,
  ToggleTaskStatusSchema,
} from "../types/schema";
import { auth } from "@/auth";
import { z } from "zod";

async function addTask(data: AddTaskValue) {
  const validate = AddTaskSchema.safeParse(data);
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  const { text, time, priority, dueDate, statusId, tags } = validate.data;
  await db.task.create({
    data: {
      time,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      text,
      statusId,
      tags,
    },
  });
}
async function editTask(data: AddTaskValue) {
  const validate = AddTaskSchema.safeParse(data);
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  if (!validate.data.taskId) return;
  const { text, time, priority, dueDate, taskId, tags } = validate.data;
  await db.task.update({
    where: { id: taskId },
    data: {
      text,
      time,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      tags,
    },
  });
}

async function editName(data: { taskId: string; text: string }) {
  const validate = z
    .object({
      taskId: z.string().uuid(),
      text: z.string().min(1).max(50),
    })
    .safeParse(data);
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  if (!validate.data.taskId) return;
  const { text, taskId } = validate.data;
  await db.task.update({
    where: { id: taskId },
    data: { text },
  });
}
async function toggleStatus(taskId: string, status: string) {
  const validate = ToggleTaskStatusSchema.safeParse({ taskId, status });
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  await db.task.update({
    where: { id: taskId },
    data: { statusId: validate.data.status },
  });
}
async function deleteTask(taskId: string) {
  await db.task.delete({ where: { id: taskId } });
}

export async function editTaskDescription(taskId: string, description: string) {
  await db.task.update({
    where: { id: taskId },
    data: { description },
  });
}

export async function editTaskName(taskId: string, name: string) {
  await db.task.update({
    where: { id: taskId },
    data: { text: name },
  });
}

async function addPage(data: {
  name: string;
  pageId: string;
  todoId: string;
  inProgressId: string;
  doneId: string;
}) {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) return;
  const category = await db.taskCategory.create({
    data: { id: data.pageId, name: data.name, userId },
  });
  await db.taskStatus.create({
    data: { id: data.todoId, name: "TODO", categoryId: category.id },
  });
  await db.taskStatus.create({
    data: {
      id: data.inProgressId,
      name: "IN PROGRESS",
      categoryId: category.id,
      primaryColor: "bg-blue-600",
    },
  });
  await db.taskStatus.create({
    data: {
      id: data.doneId,
      name: "DONE",
      categoryId: category.id,
      primaryColor: "bg-green-600",
    },
  });
}
async function deletePage(pageId: string) {
  await db.taskCategory.delete({ where: { id: pageId } });
}
async function editPageName(categoryId: string, name: string) {
  await db.taskCategory.update({ where: { id: categoryId }, data: { name } });
}
async function deleteStatus(statusId: string) {
  await db.taskStatus.delete({ where: { id: statusId } });
}

async function changeStatusColor(statusId: string, color: string) {
  await db.taskStatus.update({
    where: { id: statusId },
    data: { primaryColor: color },
  });
  revalidateTag("tasks");
}
async function changeTaskStatus(taskId: string, statusId: string) {
  await db.task.update({ where: { id: taskId }, data: { statusId } });
  revalidateTag("tasks");
}

async function updateTaskIndex(
  tasks: { id: string; taskIndex: number }[],
  opts?: { taskId: string; statusId: string },
) {
  if (opts) {
    await db.task.update({
      where: { id: opts.taskId },
      data: { statusId: opts.statusId },
    });
  }
  await db.$transaction(
    tasks.map((task) =>
      db.task.update({
        where: { id: task.id },
        data: { taskIndex: task.taskIndex },
      }),
    ),
  );
}
async function addStatus(data: {
  statusId: string;
  name: string;
  pageId: string;
}) {
  await db.taskStatus.create({
    data: { name: data.name, categoryId: data.pageId },
  });
}
export {
  addPage,
  deletePage,
  editPageName,
  addTask,
  editTask,
  updateTaskIndex,
  toggleStatus,
  deleteTask,
  addStatus,
  deleteStatus,
  changeStatusColor,
  changeTaskStatus,
  editName,
};
