import "server-only"
import { db } from "../prisma";
import { auth } from "@/auth";
import { unstable_cacheTag as cacheTag } from "next/cache"

export async function getUserTasks(userId: string) {
  "use cache"
  cacheTag("tasks")
  const todos = await db.taskCategory.findMany({
    where: { userId },
    // include: {
    //   tasks: true,
    // },
    orderBy: {
      createdAt: "desc",
    }
  });
  return todos;
}
export async function getUserSubtasks() {
  "use cache"
  cacheTag("tasks")
  const session = await auth()
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const subtasks = await db.taskCategory.findMany({
    where: { user: { id: userId } },

  });
  return subtasks;
}
export async function getTaskById(taskId: string) {
  "use cache"
  cacheTag("tasks",taskId)
  const task = await db.task.findFirst({
    where: { id: taskId },
  });
  if (!task) throw new Error("Task not found")
  return task;
}
export async function getCategoryTasks(categoryId: string) {
  "use cache"
  cacheTag("tasks",categoryId)
  const tasks = await db.taskStatus.findMany({
    where: {
      categoryId
    },
    include: {
      tasks: {
        orderBy: {
          taskIndex: "asc"
        }
      }
    },
    orderBy:{
      createdAt:"asc"
    }
  })
  return tasks
}