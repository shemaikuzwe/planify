import {
  pgTable,
  timestamp,
  primaryKey,
  uuid,
  text,
  integer,
  pgEnum,
  json,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "@auth/core/adapters";
import { relations } from "drizzle-orm";
import { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";

// enums
export const priority = ["HIGH", "MEDIUM", "LOW"] as const;
export const enumPriority = pgEnum("priority", priority);
export const taskStatus = pgEnum("task_status", [
  "COMPLETED",
  "IN_PROGRESS",
  "NOT_STARTED",
  "FAILED",
]);

// timestamps
const timestamps = {
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
};

// tables
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
  description:text("description"),
  time: text("time"),
  status: taskStatus().default("NOT_STARTED").notNull(),
  priority: enumPriority().default("MEDIUM"),
  dueDate: timestamp("due_date", { mode: "date" }),
  ...timestamps,
});

export const drawings = pgTable("drawings", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  description: text("description"),
  name: text("name").notNull(),
  elements:json("elements"),
  ...timestamps,
});

// relations
export const userRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  dailyTodos: many(dailyTodo),
  drawings: many(drawings),
}));

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const dailyTodoRelations = relations(dailyTodo, ({ one, many }) => ({
  user: one(users, {
    fields: [dailyTodo.userId],
    references: [users.id],
  }),
  categories: many(categories),
}));

export const categoryRelations = relations(categories, ({ one, many }) => ({
  dailyTodo: one(dailyTodo, {
    fields: [categories.dailyTodoId],
    references: [dailyTodo.id],
  }),
  tasks: many(tasks),
}));

export const taskRelations = relations(tasks, ({ one }) => ({
  category: one(categories, {
    fields: [tasks.categoryId],
    references: [categories.id],
  }),
}));

export const drawingsRelations = relations(drawings, ({ one }) => ({
  user: one(users, {
    fields: [drawings.userId],
    references: [users.id],
  }),
}));