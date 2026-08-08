"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Flame,
  Zap,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Calendar,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { cn, getDifficultyBg } from "@/lib/utils";
import { progressApi, challengesApi } from "@/lib/api";
import type { Progress, Challenge } from "@/types";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */
const mockProgress: Progress = {
  _id: "p1",
  userId: "u1",
  currentDay: 12,
  completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  streak: 11,
  longestStreak: 11,
  xp: 2840,
  rank: 5,
  selectedTrack: "default",
  totalSolved: 11,
  easySolved: 8,
  mediumSolved: 3,
  hardSolved: 0,
  lastActivityAt: new Date().toISOString(),
};

const mockChallengeMap: Record<number, { title: string; difficulty: string; topics: string[] }> = {
  1: { title: "Two Sum", difficulty: "easy", topics: ["Arrays", "Hash Map"] },
  2: { title: "Valid Parentheses", difficulty: "easy", topics: ["Stack", "String"] },
  3: { title: "Merge Two Sorted Lists", difficulty: "easy", topics: ["Linked List", "Recursion"] },
  4: { title: "Best Time to Buy and Sell Stock", difficulty: "easy", topics: ["Arrays", "DP"] },
  5: { title: "Maximum Subarray", difficulty: "medium", topics: ["Array", "DP"] },
  6: { title: "Reverse Linked List", difficulty: "easy", topics: ["Linked List", "Recursion"] },
  7: { title: "Contains Duplicate", difficulty: "easy", topics: ["Array", "Hash Set"] },
  8: { title: "Valid Anagram", difficulty: "easy", topics: ["String", "Hash Map"] },
  9: { title: "Binary Search", difficulty: "easy", topics: ["Array", "Binary Search"] },
  10: { title: "Maximum Depth of Binary Tree", difficulty: "easy", topics: ["Tree", "DFS", "BFS"] },
  11: { title: "Minimum Depth of Binary Tree", difficulty: "easy", topics: ["Tree", "DFS", "BFS"] },
  12: { title: "Two Sum (Revisited)", difficulty: "easy", topics: ["Arrays", "Hash Map"] },
  13: { title: "Longest Substring Without Repeating Characters", difficulty: "medium", topics: ["Sliding Window", "Hash Map"] },
  14: { title: "Climbing Stairs", difficulty: "medium", topics: ["DP", "Math"] },
  15: { title: "LRU Cache", difficulty: "hard", topics: ["Hash Map", "Linked List", "Design"] },
  16: { title: "Merge Intervals", difficulty: "medium", topics: ["Array", "Sorting"] },
  17: { title: "Word Search", difficulty: "medium", topics: ["Backtracking", "Matrix"] },
  18: { title: "Find Median from Data Stream", difficulty: "hard", topics: ["Heap", "Design"] },
  19: { title: "Serialize and Deserialize BST", difficulty: "hard", topics: ["Tree", "DFS"] },
  20: { title: "Course Schedule", difficulty: "medium", topics: ["Graph", "Topological Sort"] },
};

/* ------------------------------------------------------------------ */
/*  Animation wrapper                                                  */
/* ------------------------------------------------------------------ */
function FadeIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Day Tile                                                           */
/* ------------------------------------------------------------------ */
function DayTile({
  day,
  status,
  onClick,
}: {
  day: number;
  status: "completed" | "current" | "future";
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-bold transition-all duration-300 cursor-pointer border",
        status === "completed" && "bg-emerald-500/15 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/25",
        status === "current" && "bg-primary/20 text-primary border-primary/40 glow-blue animate-pulse",
        status === "future" && "glass-card text-muted/60 hover:text-muted border-border hover:border-white/15"
      )}
    >
      {status === "completed" && (
        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 mb-0.5" />
      )}
      <span className={cn(
        "text-xs sm:text-sm",
        status === "current" && "text-primary"
      )}>
        {day}
      </span>
      {status === "current" && (
        <span className="absolute -bottom-1 -right-1 text-[8px] font-bold bg-primary text-white rounded-full px-1.5 py-0.5 leading-none">
          NOW
        </span>
      )}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Day Detail Modal                                                   */
/* ------------------------------------------------------------------ */
function DayDetailModal({
  day,
  info,
  onClose,
}: {
  day: number;
  info: { title: string; difficulty: string; topics: string[] } | null;
  onClose: () => void;
}) {
  if (!info) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="glass-card glow-blue p-6 max-w-sm w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
              Day {day}
            </span>
            <button onClick={onClose} className="text-muted hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <h3 className="text-lg font-bold mb-3">{info.title}</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border", getDifficultyBg(info.difficulty))}>
              {info.difficulty.charAt(0).toUpperCase() + info.difficulty.slice(1)}
            </span>
            {info.topics.map((t) => (
              <span key={t} className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/5 text-muted border border-border">
                {t}
              </span>
            ))}
          </div>
          <Link
            href={`/day/${day}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold btn-gradient text-white"
            onClick={onClose}
          >
            Start Challenge
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function JourneyPage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data: any = await progressApi.get();
        if (!cancelled) setProgress(data.progress ?? data);
      } catch {
        if (!cancelled) setProgress(mockProgress);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const p = progress ?? mockProgress;
  const completionPercent = Math.round((p.completedDays.length / 60) * 100);

  const getDayStatus = (day: number): "completed" | "current" | "future" => {
    if (p.completedDays.includes(day)) return "completed";
    if (day === p.currentDay) return "current";
    return "future";
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* ============================================================ */}
      {/*  HEADER                                                       */}
      {/* ============================================================ */}
      <FadeIn>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Calendar className="w-7 h-7 text-primary" />
            Your 60-Day Journey
          </h1>
          <p className="text-muted text-sm">Track your progress through the coding challenge</p>
        </div>
      </FadeIn>

      {/* ============================================================ */}
      {/*  PROGRESS BAR                                                 */}
      {/* ============================================================ */}
      <FadeIn delay={0.05}>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted font-medium">Overall Progress</span>
            <span className="text-sm font-bold text-primary">{completionPercent}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted">Day {p.currentDay} of 60</span>
            <span className="text-xs text-muted">{p.completedDays.length} completed</span>
          </div>
        </div>
      </FadeIn>

      {/* ============================================================ */}
      {/*  STATS ROW                                                    */}
      {/* ============================================================ */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="glass-card p-4 flex flex-col items-center text-center gap-1">
            <Flame className="w-5 h-5 text-orange-400 mb-1" />
            <span className="text-xl font-bold">{p.streak}</span>
            <span className="text-xs text-muted">Current Streak</span>
          </div>
          <div className="glass-card p-4 flex flex-col items-center text-center gap-1">
            <TrendingUp className="w-5 h-5 text-blue-400 mb-1" />
            <span className="text-xl font-bold">{p.longestStreak}</span>
            <span className="text-xs text-muted">Longest Streak</span>
          </div>
          <div className="glass-card p-4 flex flex-col items-center text-center gap-1">
            <Zap className="w-5 h-5 text-yellow-400 mb-1" />
            <span className="text-xl font-bold">{p.xp.toLocaleString()}</span>
            <span className="text-xs text-muted">XP Earned</span>
          </div>
          <div className="glass-card p-4 flex flex-col items-center text-center gap-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-xl font-bold">{p.totalSolved}</span>
            <span className="text-xs text-muted">Challenges Solved</span>
          </div>
          <div className="glass-card p-4 flex flex-col items-center text-center gap-1 col-span-2 sm:col-span-3 lg:col-span-1">
            <Sparkles className="w-5 h-5 text-purple-400 mb-1" />
            <span className="text-xl font-bold">{completionPercent}%</span>
            <span className="text-xs text-muted">Completion</span>
          </div>
        </div>
      </FadeIn>

      {/* ============================================================ */}
      {/*  JOURNEY GRID                                                 */}
      {/* ============================================================ */}
      <FadeIn delay={0.15}>
        <div className="glass-card p-5">
          <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            Day-by-Day Journey
          </h3>
          <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2">
            {Array.from({ length: 60 }, (_, i) => i + 1).map((day) => (
              <DayTile
                key={day}
                day={day}
                status={getDayStatus(day)}
                onClick={() => setSelectedDay(day)}
              />
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ============================================================ */}
      {/*  LEGEND                                                       */}
      {/* ============================================================ */}
      <FadeIn delay={0.2}>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/30" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-primary/20 border border-primary/30" />
            <span>Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-white/5 border border-border" />
            <span>Upcoming</span>
          </div>
        </div>
      </FadeIn>

      {/* ============================================================ */}
      {/*  DAY DETAIL MODAL                                             */}
      {/* ============================================================ */}
      {selectedDay && (
        <DayDetailModal
          day={selectedDay}
          info={mockChallengeMap[selectedDay] ?? { title: `Day ${selectedDay} Challenge`, difficulty: "medium", topics: ["General"] }}
          onClose={() => setSelectedDay(null)}
        />
      )}

      {/* Bottom spacer for mobile nav */}
      <div className="h-8 md:h-0" />
    </div>
  );
}
