import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Betinha full-body (thumbs up)
const BETINHA_FULL = "/manus-storage/betinha-thumbsup_b1cb02fa.png";

interface BetinhaProps {
  speech: string;
  autoPlay?: boolean;
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

  // Height map for full-body image
  const sizeMap = {
    sm: "h-16 w-auto",
    md: "h-24 w-auto",
    lg: "h-36 w-auto",
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
    }, 16);
    return () => clearInterval(interval);
  }, [speech, showBubble]);

  return (
    <div className={`flex items-end gap-3 ${position === "right" ? "flex-row-reverse" : "flex-row"} ${className}`}>
      {/* Betinha full-body */}
      <div className="relative flex-shrink-0">
        {/* Glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-6 rounded-full blur-xl opacity-40"
          style={{ background: "#d9f22a" }}
        />
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative"
        >
          <img
            src={BETINHA_FULL}
            alt="Betinha"
            className={`${sizeMap[size]} object-contain drop-shadow-lg`}
          />
        </motion.div>
      </div>

      {/* Speech Bubble */}
      {showBubble && (
        <AnimatePresence mode="wait">
          <motion.div
            key={speech.slice(0, 20)}
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.25 }}
            className="betinha-bubble px-4 py-3 max-w-sm flex-1"
          >
            <p className="text-sm text-foreground leading-relaxed">
              {displayedText}
              {isTyping && (
                <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />
              )}
            </p>
            <p
              className="text-xs text-primary font-black mt-1.5 uppercase tracking-wide"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Betinha · Gente &amp; Cultura
            </p>
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
