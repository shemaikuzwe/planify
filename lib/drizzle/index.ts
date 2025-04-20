import { drizzle } from 'drizzle-orm/node-postgres';
import * as tables from "@/lib/drizzle/schema";

export type User=typeof tables.users.$inferSelect;
export type Task=typeof tables.tasks.$inferSelect;
export type Category=typeof tables.categories.$inferSelect;
export type DailyTodo=typeof tables.dailyTodo.$inferSelect;


const db = drizzle(process.env.DATABASE_URL!);
export default db;
