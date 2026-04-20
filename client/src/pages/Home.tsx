import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Star, BookOpen, Trophy, Zap, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

const BETINHA_AVATAR = "https://d2xsxph8kpxj0f.cloudfront.net/310519663204027059/NbLekrCupyKcetotbNsyPG/betinha-avatar_0d442e08.jpg";

const features = [
  { icon: BookOpen, title: "Trilhas Interativas", desc: "Módulos dinâmicos com conteúdo rico e apresentações guiadas pela Betinha." },
  { icon: Trophy, title: "Gamificação Completa", desc: "Ganhe pontos, desbloqueie conquistas e suba no ranking da empresa." },
  { icon: Zap, title: "Quizzes Interativos", desc: "Quizzes para você testar o seu conhecimento e aprender de forma interativa." },
  { icon: Star, title: "Progresso Visual", desc: "Acompanhe sua evolução com barras de progresso, níveis e conquistas." },
];

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect authenticated users to dashboard (in useEffect to avoid render-phase side effects)
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [loading, isAuthenticated, navigate]);

  // Show spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Verificando sessão...</p>
        </div>
      </div>
    );
  }

  // If already authenticated, show nothing while redirecting
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Star className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Stellar Gaming</span>
            <span className="text-muted-foreground text-sm hidden sm:block">| Plataforma de Treinamentos</span>
          </div>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => navigate("/")}>
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="stellar-hero-bg pt-32 pb-20 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm font-medium">
                <Star className="w-3 h-3 fill-primary" />
                Bem-vindo ao Trilha de Onboarding Stellar Gaming
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-foreground leading-tight">
                Sua jornada de
                <span className="text-primary stellar-glow-text block">aprendizado</span>
                começa aqui
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Conheça a Stellar Gaming, nossa cultura e nosso jeito de trabalhar através de trilhas interativas guiadas pela Betinha, sua companheira de aprendizado.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 stellar-glow" onClick={() => navigate("/")}>
                  Começar Agora
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-2">
                {[
                  { value: "3", label: "Trilhas" },
                  { value: "11+", label: "Módulos" },
                  { value: "8", label: "Conquistas" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-black text-primary">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Betinha hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="relative">
                <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-primary/60 stellar-glow animate-float mx-auto">
                  <img
                    src={BETINHA_AVATAR}
                    alt="Betinha"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute -top-2 -right-4 bg-card border border-primary/40 rounded-xl px-3 py-2 shadow-lg"
                >
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs font-bold text-foreground">+150 pts</span>
                  </div>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-2 -left-4 bg-card border border-primary/40 rounded-xl px-3 py-2 shadow-lg"
                >
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-foreground">Módulo concluído!</span>
                  </div>
                </motion.div>
              </div>

              {/* Speech bubble */}
              <div className="betinha-bubble px-5 py-4 max-w-sm">
                <p className="text-sm text-foreground leading-relaxed">
                  Oi! Eu sou a <strong className="text-primary">Betinha</strong>, sua guia de aprendizado na Stellar Gaming! Vou te acompanhar em toda a sua jornada de integração. Vamos juntos? 🚀
                </p>
                <p className="text-xs text-primary font-semibold mt-2">Betinha</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-foreground mb-3">Uma experiência de aprendizado única</h2>
            <p className="text-muted-foreground">Tudo que você precisa para uma integração incrível</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="stellar-card rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container max-w-2xl mx-auto text-center">
          <div className="bg-card border border-primary/30 rounded-2xl p-10 stellar-glow">
            <img src={BETINHA_AVATAR} alt="Betinha" className="w-16 h-16 rounded-full object-cover object-top mx-auto mb-4 border-2 border-primary" />
            <h2 className="text-2xl font-black text-foreground mb-3">Pronto para começar?</h2>
            <p className="text-muted-foreground mb-6">Faça login com sua conta Stellar Gaming e inicie sua trilha de integração hoje mesmo.</p>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => navigate("/")}>
              Entrar na Plataforma
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">© 2026 Stellar Gaming · Plataforma de Onboarding</p>
        </div>
      </footer>
    </div>
  );
}
