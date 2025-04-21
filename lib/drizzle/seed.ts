import db from ".";
import { categories, dailyTodo, tasks } from "./schema";

export async function seed(userId: string) {

  
  const todo = await db
    .insert(dailyTodo)
    .values({
      name: "Today",
      userId,
    })
    .returning({ id: dailyTodo.id });
  const team = await db
    .insert(categories)
    .values({
      name: "Team",
      dailyTodoId: todo[0].id,
    })
    .returning({ id: categories.id });
  const personal = await db
    .insert(categories)
    .values({
      name: "Personal",
      dailyTodoId: todo[0].id,
    })
    .returning({ id: categories.id });
  await db.insert(tasks).values({
    text: "Meeting",
    time: "2:00 PM",
    emoji: "📊",
    priority: "HIGH",
    categoryId: team[0].id,
  });
  await db.insert(tasks).values({
    text: "Read a book",
    time: "8:00 PM",
    emoji: "📚",
    priority: "LOW",
    categoryId: personal[0].id,
  });
}
