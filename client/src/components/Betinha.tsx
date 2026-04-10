import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";

const BETINHA_AVATAR = "https://d2xsxph8kpxj0f.cloudfront.net/310519663204027059/NbLekrCupyKcetotbNsyPG/betinha-avatar_0d442e08.jpg";

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
  autoPlay = false,
  size = "md",
  position = "left",
  showBubble = true,
  className = "",
}: BetinhaProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ttsMutation = trpc.tts.synthesize.useMutation();

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

  // Auto-play TTS
  useEffect(() => {
    if (autoPlay && speech && !isMuted) {
      handlePlayTTS();
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [speech, autoPlay]);

  const handlePlayTTS = async () => {
    if (isPlaying || isMuted) return;
    try {
      setIsPlaying(true);
      const result = await ttsMutation.mutateAsync({ text: speech.slice(0, 500) });
      if (result.audioUrl) {
        const audio = new Audio(result.audioUrl);
        audioRef.current = audio;
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        await audio.play();
      } else {
        setIsPlaying(false);
      }
    } catch {
      setIsPlaying(false);
    }
  };

  const handleToggleMute = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }
    setIsMuted(!isMuted);
  };

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
        {/* Speaking indicator */}
        {isPlaying && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-ping" />
        )}
        {/* Audio control */}
        <button
          onClick={isPlaying ? handleToggleMute : handlePlayTTS}
          className="absolute -bottom-1 -right-1 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
          title={isPlaying ? "Pausar" : isMuted ? "Ativar som" : "Ouvir Betinha"}
        >
          {ttsMutation.isPending ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : isMuted ? (
            <VolumeX className="w-3 h-3" />
          ) : (
            <Volume2 className="w-3 h-3" />
          )}
        </button>
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
      autoPlay={false}
      className={className}
    />
  );
}
