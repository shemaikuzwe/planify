import db from "../drizzle";
import { dailyTodo, drawings, tasks } from "../drizzle/schema";
import { eq } from "drizzle-orm";

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
    orderBy: (dailyTodo, { desc }) => desc(dailyTodo.createdAt)
  });
  return todos;
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
   if(!task) throw new Error("Task not found")
  return task;
}
