import { trpc } from "@/lib/trpc";
import { PlatformLayout } from "@/components/PlatformLayout";
import { useLocation, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CheckCircle, Clock, Lock, Play,
  Zap, Trophy, ChevronRight, ChevronDown,
  Users, UserCheck, Briefcase, Crown, BookOpen
} from "lucide-react";
import { StellarStar } from "@/components/StellarStar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Betinha } from "@/components/Betinha";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";

const profileColors: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
  todos: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Todos", icon: <Users className="w-3 h-3" /> },
  clt: { bg: "bg-green-500/10", text: "text-green-400", label: "CLT", icon: <UserCheck className="w-3 h-3" /> },
  pj: { bg: "bg-orange-500/10", text: "text-orange-400", label: "PJ", icon: <Briefcase className="w-3 h-3" /> },
  lideranca: { bg: "bg-purple-500/10", text: "text-purple-400", label: "Liderança", icon: <Crown className="w-3 h-3" /> },
};

function ModuleChapters({ moduleId }: { moduleId: number }) {
  const { data: chapters, isLoading } = trpc.chapters.byModule.useQuery(
    { moduleId },
    { enabled: !!moduleId }
  ) as { data: any[] | undefined; isLoading: boolean };

  if (isLoading) {
    return (
      <div className="mt-3 pl-4 border-l-2 border-border space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 bg-muted/30 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!chapters || chapters.length === 0) return null;

  return (
    <div className="mt-3 pl-4 border-l-2 border-border/50 space-y-2">
      {chapters.map((chapter: any, idx: number) => {
        const profile = profileColors[chapter.profileType] ?? profileColors.todos;
        return (
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/20 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground/80 leading-snug">{chapter.title}</p>
              {chapter.description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{chapter.description}</p>
              )}
            </div>
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0 ${profile.bg} ${profile.text}`}>
              {profile.icon}
              {profile.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function TrailDetail() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  const { data, isLoading } = trpc.trails.bySlug.useQuery(
    { slug: params.slug },
    { enabled: !!params.slug }
  );

  const { data: modulesWithProgress } = trpc.modules.byTrail.useQuery(
    { trailId: data?.trail.id ?? 0 },
    { enabled: !!data?.trail.id }
  ) as { data: any[] | undefined };

  if (isLoading) {
    return (
      <PlatformLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </PlatformLayout>
    );
  }

  if (!data) {
    return (
      <PlatformLayout>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Trilha não encontrada.</p>
          <Button variant="ghost" onClick={() => navigate("/trilhas")} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
        </div>
      </PlatformLayout>
    );
  }

  const { trail, modules } = data;
  const mods: any[] = modulesWithProgress || modules;
  const completed = mods.filter((m: any) => m.progress?.status === "completed").length;
  const totalPct = mods.length > 0 ? (completed / mods.length) * 100 : 0;

  const getModuleStatus = (mod: any) => {
    const status = mod.progress?.status;
    if (status === "completed") return "completed";
    if (status === "in_progress") return "in_progress";
    return "not_started";
  };

  const canAccessModule = (mod: any, idx: number) => {
    if (mod.isComingSoon) return false;
    if (idx === 0) return true;
    const prevMod = mods[idx - 1];
    return prevMod?.progress?.status === "completed" || prevMod?.progress?.status === "in_progress";
  };

  const toggleExpand = (modId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedModule(expandedModule === modId ? null : modId);
  };

  return (
    <PlatformLayout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate("/trilhas")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Trilhas
        </button>

        {/* Trail header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6 mb-6"
        >
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${trail.color ?? '#00C853'}20`, border: `1px solid ${trail.color ?? '#00C853'}40` }}
            >
              <StellarStar size={32} color={trail.color ?? '#00C853'} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-black text-foreground mb-1">{trail.title}</h1>
              <p className="text-muted-foreground text-sm mb-4">{trail.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{completed} de {mods.length} módulos concluídos</span>
                  <span className="font-semibold text-primary">{Math.round(totalPct)}%</span>
                </div>
                <Progress value={totalPct} className="h-2.5" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Betinha */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <Betinha
            speech={
              completed === 0
                ? `Confira aqui toda a Trilha de Onboarding: ${trail.title}. Comece pelo primeiro módulo e avance no seu ritmo. Estou aqui para te ajudar!`
                : completed === mods.length
                ? `Parabéns! Você concluiu toda a trilha "${trail.title}"! Você é incrível! 🎉`
                : `Você já completou ${completed} módulos! Continue assim, você está indo muito bem! Falta pouco para concluir a trilha.`
            }
            size="sm"
          />
        </motion.div>

        {/* Legenda de perfis */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs text-muted-foreground self-center">Capítulos por perfil:</span>
          {Object.entries(profileColors).map(([key, val]) => (
            <span key={key} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${val.bg} ${val.text}`}>
              {val.icon}
              {val.label}
            </span>
          ))}
        </div>

        {/* Modules list */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground mb-4">Módulos da Trilha</h2>
          {mods.map((mod: any, idx: number) => {
            const status = getModuleStatus(mod);
            const canAccess = canAccessModule(mod, idx);
            const isExpanded = expandedModule === mod.id;

            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`rounded-xl border transition-all duration-200 ${
                  status === "completed"
                    ? "border-primary/30 bg-primary/5"
                    : status === "in_progress"
                    ? "border-yellow-500/30 bg-yellow-500/5"
                    : "border-border bg-card"
                } ${!canAccess ? "opacity-50" : ""}`}
              >
                {/* Module header row */}
                <div
                  className={`flex items-center gap-4 p-4 ${canAccess ? "cursor-pointer" : "cursor-not-allowed"}`}
                  onClick={() => canAccess && navigate(`/modulo/${mod.id}`)}
                >
                  {/* Number / status icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                    status === "completed"
                      ? "bg-primary/20 text-primary"
                      : status === "in_progress"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : canAccess
                      ? "bg-muted text-muted-foreground"
                      : "bg-muted/50 text-muted-foreground/50"
                  }`}>
                    {status === "completed" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : status === "in_progress" ? (
                      <Play className="w-5 h-5" />
                    ) : !canAccess ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      idx + 1
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground text-sm">{mod.title}</h3>
                      {mod.subtitle && (
                        <span className="text-xs text-muted-foreground">{mod.subtitle}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{mod.description}</p>
                    {mod.progress?.quizScore != null && (
                      <div className="flex items-center gap-1 mt-1">
                        <Trophy className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-yellow-400">Quiz: {mod.progress.quizScore}%</span>
                      </div>
                    )}
                  </div>

                  {/* Points & expand button */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="flex items-center gap-1 justify-end">
                        <StellarStar size={12} color="#d9f22a" />
                        <span className="text-xs font-semibold text-foreground">{mod.pointsReward}</span>
                      </div>
                      {mod.bonusPoints > 0 && (
                        <div className="flex items-center gap-1 justify-end">
                          <Zap className="w-3 h-3 text-primary" />
                          <span className="text-xs text-primary">+{mod.bonusPoints} bônus</span>
                        </div>
                      )}
                    </div>
                    {canAccess && (
                      <>
                        <button
                          onClick={(e) => toggleExpand(mod.id, e)}
                          className="p-1 rounded-lg hover:bg-muted/50 transition-colors"
                          title={isExpanded ? "Ocultar capítulos" : "Ver capítulos"}
                        >
                          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </>
                    )}
                  </div>
                </div>

                {/* Chapters expandable section */}
                <AnimatePresence>
                  {isExpanded && canAccess && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Capítulos deste módulo</p>
                        <ModuleChapters moduleId={mod.id} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PlatformLayout>
  );
}
