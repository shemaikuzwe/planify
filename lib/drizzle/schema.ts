import {
  pgTable,
  timestamp,
  primaryKey,
  uuid,
  text,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

//enums
export const priority = ["HIGH", "MEDIUM", "LOW"] as const;
export const enumPriority = pgEnum("priority", priority);

export const taskStatus = pgEnum("task_status", [
  "COMPLETED",
  "PENDING",
  "FAILED",
]);

const timestamps = {
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  ...timestamps,
});
export const accounts = pgTable(
  "account",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const dailyTodo = pgTable("daily_todos", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  ...timestamps,
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  dailyTodoId: uuid("daily_todo_id")
    .notNull()
    .references(() => dailyTodo.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  ...timestamps,
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  time: text("time"),
  emoji: text("emoji"),
  status: taskStatus().default("PENDING"),
  priority: enumPriority().default("MEDIUM"),
  dueDate: timestamp("due_date", { mode: "date" }),
  ...timestamps,
});
