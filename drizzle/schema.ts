import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  json,
  float,
} from "drizzle-orm/mysql-core";

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  contractType: mysqlEnum("contractType", ["clt", "pj"]).default("clt"),
  department: varchar("department", { length: 128 }),
  jobTitle: varchar("jobTitle", { length: 128 }),
  admissionDate: timestamp("admissionDate"),
  totalPoints: int("totalPoints").default(0).notNull(),
  level: int("level").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Trails (Trilhas) ─────────────────────────────────────────────────────────
export const trails = mysqlTable("trails", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 64 }),
  color: varchar("color", { length: 32 }),
  isActive: boolean("isActive").default(true).notNull(),
  orderIndex: int("orderIndex").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Trail = typeof trails.$inferSelect;

// ─── Modules (Módulos/Submódulos) ─────────────────────────────────────────────
export const modules = mysqlTable("modules", {
  id: int("id").autoincrement().primaryKey(),
  trailId: int("trailId").notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 256 }).notNull(),
  subtitle: varchar("subtitle", { length: 256 }),
  description: text("description"),
  orderIndex: int("orderIndex").default(0).notNull(),
  pointsReward: int("pointsReward").default(100).notNull(),
  bonusPoints: int("bonusPoints").default(50).notNull(),
  deadlineDays: int("deadlineDays").default(3),
  isActive: boolean("isActive").default(true).notNull(),
  isComingSoon: boolean("isComingSoon").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Module = typeof modules.$inferSelect;

// // ─── Chapters (Capítulos dentro dos módulos) ─────────────────────────────────
export const chapters = mysqlTable("chapters", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("moduleId").notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  profileType: mysqlEnum("profileType", ["todos", "clt", "pj", "lideranca"]).default("todos").notNull(),
  orderIndex: int("orderIndex").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Chapter = typeof chapters.$inferSelect;
export type InsertChapter = typeof chapters.$inferInsert;

// ─── Slides (Conteúdo dos módulos) ────────────────────────────────────────────
export const slides = mysqlTable("slides", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("moduleId").notNull(),
  orderIndex: int("orderIndex").default(0).notNull(),
  title: varchar("title", { length: 256 }),
  content: text("content").notNull(),
  betinhaSpeech: text("betinhaSpeech"),
  imageUrl: varchar("imageUrl", { length: 512 }),
  layout: mysqlEnum("layout", [
    "default", "highlight", "list", "quote",
    "image-left", "image-right", "full-image",
    "timeline", "card-deck", "dictionary", "values", "video-placeholder"
  ]).default("default").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Slide = typeof slides.$inferSelect;

// ─── Quiz Questions ────────────────────────────────────────────────────────────
export const quizQuestions = mysqlTable("quiz_questions", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("moduleId").notNull(),
  question: text("question").notNull(),
  options: json("options").notNull(), // string[]
  correctIndex: int("correctIndex").notNull(),
  explanation: text("explanation"),
  orderIndex: int("orderIndex").default(0).notNull(),
  isAiGenerated: boolean("isAiGenerated").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QuizQuestion = typeof quizQuestions.$inferSelect;

// ─── User Progress ─────────────────────────────────────────────────────────────
export const userProgress = mysqlTable("user_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  moduleId: int("moduleId").notNull(),
  trailId: int("trailId").notNull(),
  status: mysqlEnum("status", ["not_started", "in_progress", "completed"]).default("not_started").notNull(),
  currentSlide: int("currentSlide").default(0).notNull(),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  quizScore: float("quizScore"),
  quizAttempts: int("quizAttempts").default(0).notNull(),
  pointsEarned: int("pointsEarned").default(0).notNull(),
  bonusEarned: int("bonusEarned").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProgress = typeof userProgress.$inferSelect;

// ─── Quiz Attempts ─────────────────────────────────────────────────────────────
export const quizAttempts = mysqlTable("quiz_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  moduleId: int("moduleId").notNull(),
  answers: json("answers").notNull(), // { questionId: number, selectedIndex: number }[]
  score: float("score").notNull(),
  passed: boolean("passed").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QuizAttempt = typeof quizAttempts.$inferSelect;

// ─── Badges ────────────────────────────────────────────────────────────────────
export const badges = mysqlTable("badges", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 64 }).notNull(),
  color: varchar("color", { length: 32 }),
  condition: varchar("condition", { length: 256 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Badge = typeof badges.$inferSelect;

// ─── User Badges ───────────────────────────────────────────────────────────────
export const userBadges = mysqlTable("user_badges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  badgeId: int("badgeId").notNull(),
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
});

export type UserBadge = typeof userBadges.$inferSelect;
