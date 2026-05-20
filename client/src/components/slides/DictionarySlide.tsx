import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Betinha } from "@/components/Betinha";

export interface DictionaryEntry {
  term: string;
  symbol?: string;
  definition: string;
  category?: string;
}

interface DictionarySlideProps {
  title?: string;
  description?: string;
  entries: DictionaryEntry[];
  betinhaSpeech?: string;
}

export function DictionarySlide({ title, description, entries, betinhaSpeech }: DictionarySlideProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [flipped, setFlipped] = useState<number | null>(null);

  // All unique categories sorted alphabetically, with "Todos" first
  const allCategories = ["Todos", ...Array.from(new Set(entries.map((e) => e.category ?? "Geral"))).sort()];

  // Filter by search and active category
  const filtered = entries.filter((e) => {
    const matchesSearch =
      e.term.toLowerCase().includes(search.toLowerCase()) ||
      e.definition.toLowerCase().includes(search.toLowerCase()) ||
      (e.category ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === "Todos" || (e.category ?? "Geral") === activeCategory;
    return matchesSearch && matchesCat;
  });

  // Group by category for display
  const visibleCategories = activeCategory === "Todos"
    ? Array.from(new Set(filtered.map((e) => e.category ?? "Geral"))).sort()
    : [activeCategory];

  return (
    <div className="w-full">
      {/* Betinha above title */}
      {betinhaSpeech && (
        <div className="mb-4">
          <Betinha speech={betinhaSpeech} size="sm" autoPlay={false} />
        </div>
      )}

      {title && <h2 className="text-2xl font-black text-primary mb-1">{title}</h2>}
      {description && <p className="text-muted-foreground text-sm mb-4">{description}</p>}

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar termo..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setFlipped(null); }}
          className="pl-9 bg-muted/30 border-border"
        />
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setFlipped(null); }}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 border ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-muted/30 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-muted-foreground text-sm text-center py-8">Nenhum termo encontrado.</p>
      )}

      <div className="space-y-5">
        {visibleCategories.map((cat) => {
          const catEntries = filtered.filter((e) => (e.category ?? "Geral") === cat);
          if (catEntries.length === 0) return null;
          return (
            <div key={cat}>
              {visibleCategories.length > 1 && (
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-2 border-l-2 border-primary/40 pl-2">{cat}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {catEntries.map((entry) => {
                  const globalIdx = entries.indexOf(entry);
                  const isFlipped = flipped === globalIdx;
                  return (
                    <motion.div
                      key={globalIdx}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.15 }}
                      className="cursor-pointer"
                      onClick={() => setFlipped(isFlipped ? null : globalIdx)}
                    >
                      <div
                        className={`rounded-xl border p-4 transition-all duration-200 min-h-[80px] ${
                          isFlipped
                            ? "bg-primary/10 border-primary/40"
                            : "bg-card border-border hover:border-primary/30"
                        }`}
                      >
                        {!isFlipped ? (
                          <div className="flex items-center gap-2">
                            {entry.symbol && (
                              <span className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded font-mono flex-shrink-0">
                                {entry.symbol}
                              </span>
                            )}
                            <span className="font-bold text-foreground text-sm">{entry.term}</span>
                            <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto flex-shrink-0" />
                          </div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.15 }}
                          >
                            <p className="text-xs text-primary font-semibold mb-1">{entry.term}</p>
                            <p className="text-sm text-foreground/90 leading-relaxed">{entry.definition}</p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function parseDictionaryContent(content: string): { entries: DictionaryEntry[]; description?: string } {
  try {
    return JSON.parse(content);
  } catch {
    return { entries: [] };
  }
}
