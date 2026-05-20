import { trpc } from "@/lib/trpc";
import { PlatformLayout } from "@/components/PlatformLayout";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Trophy, BookOpen, CheckCircle,
  TrendingUp, Award, ChevronRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Betinha } from "@/components/Betinha";
import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const LEVEL_NAMES = ["Iniciante", "Aprendiz", "Explorador", "Especialista", "Mestre", "Lenda"];

function Star4({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
    </svg>
  );
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { data: stats, isLoading } = trpc.dashboard.myStats.useQuery(undefined, { enabled: !!user });

  if (isLoading || !stats) {
    return (
      <PlatformLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground text-sm font-medium">Carregando seu progresso...</p>
          </div>
        </div>
      </PlatformLayout>
    );
  }

  const levelName = LEVEL_NAMES[Math.min(stats.level - 1, LEVEL_NAMES.length - 1)];
  const levelProgress = Math.max(0, 100 - (stats.pointsToNextLevel / (stats.level * 500)) * 100);
  const firstName = user?.name?.split(" ")[0] ?? "Colaborador";

  const getBetinhaSpeech = () => {
    if (stats.completed === 0) return "Conheça a Stellar Gaming, nossa cultura e nosso jeito de trabalhar através de trilhas interativas. Vamos começar? 🚀";
    if (stats.rank === 1) return `Uau! Você está em 1º lugar no ranking com ${stats.totalPoints} pontos! Que incrível! Continue assim! 🏆`;
    if (stats.completed >= 5) return `Você já completou ${stats.completed} módulos! Está indo muito bem! Continue para subir ainda mais no ranking.`;
    return `Você já tem ${stats.totalPoints} pontos e completou ${stats.completed} módulos. Continue, cada módulo te deixa mais próximo do topo!`;
  };

  const statCards = [
    { icon: Star4, label: "Pontos Totais", value: stats.totalPoints, colorClass: "text-yellow-400", bgClass: "bg-yellow-400/10", borderClass: "border-yellow-400/20" },
    { icon: CheckCircle, label: "Módulos Concluídos", value: stats.completed, colorClass: "text-primary", bgClass: "bg-primary/10", borderClass: "border-primary/20" },
    { icon: TrendingUp, label: "Nível Atual", value: levelName, colorClass: "text-blue-400", bgClass: "bg-blue-400/10", borderClass: "border-blue-400/20" },
    { icon: Trophy, label: "Posição no Ranking", value: stats.rank > 0 ? `#${stats.rank}` : "N/A", colorClass: "text-orange-400", bgClass: "bg-orange-400/10", borderClass: "border-orange-400/20" },
  ];

  return (
    <PlatformLayout>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">

        {/* Welcome header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1">Bem-vindo de volta</p>
          <h1
            className="text-3xl lg:text-4xl font-black text-foreground uppercase leading-tight"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Olá, {firstName}! 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Aqui está seu progresso de aprendizado</p>
        </motion.div>

        {/* Betinha */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Betinha speech={getBetinhaSpeech()} size="sm" />
        </motion.div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -3, scale: 1.01 }}
              className={`bg-card border rounded-xl p-4 transition-all duration-300 ${stat.borderClass}`}
              style={{ boxShadow: "none" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(217,242,42,0.07)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bgClass} border ${stat.borderClass} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.colorClass}`} />
              </div>
              <p
                className="text-2xl font-black text-foreground"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Level progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="font-bold text-foreground text-sm">
                Nível {stats.level}:{" "}
                <span className="text-primary" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1rem", fontWeight: 800 }}>
                  {levelName.toUpperCase()}
                </span>
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {Math.max(0, stats.pointsToNextLevel)} pts para o próximo nível
            </span>
          </div>
          <div className="relative">
            <Progress value={levelProgress} className="h-2.5" />
            <div
              className="absolute top-0 left-0 h-2.5 rounded-full transition-all duration-700"
              style={{
                width: `${levelProgress}%`,
                background: "linear-gradient(90deg, #d9f22a, #e8ff4a)",
                boxShadow: "0 0 8px rgba(217,242,42,0.5)",
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Nível {stats.level}</span>
            <span>Nível {stats.level + 1}</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <h2
                  className="font-black text-foreground uppercase text-sm tracking-wide"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Conquistas
                </h2>
              </div>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                {stats.badges.length} desbloqueadas
              </Badge>
            </div>
            {stats.badges.length === 0 ? (
              <div className="text-center py-8">
                <Star4 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Complete módulos para desbloquear conquistas!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {stats.badges.map((badge: any, i: number) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="badge-shine flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 bg-primary/20">
                      🏆
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{badge.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{badge.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <h2
                  className="font-black text-foreground uppercase text-sm tracking-wide"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Ranking
                </h2>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary" onClick={() => navigate("/ranking")}>
                Ver tudo <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="space-y-1.5">
              {stats.leaderboard.slice(0, 5).map((u: any, i: number) => {
                const isCurrentUser = u.id === user?.id;
                const rankIcons = ["🥇", "🥈", "🥉"];
                const initials = u.name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";
                return (
                  <div
                    key={u.id}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                      isCurrentUser
                        ? "bg-primary/10 border border-primary/25"
                        : "hover:bg-muted/30"
                    }`}
                  >
                    <span className="text-base w-8 text-center flex-shrink-0 font-bold">
                      {i < 3 ? rankIcons[i] : <span className="text-muted-foreground text-sm">{i + 1}º</span>}
                    </span>
                    <Avatar className="w-7 h-7 flex-shrink-0">
                      <AvatarFallback className="text-xs bg-primary/20 text-primary font-bold">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isCurrentUser ? "text-primary" : "text-foreground"}`}>
                        {u.name ?? "Colaborador"}{isCurrentUser && " (você)"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star4 className="w-3 h-3 text-yellow-400" />
                      <span className="text-sm font-bold text-foreground">{u.totalPoints}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* CTA to trails */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-primary/20 rounded-xl p-5 relative overflow-hidden"
          style={{ boxShadow: "0 0 30px rgba(217,242,42,0.05)" }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(217,242,42,0.05) 0%, transparent 60%)" }} />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3
                  className="font-black text-foreground uppercase text-sm"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Continuar Aprendendo
                </h3>
                <p className="text-xs text-muted-foreground">3 trilhas disponíveis para você</p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold flex-shrink-0"
                style={{ boxShadow: "0 0 16px rgba(217,242,42,0.2)" }}
                onClick={() => navigate("/trilhas")}
              >
                Ver Trilhas
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </PlatformLayout>
  );
}
