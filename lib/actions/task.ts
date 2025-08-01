"use server";

import { revalidatePath } from "next/cache";
import { db } from "../prisma";
import { addGroupSchema, AddTaskSchema, AddTaskValue, ToggleTaskStatusSchema, } from "../types/schema";
import { auth } from "@/auth";

async function addTask(data: AddTaskValue) {
  const validate = AddTaskSchema.safeParse(data);
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  const { text, time, priority, dueDate, statusId, tags } = validate.data;
  const task = await db.task.create({ data: { time, priority, dueDate: dueDate ? new Date(dueDate) : null, text, statusId, tags } });

  revalidatePath("/")
  return task.id
}
async function editTask(data: AddTaskValue) {
  const validate = AddTaskSchema.safeParse(data);
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  if (!validate.data.taskId) return;
  const { text, time, priority, dueDate, taskId, tags } = validate.data
  await db.task.update({
    where: { id: taskId },
    data: {
      text,
      time,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      tags
    }
  })
  revalidatePath("/")
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
  revalidatePath("/")
}
async function deleteTask(taskId: string) {
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

async function addGroup(data: { name: string }) {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) return;

  const validate = addGroupSchema.safeParse(data);
  if (!validate.success) {
    return validate.error.flatten().fieldErrors;
  }
  const category = await db.taskCategory.create({ data: { name: validate.data.name, userId } })
  await db.taskStatus.create({ data: { name: "TODO", categoryId: category.id } })
  await db.taskStatus.create({ data: { name: "IN PROGRESS", categoryId: category.id,primaryColor:"bg-blue-600" } })
  await db.taskStatus.create({ data: { name: "DONE", categoryId: category.id,primaryColor:"bg-green-600" } })
  revalidatePath("/")
}
async function deleteGroup(categoryId: string) {
  await db.taskCategory.delete({ where: { id: categoryId } });
  //revalidateTag("todos");
  revalidatePath("/")
}
async function editGroupName(categoryId: string, name: string) {
  await db.taskCategory.update({ where: { id: categoryId }, data: { name } });
  //revalidateTag("todos");
  revalidatePath("/")
}
async function deleteStatus(statusId: string) {
  await db.taskStatus.delete({ where: { id: statusId } });
  revalidatePath("/")
}

async function changeStatusColor(statusId: string, color: string) {
  await db.taskStatus.update({ where: { id: statusId }, data: { primaryColor: color } });
  revalidatePath("/")
}
async function changeTaskStatus(taskId: string, statusId: string) {
  await db.task.update({ where: { id: taskId }, data: { statusId } });
  revalidatePath("/")
}

async function updateTaskIndex(tasks: { id: string; taskIndex: number }[]) {
  await db.$transaction(
    tasks.map(task =>
      db.task.update({
        where: { id: task.id },
        data: { taskIndex: task.taskIndex }
      })
    )
  );
  revalidatePath("/")
}


async function addStatus(data: { name: string, id: string | undefined }) {
  const validate = addGroupSchema.safeParse(data);
  if (!validate.success) {
    throw validate.error.flatten().fieldErrors;
  }
  const { name, id } = validate.data
  if (!id) throw new Error("id is required");
  await db.taskStatus.create({ data: { name, categoryId: id } });
  revalidatePath("/")
}
export {
  addGroup,
  deleteGroup,
  editGroupName,
  addTask,
  editTask,
  updateTaskIndex,
  toggleStatus,
  deleteTask,
  addStatus,
  deleteStatus,
  changeStatusColor,
  changeTaskStatus,
}