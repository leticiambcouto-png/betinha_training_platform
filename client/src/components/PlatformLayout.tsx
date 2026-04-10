import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  LayoutDashboard, BookOpen, Trophy, Star, LogOut,
  Menu, X, Shield, ChevronRight, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const BETINHA_AVATAR = "https://d2xsxph8kpxj0f.cloudfront.net/310519663204027059/NbLekrCupyKcetotbNsyPG/betinha-avatar_0d442e08.jpg";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Meu Painel" },
  { href: "/trilhas", icon: BookOpen, label: "Trilhas" },
  { href: "/ranking", icon: Trophy, label: "Ranking" },
];

interface PlatformLayoutProps {
  children: React.ReactNode;
}

export function PlatformLayout({ children }: PlatformLayoutProps) {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: stats } = trpc.dashboard.myStats.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 30000,
  });

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border fixed h-full z-30">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Star className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">Stellar Gaming</p>
              <p className="text-xs text-muted-foreground">Plataforma de Treinamentos</p>
            </div>
          </div>
        </div>

        {/* User info */}
        {isAuthenticated && (
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-primary/40">
                <AvatarFallback className="bg-primary/20 text-primary font-bold text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{user?.name || "Colaborador"}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-muted-foreground">{stats?.totalPoints ?? 0} pts</span>
                  <span className="text-xs text-muted-foreground">• Nível {stats?.level ?? 1}</span>
                </div>
              </div>
            </div>
            {/* Progress bar */}
            {stats && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Próximo nível</span>
                  <span>{Math.max(0, stats.pointsToNextLevel)} pts</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-primary transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(0, 100 - (stats.pointsToNextLevel / (stats.level * 500)) * 100))}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                }`}>
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
                </div>
              </Link>
            );
          })}

          {user?.role === "admin" && (
            <Link href="/admin">
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 mt-4 ${
                location.startsWith("/admin")
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              }`}>
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">Administração</span>
              </div>
            </Link>
          )}
        </nav>

        {/* Betinha mini */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <img src={BETINHA_AVATAR} alt="Betinha" className="w-8 h-8 rounded-full object-cover object-top" />
            <div>
              <p className="text-xs font-semibold text-primary">Betinha</p>
              <p className="text-xs text-muted-foreground">Sua guia de aprendizado</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        {isAuthenticated && (
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        )}
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-sidebar border-b border-sidebar-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Star className="w-3 h-3 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm">Stellar Gaming</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground">
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
            className="lg:hidden fixed inset-0 z-30 bg-sidebar pt-14"
          >
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-foreground hover:bg-sidebar-accent"
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              ))}
              {user?.role === "admin" && (
                <Link href="/admin">
                  <div className="flex items-center gap-3 px-3 py-3 rounded-lg text-foreground hover:bg-sidebar-accent" onClick={() => setMobileOpen(false)}>
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Administração</span>
                  </div>
                </Link>
              )}
              {isAuthenticated && (
                <button
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-destructive w-full"
                  onClick={logout}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sair</span>
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        {!isAuthenticated ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border-2 border-primary">
                <img src={BETINHA_AVATAR} alt="Betinha" className="w-full h-full object-cover object-top" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Olá! Eu sou a Betinha</h2>
              <p className="text-muted-foreground">Faça login para começar sua jornada de aprendizado</p>
              <Button asChild className="bg-primary text-primary-foreground">
                <a href={getLoginUrl()}>Entrar na Plataforma</a>
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
