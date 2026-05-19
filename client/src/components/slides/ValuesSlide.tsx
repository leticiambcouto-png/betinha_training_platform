import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";

export interface ValueItem {
  name: string;
  tagline: string;
  description: string;
  icon?: string;
  color?: string;
  howToLive?: string[];
  dilemma?: {
    question: string;
    stellarWay: string;
  };
}

interface ValuesSlideProps {
  title?: string;
  intro?: string;
  values: ValueItem[];
}

export function ValuesSlide({ title, intro, values }: ValuesSlideProps) {
  const [expanded, setExpanded] = useState<number | null>(0);
  const [showDilemma, setShowDilemma] = useState<number | null>(null);

  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-black text-primary mb-2">{title}</h2>}
      {intro && <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{intro}</p>}

      <div className="space-y-3">
        {values.map((val, i) => {
          const isOpen = expanded === i;
          const accentColor = val.color ?? "#d9f22a";

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-xl border border-border overflow-hidden"
              style={{ borderLeftColor: accentColor, borderLeftWidth: 3 }}
            >
              {/* Header */}
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/20 transition-colors"
              >
                {val.icon && <span className="text-2xl flex-shrink-0">{val.icon}</span>}
                <div className="flex-1 min-w-0">
                  <span className="font-black text-foreground">{val.name}</span>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{val.tagline}</p>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
              </button>

              {/* Body */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-4">
                      <div className="h-px bg-border/50" />

                      {/* Description */}
                      <p className="text-sm text-foreground/90 leading-relaxed">{val.description}</p>

                      {/* How to live this value */}
                      {val.howToLive && val.howToLive.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                            Como vivenciar no dia a dia
                          </p>
                          <ul className="space-y-1.5">
                            {val.howToLive.map((item, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-foreground/80">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Dilemma */}
                      {val.dilemma && (
                        <div>
                          <button
                            onClick={() => setShowDilemma(showDilemma === i ? null : i)}
                            className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border border-dashed border-primary/40 text-primary hover:bg-primary/5 transition-colors w-full"
                          >
                            <Lightbulb className="w-3.5 h-3.5" />
                            Dilema: o que você faria?
                          </button>

                          <AnimatePresence>
                            {showDilemma === i && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
                                  <p className="text-sm font-medium text-foreground">
                                    💭 {val.dilemma.question}
                                  </p>
                                  <div className="h-px bg-primary/20" />
                                  <p className="text-xs text-muted-foreground">
                                    <span className="text-primary font-semibold">O jeito Stellar: </span>
                                    {val.dilemma.stellarWay}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
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

export function parseValuesContent(content: string): { values: ValueItem[]; intro?: string } {
  try {
    return JSON.parse(content);
  } catch {
    return { values: [] };
  }
}
