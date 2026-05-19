import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { PlatformLayout } from "@/components/PlatformLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Users, BookOpen, Star, Sparkles,
  CheckCircle, Clock, BarChart3, Shield,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function Admin() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [generatingFor, setGeneratingFor] = useState<number | null>(null);

  const { data: stats, isLoading: statsLoading } = trpc.admin.stats.useQuery();
  const { data: users, isLoading: usersLoading } = trpc.admin.users.useQuery();
  const { data: trails } = trpc.trails.list.useQuery();

  const generateQuizMutation = trpc.admin.generateQuizForModule.useMutation();

  if (user?.role !== "admin") {
    return (
      <PlatformLayout>
        <div className="flex items-center justify-center min-h-screen p-8">
          <div className="text-center space-y-3">
            <Shield className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="text-xl font-bold text-foreground">Acesso Restrito</h2>
            <p className="text-muted-foreground">Você não tem permissão para acessar esta área.</p>
            <Button onClick={() => navigate("/dashboard")}>Voltar ao Painel</Button>
          </div>
        </div>
      </PlatformLayout>
    );
  }

  const handleGenerateQuiz = async (moduleId: number, moduleName: string) => {
    setGeneratingFor(moduleId);
    try {
      const result = await generateQuizMutation.mutateAsync({ moduleId });
      toast.success(`Quiz gerado para "${moduleName}" — ${result.count} perguntas criadas!`);
    } catch {
      toast.error("Erro ao gerar quiz. Tente novamente.");
    } finally {
      setGeneratingFor(null);
    }
  };

  return (
    <PlatformLayout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <Shield className="w-7 h-7 text-primary" />
            <h1 className="text-3xl font-black text-foreground">Painel Administrativo</h1>
          </div>
          <p className="text-muted-foreground">Gerencie usuários, trilhas e visualize o progresso da equipe</p>
        </motion.div>

        {/* Stats overview */}
        {!statsLoading && stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Users, label: "Colaboradores", value: stats.totalUsers, color: "text-blue-400", bg: "bg-blue-400/10" },
              { icon: CheckCircle, label: "Conclusões", value: stats.completedModules, color: "text-primary", bg: "bg-primary/10" },
              { icon: Clock, label: "Em Andamento", value: stats.inProgressModules, color: "text-yellow-400", bg: "bg-yellow-400/10" },
              { icon: BarChart3, label: "Total Módulos Iniciados", value: (stats.completedModules ?? 0) + (stats.inProgressModules ?? 0), color: "text-orange-400", bg: "bg-orange-400/10" },
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
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Users table */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="stellar-card rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-foreground">Colaboradores</h2>
              </div>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                {users?.length ?? 0} total
              </Badge>
            </div>
            {usersLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {users?.map((u: any) => {
                  const initials = u.name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";
                  return (
                    <div key={u.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/30 transition-colors">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="text-xs bg-primary/20 text-primary font-bold">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{u.name ?? "Sem nome"}</p>
                        <p className="text-xs text-muted-foreground truncate">{u.email ?? "—"}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-bold text-foreground">{u.totalPoints ?? 0}</span>
                        </div>
                        {u.role === "admin" && (
                          <Badge className="text-xs bg-primary/20 text-primary border-primary/30 py-0">Admin</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
                {(!users || users.length === 0) && (
                  <p className="text-center text-muted-foreground text-sm py-6">Nenhum colaborador cadastrado ainda.</p>
                )}
              </div>
            )}
          </motion.div>

          {/* Quiz generation */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="stellar-card rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-foreground">Gerar Quizzes com IA</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Clique em um módulo para gerar ou regenerar as perguntas do quiz usando inteligência artificial.
            </p>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {trails?.map((trail: any) => (
                <div key={trail.id}>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1.5 mt-3 first:mt-0">
                    {trail.title}
                  </p>
                  <ModuleQuizList trailId={trail.id} onGenerate={handleGenerateQuiz} generatingFor={generatingFor} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Trails overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="stellar-card rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-foreground">Trilhas e Módulos</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {trails?.map((trail: any) => (
              <TrailProgressCard key={trail.id} trail={trail} users={users} />
            ))}
          </div>
        </motion.div>
      </div>
    </PlatformLayout>
  );
}

function ModuleQuizList({
  trailId,
  onGenerate,
  generatingFor,
}: {
  trailId: number;
  onGenerate: (id: number, name: string) => void;
  generatingFor: number | null;
}) {
  const { data: modules } = trpc.modules.byTrail.useQuery({ trailId });

  return (
    <div className="space-y-1.5">
      {modules?.map((mod: any) => (
        <div key={mod.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30">
          <span className="text-xs text-foreground truncate flex-1 mr-2">{mod.title}</span>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7 px-2 border-primary/30 text-primary hover:bg-primary/10 flex-shrink-0"
            onClick={() => onGenerate(mod.id, mod.title)}
            disabled={generatingFor === mod.id || !!mod.isComingSoon}
          >
            {generatingFor === mod.id ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-3 h-3 mr-1" />
                Gerar
              </>
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}

function TrailProgressCard({ trail, users }: { trail: any; users: any[] | undefined }) {
  const { data: modules } = trpc.modules.byTrail.useQuery({ trailId: trail.id });
  const totalModules = modules?.length ?? 0;

  return (
    <div className="bg-muted/30 rounded-xl p-4 border border-border">
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${trail.color ?? "#00C853"}20` }}
        >
          <BookOpen className="w-4 h-4" style={{ color: trail.color ?? "#00C853" }} />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">{trail.title}</p>
          <p className="text-xs text-muted-foreground">{totalModules} módulos</p>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{users?.length ?? 0} colaboradores</span>
          <span>{totalModules} módulos</span>
        </div>
        <Progress value={totalModules > 0 ? 100 : 0} className="h-1.5" />
        <p className="text-xs text-muted-foreground">
          {totalModules > 0 ? "Conteúdo disponível" : "Em breve"}
        </p>
      </div>
    </div>
  );
}
