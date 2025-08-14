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
export async function getUserPages(pageName?: string) {
  const session = await auth()
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const todos = await db.taskCategory.findMany({
    where: { userId, name: pageName },
    include: {
      taskStatus: {
        include: {
          tasks: true
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    }
  });
  return todos.flatMap(todo => todo.taskStatus).map(status => status.tasks);
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
      tasks: {
        orderBy: {
          taskIndex: "asc"
        }
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  })
  return tasks
}