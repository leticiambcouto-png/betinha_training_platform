import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, BookOpen, Trophy, Zap, CheckCircle, UserCheck, Briefcase } from "lucide-react";
import { toast } from "sonner";

const BETINHA_FULL = "/manus-storage/betinha-thumbsup_b1cb02fa.png";
const STELLAR_LOGO = "/manus-storage/stellar-icon_06d397a8.svg";

type ContractType = "clt" | "pj";

function StellarLogo({ size = 24 }: { size?: number }) {
  return <img src={STELLAR_LOGO} alt="Stellar Gaming" width={size} height={size} className="object-contain flex-shrink-0" />;
}

const CONTRACT_OPTIONS: { value: ContractType; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "clt", label: "CLT", icon: <UserCheck className="w-5 h-5" />, desc: "Colaborador com carteira assinada" },
  { value: "pj", label: "PJ", icon: <Briefcase className="w-5 h-5" />, desc: "Prestador de serviços pessoa jurídica" },
];

export default function Login() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contractType, setContractType] = useState<ContractType | null>(null);

  const loginMutation = trpc.auth.loginSimple.useMutation({
    onSuccess: () => navigate("/dashboard"),
    onError: (err) => toast.error(err.message || "Erro ao entrar. Tente novamente."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return toast.error("Preencha seu nome e e-mail para continuar.");
    if (!contractType) return toast.error("Selecione seu tipo de contratação (CLT ou PJ).");
    loginMutation.mutate({ name: name.trim(), email: email.trim(), contractType });
  };

  const isFormValid = name.trim() && email.trim() && contractType;

  const betinhaSpeech = contractType === "clt"
    ? "Ótimo! Como colaborador CLT, você terá acesso ao conteúdo geral e ao conteúdo específico para CLT. Vamos começar? 🚀"
    : contractType === "pj"
    ? "Perfeito! Como PJ, você terá acesso ao conteúdo geral e ao conteúdo específico para prestadores. Vamos lá? 🚀"
    : "Oi, eu sou a Betinha! Vou ser sua guia nessa jornada de onboarding. Prepare-se para conhecer tudo sobre a Stellar: nossa história, nossos valores e o nosso jeito único de trabalhar. Vamos juntos? 🚀";

  return (
    <div className="min-h-screen flex bg-background overflow-hidden" style={{ fontFamily: "'Barlow', sans-serif" }}>

      {/* Atmospheric layers */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(24,64,235,0.14) 0%, transparent 70%)", transform: "translate(-35%, -35%)" }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(217,242,42,0.07) 0%, transparent 70%)", transform: "translate(30%, 30%)" }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(circle, #d9f22a 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
      </div>

      {/* ── Left panel: branding + Betinha ── */}
      <div className="hidden lg:flex flex-col justify-between w-[55%] p-12 relative border-r border-border">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <StellarLogo size={28} />
          <span
            className="font-black text-foreground uppercase tracking-wider"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.15rem" }}
          >
            Stellar Gaming
          </span>
          <span className="text-muted-foreground text-xs border-l border-border pl-3">Plataforma de Onboarding</span>
        </motion.div>

        {/* Hero copy + Betinha */}
        <div className="flex items-end gap-8">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6 flex-1"
          >
            <h1 className="leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              <span className="block text-5xl xl:text-6xl font-black text-foreground uppercase tracking-tight">A sua jornada</span>
              <span
                className="block text-5xl xl:text-6xl font-black uppercase tracking-tight"
                style={{ color: "#d9f22a", textShadow: "0 0 40px rgba(217,242,42,0.35)" }}
              >
                Stellar
              </span>
              <span className="block text-5xl xl:text-6xl font-black text-foreground uppercase tracking-tight">começa aqui.</span>
            </h1>

            <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
              Conheça a Stellar Gaming, nossa cultura e nosso jeito de trabalhar através de trilhas interativas.
            </p>

            {/* Feature pills */}
            <div className="space-y-2.5">
              {[
                { icon: BookOpen, label: "Trilhas interativas pra você ficar por dentro" },
                { icon: Trophy, label: "Ganhe pontos e lidere o ranking" },
                { icon: Zap, label: "Quizzes para testar seu conhecimento" },
              ].map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10 border border-primary/20">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{label}</span>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-2 border-t border-border/50">
              {[{ value: "3", label: "Trilhas" }, { value: "14+", label: "Módulos" }, { value: "8", label: "Conquistas" }].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-center"
                >
                  <p className="text-2xl font-black text-primary" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{s.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Betinha full body */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="relative flex-shrink-0 w-52 xl:w-64"
          >
            <div
              className="absolute inset-0 blur-3xl opacity-25"
              style={{ background: "radial-gradient(circle, #d9f22a 0%, transparent 70%)", transform: "scale(0.7) translateY(15%)" }}
            />
            <img
              src={BETINHA_FULL}
              alt="Betinha"
              className="w-full h-auto object-contain relative z-10 drop-shadow-2xl"
            />
          </motion.div>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground/50">© 2026 Stellar Gaming · Plataforma de Onboarding</p>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 overflow-y-auto">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <StellarLogo size={22} />
          <span className="font-black text-foreground uppercase tracking-wider" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Stellar Gaming
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full max-w-md space-y-5"
        >
          {/* Betinha speech bubble */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/40">
              <img src={BETINHA_FULL} alt="Betinha" className="w-full h-full object-cover object-top scale-110" />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={betinhaSpeech}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="relative bg-card border border-primary/20 rounded-2xl rounded-tl-none px-4 py-3 flex-1"
              >
                <p className="text-sm text-foreground leading-relaxed">{betinhaSpeech}</p>
                <p className="text-xs text-primary font-bold mt-1.5 uppercase tracking-wide">Betinha · Gente &amp; Cultura</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Form card */}
          <div className="bg-card border border-border rounded-2xl p-7 space-y-5">
            <div>
              <h2
                className="text-xl font-black text-foreground uppercase"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.04em" }}
              >
                Bem-vindo ao Onboarding!
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Informe seus dados para acessar a plataforma</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  Nome completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ex: Maria Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loginMutation.isPending}
                  className="h-11 bg-background border-border focus:border-primary/50 text-foreground placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  E-mail corporativo
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ex: maria.silva@stellar.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loginMutation.isPending}
                  className="h-11 bg-background border-border focus:border-primary/50 text-foreground placeholder:text-muted-foreground/50"
                />
              </div>

              {/* Contract type */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  Você é CLT ou PJ?
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {CONTRACT_OPTIONS.map((opt) => {
                    const isSelected = contractType === opt.value;
                    return (
                      <motion.button
                        key={opt.value}
                        type="button"
                        onClick={() => setContractType(opt.value)}
                        disabled={loginMutation.isPending}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="relative flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all duration-200 cursor-pointer"
                        style={{
                          background: isSelected ? "rgba(217,242,42,0.08)" : "var(--background)",
                          border: isSelected ? "2px solid #d9f22a" : "2px solid rgba(217,242,42,0.12)",
                          boxShadow: isSelected ? "0 0 16px rgba(217,242,42,0.12)" : "none",
                        }}
                      >
                        {isSelected && (
                          <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-primary" />
                        )}
                        <span className={isSelected ? "text-primary" : "text-muted-foreground"}>
                          {opt.icon}
                        </span>
                        <span
                          className="font-black text-base uppercase"
                          style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            color: isSelected ? "#d9f22a" : "var(--foreground)",
                            textShadow: isSelected ? "0 0 12px rgba(217,242,42,0.4)" : "none",
                          }}
                        >
                          {opt.label}
                        </span>
                        <span className="text-xs text-muted-foreground leading-tight">{opt.desc}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <motion.div whileHover={{ scale: isFormValid ? 1.02 : 1 }} whileTap={{ scale: isFormValid ? 0.97 : 1 }}>
                <Button
                  type="submit"
                  disabled={loginMutation.isPending || !isFormValid}
                  className="w-full h-11 font-bold text-sm transition-all duration-300"
                  style={{
                    background: isFormValid ? "#d9f22a" : "var(--muted)",
                    color: isFormValid ? "var(--primary-foreground)" : "var(--muted-foreground)",
                    boxShadow: isFormValid ? "0 0 20px rgba(217,242,42,0.25)" : "none",
                    cursor: isFormValid ? "pointer" : "not-allowed",
                  }}
                >
                  {loginMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Entrando...</>
                  ) : (
                    <>Clique aqui e dê o play na sua jornada <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </motion.div>
            </form>

            <p className="text-xs text-center text-muted-foreground/60">
              Ao entrar, você concorda com as políticas internas da Stellar Gaming.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
