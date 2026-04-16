import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  LayoutDashboard, BookOpen, Trophy, Shield, LogOut,
  Menu, X, ChevronDown, ChevronRight, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

const BETINHA_AVATAR = "https://d2xsxph8kpxj0f.cloudfront.net/310519663204027059/NbLekrCupyKcetotbNsyPG/betinha-avatar_0d442e08.jpg";

// Ícone S estilizado idêntico ao StellarHub
function StellarIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 10C8 7.79 9.79 6 12 6H20C22.21 6 24 7.79 24 10C24 12.21 22.21 14 20 14H12C9.79 14 8 15.79 8 18C8 20.21 9.79 22 12 22H20C22.21 22 24 20.21 24 18"
        stroke="hsl(66 87% 55%)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  children?: { href: string; label: string }[];
}

const navItems: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Meu Painel" },
  {
    href: "/trilhas",
    icon: BookOpen,
    label: "Trilhas de Aprendizado",
    children: [
      { href: "/trilhas", label: "TBI Gente e Cultura" },
      { href: "/trilhas", label: "TBI de DP" },
      { href: "/trilhas", label: "TBI Seg. do Trabalho" },
    ],
  },
  { href: "/ranking", icon: Trophy, label: "Ranking" },
];

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

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-3">
        <StellarIcon className="w-8 h-8" />
        <span
          className="font-bold text-base tracking-tight"
          style={{ color: "hsl(60 100% 93%)", fontFamily: "'Barlow', sans-serif" }}
        >
          Stellar Space
        </span>
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
          style={{
            background: "hsl(210 60% 14%)",
            color: "hsl(210 20% 55%)",
          }}
        >
          <Search className="w-4 h-4 flex-shrink-0" />
          <span>Buscar conteúdo...</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {/* Meu Painel */}
        <Link href="/dashboard">
          <div
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 cursor-pointer"
            style={{
              background: isActive("/dashboard") ? "hsl(210 60% 14%)" : "transparent",
              color: isActive("/dashboard") ? "hsl(66 87% 55%)" : "hsl(210 20% 55%)",
              fontWeight: isActive("/dashboard") ? 600 : 400,
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
              background: (location.startsWith("/trilhas") || location.startsWith("/modulo") || location.startsWith("/quiz")) ? "hsl(210 60% 14%)" : "transparent",
              color: (location.startsWith("/trilhas") || location.startsWith("/modulo") || location.startsWith("/quiz")) ? "hsl(66 87% 55%)" : "hsl(210 20% 55%)",
              fontWeight: (location.startsWith("/trilhas") || location.startsWith("/modulo") || location.startsWith("/quiz")) ? 600 : 400,
            }}
            onClick={() => setTrilhasOpen(!trilhasOpen)}
          >
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">Trilhas</span>
            {trilhasOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
          <AnimatePresence>
            {trilhasOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pl-7 pt-0.5 space-y-0.5">
                  <Link href="/trilhas">
                    <div
                      className="px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors"
                      style={{ color: "hsl(210 20% 65%)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "hsl(60 100% 93%)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "hsl(210 20% 65%)")}
                    >
                      Gente e Cultura
                    </div>
                  </Link>
                  <Link href="/trilhas">
                    <div
                      className="px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors"
                      style={{ color: "hsl(210 20% 65%)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "hsl(60 100% 93%)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "hsl(210 20% 65%)")}
                    >
                      Departamento Pessoal
                    </div>
                  </Link>
                  <Link href="/trilhas">
                    <div
                      className="px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors"
                      style={{ color: "hsl(210 20% 65%)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "hsl(60 100% 93%)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "hsl(210 20% 65%)")}
                    >
                      Segurança do Trabalho
                    </div>
                  </Link>
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
              background: isActive("/ranking") ? "hsl(210 60% 14%)" : "transparent",
              color: isActive("/ranking") ? "hsl(66 87% 55%)" : "hsl(210 20% 55%)",
              fontWeight: isActive("/ranking") ? 600 : 400,
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
                background: isActive("/admin") ? "hsl(210 60% 14%)" : "transparent",
                color: isActive("/admin") ? "hsl(66 87% 55%)" : "hsl(210 20% 55%)",
                fontWeight: isActive("/admin") ? 600 : 400,
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
        <div className="px-3 py-4 border-t" style={{ borderColor: "hsl(210 40% 15%)" }}>
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback
                className="text-xs font-bold"
                style={{
                  background: "hsl(66 87% 55% / 0.2)",
                  color: "hsl(66 87% 55%)",
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "hsl(60 100% 93%)" }}>
                {user?.name || "Colaborador"}
              </p>
              <p className="text-xs" style={{ color: "hsl(210 20% 55%)" }}>
                {stats?.totalPoints ?? 0} pts · Nível {stats?.level ?? 1}
              </p>
            </div>
          </div>
          {stats && (
            <div className="mb-3">
              <div className="w-full rounded-full h-1" style={{ background: "hsl(210 40% 18%)" }}>
                <div
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(5, 100 - (stats.pointsToNextLevel / (stats.level * 500)) * 100))}%`,
                    background: "hsl(66 87% 55%)",
                  }}
                />
              </div>
            </div>
          )}
          <button
            className="flex items-center gap-2 text-xs w-full px-2 py-1.5 rounded-lg transition-colors"
            style={{ color: "hsl(210 20% 55%)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "hsl(0 84% 60%)")}
            onMouseLeave={e => (e.currentTarget.style.color = "hsl(210 20% 55%)")}
            onClick={logout}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3">
        <p className="text-xs" style={{ color: "hsl(210 20% 40%)" }}>© 2026 Stellar Space</p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex" style={{ background: "hsl(210 100% 7%)", fontFamily: "'Barlow', sans-serif" }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 fixed h-full z-30"
        style={{
          background: "hsl(210 90% 8%)",
          borderRight: "1px solid hsl(210 40% 15%)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between"
        style={{
          background: "hsl(210 90% 8%)",
          borderBottom: "1px solid hsl(210 40% 15%)",
        }}
      >
        <div className="flex items-center gap-2">
          <StellarIcon className="w-7 h-7" />
          <span className="font-bold text-sm" style={{ color: "hsl(60 100% 93%)" }}>Stellar Space</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ color: "hsl(60 100% 93%)" }}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="lg:hidden fixed inset-0 z-30 flex flex-col pt-14"
            style={{ background: "hsl(210 90% 8%)" }}
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        {!isAuthenticated ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-6 max-w-sm mx-auto px-6">
              <div className="flex justify-center">
                <StellarIcon className="w-16 h-16" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1" style={{ color: "hsl(60 100% 93%)" }}>
                  Stellar Space
                </h1>
                <p className="text-sm" style={{ color: "hsl(210 20% 55%)" }}>
                  Plataforma de Treinamentos
                </p>
              </div>
              <div className="flex justify-center">
                <img
                  src={BETINHA_AVATAR}
                  alt="Betinha"
                  className="w-24 h-24 rounded-full object-cover object-top border-2"
                  style={{ borderColor: "hsl(66 87% 55%)" }}
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2" style={{ color: "hsl(60 100% 93%)" }}>
                  Olá! Eu sou a Betinha 👋
                </h2>
                <p className="text-sm" style={{ color: "hsl(210 20% 55%)" }}>
                  Faça login para começar sua jornada de aprendizado
                </p>
              </div>
              <Button
                className="w-full font-semibold"
                style={{
                  background: "hsl(66 87% 55%)",
                  color: "hsl(210 100% 7%)",
                }}
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
