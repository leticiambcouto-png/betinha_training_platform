import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ChevronLeft, ChevronRight, ImageIcon, Film, X } from "lucide-react";

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

export interface TimelineMedia {
  type: "image" | "video";
  url: string;
  caption?: string;
}

export interface TimelineYear {
  year: string;
  title?: string;
  label?: string;
  events: string[];
  media?: Array<TimelineMedia | string>;
}

interface TimelineSlideProps {
  title?: string;
  intro?: string;
  years: TimelineYear[];
}

/** Normalise a media item: accept both string URLs and full TimelineMedia objects */
function normaliseMedia(m: TimelineMedia | string): TimelineMedia {
  if (typeof m === "string") {
    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(m);
    return { type: isVideo ? "video" : "image", url: m };
  }
  return m;
}

export function TimelineSlide({ title, intro, years }: TimelineSlideProps) {
  const [activeYear, setActiveYear] = useState<string>(years[0]?.year ?? "");
  const [lightboxMedia, setLightboxMedia] = useState<TimelineMedia | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  const activeData = years.find((y) => y.year === activeYear);
  const activeMediaList: TimelineMedia[] = (activeData?.media ?? []).map(normaliseMedia);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxMedia(activeMediaList[index]);
  };

  const closeLightbox = () => setLightboxMedia(null);

  const prevMedia = () => {
    const newIdx = (lightboxIndex - 1 + activeMediaList.length) % activeMediaList.length;
    setLightboxIndex(newIdx);
    setLightboxMedia(activeMediaList[newIdx]);
  };

  const nextMedia = () => {
    const newIdx = (lightboxIndex + 1) % activeMediaList.length;
    setLightboxIndex(newIdx);
    setLightboxMedia(activeMediaList[newIdx]);
  };

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
              const mediaList = (yr.media ?? []).map(normaliseMedia);
              const hasMedia = mediaList.length > 0;

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
                      {hasMedia && (
                        <div className="flex gap-1 mt-1 items-center">
                          <Trophy className="w-3 h-3 text-yellow-400" />
                          <span className="text-[10px] text-yellow-400/80 font-medium">{mediaList.length} prêmio{mediaList.length > 1 ? "s" : ""}</span>
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
                      {hasMedia && (
                        <div className="flex gap-1 mt-1 items-center">
                          <Trophy className="w-3 h-3 text-yellow-400" />
                          <span className="text-[10px] text-yellow-400/80 font-medium">{mediaList.length} prêmio{mediaList.length > 1 ? "s" : ""}</span>
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
                  — {activeData.title ?? activeData.label}
                </span>
              )}
            </div>

            {/* Events list */}
            <div className="space-y-2 mb-4">
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
                        <Star4 className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-foreground/90 leading-snug flex-1 min-w-0">
                      {isPrize ? ev.replace("🏆 ", "") : ev}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Awards photo gallery */}
            {activeMediaList.length > 0 && (
              <div>
                <p className="text-xs text-yellow-400 font-bold uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  Prêmios conquistados em {activeData.year}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {activeMediaList.map((m, mi) => (
                    <motion.button
                      key={mi}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: mi * 0.06 }}
                      onClick={() => openLightbox(mi)}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden border border-yellow-500/20 hover:border-yellow-400/60 transition-all duration-200 group shadow-md hover:shadow-yellow-500/10"
                    >
                      {m.type === "image" ? (
                        <img
                          src={m.url}
                          alt={m.caption ?? `Prêmio ${mi + 1} de ${activeData.year}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted/40 flex items-center justify-center">
                          <Film className="w-6 h-6 text-primary" />
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/10 transition-colors duration-200 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-white opacity-0 group-hover:opacity-80 transition-opacity" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Placeholder for years without media */}
            {activeMediaList.length === 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground/50 border border-dashed border-border/30 rounded-lg px-3 py-2">
                <ImageIcon className="w-3 h-3" />
                <span>Fotos e vídeos deste ano serão adicionados em breve</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media lightbox */}
      <AnimatePresence>
        {lightboxMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Prev / Next */}
            {activeMediaList.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevMedia(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextMedia(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-2xl w-full rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {lightboxMedia.type === "image" ? (
                <img
                  src={lightboxMedia.url}
                  alt={lightboxMedia.caption ?? ""}
                  className="w-full h-auto rounded-xl"
                />
              ) : (
                <video src={lightboxMedia.url} controls className="w-full rounded-xl" />
              )}
              {lightboxMedia.caption && (
                <div className="bg-card px-4 py-2 text-sm text-muted-foreground text-center">
                  {lightboxMedia.caption}
                </div>
              )}
              {/* Counter */}
              {activeMediaList.length > 1 && (
                <div className="text-center text-xs text-white/50 mt-2">
                  {lightboxIndex + 1} / {activeMediaList.length}
                </div>
              )}
            </motion.div>
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
    const parsed = JSON.parse(content);
    return parsed;
  } catch {
    return { years: [] };
  }
}
