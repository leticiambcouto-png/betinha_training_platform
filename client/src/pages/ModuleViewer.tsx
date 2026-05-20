import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { PlatformLayout } from "@/components/PlatformLayout";
import { useLocation, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, CheckCircle, Zap,
  ChevronLeft, ChevronRight, BookOpen, Trophy,
  Users, UserCheck, Briefcase, Crown, List, X
} from "lucide-react";
import { StellarStar } from "@/components/StellarStar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Betinha } from "@/components/Betinha";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { TimelineSlide, parseTimelineContent } from "@/components/slides/TimelineSlide";
import { CardDeckSlide, parseCardDeckContent } from "@/components/slides/CardDeckSlide";
import { DictionarySlide, parseDictionaryContent } from "@/components/slides/DictionarySlide";
import { ValuesSlide, parseValuesContent } from "@/components/slides/ValuesSlide";
import { VideoPlaceholderSlide, parseVideoContent } from "@/components/slides/VideoPlaceholderSlide";
import { BetinhaIntroSlide } from "@/components/slides/BetinhaIntroSlide";

function parseBetinhaIntroContent(content: string): { speech: string; imageUrl?: string } {
  try { return JSON.parse(content); } catch { return { speech: content }; }
}

const profileConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  todos: { label: "Todos", color: "text-blue-400", icon: <Users className="w-3 h-3" /> },
  clt: { label: "CLT", color: "text-green-400", icon: <UserCheck className="w-3 h-3" /> },
  pj: { label: "PJ", color: "text-orange-400", icon: <Briefcase className="w-3 h-3" /> },
  lideranca: { label: "Liderança", color: "text-purple-400", icon: <Crown className="w-3 h-3" /> },
};


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
  const [showChapterPanel, setShowChapterPanel] = useState(false);

  const { data, isLoading } = trpc.modules.detail.useQuery(
    { moduleId },
    { enabled: !!moduleId && !isNaN(moduleId) }
  );

  const { data: chapters } = trpc.chapters.byModule.useQuery(
    { moduleId },
    { enabled: !!moduleId && !isNaN(moduleId) }
  ) as { data: any[] | undefined };

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
    // Always start from slide 0
    setCurrentSlide(0);
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
            {chapters && chapters.length > 0 && (
              <button
                onClick={() => setShowChapterPanel(!showChapterPanel)}
                className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
                title="Ver capítulos"
              >
                {showChapterPanel ? <X className="w-4 h-4" /> : <List className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Chapter panel */}
        <AnimatePresence>
          {showChapterPanel && chapters && chapters.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-b border-border bg-card/50"
            >
              <div className="max-w-4xl mx-auto px-4 py-3">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Capítulos deste módulo</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {chapters.map((chapter: any) => {
                    const profile = profileConfig[chapter.profileType] ?? profileConfig.todos;
                    return (
                      <div key={chapter.id} className="flex items-start gap-2 p-2 rounded-lg bg-muted/20">
                        <BookOpen className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground/80 leading-snug">{chapter.title}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium flex-shrink-0 ${profile.color}`}>
                          {profile.icon}
                          {profile.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slide content */}
        <div className="flex-1 p-4 lg:p-8 max-w-4xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className={`rounded-2xl border p-6 lg:p-10 mb-6 min-h-64 relative ${getLayoutClass(slide?.layout ?? "default")}`}
            >

              {/* Rich slide layouts */}
              {slide?.layout === "timeline" && (() => {
                const parsed = parseTimelineContent(slide.content);
                return <TimelineSlide title={slide.title ?? undefined} intro={parsed.intro} years={parsed.years} />;
              })()}

              {slide?.layout === "card-deck" && (() => {
                const parsed = parseCardDeckContent(slide.content);
                return <CardDeckSlide title={slide.title ?? undefined} cards={parsed.cards} columns={parsed.columns} contractType={(user?.contractType as "clt" | "pj" | null) ?? null} />;
              })()}

              {slide?.layout === "dictionary" && (() => {
                const parsed = parseDictionaryContent(slide.content);
                return <DictionarySlide title={slide.title ?? undefined} description={parsed.description} entries={parsed.entries} />;
              })()}

              {slide?.layout === "values" && (() => {
                const parsed = parseValuesContent(slide.content);
                return <ValuesSlide title={slide.title ?? undefined} intro={parsed.intro} values={parsed.values} />;
              })()}

              {slide?.layout === "video-placeholder" && (() => {
                const parsed = parseVideoContent(slide.content);
                return <VideoPlaceholderSlide title={slide.title ?? undefined} data={parsed} />;
              })()}
              {slide?.layout === "betinha-intro" && (() => {
                const parsed = parseBetinhaIntroContent(slide.content);
                return <BetinhaIntroSlide speech={parsed.speech} imageUrl={parsed.imageUrl} />;
              })()}

              {/* Standard text layouts */}
              {(!slide?.layout || !["timeline","card-deck","dictionary","values","video-placeholder","betinha-intro"].includes(slide.layout)) && (
                <>
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
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Betinha speech — below card for all layouts */}
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
            {moduleId !== 1 ? (
              <Button
                variant="outline"
                onClick={() => handleSlideChange(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
                className="border-border"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </Button>
            ) : (
              <div />
            )}

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
                onClick={completed && moduleId !== 1 ? () => navigate(`/quiz/${moduleId}`) : handleComplete}
                disabled={completeMutation.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {completeMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                ) : completed && moduleId !== 1 ? (
                  <Trophy className="w-4 h-4 mr-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                {completed && moduleId !== 1 ? "Fazer Quiz" : "Concluir Módulo"}
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
                    <StellarStar size={16} color="#d9f22a" />
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
                  onClick={() => { setShowCompletionModal(false); navigate("/trilhas"); }}
                >
                  Ver Trilha
                </Button>
                {moduleId !== 1 && (
                  <Button
                    className="flex-1 bg-primary text-primary-foreground"
                    onClick={() => { setShowCompletionModal(false); navigate(`/quiz/${moduleId}`); }}
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Fazer Quiz
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PlatformLayout>
  );
}
