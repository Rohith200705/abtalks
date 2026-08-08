"use client";

import { useState, useEffect, useRef } from "react";
import {
  Trophy,
  Flame,
  Zap,
  CheckCircle2,
  Medal,
  Crown,
  TrendingUp,
  Search,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { leaderboardApi } from "@/lib/api";
import type { LeaderboardEntry } from "@/types";

/* ------------------------------------------------------------------ */
/*  Mock data (10 users)                                               */
/* ------------------------------------------------------------------ */
const mockLeaderboard: LeaderboardEntry[] = [
  { userId: "u10", name: "Priya", username: "priya", xp: 4200, streak: 25, totalSolved: 28, rank: 1 },
  { userId: "u11", name: "Arjun", username: "arjun", xp: 3800, streak: 20, totalSolved: 24, rank: 2 },
  { userId: "u12", name: "Sneha", username: "sneha", xp: 3500, streak: 18, totalSolved: 22, rank: 3 },
  { userId: "u13", name: "Vikram", username: "vikram", xp: 3200, streak: 15, totalSolved: 20, rank: 4 },
  { userId: "u1", name: "Rohith", username: "rohith", xp: 2840, streak: 11, totalSolved: 11, rank: 5 },
  { userId: "u14", name: "Ananya", username: "ananya", xp: 2600, streak: 14, totalSolved: 16, rank: 6 },
  { userId: "u15", name: "Karthik", username: "karthik", xp: 2400, streak: 12, totalSolved: 15, rank: 7 },
  { userId: "u16", name: "Divya", username: "divya", xp: 2100, streak: 10, totalSolved: 13, rank: 8 },
  { userId: "u17", name: "Rahul", username: "rahul", xp: 1800, streak: 8, totalSolved: 10, rank: 9 },
  { userId: "u18", name: "Meera", username: "meera", xp: 1500, streak: 7, totalSolved: 8, rank: 10 },
];

const CURRENT_USER = "rohith";

/* ------------------------------------------------------------------ */
/*  Medal icon                                                         */
/* ------------------------------------------------------------------ */
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-lg" role="img" aria-label="Gold medal">{'\uD83E\uDD47'}</span>;
  if (rank === 2) return <span className="text-lg" role="img" aria-label="Silver medal">{'\uD83E\uDD48'}</span>;
  if (rank === 3) return <span className="text-lg" role="img" aria-label="Bronze medal">{'\uD83E\uDD49'}</span>;
  return (
    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold text-muted border border-border">
      {rank}
    </div>
  );
}

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
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data: any = await leaderboardApi.get();
        const list = Array.isArray(data) ? data : data.leaderboard ?? [];
        if (!cancelled) setLeaderboard(list.length > 0 ? list : mockLeaderboard);
      } catch {
        if (!cancelled) setLeaderboard(mockLeaderboard);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = leaderboard.filter(
    (e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.username.toLowerCase().includes(search.toLowerCase())
  );

  const currentUser = leaderboard.find((e) => e.username === CURRENT_USER) ?? mockLeaderboard.find((e) => e.username === CURRENT_USER)!;

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      {/* ============================================================ */}
      {/*  HEADER                                                       */}
      {/* ============================================================ */}
      <FadeIn>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Trophy className="w-7 h-7 text-yellow-400" />
            Leaderboard
          </h1>
          <p className="text-muted text-sm">See how you rank among fellow coders</p>
        </div>
      </FadeIn>

      {/* ============================================================ */}
      {/*  CURRENT USER CARD                                            */}
      {/* ============================================================ */}
      <FadeIn delay={0.05}>
        <div className="glass-card glow-blue p-6 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 relative">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl font-bold shrink-0">
              R
            </div>
            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold">{currentUser.name}</h2>
                <span className="text-xs bg-primary/20 text-primary border border-primary/30 rounded-full px-2 py-0.5 font-medium">You</span>
              </div>
              <p className="text-sm text-muted">@{currentUser.username}</p>
            </div>
            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">#{currentUser.rank}</p>
                <p className="text-xs text-muted">Rank</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">{currentUser.xp.toLocaleString()}</p>
                <p className="text-xs text-muted">XP</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-400">{currentUser.streak}</p>
                <p className="text-xs text-muted">Streak</p>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ============================================================ */}
      {/*  SEARCH                                                       */}
      {/* ============================================================ */}
      <FadeIn delay={0.08}>
        <div className="glass-card p-1 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5">
            <Search className="w-4 h-4 text-muted shrink-0" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder:text-muted/60 outline-none"
            />
          </div>
        </div>
      </FadeIn>

      {/* ============================================================ */}
      {/*  TOP 3 PODIUM                                                */}
      {/* ============================================================ */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((rank) => {
            const entry = filtered.find((e) => e.rank === rank);
            if (!entry) return <div key={rank} className="glass-card p-4 text-center opacity-30">—</div>;
            const isCurrentUser = entry.username === CURRENT_USER;
            const heights = ["min-h-[160px]", "min-h-[140px]", "min-h-[120px]"];
            return (
              <motion.div
                key={rank}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * rank, duration: 0.4 }}
                className={cn(
                  "glass-card p-4 flex flex-col items-center text-center gap-2 relative",
                  heights[rank - 1],
                  isCurrentUser && "glow-blue border-primary/30",
                  rank === 1 && "border-yellow-500/20"
                )}
              >
                {rank === 1 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Crown className="w-6 h-6 text-yellow-400" />
                  </div>
                )}
                <div className="mt-2">
                  <RankBadge rank={rank} />
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-sm font-bold">
                  {entry.name.charAt(0)}
                </div>
                <p className={cn("text-sm font-bold", isCurrentUser && "text-primary")}>
                  {entry.name}
                  {isCurrentUser && <span className="text-xs text-muted ml-1">(You)</span>}
                </p>
                <div className="flex items-center gap-1 text-xs text-yellow-400 font-medium">
                  <Zap className="w-3 h-3" />
                  {entry.xp.toLocaleString()} XP
                </div>
              </motion.div>
            );
          })}
        </div>
      </FadeIn>

      {/* ============================================================ */}
      {/*  FULL LEADERBOARD                                             */}
      {/* ============================================================ */}
      <FadeIn delay={0.15}>
        <div className="glass-card overflow-hidden">
          {/* Desktop table header */}
          <div className="hidden md:grid grid-cols-[60px_1fr_120px_120px_120px] gap-4 px-6 py-3 border-b border-border text-xs text-muted font-medium uppercase tracking-wider">
            <span>Rank</span>
            <span>Name</span>
            <span className="text-center">XP</span>
            <span className="text-center">Streak</span>
            <span className="text-center">Solved</span>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-8 h-8 bg-white/5 rounded-full" />
                  <div className="flex-1 h-5 bg-white/5 rounded" />
                  <div className="w-16 h-5 bg-white/5 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div>
              {filtered.map((entry, i) => {
                const isCurrentUser = entry.username === CURRENT_USER;
                return (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={cn(
                      "px-4 md:px-6 py-4 border-b border-border last:border-0 transition-all",
                      isCurrentUser ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-white/5"
                    )}
                  >
                    {/* Desktop layout */}
                    <div className="hidden md:grid grid-cols-[60px_1fr_120px_120px_120px] gap-4 items-center">
                      <div className="flex items-center justify-center">
                        <RankBadge rank={entry.rank} />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                          isCurrentUser ? "bg-gradient-to-br from-primary to-secondary" : "bg-white/10"
                        )}>
                          {entry.name.charAt(0)}
                        </div>
                        <div>
                          <p className={cn("text-sm font-semibold", isCurrentUser && "text-primary")}>
                            {entry.name}
                            {isCurrentUser && <span className="text-xs text-muted ml-1.5">(You)</span>}
                          </p>
                          <p className="text-xs text-muted">@{entry.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-sm font-medium text-yellow-400">
                        <Zap className="w-3.5 h-3.5" />
                        {entry.xp.toLocaleString()}
                      </div>
                      <div className="flex items-center justify-center gap-1 text-sm text-orange-400">
                        <Flame className="w-3.5 h-3.5" />
                        {entry.streak}
                      </div>
                      <div className="flex items-center justify-center gap-1 text-sm text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {entry.totalSolved}
                      </div>
                    </div>

                    {/* Mobile card layout */}
                    <div className="md:hidden flex items-center gap-3">
                      <div className="shrink-0">
                        <RankBadge rank={entry.rank} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-semibold truncate", isCurrentUser && "text-primary")}>
                          {entry.name}
                          {isCurrentUser && <span className="text-xs text-muted ml-1">(You)</span>}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-yellow-400">
                            <Zap className="w-3 h-3" />
                            {entry.xp.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-orange-400">
                            <Flame className="w-3 h-3" />
                            {entry.streak}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            {entry.totalSolved}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </FadeIn>

      {/* Bottom spacer for mobile nav */}
      <div className="h-8 md:h-0" />
    </div>
  );
}
