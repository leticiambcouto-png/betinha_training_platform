import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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
}

export function DictionarySlide({ title, description, entries }: DictionarySlideProps) {
  const [search, setSearch] = useState("");
  const [flipped, setFlipped] = useState<number | null>(null);

  const filtered = entries.filter(
    (e) =>
      e.term.toLowerCase().includes(search.toLowerCase()) ||
      e.definition.toLowerCase().includes(search.toLowerCase()) ||
      (e.category ?? "").toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const categories = Array.from(new Set(filtered.map((e) => e.category ?? "Geral")));

  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-black text-primary mb-2">{title}</h2>}
      {description && <p className="text-muted-foreground text-sm mb-4">{description}</p>}

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar termo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-muted/30 border-border"
        />
      </div>

      {filtered.length === 0 && (
        <p className="text-muted-foreground text-sm text-center py-8">Nenhum termo encontrado.</p>
      )}

      <div className="space-y-5">
        {categories.map((cat) => {
          const catEntries = filtered.filter((e) => (e.category ?? "Geral") === cat);
          if (catEntries.length === 0) return null;
          return (
            <div key={cat}>
              {categories.length > 1 && (
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-2">{cat}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {catEntries.map((entry, i) => {
                  const globalIdx = entries.indexOf(entry);
                  const isFlipped = flipped === globalIdx;
                  return (
                    <motion.div
                      key={globalIdx}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
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
                            <span className="text-xs text-muted-foreground ml-auto italic">clique para ver a definição</span>
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
