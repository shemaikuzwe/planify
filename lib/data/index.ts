import { db } from "../prisma";
import { auth } from "@/auth";
export async function GetUserTodos(userId: string) {
  // "use cache";
  // cacheTag("todos", userId);
  const todos = await db.taskCategory.findMany({
    where: { userId },
    include: {
      tasks: true,
    },
    orderBy: {
      createdAt: "desc",
    }
  });
  return todos;
}
export async function getUserSubtasks() {
  // "use cache";
  // cacheTag("subtasks", userId);
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
export type Todos = Awaited<ReturnType<typeof GetUserTodos>>;

export async function GetUserDrawings(userId: string) {
  // "use cache";
  // cacheTag("drawings", userId);
  const userDrawings = await db.drawing.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    }
  });
  return userDrawings;
}

export async function GetDrawingById(id: string) {
  // "use cache";
  // cacheTag("drawing", id);
  const drawing = await db.drawing.findFirst({
    where: { id },
  });
  return drawing;
}


export async function getTaskById(taskId: string) {
  const task = await db.task.findFirst({
    where: { id: taskId },
  });
  if (!task) throw new Error("Task not found")
  return task;
}
