import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ChevronLeft, ChevronRight, Star } from "lucide-react";

export interface TimelineYear {
  year: string;
  title?: string;
  label?: string;
  events: string[];
}

interface TimelineSlideProps {
  title?: string;
  intro?: string;
  years: TimelineYear[];
}

export function TimelineSlide({ title, intro, years }: TimelineSlideProps) {
  const [activeYear, setActiveYear] = useState<string>(years[0]?.year ?? "");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  const activeData = years.find((y) => y.year === activeYear);

  return (
    <div className="w-full select-none">
      {title && (
        <h2 className="text-2xl font-black text-primary mb-2">{title}</h2>
      )}
      {intro && (
        <p className="text-xs text-muted-foreground italic mb-5 leading-relaxed border-l-2 border-primary/30 pl-3">
          {intro}
        </p>
      )}

      {/* Horizontal scrollable timeline */}
      <div className="relative">
        {/* Scroll buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/80 border border-border flex items-center justify-center hover:border-primary/50 transition-colors shadow-lg"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background/80 border border-border flex items-center justify-center hover:border-primary/50 transition-colors shadow-lg"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide px-10"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="relative flex items-center min-w-max py-2">
            {/* Center horizontal line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            {years.map((yr, yi) => {
              const isActive = yr.year === activeYear;
              const isAbove = yi % 2 === 0;

              return (
                <div
                  key={yr.year}
                  className="relative flex flex-col items-center mx-6 cursor-pointer"
                  style={{ width: 120 }}
                  onClick={() => setActiveYear(yr.year)}
                >
                  {/* Card above */}
                  {isAbove && (
                    <div
                      className={`mb-3 w-28 min-h-[56px] rounded-lg border p-2 transition-all duration-200 ${
                        isActive
                          ? "border-primary bg-primary/10 shadow-[0_0_12px_rgba(var(--primary-rgb,0,200,83),0.25)]"
                          : "border-border/50 bg-card/60 opacity-60 hover:opacity-90"
                      }`}
                    >
                      <p className={`text-xs font-semibold leading-snug ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                        {yr.title ?? yr.label ?? ""}
                      </p>
                    </div>
                  )}
                  {!isAbove && <div className="mb-3 w-28 min-h-[56px]" />}

                  {/* Year dot + connector */}
                  <div className="relative flex flex-col items-center">
                    {isAbove && <div className={`w-0.5 h-3 ${isActive ? "bg-primary" : "bg-border/50"}`} />}
                    <motion.div
                      animate={{ scale: isActive ? 1.15 : 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-black text-xs z-10 transition-colors duration-200 ${
                        isActive
                          ? "bg-primary border-primary text-primary-foreground shadow-[0_0_16px_rgba(var(--primary-rgb,0,200,83),0.5)]"
                          : "bg-card border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {yr.year}
                    </motion.div>
                    {!isAbove && <div className={`w-0.5 h-3 ${isActive ? "bg-primary" : "bg-border/50"}`} />}
                  </div>

                  {/* Card below */}
                  {!isAbove && (
                    <div
                      className={`mt-3 w-28 min-h-[56px] rounded-lg border p-2 transition-all duration-200 ${
                        isActive
                          ? "border-primary bg-primary/10 shadow-[0_0_12px_rgba(var(--primary-rgb,0,200,83),0.25)]"
                          : "border-border/50 bg-card/60 opacity-60 hover:opacity-90"
                      }`}
                    >
                      <p className={`text-xs font-semibold leading-snug ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                        {yr.title ?? yr.label ?? ""}
                      </p>
                    </div>
                  )}
                  {isAbove && <div className="mt-3 w-28 min-h-[56px]" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active year detail panel */}
      <AnimatePresence mode="wait">
        {activeData && (
          <motion.div
            key={activeYear}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-5 rounded-xl border border-primary/20 bg-card/80 p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-black text-primary leading-none">{activeData.year}</span>
              {(activeData.title ?? activeData.label) && (
                <span className="text-sm font-semibold text-foreground/80">
                  — {activeData.title ?? activeData.label}
                </span>
              )}
            </div>
            <div className="space-y-2">
              {activeData.events.map((ev, ei) => {
                const isPrize = ev.startsWith("🏆");
                return (
                  <motion.div
                    key={ei}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: ei * 0.04 }}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      isPrize
                        ? "bg-yellow-500/5 border-yellow-500/20"
                        : "bg-muted/20 border-border/50"
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {isPrize ? (
                        <Trophy className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <Star className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-foreground/90 leading-snug flex-1 min-w-0">
                      {isPrize ? ev.replace("🏆 ", "") : ev}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle star decorations */}
      <div className="flex justify-center gap-2 mt-4 opacity-20 pointer-events-none" aria-hidden>
        {["✦","·","✦","·","✦"].map((s, i) => (
          <span key={i} className="text-primary text-xs">{s}</span>
        ))}
      </div>
    </div>
  );
}

/** Parse JSON content from slide into TimelineSlide props */
export function parseTimelineContent(content: string): { intro?: string; years: TimelineYear[] } {
  try {
    return JSON.parse(content);
  } catch {
    return { years: [] };
  }
}
