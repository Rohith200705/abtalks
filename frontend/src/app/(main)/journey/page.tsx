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
  AlertCircle,
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { cn, getDifficultyBg } from "@/lib/utils";
import { progressApi, challengesApi } from "@/lib/api";
import type { Progress, Challenge } from "@/types";

function FadeIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

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
      <span className={cn("text-xs sm:text-sm", status === "current" && "text-primary")}>
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

function DayDetailModal({
  day,
  challengeInfo,
  loading,
  onClose,
}: {
  day: number;
  challengeInfo: Challenge | null;
  loading: boolean;
  onClose: () => void;
}) {
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
          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-5 bg-white/5 rounded w-3/4" />
              <div className="flex gap-2">
                <div className="h-5 bg-white/5 rounded w-16" />
                <div className="h-5 bg-white/5 rounded w-20" />
              </div>
            </div>
          ) : challengeInfo ? (
            <>
              <h3 className="text-lg font-bold mb-3">{challengeInfo.title}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border", getDifficultyBg(challengeInfo.difficulty))}>
                  {challengeInfo.difficulty.charAt(0).toUpperCase() + challengeInfo.difficulty.slice(1)}
                </span>
                {challengeInfo.topics.map((t) => (
                  <span key={t} className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/5 text-muted border border-border">
                    {t}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted mb-4">Challenge details not available</p>
          )}
          <Link
            href={"/day/" + day}
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

export default function JourneyPage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedDayChallenge, setSelectedDayChallenge] = useState<Challenge | null>(null);
  const [dayLoading, setDayLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data: any = await progressApi.get();
        if (!cancelled) setProgress(data.progress ?? data);
      } catch {
        if (!cancelled) setError("Failed to load progress");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!selectedDay) {
      setSelectedDayChallenge(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setDayLoading(true);
      try {
        const data: any = await challengesApi.getByDay(selectedDay);
        if (!cancelled) setSelectedDayChallenge(data.challenge ?? data);
      } catch {
        if (!cancelled) setSelectedDayChallenge(null);
      } finally {
        if (!cancelled) setDayLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedDay]);

  const p = progress;
  const completionPercent = p ? Math.round((p.completedDays.length / 60) * 100) : 0;

  const getDayStatus = (day: number): "completed" | "current" | "future" => {
    if (!p) return "future";
    if (p.completedDays.includes(day)) return "completed";
    if (day === p.currentDay) return "current";
    return "future";
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <FadeIn>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Calendar className="w-7 h-7 text-primary" />
            Your 60-Day Journey
          </h1>
          <p className="text-muted text-sm">Track your progress through the coding challenge</p>
        </div>
      </FadeIn>

      {loading ? (
        <div className="space-y-6">
          <div className="glass-card p-5 animate-pulse">
            <div className="h-4 bg-white/5 rounded w-32 mb-3" />
            <div className="h-3 bg-white/5 rounded w-full mb-2" />
            <div className="h-4 bg-white/5 rounded w-24" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="glass-card p-4 space-y-2 animate-pulse">
                <div className="h-5 bg-white/5 rounded w-5 mx-auto" />
                <div className="h-6 bg-white/5 rounded w-12 mx-auto" />
                <div className="h-3 bg-white/5 rounded w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <FadeIn>
          <div className="glass-card p-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-400/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load progress</h3>
            <p className="text-sm text-muted">{error}</p>
          </div>
        </FadeIn>
      ) : p ? (
        <>
          {/* PROGRESS BAR */}
          <FadeIn delay={0.05}>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted font-medium">Overall Progress</span>
                <span className="text-sm font-bold text-primary">{completionPercent}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: completionPercent + "%" }}
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

          {/* STATS ROW */}
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

          {/* JOURNEY GRID */}
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

          {/* LEGEND */}
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
        </>
      ) : (
        <FadeIn>
          <div className="glass-card p-12 text-center">
            <Calendar className="w-12 h-12 text-muted/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No progress data</h3>
            <p className="text-sm text-muted">Start your first challenge to begin tracking!</p>
            <Link href="/challenges" className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline">
              Browse Challenges <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>
      )}

      {/* DAY DETAIL MODAL */}
      {selectedDay && (
        <DayDetailModal
          day={selectedDay}
          challengeInfo={selectedDayChallenge}
          loading={dayLoading}
          onClose={() => setSelectedDay(null)}
        />
      )}

      <div className="h-8 md:h-0" />
    </div>
  );
}
