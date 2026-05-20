import { trpc } from "@/lib/trpc";
import { PlatformLayout } from "@/components/PlatformLayout";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Star, BookOpen, FileText, Shield, ChevronRight,
  CheckCircle, Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Betinha } from "@/components/Betinha";
import { useAuth } from "@/_core/hooks/useAuth";

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Star: Star as React.FC<React.SVGProps<SVGSVGElement>>,
  BookOpen: BookOpen as React.FC<React.SVGProps<SVGSVGElement>>,
  FileText: FileText as React.FC<React.SVGProps<SVGSVGElement>>,
  Shield: Shield as React.FC<React.SVGProps<SVGSVGElement>>,
};

function Star4({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
    </svg>
  );
}

export default function Trails() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { data: trails, isLoading } = trpc.trails.list.useQuery();
  const { data: stats } = trpc.dashboard.myStats.useQuery(undefined, { enabled: !!user });

  const getTrailProgress = (trailId: number) => {
    if (!stats?.progress) return { completed: 0, total: 0, pct: 0 };
    const trailProgress = stats.progress.filter((p: any) => p.trailId === trailId);
    const completed = trailProgress.filter((p: any) => p.status === "completed").length;
    return { completed, total: trailProgress.length, pct: trailProgress.length > 0 ? (completed / trailProgress.length) * 100 : 0 };
  };

  if (isLoading) {
    return (
      <PlatformLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground text-sm font-medium">Carregando trilhas...</p>
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
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1">Onboarding 2.0</p>
          <h1
            className="text-3xl lg:text-4xl font-black text-foreground uppercase leading-tight"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Trilhas de Aprendizado
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Escolha uma trilha e comece sua jornada de integração
          </p>
        </motion.div>

        {/* Betinha */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Betinha
            speech="Aqui estão todas as trilhas disponíveis para você! Comece pela Trilha de Onboarding: Gente e Cultura, ela foi feita especialmente para o seu primeiro dia. Depois explore as trilhas de Departamento Pessoal e Saúde e Segurança do Trabalho!"
            size="md"
          />
        </motion.div>

        {/* Trails grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trails?.map((trail: any, i: number) => {
            const IconComp = iconMap[trail.icon] || Star;
            const progress = getTrailProgress(trail.id);
            const isCompleted = progress.pct === 100;
            const inProgress = progress.completed > 0 && !isCompleted;
            const pct = Math.round(progress.pct);

            return (
              <motion.div
                key={trail.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => navigate(`/trilhas/${trail.slug}`)}
                className="group relative bg-card border border-border rounded-2xl p-6 cursor-pointer transition-all duration-300 overflow-hidden"
                style={{
                  boxShadow: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${trail.color}60`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${trail.color}18`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Background glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 20% 20%, ${trail.color}08 0%, transparent 60%)` }}
                />

                {/* Header row */}
                <div className="relative flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${trail.color}18`, border: `1px solid ${trail.color}35` }}
                  >
                    <IconComp className="w-6 h-6" style={{ color: trail.color }} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {isCompleted && (
                      <Badge className="bg-primary/15 text-primary border-primary/25 text-xs font-bold">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Concluída
                      </Badge>
                    )}
                    {inProgress && (
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary font-bold">
                        <Zap className="w-3 h-3 mr-1" />
                        Em progresso
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3
                  className="font-black text-foreground text-lg uppercase leading-tight mb-2"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {trail.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">
                  {trail.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground font-medium">
                    <span>
                      {progress.completed} de {progress.total > 0 ? progress.total : "0"} módulos
                    </span>
                    <span style={{ color: trail.color }}>{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: trail.color,
                        boxShadow: pct > 0 ? `0 0 6px ${trail.color}60` : "none",
                      }}
                    />
                  </div>
                </div>

                {/* CTA row */}
                <div
                  className="flex items-center gap-1 text-sm font-bold transition-colors duration-200"
                  style={{ color: trail.color }}
                >
                  <Star4 className="w-3.5 h-3.5" />
                  <span>{progress.completed > 0 ? "Continuar trilha" : "Começar trilha"}</span>
                  <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PlatformLayout>
  );
}
