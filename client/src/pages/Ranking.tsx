import { trpc } from "@/lib/trpc";
import { PlatformLayout } from "@/components/PlatformLayout";
import { motion } from "framer-motion";
import { Trophy, Crown, Medal } from "lucide-react";
import { StellarStar } from "@/components/StellarStar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Betinha } from "@/components/Betinha";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Ranking() {
  const { user } = useAuth();
  const { data: leaderboard, isLoading } = trpc.dashboard.leaderboard.useQuery({ limit: 20 });

  const currentUserRank = leaderboard?.findIndex((u: any) => u.id === user?.id) ?? -1;

  if (isLoading) {
    return (
      <PlatformLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </PlatformLayout>
    );
  }

  const top3 = leaderboard?.slice(0, 3) ?? [];
  const rest = leaderboard?.slice(3) ?? [];

  return (
    <PlatformLayout>
      <div className="p-6 lg:p-8 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <Trophy className="w-7 h-7 text-primary" />
            <h1 className="text-3xl font-black text-foreground">Ranking</h1>
          </div>
          <p className="text-muted-foreground">Os colaboradores mais dedicados da Stellar Gaming</p>
        </motion.div>

        {/* Betinha */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8">
          <Betinha
            speech={
              currentUserRank === 0
                ? "Você está em 1º lugar! Que conquista incrível! Continue assim e inspire o time!"
                : currentUserRank > 0
                ? `Você está em ${currentUserRank + 1}º lugar! Continue completando módulos para subir no ranking!`
                : "Complete módulos e ganhe pontos para aparecer no ranking! Cada ponto conta!"
            }
            size="sm"
          />
        </motion.div>

        {/* Top 3 podium */}
        {top3.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-end justify-center gap-4 mb-8"
          >
            {/* 2nd place */}
            {top3[1] && (
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <Avatar className="w-14 h-14 border-2 border-[#fdffdf]">
                    <AvatarFallback className="bg-[#fdffdf]/10 text-[#fdffdf] font-bold">
                      {top3[1].name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2 text-xl">🥈</div>
                </div>
                <p className="text-xs font-semibold text-foreground text-center max-w-16 truncate">{top3[1].name?.split(" ")[0]}</p>
                <div className="bg-[#fdffdf]/10 border border-[#fdffdf]/40 rounded-xl px-3 py-4 text-center w-20">
                  <p className="text-xs text-[#fdffdf] font-bold">2º</p>
                  <p className="text-sm font-black text-foreground">{top3[1].totalPoints}</p>
                  <p className="text-xs text-muted-foreground">pts</p>
                </div>
              </div>
            )}

            {/* 1st place */}
            {top3[0] && (
              <div className="flex flex-col items-center gap-2">
                <Crown className="w-6 h-6 text-primary" />
                <div className="relative">
                  <Avatar className="w-20 h-20 border-2 border-primary stellar-glow">
                    <AvatarFallback className="bg-primary/20 text-primary font-bold text-xl">
                      {top3[0].name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2 text-2xl">🥇</div>
                </div>
                <p className="text-sm font-bold text-foreground text-center max-w-20 truncate">{top3[0].name?.split(" ")[0]}</p>
                <div className="bg-primary/20 border border-primary/40 rounded-xl px-4 py-5 text-center w-24">
                  <p className="text-xs text-primary font-bold">1º</p>
                  <p className="text-lg font-black text-foreground">{top3[0].totalPoints}</p>
                  <p className="text-xs text-muted-foreground">pts</p>
                </div>
              </div>
            )}

            {/* 3rd place */}
            {top3[2] && (
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <Avatar className="w-14 h-14 border-2 border-[#1840eb]">
                    <AvatarFallback className="bg-[#1840eb]/20 text-[#1840eb] font-bold">
                      {top3[2].name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2 text-xl">🥉</div>
                </div>
                <p className="text-xs font-semibold text-foreground text-center max-w-16 truncate">{top3[2].name?.split(" ")[0]}</p>
                <div className="bg-[#1840eb]/20 border border-[#1840eb]/40 rounded-xl px-3 py-3 text-center w-20">
                  <p className="text-xs text-[#1840eb] font-bold">3º</p>
                  <p className="text-sm font-black text-foreground">{top3[2].totalPoints}</p>
                  <p className="text-xs text-muted-foreground">pts</p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Rest of leaderboard */}
        <div className="space-y-2">
          {rest.map((u: any, i: number) => {
            const rank = i + 4;
            const isCurrentUser = u.id === user?.id;
            const initials = u.name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";
            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                  isCurrentUser
                    ? "bg-primary/10 border-primary/30"
                    : "bg-card border-border hover:border-primary/20"
                }`}
              >
                <span className="w-8 text-center text-sm font-bold text-muted-foreground flex-shrink-0">{rank}º</span>
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className={`text-xs font-bold ${isCurrentUser ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isCurrentUser ? "text-primary" : "text-foreground"}`}>
                    {u.name ?? "Colaborador"}
                    {isCurrentUser && " (você)"}
                  </p>
                  <p className="text-xs text-muted-foreground">Nível {u.level}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <StellarStar size={14} color="#d9f22a" />
                  <span className="text-sm font-bold text-foreground">{u.totalPoints}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {leaderboard?.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhum colaborador no ranking ainda.</p>
            <p className="text-sm text-muted-foreground mt-1">Complete módulos para aparecer aqui!</p>
          </div>
        )}
      </div>
    </PlatformLayout>
  );
}
