import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, Trophy, Zap, ArrowRight, CheckCircle, Loader2, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

const BETINHA_FULL = "/manus-storage/betinha-nova_c4732510.png";
const STELLAR_LOGO_FULL = "/manus-storage/stellar-gaming-logo_7cfdb94e.svg";
const STELLAR_ICON = "/manus-storage/stellar-icon_06d397a8.svg";

const features = [
  { icon: BookOpen, title: "Trilhas Interativas", desc: "Módulos dinâmicos com conteúdo rico e apresentações guiadas pela Betinha." },
  { icon: Trophy, title: "Gamificação Completa", desc: "Ganhe pontos, desbloqueie conquistas e suba no ranking da empresa." },
  { icon: Zap, title: "Quizzes Interativos", desc: "Teste seu conhecimento e aprenda de forma interativa." },
  { icon: Sparkles, title: "Conteúdo por Perfil", desc: "Conteúdo personalizado para CLT e PJ, só o que é relevante para você." },
];

// Logo completa horizontal (1080x349)
function StellarLogo({ width = 140 }: { width?: number }) {
  const height = Math.round(width * (349 / 1080));
  return <img src={STELLAR_LOGO_FULL} alt="Stellar Gaming" width={width} height={height} className="object-contain flex-shrink-0" />;
}
// Ícone quadrado da estrela
function StellarIcon({ size = 20 }: { size?: number }) {
  return <img src={STELLAR_ICON} alt="Stellar" width={size} height={size} className="object-contain flex-shrink-0" />;
}

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm font-medium">Verificando sessão...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Atmospheric background layers */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        {/* Radial glow top-left */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(24,64,235,0.12) 0%, transparent 70%)", transform: "translate(-30%, -30%)" }} />
        {/* Radial glow bottom-right */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(217,242,42,0.06) 0%, transparent 70%)", transform: "translate(30%, 30%)" }} />
        {/* Grid dots */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, #d9f22a 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <StellarLogo width={130} />
          </div>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
            style={{ boxShadow: "0 0 16px rgba(217,242,42,0.2)" }}
            onClick={() => navigate("/login")}
          >
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero — asymmetric split */}
      <section className="relative pt-28 pb-16 px-4 min-h-screen flex items-center">
        <div className="container max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-center">

            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-7"
            >
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold uppercase tracking-widest"
              >
                <StellarIcon size={14} />
                Onboarding Stellar Gaming
              </motion.div>

              <h1 className="leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                <span className="block text-5xl lg:text-7xl font-black text-foreground uppercase tracking-tight">
                  A sua jornada
                </span>
                <span
                  className="block text-5xl lg:text-7xl font-black uppercase tracking-tight"
                  style={{
                    color: "#d9f22a",
                    textShadow: "0 0 40px rgba(217,242,42,0.35)",
                  }}
                >
                  Stellar
                </span>
                <span className="block text-5xl lg:text-7xl font-black text-foreground uppercase tracking-tight">
                  começa aqui.
                </span>
              </h1>

              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-lg">
                Conheça a Stellar Gaming, nossa cultura e nosso jeito de trabalhar através de trilhas interativas guiadas pela <strong className="text-foreground">Betinha</strong>, nossa agente de Gente &amp; Cultura.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base px-8"
                    style={{ boxShadow: "0 0 24px rgba(217,242,42,0.25)" }}
                    onClick={() => navigate("/login")}
                  >
                    Clique aqui e dê o play
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-2 border-t border-border/50">
                {[
                  { value: "3", label: "Trilhas" },
                  { value: "14+", label: "Módulos" },
                  { value: "8", label: "Conquistas" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="text-center"
                  >
                    <p className="text-2xl font-black text-primary" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{stat.value}</p>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Betinha + speech bubble */}
            <motion.div
              initial={{ opacity: 0, x: 32, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col items-center gap-4 relative"
            >
              {/* Floating achievement badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 -right-2 bg-card border border-primary/30 rounded-xl px-3 py-2 shadow-xl z-10"
              >
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-bold text-foreground">+150 pts</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-32 -left-4 bg-card border border-primary/30 rounded-xl px-3 py-2 shadow-xl z-10"
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">Módulo concluído!</span>
                </div>
              </motion.div>

              {/* Betinha full body */}
              <div className="relative w-80 lg:w-96">
                <div
                  className="absolute inset-0 rounded-full blur-3xl opacity-20"
                  style={{ background: "radial-gradient(circle, #d9f22a 0%, transparent 70%)", transform: "scale(0.8) translateY(10%)" }}
                />
                <img
                  src={BETINHA_FULL}
                  alt="Betinha"
                  className="w-full h-auto object-contain relative z-10 drop-shadow-2xl"
                />
              </div>

              {/* Speech bubble */}
              <div
                className="relative bg-card border rounded-2xl p-4 max-w-xs shadow-xl"
                style={{ borderColor: "rgba(217,242,42,0.25)" }}
              >
                {/* Tail pointing up */}
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-0 h-0"
                  style={{ borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderBottom: "10px solid rgba(217,242,42,0.25)" }} />
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0"
                  style={{ borderLeft: "9px solid transparent", borderRight: "9px solid transparent", borderBottom: "9px solid #001830" }} />
                <p className="text-sm text-foreground leading-relaxed font-medium">
                  Oi! Eu sou a <strong className="text-primary">Betinha</strong>, sua agente de Gente &amp; Cultura! Informe seus dados e selecione seu tipo de contratação para começarmos. 🚀
                </p>
                <p className="text-xs text-primary font-bold mt-2 uppercase tracking-wide">Betinha · Gente &amp; Cultura</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, transparent 0%, rgba(24,64,235,0.04) 50%, transparent 100%)" }} />
        <div className="container max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <p className="text-xs text-primary font-bold uppercase tracking-widest mb-2">Por que a plataforma é diferente</p>
            <h2 className="text-3xl lg:text-4xl font-black text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              UMA EXPERIÊNCIA DE<br />
              <span className="text-primary">APRENDIZADO ÚNICA</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="bg-card border border-border rounded-xl p-6 group transition-all duration-300"
                style={{ "--tw-shadow": "0 0 0 rgba(217,242,42,0)" } as React.CSSProperties}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(217,242,42,0.35)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(217,242,42,0.08)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-primary/20 rounded-2xl p-10 text-center relative overflow-hidden"
            style={{ boxShadow: "0 0 40px rgba(217,242,42,0.06)" }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(217,242,42,0.06) 0%, transparent 60%)" }} />
            <div className="relative">
              <StellarLogo width={160} />
              <h2 className="text-2xl lg:text-3xl font-black text-foreground mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                PRONTO PARA COMEÇAR?
              </h2>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Faça login com sua conta Stellar Gaming e inicie sua trilha de integração hoje mesmo.
              </p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                  style={{ boxShadow: "0 0 24px rgba(217,242,42,0.25)" }}
                  onClick={() => navigate("/login")}
                >
                  Entrar na Plataforma
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StellarLogo width={110} />
          </div>
          <p className="text-xs text-muted-foreground">© 2026 · Plataforma de Onboarding</p>
        </div>
      </footer>
    </div>
  );
}
