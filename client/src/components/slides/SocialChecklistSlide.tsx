import { useState } from "react";
import { motion } from "framer-motion";
import {
  Instagram, Linkedin, Youtube, Globe, Twitter,
  CheckCircle2, Circle, ExternalLink, Send
} from "lucide-react";

interface SocialLink {
  platform: string;
  handle: string;
  description?: string;
  url: string;
  icon: string;
}

interface Brand {
  name: string;
  color: string;
  links: SocialLink[];
}

interface SocialChecklistContent {
  speech?: string;
  brands: Brand[];
}

function parseSocialContent(content: string): SocialChecklistContent {
  try {
    return JSON.parse(content);
  } catch {
    return { brands: [] };
  }
}

function PlatformIcon({ icon, color }: { icon: string; color: string }) {
  const cls = "w-4 h-4 flex-shrink-0";
  const style = { color };
  switch (icon) {
    case "instagram": return <Instagram className={cls} style={style} />;
    case "linkedin": return <Linkedin className={cls} style={style} />;
    case "youtube": return <Youtube className={cls} style={style} />;
    case "twitter": return <Twitter className={cls} style={style} />;
    case "telegram": return <Send className={cls} style={style} />;
    case "tiktok":
      return (
        <svg className={cls} style={style} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/>
        </svg>
      );
    default: return <Globe className={cls} style={style} />;
  }
}

export function parseSocialChecklistContent(content: string) {
  return parseSocialContent(content);
}

export function SocialChecklistSlide({ content }: { content: string }) {
  const data = parseSocialContent(content);
  const totalLinks = data.brands.reduce((acc, b) => acc + b.links.length, 0);

  // Track checked state per link (key = brandIdx-linkIdx)
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const checkedCount = Object.values(checked).filter(Boolean).length;

  const toggle = (key: string) => {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">Progresso do checklist</span>
          <span className="text-primary font-bold">{checkedCount}/{totalLinks} seguidos</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #d9f22a, #e8ff4a)" }}
            initial={{ width: 0 }}
            animate={{ width: `${totalLinks > 0 ? (checkedCount / totalLinks) * 100 : 0}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Brands grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {data.brands.map((brand, bIdx) => (
          <motion.div
            key={brand.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: bIdx * 0.07 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            {/* Brand header */}
            <div
              className="px-4 py-2.5 flex items-center gap-2"
              style={{ borderBottom: `2px solid ${brand.color}30`, background: `${brand.color}08` }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: brand.color }}
              />
              <span
                className="font-black text-sm uppercase tracking-wide"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", color: brand.color }}
              >
                {brand.name}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">
                {brand.links.filter((_, lIdx) => checked[`${bIdx}-${lIdx}`]).length}/{brand.links.length}
              </span>
            </div>

            {/* Links list */}
            <div className="divide-y divide-border/40">
              {brand.links.map((link, lIdx) => {
                const key = `${bIdx}-${lIdx}`;
                const isChecked = !!checked[key];
                return (
                  <div
                    key={key}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      isChecked ? "bg-primary/5" : "hover:bg-muted/20"
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggle(key)}
                      className="flex-shrink-0 transition-transform hover:scale-110"
                      aria-label={isChecked ? "Desmarcar" : "Marcar como seguido"}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground/50" />
                      )}
                    </button>

                    {/* Platform icon */}
                    <PlatformIcon icon={link.icon} color={isChecked ? brand.color : "var(--muted-foreground)"} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate transition-colors ${isChecked ? "text-primary" : "text-foreground"}`}>
                        {link.handle}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {link.description ?? link.platform}
                      </p>
                    </div>

                    {/* External link */}
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => toggle(key)}
                      className="flex-shrink-0 p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                      aria-label={`Abrir ${link.handle}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" />
                    </a>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Completion message */}
      {checkedCount === totalLinks && totalLinks > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-4 px-6 rounded-xl border border-primary/30 bg-primary/5"
        >
          <p className="text-primary font-bold text-sm">
            Você seguiu todas as nossas redes! Bem-vindo ao universo Stellar!
          </p>
        </motion.div>
      )}
    </div>
  );
}
