import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  getAllTrails,
  getTrailBySlug,
  getModulesByTrail,
  getModuleById,
  getSlidesByModule,
  getQuizByModule,
  getUserProgressForTrail,
  getUserProgressForModule,
  getAllUserProgress,
  upsertUserProgress,
  incrementQuizAttempts,
  saveQuizAttempt,
  updateUserPoints,
  getUserBadges,
  getAllBadges,
  awardBadge,
  getBadgeBySlug,
  getLeaderboard,
  getAllUsers,
  getAdminStats,
  updateUserProfile,
  createTrail,
  createModule,
  createSlide,
  createQuizQuestion,
  deleteQuizQuestionsByModule,
  getUserById,
} from "./db";
import { invokeLLM } from "./_core/llm";

// ─── Admin middleware ──────────────────────────────────────────────────────────
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito a administradores." });
  }
  return next({ ctx });
});

// ─── Gamification helpers ──────────────────────────────────────────────────────
async function checkAndAwardBadges(userId: number) {
  const progress = await getAllUserProgress(userId);
  const completed = progress.filter((p) => p.status === "completed");
  const user = await getUserById(userId);
  if (!user) return [];

  const newBadges: string[] = [];

  // First module
  if (completed.length >= 1) {
    const b = await getBadgeBySlug("primeiro-passo");
    if (b) { await awardBadge(userId, b.id); newBadges.push(b.name); }
  }
  // 3 modules
  if (completed.length >= 3) {
    const b = await getBadgeBySlug("estrela-em-ascensao");
    if (b) { await awardBadge(userId, b.id); newBadges.push(b.name); }
  }
  // 500 points
  if (user.totalPoints >= 500) {
    const b = await getBadgeBySlug("pontuacao-500");
    if (b) { await awardBadge(userId, b.id); newBadges.push(b.name); }
  }
  // On time bonus
  const onTime = completed.find((p) => p.bonusEarned > 0);
  if (onTime) {
    const b = await getBadgeBySlug("velocidade-da-luz");
    if (b) { await awardBadge(userId, b.id); newBadges.push(b.name); }
  }
  // Perfect quiz
  const perfect = completed.find((p) => p.quizScore === 100);
  if (perfect) {
    const b = await getBadgeBySlug("mestre-do-quiz");
    if (b) { await awardBadge(userId, b.id); newBadges.push(b.name); }
  }

  return newBadges;
}

// ─── App Router ───────────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    updateProfile: protectedProcedure
      .input(z.object({
        department: z.string().optional(),
        jobTitle: z.string().optional(),
        admissionDate: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),
  }),

  // ─── Trails ─────────────────────────────────────────────────────────────────
  trails: router({
    list: publicProcedure.query(async () => {
      return getAllTrails();
    }),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const trail = await getTrailBySlug(input.slug);
        if (!trail) throw new TRPCError({ code: "NOT_FOUND" });
        const mods = await getModulesByTrail(trail.id);
        return { trail, modules: mods };
      }),
  }),

  // ─── Modules ────────────────────────────────────────────────────────────────
  modules: router({
    byTrail: protectedProcedure
      .input(z.object({ trailId: z.number() }))
      .query(async ({ ctx, input }) => {
        const mods = await getModulesByTrail(input.trailId);
        const progress = await getUserProgressForTrail(ctx.user.id, input.trailId);
        const progressMap = new Map(progress.map((p) => [p.moduleId, p]));
        return mods.map((m) => ({
          ...m,
          progress: progressMap.get(m.id) ?? null,
        }));
      }),

    detail: protectedProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ ctx, input }) => {
        const mod = await getModuleById(input.moduleId);
        if (!mod) throw new TRPCError({ code: "NOT_FOUND" });
        const slides = await getSlidesByModule(input.moduleId);
        const progress = await getUserProgressForModule(ctx.user.id, input.moduleId);
        return { module: mod, slides, progress: progress ?? null };
      }),

    start: protectedProcedure
      .input(z.object({ moduleId: z.number(), trailId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const existing = await getUserProgressForModule(ctx.user.id, input.moduleId);
        if (!existing || existing.status === "not_started") {
          await upsertUserProgress({
            userId: ctx.user.id,
            moduleId: input.moduleId,
            trailId: input.trailId,
            status: "in_progress",
            startedAt: new Date(),
          });
        }
        return { success: true };
      }),

    updateProgress: protectedProcedure
      .input(z.object({
        moduleId: z.number(),
        trailId: z.number(),
        currentSlide: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        await upsertUserProgress({
          userId: ctx.user.id,
          moduleId: input.moduleId,
          trailId: input.trailId,
          status: "in_progress",
          currentSlide: input.currentSlide,
        });
        return { success: true };
      }),

    complete: protectedProcedure
      .input(z.object({ moduleId: z.number(), trailId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const mod = await getModuleById(input.moduleId);
        if (!mod) throw new TRPCError({ code: "NOT_FOUND" });

        const existing = await getUserProgressForModule(ctx.user.id, input.moduleId);
        if (existing?.status === "completed") {
          return { success: true, pointsEarned: 0, bonusEarned: 0, newBadges: [] };
        }

        const now = new Date();
        let bonusEarned = 0;

        // Check deadline bonus
        if (existing?.startedAt && mod.deadlineDays) {
          const deadlineMs = mod.deadlineDays * 24 * 60 * 60 * 1000;
          const elapsed = now.getTime() - existing.startedAt.getTime();
          if (elapsed <= deadlineMs) {
            bonusEarned = mod.bonusPoints;
          }
        }

        await upsertUserProgress({
          userId: ctx.user.id,
          moduleId: input.moduleId,
          trailId: input.trailId,
          status: "completed",
          completedAt: now,
          pointsEarned: mod.pointsReward,
          bonusEarned,
        });

        await updateUserPoints(ctx.user.id, mod.pointsReward + bonusEarned);
        const newBadges = await checkAndAwardBadges(ctx.user.id);

        return {
          success: true,
          pointsEarned: mod.pointsReward,
          bonusEarned,
          newBadges,
        };
      }),
  }),

  // ─── Quiz ────────────────────────────────────────────────────────────────────
  quiz: router({
    getQuestions: protectedProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ input }) => {
        const questions = await getQuizByModule(input.moduleId);
        // Return without correct answer index for security
        return questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options as string[],
          orderIndex: q.orderIndex,
        }));
      }),

    generateWithAI: protectedProcedure
      .input(z.object({ moduleId: z.number() }))
      .mutation(async ({ input }) => {
        const mod = await getModuleById(input.moduleId);
        if (!mod) throw new TRPCError({ code: "NOT_FOUND" });

        const slides = await getSlidesByModule(input.moduleId);
        const content = slides.map((s) => `${s.title || ""}\n${s.content}`).join("\n\n");

        const prompt = `Você é um especialista em criação de quizzes educacionais. Com base no conteúdo abaixo sobre "${mod.title} - ${mod.subtitle}", crie 4 perguntas de múltipla escolha em português brasileiro.

CONTEÚDO:
${content}

Retorne APENAS um JSON válido no seguinte formato:
{
  "questions": [
    {
      "question": "Pergunta aqui?",
      "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
      "correctIndex": 0,
      "explanation": "Explicação do porquê esta é a resposta correta."
    }
  ]
}

Regras:
- As perguntas devem testar compreensão real do conteúdo
- Cada pergunta deve ter exatamente 4 opções
- correctIndex é o índice (0-3) da resposta correta
- A explicação deve ser educativa e em português
- Não repita perguntas óbvias demais`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Você é um especialista em educação corporativa e criação de quizzes. Responda sempre em JSON válido." },
            { role: "user", content: prompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "quiz_questions",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        question: { type: "string" },
                        options: { type: "array", items: { type: "string" } },
                        correctIndex: { type: "integer" },
                        explanation: { type: "string" },
                      },
                      required: ["question", "options", "correctIndex", "explanation"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["questions"],
                additionalProperties: false,
              },
            },
          },
        });

        const parsed = JSON.parse(response.choices[0].message.content as string);

        // Delete existing AI questions and insert new ones
        await deleteQuizQuestionsByModule(input.moduleId);
        for (let i = 0; i < parsed.questions.length; i++) {
          const q = parsed.questions[i];
          await createQuizQuestion({
            moduleId: input.moduleId,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            orderIndex: i,
            isAiGenerated: true,
          });
        }

        return { success: true, count: parsed.questions.length };
      }),

    submit: protectedProcedure
      .input(z.object({
        moduleId: z.number(),
        trailId: z.number(),
        answers: z.array(z.object({
          questionId: z.number(),
          selectedIndex: z.number(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        const questions = await getQuizByModule(input.moduleId);
        if (questions.length === 0) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Nenhuma pergunta encontrada para este módulo." });
        }

        let correct = 0;
        const results = input.answers.map((a) => {
          const q = questions.find((q) => q.id === a.questionId);
          if (!q) return { questionId: a.questionId, correct: false, correctIndex: -1, explanation: "" };
          const isCorrect = q.correctIndex === a.selectedIndex;
          if (isCorrect) correct++;
          return {
            questionId: a.questionId,
            correct: isCorrect,
            correctIndex: q.correctIndex,
            explanation: q.explanation ?? "",
          };
        });

        const score = Math.round((correct / questions.length) * 100);
        const passed = score >= 70;

        await saveQuizAttempt({
          userId: ctx.user.id,
          moduleId: input.moduleId,
          answers: input.answers,
          score,
          passed,
        });

        await incrementQuizAttempts(ctx.user.id, input.moduleId);

        // Update quiz score in progress
        await upsertUserProgress({
          userId: ctx.user.id,
          moduleId: input.moduleId,
          trailId: input.trailId,
          quizScore: score,
        });

        // Award badge for perfect score
        if (score === 100) {
          const b = await getBadgeBySlug("mestre-do-quiz");
          if (b) await awardBadge(ctx.user.id, b.id);
        }

        return { score, passed, correct, total: questions.length, results };
      }),
  }),

  // ─── User Dashboard ──────────────────────────────────────────────────────────
  dashboard: router({
    myStats: protectedProcedure.query(async ({ ctx }) => {
      const user = await getUserById(ctx.user.id);
      const progress = await getAllUserProgress(ctx.user.id);
      const badges = await getUserBadges(ctx.user.id);
      const leaderboard = await getLeaderboard(10);
      const rank = leaderboard.findIndex((u) => u.id === ctx.user.id) + 1;

      const completed = progress.filter((p) => p.status === "completed").length;
      const inProgress = progress.filter((p) => p.status === "in_progress").length;
      const totalPoints = user?.totalPoints ?? 0;
      const level = user?.level ?? 1;
      const pointsToNextLevel = (level * 500) - totalPoints;

      return {
        user,
        completed,
        inProgress,
        totalPoints,
        level,
        pointsToNextLevel,
        badges,
        leaderboard,
        rank,
        progress,
      };
    }),

    leaderboard: publicProcedure
      .input(z.object({ limit: z.number().default(10) }))
      .query(async ({ input }) => {
        return getLeaderboard(input.limit);
      }),
  }),

  // ─── TTS ─────────────────────────────────────────────────────────────────────
  tts: router({
    synthesize: protectedProcedure
      .input(z.object({ text: z.string().max(500) }))
      .mutation(async ({ input }) => {
        // Use Forge API for TTS
        const apiUrl = process.env.BUILT_IN_FORGE_API_URL;
        const apiKey = process.env.BUILT_IN_FORGE_API_KEY;

        if (!apiUrl || !apiKey) {
          return { audioUrl: null, error: "TTS não configurado" };
        }

        try {
          const response = await fetch(`${apiUrl}/v1/audio/speech`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "tts-1",
              input: input.text,
              voice: "nova",
              response_format: "mp3",
            }),
          });

          if (!response.ok) {
            return { audioUrl: null, error: "Falha ao gerar áudio" };
          }

          const audioBuffer = await response.arrayBuffer();
          const base64 = Buffer.from(audioBuffer).toString("base64");
          return { audioUrl: `data:audio/mp3;base64,${base64}`, error: null };
        } catch {
          return { audioUrl: null, error: "Erro ao processar TTS" };
        }
      }),
  }),

  // ─── Admin ───────────────────────────────────────────────────────────────────
  admin: router({
    stats: adminProcedure.query(async () => {
      return getAdminStats();
    }),

    users: adminProcedure.query(async () => {
      return getAllUsers();
    }),

    allProgress: adminProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return getAllUserProgress(input.userId);
      }),

    createTrail: adminProcedure
      .input(z.object({
        slug: z.string(),
        title: z.string(),
        description: z.string().optional(),
        icon: z.string().optional(),
        color: z.string().optional(),
        orderIndex: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await createTrail(input);
        return { success: true };
      }),

    createModule: adminProcedure
      .input(z.object({
        trailId: z.number(),
        slug: z.string(),
        title: z.string(),
        subtitle: z.string().optional(),
        description: z.string().optional(),
        orderIndex: z.number().optional(),
        pointsReward: z.number().optional(),
        bonusPoints: z.number().optional(),
        deadlineDays: z.number().optional(),
        isComingSoon: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        await createModule(input);
        return { success: true };
      }),

    generateQuizForModule: adminProcedure
      .input(z.object({ moduleId: z.number() }))
      .mutation(async ({ input }) => {
        const mod = await getModuleById(input.moduleId);
        if (!mod) throw new TRPCError({ code: "NOT_FOUND" });

        const slides = await getSlidesByModule(input.moduleId);
        const content = slides.map((s) => `${s.title || ""}\n${s.content}`).join("\n\n");

        const prompt = `Você é um especialista em criação de quizzes educacionais. Com base no conteúdo abaixo sobre "${mod.title}", crie 4 perguntas de múltipla escolha em português brasileiro.

CONTEÚDO:
${content}

Retorne APENAS um JSON válido no seguinte formato:
{
  "questions": [
    {
      "question": "Pergunta aqui?",
      "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
      "correctIndex": 0,
      "explanation": "Explicação do porquê esta é a resposta correta."
    }
  ]
}`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Você é um especialista em educação corporativa. Responda sempre em JSON válido." },
            { role: "user", content: prompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "quiz_questions",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        question: { type: "string" },
                        options: { type: "array", items: { type: "string" } },
                        correctIndex: { type: "integer" },
                        explanation: { type: "string" },
                      },
                      required: ["question", "options", "correctIndex", "explanation"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["questions"],
                additionalProperties: false,
              },
            },
          },
        });

        const parsed = JSON.parse(response.choices[0].message.content as string);
        await deleteQuizQuestionsByModule(input.moduleId);
        for (let i = 0; i < parsed.questions.length; i++) {
          const q = parsed.questions[i];
          await createQuizQuestion({
            moduleId: input.moduleId,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            orderIndex: i,
            isAiGenerated: true,
          });
        }

        return { success: true, count: parsed.questions.length };
      }),

    badges: adminProcedure.query(async () => {
      return getAllBadges();
    }),
  }),
});

export type AppRouter = typeof appRouter;
