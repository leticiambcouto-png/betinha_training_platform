import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { PlatformLayout } from "@/components/PlatformLayout";
import { useLocation, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, CheckCircle, Star, Zap,
  ChevronLeft, ChevronRight, BookOpen, Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Betinha } from "@/components/Betinha";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";


export default function ModuleViewer() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const moduleId = parseInt(params.id);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [earnedBonus, setEarnedBonus] = useState(0);
  const [newBadges, setNewBadges] = useState<string[]>([]);

  const { data, isLoading } = trpc.modules.detail.useQuery(
    { moduleId },
    { enabled: !!moduleId && !isNaN(moduleId) }
  );

  const startMutation = trpc.modules.start.useMutation();
  const updateProgressMutation = trpc.modules.updateProgress.useMutation();
  const completeMutation = trpc.modules.complete.useMutation();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (data?.module && data.progress?.status !== "completed") {
      startMutation.mutate({ moduleId, trailId: data.module.trailId });
    }
    if (data?.progress?.status === "completed") {
      setCompleted(true);
    }
    if (data?.progress?.currentSlide) {
      setCurrentSlide(data.progress.currentSlide);
    }
  }, [data?.module?.id]);

  const handleSlideChange = (idx: number) => {
    setCurrentSlide(idx);
    updateProgressMutation.mutate({ moduleId, trailId: data!.module.trailId, currentSlide: idx });
  };

  const handleComplete = async () => {
    if (!data?.module) return;
    try {
      const result = await completeMutation.mutateAsync({ moduleId, trailId: data.module.trailId });
      setCompleted(true);
      setEarnedPoints(result.pointsEarned);
      setEarnedBonus(result.bonusEarned);
      setNewBadges(result.newBadges);
      setShowCompletionModal(true);
      utils.dashboard.myStats.invalidate();
    } catch {
      toast.error("Erro ao registrar conclusão. Tente novamente.");
    }
  };

  if (isLoading || !data) {
    return (
      <PlatformLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </PlatformLayout>
    );
  }

  const { module: mod, slides } = data;
  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;
  const progressPct = slides.length > 0 ? ((currentSlide + 1) / slides.length) * 100 : 0;

  const getLayoutClass = (layout: string) => {
    switch (layout) {
      case "highlight": return "bg-primary/5 border-primary/30";
      case "quote": return "bg-accent border-accent";
      case "list": return "bg-card border-border";
      default: return "bg-card border-border";
    }
  };

  return (
    <PlatformLayout>
      <div className="flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button
              onClick={() => navigate("/trilhas")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{mod.title}</span>
                {mod.subtitle && <span className="text-xs text-muted-foreground hidden sm:block">— {mod.subtitle}</span>}
              </div>
              <Progress value={progressPct} className="h-1.5" />
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
        </div>

        {/* Slide content */}
        <div className="flex-1 p-4 lg:p-8 max-w-4xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className={`rounded-2xl border p-6 lg:p-10 mb-6 min-h-64 ${getLayoutClass(slide?.layout ?? "default")}`}
            >
              {slide?.title && (
                <h2 className={`text-2xl lg:text-3xl font-black mb-6 ${
                  slide.layout === "highlight" ? "text-primary stellar-glow-text" : "text-foreground"
                }`}>
                  {slide.title}
                </h2>
              )}
              <div className="text-foreground/90 leading-relaxed text-base">
                {(slide?.content ?? "").split("\n").map((line, i) => {
                  if (!line.trim()) return <br key={i} />;
                  const formatted = line
                    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-primary font-semibold">$1</strong>')
                    .replace(/^• /, '');
                  if (line.startsWith('• ') || line.startsWith('* ')) {
                    return (
                      <div key={i} className="flex items-start gap-2 mb-2">
                        <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                        <span dangerouslySetInnerHTML={{ __html: formatted }} />
                      </div>
                    );
                  }
                  return <p key={i} className="mb-3" dangerouslySetInnerHTML={{ __html: formatted }} />;
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Betinha speech */}
          {slide?.betinhaSpeech && (
            <motion.div
              key={`betinha-${currentSlide}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Betinha speech={slide.betinhaSpeech} size="sm" autoPlay={false} />
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => handleSlideChange(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="border-border"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </Button>

            {/* Slide dots */}
            <div className="flex gap-1.5 flex-wrap justify-center">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleSlideChange(i)}
                  className={`rounded-full transition-all ${
                    i === currentSlide
                      ? "w-6 h-2 bg-primary"
                      : i < currentSlide
                      ? "w-2 h-2 bg-primary/50"
                      : "w-2 h-2 bg-muted"
                  }`}
                />
              ))}
            </div>

            {isLastSlide ? (
              <Button
                onClick={completed ? () => navigate(`/quiz/${moduleId}`) : handleComplete}
                disabled={completeMutation.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {completeMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                ) : completed ? (
                  <Trophy className="w-4 h-4 mr-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                {completed ? "Fazer Quiz" : "Concluir Módulo"}
              </Button>
            ) : (
              <Button
                onClick={() => handleSlideChange(Math.min(slides.length - 1, currentSlide + 1))}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Próximo
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setShowCompletionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-card border border-primary/40 rounded-2xl p-8 max-w-md w-full text-center stellar-glow"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-black text-foreground mb-2">Módulo Concluído!</h2>
              <p className="text-muted-foreground mb-6">Parabéns! Você completou <strong className="text-foreground">{mod.title}</strong>.</p>

              {/* Points earned */}
              <div className="flex justify-center gap-4 mb-6">
                <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-1.5 justify-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-foreground">+{earnedPoints}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Pontos</p>
                </div>
                {earnedBonus > 0 && (
                  <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-1.5 justify-center">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="font-bold text-primary">+{earnedBonus}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">Bônus prazo</p>
                  </div>
                )}
              </div>

              {/* New conquistas */}
              {newBadges.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Conquistas desbloqueadas:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {newBadges.map((b) => (
                      <span key={b} className="px-3 py-1 bg-primary/15 border border-primary/30 rounded-full text-xs text-primary font-semibold animate-badge-pop">
                        🏆 {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-border"
                  onClick={() => { setShowCompletionModal(false); navigate(`/trilhas/gente-cultura`); }}
                >
                  Ver Trilha
                </Button>
                <Button
                  className="flex-1 bg-primary text-primary-foreground"
                  onClick={() => { setShowCompletionModal(false); navigate(`/quiz/${moduleId}`); }}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Fazer Quiz
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PlatformLayout>
  );
}
