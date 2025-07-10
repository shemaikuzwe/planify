import {
  pgTable,
  timestamp,
  primaryKey,
  uuid,
  text,
  integer,
  pgEnum,
  json,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { nanoid } from "nanoid";

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
    type: text("type").notNull(),
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
  description: text("description"),
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
  elements: json("elements"),
  ...timestamps,
});

export const meetingStatus = pgEnum("status", ["ACTIVE", "ENDED", "CANCELLED"]);

export const meeting = pgTable("meeting", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name"),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  meetingId: varchar("meeting_id"),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  status: meetingStatus().default("ACTIVE"),
  ...timestamps,
});

export const team = pgTable("team", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name").notNull(),
  slogan: text("slogan"),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  teamId:varchar("team_id").$default(()=>nanoid(6)),
  ...timestamps,
});

// Join table mapping teams to users (many-to-many)
export const teamMembers = pgTable(
  "team_members",
  {
    teamId: uuid("team_id")
      .notNull()
      .references(() => team.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.teamId, table.userId] }),
  })
);

// relations
export const userRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  dailyTodos: many(dailyTodo),
  drawings: many(drawings),
  meetings: many(meeting),
  teamMembers: many(teamMembers),
  createdTeams: many(team),
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

export const meetingRelations = relations(meeting, ({ one }) => ({
  user: one(users, {
    fields: [meeting.userId],
    references: [users.id],
  }),
}));

export const teamRelations = relations(team, ({ many, one }) => ({
  teamMembers: many(teamMembers),
  creator: one(users, {
    fields: [team.createdBy],
    references: [users.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(team, {
    fields: [teamMembers.teamId],
    references: [team.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

