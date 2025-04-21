import { auth } from "@/app/auth";
import db from "../drizzle";
import { dailyTodo } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export async function GetUserTodos() {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.id) throw new Error("User not found");
  const todos = await db.query.dailyTodo.findMany({
    where: eq(dailyTodo.userId, user.id),
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
