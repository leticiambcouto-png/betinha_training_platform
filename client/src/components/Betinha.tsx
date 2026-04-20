import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BETINHA_AVATAR = "https://d2xsxph8kpxj0f.cloudfront.net/310519663204027059/NbLekrCupyKcetotbNsyPG/betinha-avatar_0d442e08.jpg";

interface BetinhaProps {
  speech: string;
  autoPlay?: boolean; // kept for API compatibility, no longer used
  size?: "sm" | "md" | "lg";
  position?: "left" | "right";
  showBubble?: boolean;
  className?: string;
}

export function Betinha({
  speech,
  size = "md",
  position = "left",
  showBubble = true,
  className = "",
}: BetinhaProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sizeMap = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  // Typewriter effect
  useEffect(() => {
    if (!showBubble || !speech) return;
    setDisplayedText("");
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < speech.length) {
        setDisplayedText(speech.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [speech, showBubble]);

  return (
    <div className={`flex items-end gap-3 ${position === "right" ? "flex-row-reverse" : "flex-row"} ${className}`}>
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <motion.div
          className={`${sizeMap[size]} rounded-full overflow-hidden border-2 border-primary/60 animate-pulse-glow`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img
            src={BETINHA_AVATAR}
            alt="Betinha"
            className="w-full h-full object-cover object-top"
          />
        </motion.div>
      </div>

      {/* Speech Bubble */}
      {showBubble && (
        <AnimatePresence mode="wait">
          <motion.div
            key={speech.slice(0, 20)}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="betinha-bubble px-4 py-3 max-w-sm flex-1"
          >
            <p className="text-sm text-foreground leading-relaxed">
              {displayedText}
              {isTyping && (
                <span className="inline-block w-1 h-4 bg-primary ml-0.5 animate-pulse" />
              )}
            </p>
            <p className="text-xs text-primary font-semibold mt-1">Betinha</p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

// Compact version for slide header
export function BetinhaCompact({ speech, className = "" }: { speech: string; className?: string }) {
  return (
    <Betinha
      speech={speech}
      size="sm"
      showBubble={true}
      className={className}
    />
  );
}
