import { boolean, integer, numeric, pgEnum, pgTable, real, timestamp, varchar } from "drizzle-orm/pg-core";

const timestamps = {
  updatedAt: timestamp('updated_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
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
  name: varchar('name', { length: 255 }),
  description: varchar('description', { length: 255 }),

  // Status
  status: varchar('status').notNull().default('INACTIVE'),  // ACTIVE, INACTIVE, DISABLED, FAILED
  notify: boolean('notify').default(false),

  // Analytics
  jobCount: integer('job_count').default(0),


  // Search
  query: varchar('query').notNull(), //q=[QUERY]%20AND%20[ANY_WORDS]%20AND%20NOT%20[NONE_WORDS]%20AND%20"[EXACT_PHRASE]"%20AND%20title%3A[TITLE_SEARCH]

  jobType: varchar('job_type'), //t=0,1  => 0:Fixed,1:Hourly
  fixedPrice: varchar('fixed_price'), //amount=0-99,100-499,500-999,1000-4999,5000-,[MIN]-[MAX]
  proposalsNumber: varchar('proposals_number'), //proposals=0-4,5-9,10-14,15-19,20-49

  verifiedOnly: boolean('verified_only').default(false), //payment_verified=1
  previousClientsOnly: boolean('previous_clients_only').default(false), //previous_clients=all

  ...timestamps
})

export const Jobs = pgTable("jobs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  workerId: integer('worker_id').references(() => Workers.id).notNull(),

  url: varchar('url'),
  title: varchar('title'),
  description: varchar('description'),

  postedAt: timestamp('posted_at'),

  tags: varchar('tags'),
  clientRate: real('client_rate'),
  clientSpent: integer('client_spent'),
  clientLocation: varchar('client_location'),

  type: varchar('type').notNull(), // FIXED, HOURLY
  amount: integer('amount'),
  hourlyRateRange: varchar('hourly_rate_range'), // [MIN]-[MAX] $/hour
  paymentVerified: boolean('payment_verified'),
  proposalsNumber: varchar('proposals_number'), //0-5,5-10,10-15,15-20,20-50,50-

  ignore: boolean('ignore'),
  favourite: boolean('favourite'),
  ...timestamps
})

export const SYSTEM = pgTable("system", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  mutaAll: boolean('muta_all'),
  ...timestamps
})