import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, ArrowRight, Loader2, BookOpen, Trophy, Zap, CheckCircle, FileText, UserCheck, Briefcase } from "lucide-react";
import { toast } from "sonner";

const BETINHA_AVATAR =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663204027059/NbLekrCupyKcetotbNsyPG/betinha-avatar_0d442e08.jpg";

type ContractType = "clt" | "pj";

const CONTRACT_OPTIONS: { value: ContractType; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    value: "clt",
    label: "CLT",
    icon: <UserCheck className="w-5 h-5" />,
    desc: "Colaborador com carteira assinada",
  },
  {
    value: "pj",
    label: "PJ",
    icon: <Briefcase className="w-5 h-5" />,
    desc: "Prestador de serviços pessoa jurídica",
  },
];

export default function Login() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contractType, setContractType] = useState<ContractType | null>(null);

  const loginMutation = trpc.auth.loginSimple.useMutation({
    onSuccess: () => {
      navigate("/dashboard");
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao entrar. Tente novamente.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Preencha seu nome e e-mail para continuar.");
      return;
    }
    if (!contractType) {
      toast.error("Selecione seu tipo de contratação (CLT ou PJ).");
      return;
    }
    loginMutation.mutate({ name: name.trim(), email: email.trim(), contractType });
  };

  const isFormValid = name.trim() && email.trim() && contractType;

  const betinhaSpeech = contractType
    ? contractType === "clt"
      ? "Ótimo! Como colaborador CLT, você terá acesso ao conteúdo geral e ao conteúdo específico para CLT. Vamos começar? 🚀"
      : "Perfeito! Como PJ, você terá acesso ao conteúdo geral e ao conteúdo específico para prestadores. Vamos lá? 🚀"
    : "Oi! Eu sou a Betinha, sua agente de Gente & Cultura! Informe seus dados e selecione seu tipo de contratação para começarmos. 🚀";

  return (
    <div className="min-h-screen flex" style={{ background: "hsl(210 100% 7%)", fontFamily: "'Barlow', sans-serif" }}>
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12"
        style={{ background: "hsl(210 90% 8%)", borderRight: "1px solid hsl(210 40% 15%)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/manus-storage/stellar-gaming-logo_7a539a02.svg"
            alt="Stellar Gaming"
            className="h-10 w-auto object-contain"
          />
          <span className="text-sm" style={{ color: "hsl(210 20% 50%)" }}>
            | Boas-vindas
          </span>
        </div>

        {/* Hero content */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
              style={{
                background: "hsl(66 87% 55% / 0.12)",
                border: "1px solid hsl(66 87% 55% / 0.3)",
                color: "hsl(66 87% 55%)",
              }}
            >
              <Star className="w-3 h-3 fill-current" />
              ONBOARDING
            </div>

            <h1
              className="text-4xl font-black leading-tight"
              style={{ color: "hsl(60 100% 93%)" }}
            >
              A sua jornada{" "}
              <span style={{ color: "hsl(66 87% 55%)" }}>Stellar</span>
              <br />começa aqui.
            </h1>

            <p className="text-base leading-relaxed" style={{ color: "hsl(210 20% 60%)" }}>
              Conheça a Stellar Gaming, nossa cultura e nosso jeito de trabalhar através de trilhas interativas guiadas pela Betinha, nossa agente de Gente &amp; Cultura.
            </p>
          </motion.div>

          {/* Feature pills */}
          <div className="space-y-3">
            {[
              { icon: BookOpen, label: "Trilhas interativas pra você ficar por dentro" },
              { icon: Trophy, label: "Ganhe pontos e lidere o ranking realizando as trilhas" },
              { icon: Zap, label: "Quizzes para você testar o seu conhecimento e aprender de forma interativa" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "hsl(66 87% 55% / 0.1)", border: "1px solid hsl(66 87% 55% / 0.25)" }}
                >
                  <Icon className="w-4 h-4" style={{ color: "hsl(66 87% 55%)" }} />
                </div>
                <span className="text-sm" style={{ color: "hsl(210 20% 65%)" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 pt-2">
            {[
              { value: "3", label: "Trilhas" },
              { value: "14+", label: "Módulos" },
              { value: "8", label: "Conquistas" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-black" style={{ color: "hsl(66 87% 55%)" }}>{stat.value}</p>
                <p className="text-xs" style={{ color: "hsl(210 20% 50%)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs" style={{ color: "hsl(210 20% 35%)" }}>
          © 2026 Stellar Gaming · Plataforma de Onboarding
        </p>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "hsl(66 87% 55% / 0.15)", border: "1px solid hsl(66 87% 55% / 0.4)" }}
          >
            <Star className="w-4 h-4" style={{ color: "hsl(66 87% 55%)" }} />
          </div>
          <span className="font-bold" style={{ color: "hsl(60 100% 93%)" }}>Stellar Gaming</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-6"
        >
          {/* Betinha greeting */}
          <div className="flex items-start gap-4">
            <img
              src={BETINHA_AVATAR}
              alt="Betinha"
              className="w-14 h-14 rounded-full object-cover object-top flex-shrink-0"
              style={{ border: "2px solid hsl(66 87% 55% / 0.6)" }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={betinhaSpeech}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="relative px-4 py-3 rounded-2xl rounded-tl-none text-sm leading-relaxed flex-1"
                style={{
                  background: "hsl(210 60% 12%)",
                  border: "1px solid hsl(210 40% 20%)",
                  color: "hsl(60 100% 93%)",
                }}
              >
                {betinhaSpeech.replace("Betinha", "").trim().startsWith(",") ? (
                  <>Oi! Eu sou a <strong style={{ color: "hsl(66 87% 55%)" }}>Betinha</strong>{betinhaSpeech.replace("Oi! Eu sou a Betinha", "")}</>
                ) : (
                  betinhaSpeech
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Form */}
          <div
            className="rounded-2xl p-8 space-y-5"
            style={{
              background: "hsl(210 90% 8%)",
              border: "1px solid hsl(210 40% 15%)",
            }}
          >
            <div className="space-y-1">
              <h2 className="text-xl font-bold" style={{ color: "hsl(60 100% 93%)" }}>
                Bem-vindo ao Onboarding!
              </h2>
              <p className="text-sm" style={{ color: "hsl(210 20% 55%)" }}>
                Informe seus dados para acessar a plataforma
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium" style={{ color: "hsl(210 20% 70%)" }}>
                  Seu nome completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ex: Maria Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loginMutation.isPending}
                  className="h-11"
                  style={{ background: "hsl(210 60% 12%)", border: "1px solid hsl(210 40% 20%)", color: "hsl(60 100% 93%)" }}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium" style={{ color: "hsl(210 20% 70%)" }}>
                  Seu e-mail corporativo
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ex: maria.silva@stellar.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loginMutation.isPending}
                  className="h-11"
                  style={{ background: "hsl(210 60% 12%)", border: "1px solid hsl(210 40% 20%)", color: "hsl(60 100% 93%)" }}
                />
              </div>

              {/* Contract type selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: "hsl(210 20% 70%)" }}>
                  Você é CLT ou PJ?
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {CONTRACT_OPTIONS.map((opt) => {
                    const isSelected = contractType === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setContractType(opt.value)}
                        disabled={loginMutation.isPending}
                        className="relative flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all duration-200 cursor-pointer"
                        style={{
                          background: isSelected ? "hsl(66 87% 55% / 0.12)" : "hsl(210 60% 10%)",
                          border: isSelected ? "2px solid hsl(66 87% 55%)" : "2px solid hsl(210 40% 18%)",
                          color: isSelected ? "hsl(66 87% 55%)" : "hsl(210 20% 60%)",
                        }}
                      >
                        {isSelected && (
                          <CheckCircle
                            className="absolute top-2 right-2 w-4 h-4"
                            style={{ color: "hsl(66 87% 55%)" }}
                          />
                        )}
                        <span style={{ color: isSelected ? "hsl(66 87% 55%)" : "hsl(210 20% 55%)" }}>
                          {opt.icon}
                        </span>
                        <span className="font-bold text-base" style={{ color: isSelected ? "hsl(66 87% 55%)" : "hsl(60 100% 93%)" }}>
                          {opt.label}
                        </span>
                        <span className="text-xs leading-tight" style={{ color: "hsl(210 20% 50%)" }}>
                          {opt.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loginMutation.isPending || !isFormValid}
                className="w-full h-11 font-semibold text-sm"
                style={{
                  background: isFormValid ? "hsl(66 87% 55%)" : "hsl(210 40% 18%)",
                  color: isFormValid ? "hsl(210 100% 7%)" : "hsl(210 20% 40%)",
                  cursor: isFormValid ? "pointer" : "not-allowed",
                }}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    Clique aqui e dê o play na sua jornada
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-center" style={{ color: "hsl(210 20% 40%)" }}>
              Ao entrar, você concorda com as políticas internas da Stellar Gaming.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
