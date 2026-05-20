import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, Zap } from "lucide-react";

export interface ValueItem {
  name: string;
  tagline: string;
  description: string;
  icon?: string;
  color?: string;
  howToLive?: string[];
  practice?: string[];
  dos?: string[];
  donts?: string[];
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

type Tab = "practice" | "dos" | "donts";

export function ValuesSlide({ title, intro, values }: ValuesSlideProps) {
  const [expanded, setExpanded] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<Record<number, Tab>>({});

  const getTab = (i: number): Tab => activeTab[i] ?? "practice";

  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-black text-primary mb-2">{title}</h2>}
      {intro && <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{intro}</p>}

      <div className="space-y-3">
        {values.map((val, i) => {
          const isOpen = expanded === i;
          const accentColor = val.color ?? "#d9f22a";
          const tab = getTab(i);

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl border border-border overflow-hidden"
              style={{ borderLeftColor: accentColor, borderLeftWidth: 4 }}
            >
              {/* Card Header */}
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-muted/10"
                style={isOpen ? { background: `${accentColor}10` } : {}}
              >
                {val.icon && (
                  <span
                    className="text-xl w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ background: `${accentColor}20` }}
                  >
                    {val.icon}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <span
                    className="font-black text-base tracking-tight"
                    style={{ color: isOpen ? accentColor : "var(--foreground)" }}
                  >
                    {val.name}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5 italic">{val.tagline}</p>
                </div>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ background: isOpen ? `${accentColor}25` : "transparent" }}
                >
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" style={{ color: accentColor }} />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expanded Body */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      {/* Divider */}
                      <div className="h-px mb-4" style={{ background: `${accentColor}30` }} />

                      {/* Description */}
                      <p className="text-sm text-foreground/90 leading-relaxed mb-4">{val.description}</p>

                      {/* Tab selector */}
                      <div className="flex gap-2 mb-4 flex-wrap">
                        {[
                          { key: "practice" as Tab, label: "Na Prática", icon: <Zap className="w-3 h-3" /> },
                          { key: "dos" as Tab, label: "Do's", icon: <CheckCircle2 className="w-3 h-3" /> },
                          { key: "donts" as Tab, label: "Don'ts", icon: <XCircle className="w-3 h-3" /> },
                        ].map(({ key, label, icon }) => (
                          <button
                            key={key}
                            onClick={() => setActiveTab((prev) => ({ ...prev, [i]: key }))}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                              tab === key
                                ? "text-background border-transparent"
                                : "bg-transparent text-muted-foreground border-border hover:border-border/80"
                            }`}
                            style={tab === key ? { background: accentColor, borderColor: accentColor } : {}}
                          >
                            {icon}
                            {label}
                          </button>
                        ))}
                      </div>

                      {/* Tab content */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={tab}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                        >
                          {tab === "practice" && (
                            <ul className="space-y-2">
                              {(val.practice ?? val.howToLive ?? []).map((item, j) => (
                                <li key={j} className="flex items-start gap-2.5 text-sm text-foreground/85">
                                  <span
                                    className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: accentColor }}
                                  />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}

                          {tab === "dos" && (
                            <ul className="space-y-2">
                              {(val.dos ?? []).map((item, j) => (
                                <li key={j} className="flex items-start gap-2.5 text-sm text-foreground/85">
                                  <CheckCircle2
                                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                                    style={{ color: accentColor }}
                                  />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}

                          {tab === "donts" && (
                            <ul className="space-y-2">
                              {(val.donts ?? []).map((item, j) => (
                                <li key={j} className="flex items-start gap-2.5 text-sm text-foreground/85">
                                  <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-destructive/70" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}
                        </motion.div>
                      </AnimatePresence>
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
