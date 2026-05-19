import { eq, and, desc, asc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  trails,
  modules,
  chapters,
  slides,
  quizQuestions,
  userProgress,
  quizAttempts,
  badges,
  userBadges,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (user.contractType !== undefined) {
      values.contractType = user.contractType;
      updateSet.contractType = user.contractType;
    }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.totalPoints));
}

export async function updateUserPoints(userId: number, pointsToAdd: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(users)
    .set({
      totalPoints: sql`${users.totalPoints} + ${pointsToAdd}`,
    })
    .where(eq(users.id, userId));
  // Recalculate level
  const user = await getUserById(userId);
  if (user) {
    const newLevel = Math.floor(user.totalPoints / 500) + 1;
    await db.update(users).set({ level: newLevel }).where(eq(users.id, userId));
  }
}

export async function updateUserProfile(
  userId: number,
  data: { department?: string; jobTitle?: string; admissionDate?: Date }
) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set(data).where(eq(users.id, userId));
}

// ─── Trails ───────────────────────────────────────────────────────────────────
export async function getAllTrails() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(trails).where(eq(trails.isActive, true)).orderBy(asc(trails.orderIndex));
}

export async function getTrailBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(trails).where(eq(trails.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createTrail(data: {
  slug: string;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
  orderIndex?: number;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(trails).values(data);
}

// ─── Modules ──────────────────────────────────────────────────────────────────
export async function getModulesByTrail(trailId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(modules)
    .where(eq(modules.trailId, trailId))
    .orderBy(asc(modules.orderIndex));
}

export async function getModuleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(modules).where(eq(modules.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createModule(data: {
  trailId: number;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  orderIndex?: number;
  pointsReward?: number;
  bonusPoints?: number;
  deadlineDays?: number;
  isComingSoon?: boolean;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(modules).values(data);
}

// ─── Chapters ────────────────────────────────────────────────────────────────
export async function getChaptersByModule(moduleId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(chapters)
    .where(and(eq(chapters.moduleId, moduleId), eq(chapters.isActive, true)))
    .orderBy(asc(chapters.orderIndex));
}

export async function getChaptersByModuleAndProfile(
  moduleId: number,
  profileType: "todos" | "clt" | "pj" | "lideranca"
) {
  const db = await getDb();
  if (!db) return [];
  // Return chapters that match the profile OR are for 'todos'
  const allChapters = await db
    .select()
    .from(chapters)
    .where(and(eq(chapters.moduleId, moduleId), eq(chapters.isActive, true)))
    .orderBy(asc(chapters.orderIndex));
  return allChapters.filter(
    (c) => c.profileType === "todos" || c.profileType === profileType
  );
}

export async function getChapterBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(chapters).where(eq(chapters.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Slides ───────────────────────────────────────────────────────────────────
export async function getSlidesByModule(moduleId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(slides)
    .where(eq(slides.moduleId, moduleId))
    .orderBy(asc(slides.orderIndex));
}

export async function createSlide(data: {
  moduleId: number;
  orderIndex: number;
  title?: string;
  content: string;
  betinhaSpeech?: string;
  imageUrl?: string;
  layout?: "default" | "highlight" | "list" | "quote" | "image-left" | "image-right" | "full-image";
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(slides).values(data);
}

// ─── Quiz Questions ────────────────────────────────────────────────────────────
export async function getQuizByModule(moduleId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.moduleId, moduleId))
    .orderBy(asc(quizQuestions.orderIndex));
}

export async function createQuizQuestion(data: {
  moduleId: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  orderIndex?: number;
  isAiGenerated?: boolean;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(quizQuestions).values(data);
}

export async function deleteQuizQuestionsByModule(moduleId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(quizQuestions).where(eq(quizQuestions.moduleId, moduleId));
}

// ─── User Progress ─────────────────────────────────────────────────────────────
export async function getUserProgressForTrail(userId: number, trailId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.trailId, trailId)));
}

export async function getUserProgressForModule(userId: number, moduleId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.moduleId, moduleId)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUserProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userProgress).where(eq(userProgress.userId, userId));
}

export async function upsertUserProgress(data: {
  userId: number;
  moduleId: number;
  trailId: number;
  status?: "not_started" | "in_progress" | "completed";
  currentSlide?: number;
  startedAt?: Date;
  completedAt?: Date;
  quizScore?: number;
  pointsEarned?: number;
  bonusEarned?: number;
}) {
  const db = await getDb();
  if (!db) return;
  const existing = await getUserProgressForModule(data.userId, data.moduleId);
  if (existing) {
    const updateData: Record<string, unknown> = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.currentSlide !== undefined) updateData.currentSlide = data.currentSlide;
    if (data.startedAt !== undefined) updateData.startedAt = data.startedAt;
    if (data.completedAt !== undefined) updateData.completedAt = data.completedAt;
    if (data.quizScore !== undefined) updateData.quizScore = data.quizScore;
    if (data.pointsEarned !== undefined) updateData.pointsEarned = data.pointsEarned;
    if (data.bonusEarned !== undefined) updateData.bonusEarned = data.bonusEarned;
    await db
      .update(userProgress)
      .set(updateData)
      .where(and(eq(userProgress.userId, data.userId), eq(userProgress.moduleId, data.moduleId)));
  } else {
    await db.insert(userProgress).values({
      userId: data.userId,
      moduleId: data.moduleId,
      trailId: data.trailId,
      status: data.status ?? "not_started",
      currentSlide: data.currentSlide ?? 0,
      startedAt: data.startedAt,
      completedAt: data.completedAt,
      quizScore: data.quizScore,
      pointsEarned: data.pointsEarned ?? 0,
      bonusEarned: data.bonusEarned ?? 0,
    });
  }
}

export async function incrementQuizAttempts(userId: number, moduleId: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(userProgress)
    .set({ quizAttempts: sql`${userProgress.quizAttempts} + 1` })
    .where(and(eq(userProgress.userId, userId), eq(userProgress.moduleId, moduleId)));
}

// ─── Quiz Attempts ─────────────────────────────────────────────────────────────
export async function saveQuizAttempt(data: {
  userId: number;
  moduleId: number;
  answers: { questionId: number; selectedIndex: number }[];
  score: number;
  passed: boolean;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(quizAttempts).values(data);
}

// ─── Badges ────────────────────────────────────────────────────────────────────
export async function getAllBadges() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(badges);
}

export async function getUserBadges(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({ badge: badges, earnedAt: userBadges.earnedAt })
    .from(userBadges)
    .innerJoin(badges, eq(userBadges.badgeId, badges.id))
    .where(eq(userBadges.userId, userId));
}

export async function awardBadge(userId: number, badgeId: number) {
  const db = await getDb();
  if (!db) return;
  // Check if already awarded
  const existing = await db
    .select()
    .from(userBadges)
    .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, badgeId)))
    .limit(1);
  if (existing.length > 0) return;
  await db.insert(userBadges).values({ userId, badgeId });
}

export async function getBadgeBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(badges).where(eq(badges.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createBadge(data: {
  slug: string;
  name: string;
  description?: string;
  icon: string;
  color?: string;
  condition?: string;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(badges).values(data);
}

// ─── Leaderboard ───────────────────────────────────────────────────────────────
export async function getLeaderboard(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: users.id,
      name: users.name,
      totalPoints: users.totalPoints,
      level: users.level,
    })
    .from(users)
    .orderBy(desc(users.totalPoints))
    .limit(limit);
}

// ─── Admin Stats ───────────────────────────────────────────────────────────────
export async function getAdminStats() {
  const db = await getDb();
  if (!db) return null;
  const [totalUsersResult] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [completedResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(userProgress)
    .where(eq(userProgress.status, "completed"));
  const [inProgressResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(userProgress)
    .where(eq(userProgress.status, "in_progress"));
  return {
    totalUsers: totalUsersResult?.count ?? 0,
    completedModules: completedResult?.count ?? 0,
    inProgressModules: inProgressResult?.count ?? 0,
  };
}
