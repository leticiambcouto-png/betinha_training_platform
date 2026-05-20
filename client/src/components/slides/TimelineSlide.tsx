import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ChevronLeft, ChevronRight, X } from "lucide-react";

// 4-pointed star SVG icon
function Star4({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
    </svg>
  );
}

// An event is either a plain string or a prize object
export type TimelineEvent =
  | string
  | { type: "prize"; label: string; image?: string | null };

export interface TimelineYear {
  year: string;
  title?: string;
  label?: string;
  events: TimelineEvent[];
  // legacy field kept for backwards compat
  media?: Array<{ type: "image" | "video"; url: string; caption?: string } | string>;
}

interface TimelineSlideProps {
  title?: string;
  intro?: string;
  years: TimelineYear[];
}

export function TimelineSlide({ title, intro, years }: TimelineSlideProps) {
  const [activeYear, setActiveYear] = useState<string>(years[0]?.year ?? "");
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  const activeData = years.find((y) => y.year === activeYear);

  const prizeCount = (yr: TimelineYear) =>
    yr.events.filter((e) => typeof e === "object" && e.type === "prize").length;

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

        <div
          ref={scrollRef}
          className="overflow-x-auto px-10"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="relative flex items-center min-w-max py-2">
            {/* Center line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            {years.map((yr, yi) => {
              const isActive = yr.year === activeYear;
              const isAbove = yi % 2 === 0;
              const prizes = prizeCount(yr);

              return (
                <div
                  key={yr.year}
                  className="relative flex flex-col items-center mx-6 cursor-pointer"
                  style={{ width: 120 }}
                  onClick={() => setActiveYear(yr.year)}
                >
                  {/* Card above */}
                  {isAbove ? (
                    <div
                      className={`mb-3 w-28 min-h-[56px] rounded-lg border p-2 transition-all duration-200 ${
                        isActive
                          ? "border-primary bg-primary/10 shadow-[0_0_12px_rgba(0,200,83,0.2)]"
                          : "border-border/50 bg-card/60 opacity-60 hover:opacity-90"
                      }`}
                    >
                      <p className={`text-xs font-semibold leading-snug ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                        {yr.title ?? yr.label ?? ""}
                      </p>
                      {prizes > 0 && (
                        <div className="flex gap-1 mt-1 items-center">
                          <Trophy className="w-3 h-3 text-yellow-400" />
                          <span className="text-[10px] text-yellow-400/80 font-medium">{prizes} prêmio{prizes > 1 ? "s" : ""}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mb-3 w-28 min-h-[56px]" />
                  )}

                  {/* Year dot */}
                  <div className="relative flex flex-col items-center">
                    {isAbove && <div className={`w-0.5 h-3 ${isActive ? "bg-primary" : "bg-border/50"}`} />}
                    <motion.div
                      animate={{ scale: isActive ? 1.15 : 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-black text-xs z-10 transition-colors duration-200 ${
                        isActive
                          ? "bg-primary border-primary text-primary-foreground shadow-[0_0_16px_rgba(0,200,83,0.5)]"
                          : "bg-card border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {yr.year}
                    </motion.div>
                    {!isAbove && <div className={`w-0.5 h-3 ${isActive ? "bg-primary" : "bg-border/50"}`} />}
                  </div>

                  {/* Card below */}
                  {!isAbove ? (
                    <div
                      className={`mt-3 w-28 min-h-[56px] rounded-lg border p-2 transition-all duration-200 ${
                        isActive
                          ? "border-primary bg-primary/10 shadow-[0_0_12px_rgba(0,200,83,0.2)]"
                          : "border-border/50 bg-card/60 opacity-60 hover:opacity-90"
                      }`}
                    >
                      <p className={`text-xs font-semibold leading-snug ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                        {yr.title ?? yr.label ?? ""}
                      </p>
                      {prizes > 0 && (
                        <div className="flex gap-1 mt-1 items-center">
                          <Trophy className="w-3 h-3 text-yellow-400" />
                          <span className="text-[10px] text-yellow-400/80 font-medium">{prizes} prêmio{prizes > 1 ? "s" : ""}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-3 w-28 min-h-[56px]" />
                  )}
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
                  {activeData.title ?? activeData.label}
                </span>
              )}
            </div>

            {/* Regular events */}
            <div className="space-y-2 mb-5">
              {activeData.events
                .filter((ev): ev is string => typeof ev === "string")
                .map((ev, ei) => (
                  <motion.div
                    key={ei}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: ei * 0.04 }}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20 border-border/50"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <Star4 className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm text-foreground/90 leading-snug flex-1 min-w-0">{ev}</p>
                  </motion.div>
                ))}
            </div>

            {/* Prize cards — side by side */}
            {activeData.events.some((e) => typeof e === "object" && e.type === "prize") && (
              <div>
                <p className="text-xs text-yellow-400 font-bold uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  Prêmios conquistados em {activeData.year}
                </p>
                <div className="flex flex-wrap gap-3">
                  {activeData.events
                    .filter(
                      (e): e is { type: "prize"; label: string; image?: string | null } =>
                        typeof e === "object" && e.type === "prize"
                    )
                    .map((prize, pi) => (
                      <motion.div
                        key={pi}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: pi * 0.07 }}
                        className="flex flex-col rounded-xl border border-yellow-500/25 bg-yellow-500/5 overflow-hidden w-44 flex-shrink-0 shadow-md hover:shadow-yellow-500/10 hover:border-yellow-400/50 transition-all duration-200"
                      >
                        {/* Image */}
                        {prize.image ? (
                          <button
                            onClick={() => setLightboxSrc(prize.image!)}
                            className="w-full aspect-[4/3] overflow-hidden group"
                          >
                            <img
                              src={prize.image}
                              alt={prize.label}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </button>
                        ) : (
                          <div className="w-full aspect-[4/3] bg-yellow-500/10 flex items-center justify-center">
                            <Trophy className="w-8 h-8 text-yellow-400/40" />
                          </div>
                        )}
                        {/* Label */}
                        <div className="p-2.5 flex items-start gap-2">
                          <Trophy className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-foreground/90 font-medium leading-snug">{prize.label}</p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxSrc(null)}
          >
            <button
              onClick={() => setLightboxSrc(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightboxSrc}
              alt="Prêmio"
              className="max-w-2xl w-full rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle star decorations */}
      <div className="flex justify-center gap-2 mt-4 opacity-20 pointer-events-none" aria-hidden>
        {["✦", "·", "✦", "·", "✦"].map((s, i) => (
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
