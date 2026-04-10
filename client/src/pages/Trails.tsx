import { trpc } from "@/lib/trpc";
import { PlatformLayout } from "@/components/PlatformLayout";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Star, BookOpen, FileText, Shield, ChevronRight,
  Lock, CheckCircle, Clock, Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Betinha } from "@/components/Betinha";
import { useAuth } from "@/_core/hooks/useAuth";

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Star: Star as React.FC<React.SVGProps<SVGSVGElement>>,
  BookOpen: BookOpen as React.FC<React.SVGProps<SVGSVGElement>>,
  FileText: FileText as React.FC<React.SVGProps<SVGSVGElement>>,
  Shield: Shield as React.FC<React.SVGProps<SVGSVGElement>>,
};

const TRAIL_SPEECHES: Record<string, string> = {
  "tbi-gente-cultura": "Essa é a trilha principal do seu onboarding! Aqui você vai conhecer tudo sobre a Stellar Space — nossa história, valores, cultura e muito mais. Vamos começar?",
  "tbi-dp": "Essa trilha vai te ajudar a entender tudo sobre benefícios, jornada de trabalho e políticas de RH. Em breve disponível!",
  "tbi-seguranca": "Aqui você aprende sobre saúde e segurança no trabalho. Um ambiente seguro é responsabilidade de todos! Em breve disponível.",
};

export default function Trails() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { data: trails, isLoading } = trpc.trails.list.useQuery();
  const { data: stats } = trpc.dashboard.myStats.useQuery(undefined, {
    enabled: !!user,
  });

  const getTrailProgress = (trailId: number) => {
    if (!stats?.progress) return { completed: 0, total: 0, pct: 0 };
    const trailProgress = stats.progress.filter((p: any) => p.trailId === trailId);
    const completed = trailProgress.filter((p: any) => p.status === "completed").length;
    return { completed, total: trailProgress.length, pct: trailProgress.length > 0 ? (completed / trailProgress.length) * 100 : 0 };
  };

  if (isLoading) {
    return (
      <PlatformLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground text-sm">Carregando trilhas...</p>
          </div>
        </div>
      </PlatformLayout>
    );
  }

  return (
    <PlatformLayout>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-black text-foreground mb-1">Trilhas de Aprendizado</h1>
          <p className="text-muted-foreground">Escolha uma trilha e comece sua jornada de integração</p>
        </motion.div>

        {/* Betinha */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Betinha
            speech="Aqui estão todas as trilhas disponíveis para você! Comece pela TBI Gente e Cultura — ela foi feita especialmente para o seu primeiro dia. As outras trilhas chegarão em breve!"
            size="md"
          />
        </motion.div>

        {/* Trails grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trails?.map((trail: any, i: number) => {
            const IconComp = iconMap[trail.icon] || Star;
            const progress = getTrailProgress(trail.id);
            const isComingSoon = trail.slug !== "tbi-gente-cultura";
            const isCompleted = progress.pct === 100;

            return (
              <motion.div
                key={trail.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => !isComingSoon && navigate(`/trilhas/${trail.slug}`)}
                className={`stellar-card rounded-2xl p-6 ${!isComingSoon ? "cursor-pointer" : "opacity-70 cursor-not-allowed"}`}
              >
                {/* Trail icon & status */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${trail.color}20`, border: `1px solid ${trail.color}40` }}
                  >
                    <IconComp className="w-7 h-7" style={{ color: trail.color }} />
                  </div>
                  {isComingSoon ? (
                    <Badge variant="outline" className="text-xs border-muted-foreground/30 text-muted-foreground">
                      <Lock className="w-3 h-3 mr-1" />
                      Em breve
                    </Badge>
                  ) : isCompleted ? (
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Concluída
                    </Badge>
                  ) : progress.completed > 0 ? (
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                      <Zap className="w-3 h-3 mr-1" />
                      Em progresso
                    </Badge>
                  ) : null}
                </div>

                {/* Info */}
                <h3 className="font-bold text-foreground text-lg mb-1">{trail.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{trail.description}</p>

                {/* Progress */}
                {!isComingSoon && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{progress.completed} de {progress.total > 0 ? progress.total : "11"} módulos</span>
                      <span>{Math.round(progress.pct)}%</span>
                    </div>
                    <Progress value={progress.pct} className="h-2" />
                  </div>
                )}

                {/* CTA */}
                {!isComingSoon && (
                  <div className="flex items-center gap-1 mt-4 text-primary text-sm font-semibold">
                    {progress.completed > 0 ? "Continuar trilha" : "Começar trilha"}
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </PlatformLayout>
  );
}
