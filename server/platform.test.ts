import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

// ─── Mock DB helpers ──────────────────────────────────────────────────────────
vi.mock("./db", () => ({
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
  getUserById: vi.fn().mockResolvedValue({
    id: 1, openId: "test-user", name: "Test User", email: "test@test.com",
    role: "user", totalPoints: 0, level: 1, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
  }),
  getAllTrails: vi.fn().mockResolvedValue([
    { id: 1, slug: "tbi-gente-cultura", title: "TBI Gente e Cultura", description: "Trilha principal", icon: "Star", color: "#00C853", orderIndex: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, slug: "tbi-dp", title: "TBI de DP", description: "Em breve", icon: "FileText", color: "#2196F3", orderIndex: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 3, slug: "tbi-seguranca", title: "TBI de Segurança do Trabalho", description: "Em breve", icon: "Shield", color: "#FF5722", orderIndex: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  ]),
  getTrailBySlug: vi.fn().mockImplementation(async (slug: string) => {
    if (slug === "tbi-gente-cultura") return { id: 1, slug, title: "TBI Gente e Cultura", description: "Trilha principal", icon: "Star", color: "#00C853", orderIndex: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() };
    return null;
  }),
  getModulesByTrail: vi.fn().mockResolvedValue([
    { id: 1, trailId: 1, slug: "institucional", title: "Institucional", subtitle: "Quem Somos", description: "Conheça a empresa", orderIndex: 1, pointsReward: 100, bonusPoints: 50, deadlineDays: 7, isActive: true, isComingSoon: false, createdAt: new Date(), updatedAt: new Date() },
    { id: 2, trailId: 1, slug: "nossa-historia", title: "Nossa História", subtitle: "O que nos trouxe até aqui", description: "Nossa jornada", orderIndex: 2, pointsReward: 100, bonusPoints: 50, deadlineDays: 7, isActive: true, isComingSoon: false, createdAt: new Date(), updatedAt: new Date() },
  ]),
  getModuleById: vi.fn().mockResolvedValue({
    id: 1, trailId: 1, slug: "institucional", title: "Institucional", subtitle: "Quem Somos",
    description: "Conheça a empresa", orderIndex: 1, pointsReward: 100, bonusPoints: 50,
    deadlineDays: 7, isActive: true, isComingSoon: false, createdAt: new Date(), updatedAt: new Date(),
  }),
  getSlidesByModule: vi.fn().mockResolvedValue([
    { id: 1, moduleId: 1, title: "Bem-vindo", content: "Conteúdo do slide 1", betinhaSpeech: "Olá!", layout: "default", orderIndex: 1, imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  ]),
  getQuizByModule: vi.fn().mockResolvedValue([
    { id: 1, moduleId: 1, question: "O que é a Stellar Gaming?", options: JSON.stringify(["Empresa de jogos", "Banco", "Escola", "Hospital"]), correctIndex: 0, explanation: "É uma empresa de jogos.", orderIndex: 1, isAiGenerated: false, createdAt: new Date(), updatedAt: new Date() },
  ]),
  getUserProgressForTrail: vi.fn().mockResolvedValue([]),
  getUserProgressForModule: vi.fn().mockResolvedValue(null),
  getAllUserProgress: vi.fn().mockResolvedValue([]),
  upsertUserProgress: vi.fn().mockResolvedValue(undefined),
  incrementQuizAttempts: vi.fn().mockResolvedValue(undefined),
  saveQuizAttempt: vi.fn().mockResolvedValue(undefined),
  updateUserPoints: vi.fn().mockResolvedValue(undefined),
  getUserBadges: vi.fn().mockResolvedValue([]),
  getAllBadges: vi.fn().mockResolvedValue([]),
  awardBadge: vi.fn().mockResolvedValue(undefined),
  getBadgeBySlug: vi.fn().mockResolvedValue(null),
  getLeaderboard: vi.fn().mockResolvedValue([
    { id: 1, name: "Test User", totalPoints: 0, level: 1 },
  ]),
  getAllUsers: vi.fn().mockResolvedValue([
    { id: 1, name: "Test User", email: "test@test.com", role: "user", totalPoints: 0, level: 1 },
  ]),
  getAdminStats: vi.fn().mockResolvedValue({ totalUsers: 1, completedModules: 0, inProgressModules: 0 }),
  updateUserProfile: vi.fn().mockResolvedValue(undefined),
  createTrail: vi.fn().mockResolvedValue(undefined),
  createModule: vi.fn().mockResolvedValue(undefined),
  createSlide: vi.fn().mockResolvedValue(undefined),
  createQuizQuestion: vi.fn().mockResolvedValue(undefined),
  deleteQuizQuestionsByModule: vi.fn().mockResolvedValue(undefined),
}));

// ─── Context factories ────────────────────────────────────────────────────────
function createUserContext(): TrpcContext {
  return {
    user: {
      id: 1, openId: "test-user", name: "Test User", email: "test@test.com",
      loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1, openId: "admin-user", name: "Admin User", email: "admin@test.com",
      loginMethod: "manus", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────
// ─── Mock SDK ────────────────────────────────────────────────────────────────
vi.mock("./_core/sdk", () => ({
  sdk: {
    signSession: vi.fn().mockResolvedValue("mock-jwt-token"),
    verifySession: vi.fn().mockResolvedValue(null),
    authenticateRequest: vi.fn().mockRejectedValue(new Error("no session")),
  },
}));

describe("auth", () => {
  it("loginSimple cria sessão e retorna usuário", async () => {
    const { getUserByOpenId, upsertUser } = await import("./db");
    (getUserByOpenId as any).mockResolvedValueOnce({
      id: 99, openId: "simple:novo@stellar.com", name: "Novo Colaborador",
      email: "novo@stellar.com", loginMethod: "simple", role: "user",
      totalPoints: 0, level: 1, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
    });

    const setCookies: string[] = [];
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {
        clearCookie: vi.fn(),
        cookie: (_name: string, _val: string) => setCookies.push(_name),
      } as unknown as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.loginSimple({ name: "Novo Colaborador", email: "novo@stellar.com" });

    expect(result.success).toBe(true);
    expect(result.user.email).toBe("novo@stellar.com");
    expect(upsertUser).toHaveBeenCalled();
    expect(setCookies).toContain(COOKIE_NAME);
  });

  it("loginSimple rejeita nome muito curto", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: vi.fn(), cookie: vi.fn() } as unknown as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    await expect(caller.auth.loginSimple({ name: "A", email: "a@b.com" })).rejects.toThrow();
  });

  it("loginSimple rejeita e-mail inválido", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: vi.fn(), cookie: vi.fn() } as unknown as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    await expect(caller.auth.loginSimple({ name: "Nome Valido", email: "nao-e-email" })).rejects.toThrow();
  });

  it("logout clears session cookie", async () => {
    const ctx = createUserContext();
    const clearedCookies: string[] = [];
    (ctx.res.clearCookie as any) = (name: string) => clearedCookies.push(name);
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies).toContain(COOKIE_NAME);
  });

  it("me returns current user", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    const user = await caller.auth.me();
    expect(user).toBeDefined();
    expect(user?.role).toBe("user");
  });
});

describe("trails", () => {
  it("list returns all 3 trails", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    const trails = await caller.trails.list();
    expect(trails).toHaveLength(3);
    expect(trails[0].slug).toBe("tbi-gente-cultura");
    expect(trails[1].slug).toBe("tbi-dp");
    expect(trails[2].slug).toBe("tbi-seguranca");
  });

  it("bySlug returns trail with modules", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.trails.bySlug({ slug: "tbi-gente-cultura" });
    expect(result.trail.title).toBe("TBI Gente e Cultura");
    expect(result.modules).toHaveLength(2);
  });

  it("bySlug throws NOT_FOUND for unknown slug", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.trails.bySlug({ slug: "nao-existe" })).rejects.toThrow();
  });
});

describe("modules", () => {
  it("byTrail returns modules with progress", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    const mods = await caller.modules.byTrail({ trailId: 1 });
    expect(mods).toHaveLength(2);
    expect(mods[0].progress).toBeNull();
  });

  it("detail returns module with slides", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.modules.detail({ moduleId: 1 });
    expect(result.module.title).toBe("Institucional");
    expect(result.slides).toHaveLength(1);
    expect(result.progress).toBeNull();
  });

  it("start creates in_progress progress record", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.modules.start({ moduleId: 1, trailId: 1 });
    expect(result.success).toBe(true);
  });
});

describe("quiz", () => {
  it("getQuestions returns questions without correctIndex", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    const questions = await caller.quiz.getQuestions({ moduleId: 1 });
    expect(questions).toHaveLength(1);
    expect(questions[0].question).toBe("O que é a Stellar Gaming?");
    // Security: correctIndex should NOT be exposed
    expect((questions[0] as any).correctIndex).toBeUndefined();
  });

  it("submit calculates score correctly", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.quiz.submit({
      moduleId: 1,
      trailId: 1,
      answers: [{ questionId: 1, selectedIndex: 0 }], // correct answer
    });
    expect(result.score).toBe(100);
    expect(result.passed).toBe(true);
    expect(result.correct).toBe(1);
  });

  it("submit marks wrong answer as failed", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.quiz.submit({
      moduleId: 1,
      trailId: 1,
      answers: [{ questionId: 1, selectedIndex: 2 }], // wrong answer
    });
    expect(result.score).toBe(0);
    expect(result.passed).toBe(false);
    expect(result.correct).toBe(0);
  });
});

describe("dashboard", () => {
  it("myStats returns user stats", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    const stats = await caller.dashboard.myStats();
    expect(stats.totalPoints).toBe(0);
    expect(stats.level).toBe(1);
    expect(stats.completed).toBe(0);
    expect(stats.leaderboard).toHaveLength(1);
  });

  it("leaderboard returns sorted users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    const lb = await caller.dashboard.leaderboard({ limit: 10 });
    expect(lb).toHaveLength(1);
  });
});

describe("admin", () => {
  it("stats returns platform stats for admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const stats = await caller.admin.stats();
    expect(stats?.totalUsers).toBe(1);
    expect(stats?.completedModules).toBe(0);
  });

  it("users returns all users for admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const users = await caller.admin.users();
    expect(users).toHaveLength(1);
    expect(users[0].name).toBe("Test User");
  });

  it("stats throws FORBIDDEN for regular user", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.stats()).rejects.toThrow("Acesso restrito a administradores.");
  });

  it("users throws FORBIDDEN for regular user", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.users()).rejects.toThrow("Acesso restrito a administradores.");
  });
});
