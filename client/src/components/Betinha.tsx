import { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BETINHA_AVATAR = "https://d2xsxph8kpxj0f.cloudfront.net/310519663204027059/NbLekrCupyKcetotbNsyPG/betinha-avatar_0d442e08.jpg";

// Web Speech API TTS helper — works natively in the browser, no API key needed
function speakText(text: string, onEnd?: () => void, onError?: () => void): SpeechSynthesisUtterance | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  utterance.volume = 1;

  // Try to find a Portuguese voice
  const voices = window.speechSynthesis.getVoices();
  const ptVoice = voices.find(
    (v) =>
      v.lang.startsWith("pt") &&
      (v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("feminino") ||
        v.name.toLowerCase().includes("francisca") ||
        v.name.toLowerCase().includes("luciana") ||
        v.name.toLowerCase().includes("vitoria") ||
        v.name.toLowerCase().includes("google"))
  ) || voices.find((v) => v.lang.startsWith("pt"));

  if (ptVoice) utterance.voice = ptVoice;

  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;

  window.speechSynthesis.speak(utterance);
  return utterance;
}

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
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const sizeMap = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  // Load voices (some browsers load them asynchronously)
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis?.getVoices() ?? [];
      if (voices.length > 0) setVoicesLoaded(true);
    };
    loadVoices();
    window.speechSynthesis?.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", loadVoices);
  }, []);

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

  const stopSpeech = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, []);

  const handlePlayTTS = useCallback(() => {
    if (isMuted || !speech) return;
    if (isPlaying) {
      stopSpeech();
      return;
    }
    setIsPlaying(true);
    const utt = speakText(
      speech.slice(0, 600),
      () => setIsPlaying(false),
      () => setIsPlaying(false)
    );
    utteranceRef.current = utt;
  }, [speech, isMuted, isPlaying, stopSpeech]);

  // Auto-play TTS when speech changes
  useEffect(() => {
    if (!autoPlay || !speech || isMuted) return;
    // Small delay to let the typewriter start first
    const timer = setTimeout(() => {
      setIsPlaying(true);
      const utt = speakText(
        speech.slice(0, 600),
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
      utteranceRef.current = utt;
    }, 400);

    return () => {
      clearTimeout(timer);
      stopSpeech();
    };
  }, [speech, autoPlay, isMuted, stopSpeech]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopSpeech();
  }, [stopSpeech]);

  const handleToggleMute = () => {
    if (isPlaying) {
      stopSpeech();
    }
    setIsMuted((prev) => !prev);
  };

  const handleAudioButton = () => {
    if (isMuted) {
      // Unmute and start playing
      setIsMuted(false);
      setIsPlaying(true);
      const utt = speakText(
        speech.slice(0, 600),
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
      utteranceRef.current = utt;
    } else if (isPlaying) {
      // Stop playing
      stopSpeech();
    } else {
      // Start playing
      handlePlayTTS();
    }
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
          onClick={handleAudioButton}
          className="absolute -bottom-1 -right-1 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
          title={isPlaying ? "Pausar narração" : isMuted ? "Ativar som" : "Ouvir Betinha"}
          aria-label={isPlaying ? "Pausar narração" : isMuted ? "Ativar som" : "Ouvir Betinha"}
        >
          {isMuted ? (
            <VolumeX className="w-3 h-3" />
          ) : isPlaying ? (
            <Loader2 className="w-3 h-3 animate-spin" />
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
