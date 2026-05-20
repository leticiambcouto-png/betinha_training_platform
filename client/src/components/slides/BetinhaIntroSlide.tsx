import { motion } from "framer-motion";

interface BetinhaIntroSlideProps {
  speech: string;
  imageUrl?: string;
}

const BETINHA_FULL = "/manus-storage/betinha-thumbsup_b1cb02fa.png";

export function BetinhaIntroSlide({ speech, imageUrl }: BetinhaIntroSlideProps) {
  const src = imageUrl ?? BETINHA_FULL;

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 w-full min-h-[280px]">
      {/* Betinha image */}
      <motion.div
        initial={{ opacity: 0, x: -20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex-shrink-0 w-48 sm:w-56 lg:w-64"
      >
        <img
          src={src}
          alt="Betinha"
          className="w-full h-auto object-contain drop-shadow-2xl"
          style={{ filter: "drop-shadow(0 0 24px rgba(217,242,42,0.22))" }}
        />
      </motion.div>

      {/* Speech bubble */}
      <motion.div
        initial={{ opacity: 0, x: 20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="flex-1 relative"
      >
        {/* Tail pointing left (toward Betinha) */}
        <div
          className="absolute -left-3 bottom-8 w-0 h-0 hidden sm:block"
          style={{
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderRight: "14px solid hsl(var(--border))",
          }}
        />
        <div
          className="absolute -left-[10px] bottom-8 w-0 h-0 hidden sm:block"
          style={{
            borderTop: "9px solid transparent",
            borderBottom: "9px solid transparent",
            borderRight: "13px solid hsl(var(--card))",
          }}
        />

        <div className="bg-card border border-border rounded-2xl p-5 shadow-lg">
          <p className="text-base sm:text-lg text-foreground leading-relaxed font-medium">
            {speech}
          </p>
          <p
            className="text-xs text-primary font-black mt-3 tracking-widest uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Betinha · Gente &amp; Cultura
          </p>
        </div>
      </motion.div>
    </div>
  );
}
