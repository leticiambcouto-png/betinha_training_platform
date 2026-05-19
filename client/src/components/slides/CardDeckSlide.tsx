import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface InteractiveCard {
  title: string;
  subtitle?: string;
  body: string;
  icon?: string;
  color?: string;
  tag?: string;
}

interface CardDeckSlideProps {
  title?: string;
  description?: string;
  cards: InteractiveCard[];
  columns?: 1 | 2 | 3;
}

export function CardDeckSlide({ title, description, cards, columns = 2 }: CardDeckSlideProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const gridClass =
    columns === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1";

  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-black text-primary mb-2">{title}</h2>}
      {description && <p className="text-muted-foreground text-sm mb-5">{description}</p>}

      <div className={`grid ${gridClass} gap-3`}>
        {cards.map((card, i) => {
          const isOpen = expanded === i;
          const accentColor = card.color ?? "#d9f22a";

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card overflow-hidden"
              style={{ borderLeftColor: accentColor, borderLeftWidth: 3 }}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full flex items-start gap-3 p-4 text-left hover:bg-muted/20 transition-colors"
              >
                {card.icon && (
                  <span className="text-2xl flex-shrink-0 mt-0.5">{card.icon}</span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-foreground text-sm">{card.title}</span>
                    {card.tag && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-medium"
                        style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                      >
                        {card.tag}
                      </span>
                    )}
                  </div>
                  {card.subtitle && (
                    <p className="text-xs text-muted-foreground mt-0.5">{card.subtitle}</p>
                  )}
                </div>
                <div className="flex-shrink-0 mt-0.5">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0">
                      <div className="h-px bg-border/50 mb-3" />
                      <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">
                        {card.body}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function parseCardDeckContent(content: string): { cards: InteractiveCard[]; columns?: 1 | 2 | 3 } {
  try {
    return JSON.parse(content);
  } catch {
    return { cards: [] };
  }
}
