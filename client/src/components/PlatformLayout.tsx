import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  LayoutDashboard, BookOpen, Trophy, Shield, LogOut,
  Menu, X, ChevronDown, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

const BETINHA_FULL = "/manus-storage/betinha-thumbsup_b1cb02fa.png";

function Star4({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
    </svg>
  );
}

interface PlatformLayoutProps {
  children: React.ReactNode;
}

export function PlatformLayout({ children }: PlatformLayoutProps) {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [trilhasOpen, setTrilhasOpen] = useState(
    location.startsWith("/trilhas") || location.startsWith("/modulo") || location.startsWith("/quiz")
  );

  const { data: stats } = trpc.dashboard.myStats.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 30000,
  });

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const isActive = (href: string) =>
    location === href || location.startsWith(href + "/");

  const isTrilhasActive =
    location.startsWith("/trilhas") ||
    location.startsWith("/modulo") ||
    location.startsWith("/quiz");

  const contractLabel = (user as any)?.contractType === "pj" ? "PJ" : (user as any)?.contractType === "clt" ? "CLT" : null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div className="px-4 pt-5 pb-3 space-y-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Star4 className="w-5 h-5 text-primary flex-shrink-0" />
          <span
            className="font-black text-foreground uppercase tracking-wider text-sm"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Stellar Gaming
          </span>
        </div>
        <div className="w-full flex items-center justify-center py-1.5 rounded-md bg-primary">
          <span
            className="text-xs font-black tracking-widest uppercase text-primary-foreground"
            style={{ letterSpacing: "0.12em" }}
          >
            Onboarding 2.0
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {/* Meu Painel */}
        <Link href="/dashboard">
          <div
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 cursor-pointer"
            style={{
              background: isActive("/dashboard") ? "rgba(217,242,42,0.08)" : "transparent",
              color: isActive("/dashboard") ? "#d9f22a" : "var(--muted-foreground)",
              fontWeight: isActive("/dashboard") ? 600 : 400,
              borderLeft: isActive("/dashboard") ? "2px solid #d9f22a" : "2px solid transparent",
            }}
          >
            <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
            <span>Meu Painel</span>
          </div>
        </Link>

        {/* Trilhas — accordion */}
        <div>
          <button
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 cursor-pointer"
            style={{
              background: isTrilhasActive ? "rgba(217,242,42,0.08)" : "transparent",
              color: isTrilhasActive ? "#d9f22a" : "var(--muted-foreground)",
              fontWeight: isTrilhasActive ? 600 : 400,
              borderLeft: isTrilhasActive ? "2px solid #d9f22a" : "2px solid transparent",
            }}
            onClick={() => setTrilhasOpen(!trilhasOpen)}
          >
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">Trilhas</span>
            {trilhasOpen
              ? <ChevronDown className="w-3 h-3 opacity-60" />
              : <ChevronRight className="w-3 h-3 opacity-60" />}
          </button>
          <AnimatePresence>
            {trilhasOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="pl-7 pt-0.5 space-y-0.5">
                  {[
                    { href: "/trilhas/gente-cultura", label: "Gente e Cultura" },
                    { href: "/trilhas/departamento-pessoal", label: "Departamento Pessoal" },
                    { href: "/trilhas/seguranca-trabalho", label: "Segurança do Trabalho" },
                  ].map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div
                        className="px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors"
                        style={{
                          color: isActive(item.href) ? "#d9f22a" : "var(--muted-foreground)",
                          fontWeight: isActive(item.href) ? 600 : 400,
                        }}
                      >
                        {item.label}
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ranking */}
        <Link href="/ranking">
          <div
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 cursor-pointer"
            style={{
              background: isActive("/ranking") ? "rgba(217,242,42,0.08)" : "transparent",
              color: isActive("/ranking") ? "#d9f22a" : "var(--muted-foreground)",
              fontWeight: isActive("/ranking") ? 600 : 400,
              borderLeft: isActive("/ranking") ? "2px solid #d9f22a" : "2px solid transparent",
            }}
          >
            <Trophy className="w-4 h-4 flex-shrink-0" />
            <span>Ranking</span>
          </div>
        </Link>

        {/* Admin */}
        {user?.role === "admin" && (
          <Link href="/admin">
            <div
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 cursor-pointer mt-2"
              style={{
                background: isActive("/admin") ? "rgba(217,242,42,0.08)" : "transparent",
                color: isActive("/admin") ? "#d9f22a" : "var(--muted-foreground)",
                fontWeight: isActive("/admin") ? 600 : 400,
                borderLeft: isActive("/admin") ? "2px solid #d9f22a" : "2px solid transparent",
              }}
            >
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span>Administração</span>
            </div>
          </Link>
        )}
      </nav>

      {/* User info + logout */}
      {isAuthenticated && (
        <div className="px-3 py-4 border-t border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="text-xs font-bold bg-primary/20 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user?.name || "Colaborador"}
                </p>
                {contractLabel && (
                  <span
                    className="text-xs font-black px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{
                      background: "rgba(217,242,42,0.12)",
                      color: "#d9f22a",
                      border: "1px solid rgba(217,242,42,0.25)",
                      fontFamily: "'Barlow Condensed', sans-serif",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {contractLabel}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.totalPoints ?? 0} pts · Nível {stats?.level ?? 1}
              </p>
            </div>
          </div>

          {/* Level mini-bar */}
          {stats && (
            <div className="mb-3">
              <div className="w-full rounded-full h-1 bg-border">
                <div
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(5, 100 - (stats.pointsToNextLevel / (stats.level * 500)) * 100))}%`,
                    background: "#d9f22a",
                    boxShadow: "0 0 6px rgba(217,242,42,0.4)",
                  }}
                />
              </div>
            </div>
          )}

          <button
            className="flex items-center gap-2 text-xs w-full px-2 py-1.5 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border/30">
        <p className="text-xs text-muted-foreground/40">© 2026 Stellar Gaming</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background" style={{ fontFamily: "'Barlow', sans-serif" }}>
      {/* Atmospheric background */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-50"
          style={{ background: "radial-gradient(circle, rgba(24,64,235,0.08) 0%, transparent 70%)", transform: "translate(-40%, -40%)" }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-50"
          style={{ background: "radial-gradient(circle, rgba(217,242,42,0.04) 0%, transparent 70%)", transform: "translate(30%, 30%)" }} />
      </div>

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 fixed h-full z-30 bg-card border-r border-border"
      >
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between bg-card border-b border-border">
        <div className="flex items-center gap-2">
          <Star4 className="w-5 h-5 text-primary" />
          <span
            className="font-black text-foreground uppercase tracking-wider text-sm"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Stellar Gaming
          </span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: -280 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -280 }}
            transition={{ duration: 0.22 }}
            className="lg:hidden fixed inset-0 z-30 flex flex-col pt-14 bg-card"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 lg:ml-60 pt-14 lg:pt-0 min-h-screen relative">
        {!isAuthenticated ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-6 max-w-sm mx-auto px-6">
              <Star4 className="w-12 h-12 text-primary mx-auto" />
              <div>
                <h1
                  className="text-2xl font-black text-foreground uppercase"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Stellar Gaming
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Plataforma de Treinamentos</p>
              </div>
              <div className="flex justify-center">
                <img
                  src={BETINHA_FULL}
                  alt="Betinha"
                  className="w-32 h-auto object-contain"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground mb-1">Olá! Eu sou a Betinha 👋</h2>
                <p className="text-sm text-muted-foreground">Faça login para começar sua jornada de aprendizado</p>
              </div>
              <Button
                className="w-full font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => window.location.href = "/"}
              >
                Entrar na Plataforma
              </Button>
            </div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
