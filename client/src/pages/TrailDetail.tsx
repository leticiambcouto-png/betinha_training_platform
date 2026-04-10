import { trpc } from "@/lib/trpc";
import { PlatformLayout } from "@/components/PlatformLayout";
import { useLocation, useParams } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft, CheckCircle, Clock, Lock, Play,
  Star, Zap, Trophy, ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Betinha } from "@/components/Betinha";
import { useAuth } from "@/_core/hooks/useAuth";

export default function TrailDetail() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();

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
              <Star className="w-8 h-8" style={{ color: trail.color ?? '#00C853' }} />
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
                ? `Boa sorte na trilha "${trail.title}"! Comece pelo primeiro módulo e avance no seu ritmo. Estou aqui para te ajudar!`
                : completed === mods.length
                ? `Parabéns! Você concluiu toda a trilha "${trail.title}"! Você é incrível! 🎉`
                : `Você já completou ${completed} módulos! Continue assim, você está indo muito bem! Falta pouco para concluir a trilha.`
            }
            size="sm"
          />
        </motion.div>

        {/* Modules list */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-foreground mb-4">Módulos da Trilha</h2>
          {mods.map((mod: any, idx: number) => {
            const status = getModuleStatus(mod);
            const canAccess = canAccessModule(mod, idx);

            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => canAccess && navigate(`/modulo/${mod.id}`)}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                  canAccess
                    ? "cursor-pointer hover:border-primary/40 hover:bg-card/80"
                    : "opacity-50 cursor-not-allowed"
                } ${
                  status === "completed"
                    ? "border-primary/30 bg-primary/5"
                    : status === "in_progress"
                    ? "border-yellow-500/30 bg-yellow-500/5"
                    : "border-border bg-card"
                }`}
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
                      <span className="text-xs text-muted-foreground">— {mod.subtitle}</span>
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

                {/* Points & arrow */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
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
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PlatformLayout>
  );
}
