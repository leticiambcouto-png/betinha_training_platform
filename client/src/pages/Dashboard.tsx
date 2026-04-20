import { trpc } from "@/lib/trpc";
import { PlatformLayout } from "@/components/PlatformLayout";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Star, Trophy, Zap, BookOpen, CheckCircle,
  Clock, TrendingUp, Award, ChevronRight, Crown
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Betinha } from "@/components/Betinha";
import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const LEVEL_NAMES = ["Iniciante", "Aprendiz", "Explorador", "Especialista", "Mestre", "Lenda"];

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { data: stats, isLoading } = trpc.dashboard.myStats.useQuery(undefined, {
    enabled: !!user,
  });

  if (isLoading || !stats) {
    return (
      <PlatformLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </PlatformLayout>
    );
  }

  const levelName = LEVEL_NAMES[Math.min(stats.level - 1, LEVEL_NAMES.length - 1)];
  const levelProgress = Math.max(0, 100 - (stats.pointsToNextLevel / (stats.level * 500)) * 100);

  const getBetinhaSpeech = () => {
    if (stats.completed === 0) return "Olá! Bem-vindo à plataforma! Comece pela trilha Trilha de Onboarding: Gente e Cultura para dar o primeiro passo na sua jornada. Estou aqui para te ajudar!";
    if (stats.rank === 1) return `Uau! Você está em 1º lugar no ranking! Que incrível! Com ${stats.totalPoints} pontos, você é o colaborador mais dedicado. Continue assim!`;
    if (stats.completed >= 5) return `Você já completou ${stats.completed} módulos! Está indo muito bem! Continue assim para subir ainda mais no ranking.`;
    return `Você já tem ${stats.totalPoints} pontos e completou ${stats.completed} módulos. Continue sua jornada — cada módulo te deixa mais próximo do topo!`;
  };

  return (
    <PlatformLayout>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        {/* Welcome header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-black text-foreground">
            Olá, {user?.name?.split(" ")[0] ?? "Colaborador"}! 👋
          </h1>
          <p className="text-muted-foreground">Aqui está seu progresso de aprendizado</p>
        </motion.div>

        {/* Betinha */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Betinha speech={getBetinhaSpeech()} size="sm" />
        </motion.div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Star, label: "Pontos Totais", value: stats.totalPoints, color: "text-yellow-400", bg: "bg-yellow-400/10" },
            { icon: CheckCircle, label: "Módulos Concluídos", value: stats.completed, color: "text-primary", bg: "bg-primary/10" },
            { icon: TrendingUp, label: "Nível Atual", value: levelName, color: "text-blue-400", bg: "bg-blue-400/10" },
            { icon: Trophy, label: "Posição no Ranking", value: stats.rank > 0 ? `#${stats.rank}` : "—", color: "text-orange-400", bg: "bg-orange-400/10" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="stellar-card rounded-xl p-4"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-black text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Level progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="stellar-card rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="font-bold text-foreground">Nível {stats.level} — {levelName}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {Math.max(0, stats.pointsToNextLevel)} pts para o próximo nível
            </span>
          </div>
          <Progress value={levelProgress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Nível {stats.level}</span>
            <span>Nível {stats.level + 1}</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="stellar-card rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-foreground">Conquistas</h2>
              </div>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                {stats.badges.length} desbloqueadas
              </Badge>
            </div>
            {stats.badges.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground text-sm">Complete módulos para desbloquear badges!</p>
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
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                      style={{ backgroundColor: `${badge.color}20` }}
                    >
                      🏆
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{badge.name}</p>
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
            transition={{ delay: 0.3 }}
            className="stellar-card rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <h2 className="font-bold text-foreground">Ranking</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary"
                onClick={() => navigate("/ranking")}
              >
                Ver tudo <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="space-y-2">
              {stats.leaderboard.slice(0, 5).map((u: any, i: number) => {
                const isCurrentUser = u.id === user?.id;
                const rankIcons = ["🥇", "🥈", "🥉"];
                const initials = u.name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";
                return (
                  <div
                    key={u.id}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                      isCurrentUser ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/30"
                    }`}
                  >
                    <span className="text-lg w-8 text-center flex-shrink-0">
                      {i < 3 ? rankIcons[i] : `${i + 1}º`}
                    </span>
                    <Avatar className="w-7 h-7 flex-shrink-0">
                      <AvatarFallback className="text-xs bg-primary/20 text-primary font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isCurrentUser ? "text-primary" : "text-foreground"}`}>
                        {u.name ?? "Colaborador"}
                        {isCurrentUser && " (você)"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-foreground">{u.totalPoints}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Quick access to trails */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="stellar-card rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-foreground">Continuar Aprendendo</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => navigate("/trilhas")}>
              Ver trilhas <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => navigate("/trilhas/tbi-gente-cultura")}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Trilha de Onboarding: Gente e Cultura
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Button>
        </motion.div>
      </div>
    </PlatformLayout>
  );
}
