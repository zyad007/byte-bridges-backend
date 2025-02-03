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
  utl: varchar(),
  title: varchar(),
  description: varchar(),
  workerId: integer("worked_id").references(() => Workers.id),
  postedAt: timestamp(),
  type: varchar().notNull(),
  amount: integer(),
  tags: varchar(),
  clientRate: numeric(),
  clientSpent: integer(),
  clientLocation: varchar(),
  paymentVerfied: boolean(),
  proposalCount: varchar(),

  ignore: boolean(),
  favourie: boolean(),
  ...timestamps
})

export const SYSTEM = pgTable("system", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  mutaAll: boolean()
})