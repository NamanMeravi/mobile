import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password:text('password').notNull()
});