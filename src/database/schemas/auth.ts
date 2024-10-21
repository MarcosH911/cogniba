import { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  timestamp,
  text,
  pgTable,
  pgSchema,
  uuid,
} from "drizzle-orm/pg-core";

const authSchema = pgSchema("auth");

const users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const usersTable = pgTable("users_table", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),

  email: text("email").unique(),
  name: text("name").notNull(),

  hasFinishedTutorial: boolean("has_finished_tutorial")
    .notNull()
    .default(false),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export type UserType = InferSelectModel<typeof usersTable>;
