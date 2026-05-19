import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ChevronDown, ChevronUp, Star } from "lucide-react";

export interface TimelineEvent {
  date: string;
  title: string;
  description?: string;
  isPrize?: boolean;
  emoji?: string;
}

export interface TimelineYear {
  year: string;
  label: string;
  events: TimelineEvent[];
}

interface TimelineSlideProps {
  title?: string;
  years: TimelineYear[];
}

export function TimelineSlide({ title, years }: TimelineSlideProps) {
  const [expandedYear, setExpandedYear] = useState<string | null>(years[0]?.year ?? null);

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-2xl font-black text-primary mb-6">{title}</h2>
      )}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border/60" />

        <div className="space-y-3">
          {years.map((yr, yi) => {
            const isOpen = expandedYear === yr.year;
            return (
              <motion.div
                key={yr.year}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: yi * 0.06 }}
                className="relative pl-14"
              >
                {/* Year dot */}
                <button
                  onClick={() => setExpandedYear(isOpen ? null : yr.year)}
                  className={`absolute left-0 w-12 h-12 rounded-full border-2 flex items-center justify-center font-black text-xs transition-all ${
                    isOpen
                      ? "bg-primary border-primary text-primary-foreground scale-110"
                      : "bg-card border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {yr.year}
                </button>

                {/* Year header */}
                <button
                  onClick={() => setExpandedYear(isOpen ? null : yr.year)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all text-left"
                >
                  <div>
                    <span className="font-bold text-foreground">{yr.year}</span>
                    <span className="text-muted-foreground text-sm ml-2">— {yr.label}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </button>

                {/* Events */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 ml-2 space-y-2 pb-2">
                        {yr.events.map((ev, ei) => (
                          <motion.div
                            key={ei}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: ei * 0.04 }}
                            className={`flex items-start gap-3 p-3 rounded-lg border ${
                              ev.isPrize
                                ? "bg-yellow-500/5 border-yellow-500/20"
                                : "bg-muted/20 border-border/50"
                            }`}
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              {ev.isPrize ? (
                                <Trophy className="w-4 h-4 text-yellow-400" />
                              ) : ev.emoji ? (
                                <span className="text-base">{ev.emoji}</span>
                              ) : (
                                <Star className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              {ev.date && (
                                <span className="text-xs text-primary font-semibold block mb-0.5">{ev.date}</span>
                              )}
                              <p className="text-sm text-foreground/90 font-medium leading-snug">{ev.title}</p>
                              {ev.description && (
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{ev.description}</p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Parse JSON content from slide into TimelineSlide props */
export function parseTimelineContent(content: string): { years: TimelineYear[] } {
  try {
    return JSON.parse(content);
  } catch {
    return { years: [] };
  }
}
