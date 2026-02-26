import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./user.js";

export const books = pgTable("books", {
  id: uuid("id").defaultRandom().primaryKey(),

  title: varchar("title", { length: 200 }).notNull(),

  caption: text("caption").notNull(),

  image: varchar("image", { length: 500 }).notNull(),

  rating: integer("rating").notNull(),

  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});