import "server-only"
import { db } from "../prisma";
import { auth } from "@/auth";

export async function getUserTasks(userId: string) {
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
  const task = await db.task.findFirst({
    where: { id: taskId },
  });
  if (!task) throw new Error("Task not found")
  return task;
}
export async function getCategoryTasks(categoryId: string) {
  const tasks = await db.taskStatus.findMany({
    where: {
      categoryId
    },
    include: {
      tasks: true,
    }
  })
  return tasks
}