import { pgTable, serial, integer, text, boolean, timestamp } from 'drizzle-orm/pg-core';

// Advent Days table
export const adventDays = pgTable('advent_days', {
  id: serial('id').primaryKey(),
  day: integer('day').notNull().unique(),
  message: text('message').notNull(),
  clue: text('clue').notNull(),
  isActive: boolean('is_active').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Email Logs table
export const emailLogs = pgTable('email_logs', {
  id: serial('id').primaryKey(),
  dayId: text('day_id').notNull(),
  recipientEmail: text('recipient_email').notNull(),
  sentAt: timestamp('sent_at').defaultNow().notNull(),
  status: text('status').notNull(), // 'sent', 'failed', 'pending'
  qrCodeUrl: text('qr_code_url').notNull(),
  errorMessage: text('error_message'),
});

// Types
export type AdventDay = typeof adventDays.$inferSelect;
export type NewAdventDay = typeof adventDays.$inferInsert;
export type EmailLog = typeof emailLogs.$inferSelect;
export type NewEmailLog = typeof emailLogs.$inferInsert;
