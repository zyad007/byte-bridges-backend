import { boolean, integer, numeric, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

const timestamps = {
  updatedAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
}

export const Users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  phoneNumber: varchar({ length: 12 }).notNull(),
  telegramId: varchar({ length: 255 }),
  passwordHash: varchar({ length: 255 }).notNull(),
  ...timestamps
});

export const Sessions = pgTable("sessions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => Users.id),
  ip: varchar(),
  ...timestamps
})

export const Workers = pgTable("workers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  search_url: varchar(),
  status: varchar().notNull(),
  jobCount: integer().default(0),
  notify: boolean(),
  ...timestamps
})

export const Jobs = pgTable("jobs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  url: varchar(),
  title: varchar(),
  description: varchar(),
  workerId: integer("worker_id").references(() => Workers.id),
  postedAt: timestamp("posted_at"),
  type: varchar().notNull(),
  amount: integer(),
  tags: varchar(),
  clientRate: numeric("client_rate"),
  clientSpent: integer("client_spent"),
  clientLocation: varchar("client_location"),
  paymentVerfied: boolean("payment_verified"),
  proposalCount: varchar("proposal_count"),

  ignore: boolean(),
  favourite: boolean(),
  // ...timestamps
})

export const SYSTEM = pgTable("system", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  mutaAll: boolean()
})