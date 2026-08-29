import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Applications are the source of admissions funnel metrics and programme demand.
 * All timestamps remain UTC so the analytics layer can aggregate reliably.
 */
export const admissionApplications = mysqlTable("admissionApplications", {
  id: int("id").autoincrement().primaryKey(),
  reference: varchar("reference", { length: 32 }).notNull().unique(),
  applicantName: varchar("applicantName", { length: 160 }).notNull(),
  programme: varchar("programme", { length: 160 }).notNull(),
  faculty: varchar("faculty", { length: 160 }).notNull(),
  status: mysqlEnum("status", ["draft", "submitted", "under_review", "approved", "rejected"]).notNull().default("draft"),
  submittedAt: timestamp("submittedAt"),
  decisionAt: timestamp("decisionAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Each record captures an active student enrolment in a specific academic session.
 * These rows support live totals, distribution views, and registration completion.
 */
export const enrollmentRecords = mysqlTable("enrollmentRecords", {
  id: int("id").autoincrement().primaryKey(),
  studentNumber: varchar("studentNumber", { length: 64 }).notNull(),
  academicSession: varchar("academicSession", { length: 16 }).notNull(),
  faculty: varchar("faculty", { length: 160 }).notNull(),
  programme: varchar("programme", { length: 160 }).notNull(),
  level: varchar("level", { length: 32 }).notNull(),
  status: mysqlEnum("status", ["active", "pending", "withdrawn"]).notNull().default("pending"),
  enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Stores a minimal, non-personal walkthrough signal so a client demonstration
 * can prove the handoff from an applicant journey to administrator insight.
 */
export const guidedDemoIntakes = mysqlTable("guidedDemoIntakes", {
  id: int("id").autoincrement().primaryKey(),
  reference: varchar("reference", { length: 40 }).notNull().unique(),
  status: mysqlEnum("status", ["queued", "presented"]).notNull().default("queued"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AdmissionApplication = typeof admissionApplications.$inferSelect;
export type EnrollmentRecord = typeof enrollmentRecords.$inferSelect;
export type GuidedDemoIntake = typeof guidedDemoIntakes.$inferSelect;
