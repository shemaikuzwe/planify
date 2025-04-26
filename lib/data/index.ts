import db from "../drizzle";
import { dailyTodo } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { unstable_cacheTag as cacheTag } from "next/cache";

export async function GetUserTodos(userId: string) {
  "use cache";
  cacheTag("todos", userId);
  const todos = await db.query.dailyTodo.findMany({
    where: eq(dailyTodo.userId, userId),
    with: {
      categories: {
        with: {
          tasks: true,
        },
      },
    },
  });
  return todos;
}

export type Todos = Awaited<ReturnType<typeof GetUserTodos>>;
