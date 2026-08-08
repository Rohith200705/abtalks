"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Trophy,
  Flame,
  GitBranch,
  Share2,
  ChevronRight,
  Star,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    xpEarned: number;
    newStreak: number;
    githubStatus: string;
    linkedinStatus: string;
    achievements: { title: string; description: string; xp: number }[];
  } | null;
  day?: number;
  challengeTitle?: string;
}

/* ───────────── Confetti Particle ───────────── */

function ConfettiParticle({ delay }: { delay: number }) {
  const colors = [
    "bg-primary",
    "bg-amber-400",
    "bg-emerald-400",
    "bg-blue-400",
    "bg-purple-400",
    "bg-pink-400",
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const x = Math.random() * 200 - 100;
  const rotation = Math.random() * 360;

  return (
    <motion.div
      initial={{ opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 }}
      animate={{
        opacity: 0,
        y: -150 - Math.random() * 100,
        x: x,
        rotate: rotation,
        scale: 0.5,
      }}
      transition={{
        duration: 1.5 + Math.random() * 1,
        delay: delay,
        ease: "easeOut",
      }}
      className={cn("absolute w-2 h-2 rounded-full", color)}
      style={{
        left: `${40 + Math.random() * 20}%`,
        top: "50%",
      }}
    />
  );
}

/* ───────────── Completion Modal ───────────── */

export function CompletionModal({
  isOpen,
  onClose,
  result,
  day = 12,
  challengeTitle = "Two Sum",
}: CompletionModalProps) {
  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!result) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Confetti */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <ConfettiParticle key={i} delay={i * 0.03} />
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="relative p-8 text-center">
              {/* Trophy */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 border-2 border-amber-400/30 flex items-center justify-center mx-auto mb-4"
              >
                <Trophy className="w-10 h-10 text-amber-400" />
              </motion.div>

              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-1">
                  Day {day} Complete!
                </h2>
                <p className="text-sm text-white/50 mb-6">
                  SOLVED: {challengeTitle}
                </p>
              </motion.div>

              {/* XP Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6"
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-2xl font-bold text-amber-400">
                  +{result.xpEarned} XP
                </span>
              </motion.div>

              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 gap-3 mb-6"
              >
                {/* Streak */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">
                    {result.newStreak}
                  </div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider">
                    Day Streak
                  </div>
                </div>

                {/* GitHub */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <GitBranch className="w-5 h-5 text-white/60 mx-auto mb-1" />
                  <div className="text-sm font-semibold">
                    {result.githubStatus === "connected" ? (
                      <span className="text-emerald-400 flex items-center justify-center gap-1">
                        GitHub
                        <Badge variant="success" className="text-[10px]">
                          Connected
                        </Badge>
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center justify-center gap-1">
                        GitHub
                        <Badge variant="warning" className="text-[10px]">
                          Retry
                        </Badge>
                      </span>
                    )}
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-4 col-span-2">
                  <Share2 className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-sm font-semibold text-blue-400 flex items-center justify-center gap-1">
                    Demo Published
                    <Badge variant="success" className="text-[10px]">
                      LinkedIn
                    </Badge>
                  </div>
                </div>
              </motion.div>

              {/* Achievements */}
              {result.achievements && result.achievements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-6"
                >
                  <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
                    <Award className="w-3 h-3" />
                    Achievements Unlocked
                  </div>
                  <div className="space-y-2">
                    {result.achievements.map((ach, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + idx * 0.1 }}
                        className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <Star className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white">
                            {ach.title}
                          </div>
                          <div className="text-xs text-white/40">
                            {ach.description}
                          </div>
                        </div>
                        <div className="text-xs text-amber-400 font-semibold">
                          +{ach.xp} XP
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-3"
              >
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={onClose}
                >
                  Continue to Next Day
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <button
                  onClick={onClose}
                  className="text-xs text-white/30 hover:text-white/60 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}