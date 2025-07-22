import db from "../drizzle";
import { categories, dailyTodo, drawings, tasks } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
export async function GetUserTodos(userId: string) {
  // "use cache";
  // cacheTag("todos", userId);
  const todos = await db.query.dailyTodo.findMany({
    where: eq(dailyTodo.userId, userId),
    with: {
      categories: {
        with: {
          tasks: true,
        },
      },
    },
    orderBy: (dailyTodo, { desc, asc }) => [desc(dailyTodo.createdAt), asc(categories.createdAt)]
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
  const subtasks = await db.query.dailyTodo.findMany({
    where: eq(dailyTodo.userId, userId),
    with: {
      categories: true,
    },
    orderBy: (dailyTodo, { desc, asc }) => [desc(dailyTodo.createdAt), asc(dailyTodo.createdAt)]
  });
  return subtasks[0].categories;
}
export type Todos = Awaited<ReturnType<typeof GetUserTodos>>;

export async function GetUserDrawings(userId: string) {
  // "use cache";
  // cacheTag("drawings", userId);
  const userDrawings = await db.query.drawings.findMany({
    where: eq(drawings.userId, userId),
    orderBy: (drawings, { desc }) => desc(drawings.createdAt)
  });
  return userDrawings;
}

export async function GetDrawingById(id: string) {
  // "use cache";
  // cacheTag("drawing", id);
  const drawing = await db.query.drawings.findFirst({
    where: eq(drawings.id, id),
  });
  return drawing;
}


export async function getTaskById(taskId: string) {
  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
  });
  if (!task) throw new Error("Task not found")
  return task;
}
