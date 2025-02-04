import { boolean, integer, numeric, pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

const timestamps = {
  updatedAt: timestamp('updated_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}


export const Users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phoneNumber: varchar('phone_number', { length: 12 }).notNull(),
  telegramId: varchar('telegram_id', { length: 255 }),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
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
  searchUrl: varchar('search_url'),
  status: varchar('status').notNull(),
  jobCount: integer('job_count').default(0),
  notify: boolean('notify'),
  ...timestamps

})

export const Jobs = pgTable("jobs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  url: varchar('url'),
  title: varchar('title'),
  description: varchar('description'),
  workerId: integer('worker_id').references(() => Workers.id),
  postedAt: timestamp('posted_at'),
  type: varchar('type').notNull(),
  amount: integer('amount'),

  tags: varchar('tags'),
  clientRate: numeric('client_rate'),
  clientSpent: integer('client_spent'),
  clientLocation: varchar('client_location'),
  paymentVerfied: boolean('payment_verified'),
  proposalCount: varchar('proposal_count'),


  ignore: boolean('ignore'),
  favourite: boolean('favourite'),
  ...timestamps

})

export const SYSTEM = pgTable("system", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  mutaAll: boolean('muta_all'),
  ...timestamps
})