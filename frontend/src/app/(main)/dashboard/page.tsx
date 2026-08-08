"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Flame,
  Zap,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Code,
  Calendar,
  GitBranch,
  ChevronRight,
  Star,
  Medal,
  Award,
  Sparkles,
  Target,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { getGreeting, getDifficultyBg } from "@/lib/utils";
import { progressApi, challengesApi, leaderboardApi, achievementsApi, githubApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Progress, Challenge, LeaderboardEntry, Achievement, GitHubStatus } from "@/types";

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="glass-card p-5 flex flex-col gap-3">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted mt-0.5">{label}</p>
      </div>
    </div>
  );
}

const achievementIcons: Record<string, React.ReactNode> = {
  first_steps: <Star className="w-5 h-5 text-yellow-400" />,
  week_warrior: <Medal className="w-5 h-5 text-blue-400" />,
  streak_master: <Flame className="w-5 h-5 text-orange-400" />,
  double_digits: <Sparkles className="w-5 h-5 text-purple-400" />,
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [todayChallenge, setTodayChallenge] = useState<Challenge | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [githubStatus, setGithubStatus] = useState<GitHubStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [progressRes, challengeRes, leaderboardRes, achievementsRes, githubRes] = await Promise.allSettled([
          progressApi.get(),
          progressApi.get().then((p: any) => {
            const prog = p.progress ?? p;
            return challengesApi.getByDay(prog.currentDay);
          }),
          leaderboardApi.get(),
          achievementsApi.getAll(),
          githubApi.getStatus(),
        ]);

        if (cancelled) return;

        const prog = progressRes.status === "fulfilled"
          ? ((progressRes.value as any).progress ?? (progressRes.value as Progress))
          : null;
        setProgress(prog);

        setTodayChallenge(
          challengeRes.status === "fulfilled"
            ? ((challengeRes.value as any).challenge ?? (challengeRes.value as Challenge))
            : null
        );

        const lbData = leaderboardRes.status === "fulfilled"
          ? ((leaderboardRes.value as any).leaderboard ?? (leaderboardRes.value as LeaderboardEntry[]))
          : [];
        setLeaderboard(
          Array.isArray(lbData)
            ? lbData.map((e: any) => ({
                userId: e.userId?._id || e.userId,
                name: e.userId?.name || e.name || "Unknown",
                username: e.userId?.username || e.username || "",
                xp: e.xp ?? 0,
                streak: e.streak ?? 0,
                totalSolved: e.totalSolved ?? 0,
                rank: e.rank ?? 0,
              }))
            : []
        );

        setAchievements(
          achievementsRes.status === "fulfilled"
            ? ((achievementsRes.value as any).achievements ?? (achievementsRes.value as Achievement[]))
            : []
        );

        setGithubStatus(
          githubRes.status === "fulfilled"
            ? ((githubRes.value as any).status ?? (githubRes.value as GitHubStatus))
            : null
        );
      } catch {
        if (!cancelled) setError("Failed to load dashboard data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (authLoading || (!user && !error)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-white/40 text-sm">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const p = progress;
  const challenge = todayChallenge;
  const lb = leaderboard;
  const ach = achievements;

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {getGreeting()}, {user.name}
            </h1>
            {p && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-amber-400">
                    {p.streak} Day Streak
                  </span>
                </div>
              </div>
            )}
          </div>
          {p && (
            <div className="text-sm text-muted">
              Day {p.currentDay} of 60
            </div>
          )}
        </div>
      </FadeIn>

      {loading ? (
        /* Loading skeleton */
        <div className="space-y-6">
          <div className="glass-card p-6 sm:p-8 animate-pulse">
            <div className="h-4 bg-white/5 rounded w-32 mb-3" />
            <div className="h-7 bg-white/5 rounded w-64 mb-3" />
            <div className="h-4 bg-white/5 rounded w-48" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-5 space-y-3 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-white/5" />
                <div className="h-6 bg-white/5 rounded w-16" />
                <div className="h-4 bg-white/5 rounded w-20" />
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <FadeIn>
          <div className="glass-card p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-amber-400/60 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
            <p className="text-sm text-muted">{error}</p>
          </div>
        </FadeIn>
      ) : (
        <>
          {/* TODAY'S CHALLENGE */}
          {challenge ? (
            <FadeIn delay={0.05}>
              <div className="glass-card p-6 sm:p-8 glow-blue relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
                  <div className="space-y-3">
                    <p className="text-sm text-primary font-semibold uppercase tracking-wide">
                      Today&apos;s Challenge
                    </p>
                    <h2 className="text-xl sm:text-2xl font-bold">
                      {challenge.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
                          getDifficultyBg(challenge.difficulty)
                        )}
                      >
                        {challenge.difficulty.charAt(0).toUpperCase() +
                          challenge.difficulty.slice(1)}
                      </span>
                      {challenge.topics.map((topic) => (
                        <span
                          key={topic}
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-white/5 text-muted border border-border"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href={"/day/" + challenge.day}
                    className="btn-gradient text-white font-semibold px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2 shadow-lg shadow-primary/25 transition-all hover:scale-105 shrink-0"
                  >
                    Continue Challenge
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </FadeIn>
          ) : p ? (
            <FadeIn delay={0.05}>
              <div className="glass-card p-6 sm:p-8 text-center">
                <p className="text-muted">No challenge available for today.</p>
                <Link
                  href="/challenges"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  Browse all challenges
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>
          ) : null}

          {/* STATS GRID */}
          {p && (
            <FadeIn delay={0.12}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={<Zap className="w-5 h-5 text-yellow-400" />}
                  label="Total XP"
                  value={p.xp.toLocaleString()}
                  color="bg-yellow-500/10"
                />
                <StatCard
                  icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  label="Solved"
                  value={p.totalSolved + " challenges"}
                  color="bg-emerald-500/10"
                />
                <StatCard
                  icon={<Trophy className="w-5 h-5 text-blue-400" />}
                  label="Rank"
                  value={"#" + p.rank}
                  color="bg-blue-500/10"
                />
                <StatCard
                  icon={<Flame className="w-5 h-5 text-orange-400" />}
                  label="Streak"
                  value={p.streak + " days"}
                  color="bg-orange-500/10"
                />
              </div>
            </FadeIn>
          )}

          {/* GITHUB + ACHIEVEMENTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GitHub Status */}
            <FadeIn delay={0.14}>
              <div className="glass-card p-6 h-full">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <GitBranch className="w-5 h-5" />
                  GitHub Status
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <GitBranch className="w-5 h-5 text-muted" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted">GitHub Integration</p>
                      <p className="text-xs text-muted/60">
                        Connect GitHub to auto-commit solutions
                      </p>
                    </div>
                  </div>
                  {githubStatus?.connected ? (
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      GitHub Connected
                      {githubStatus.repositoryUrl && (
                        <Link
                          href={githubStatus.repositoryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline ml-1"
                        >
                          View Repo
                        </Link>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted">Not connected yet</p>
                  )}
                </div>
              </div>
            </FadeIn>

            {/* Recent Achievements */}
            <FadeIn delay={0.16}>
              <div className="glass-card p-6 h-full">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </h3>
                {ach.length === 0 ? (
                  <div className="text-center py-6">
                    <Award className="w-8 h-8 text-muted/30 mx-auto mb-2" />
                    <p className="text-sm text-muted">No achievements yet</p>
                    <p className="text-xs text-muted/60">Complete challenges to earn XP!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ach.slice(0, 4).map((a) => (
                      <div
                        key={a._id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                          {achievementIcons[a.type] ?? (
                            <Trophy className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold truncate">{a.title}</p>
                          <p className="text-xs text-muted truncate">{a.description}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-amber-400 font-medium shrink-0">
                          <Zap className="w-3 h-3" />
                          +{a.xp}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FadeIn>
          </div>

          {/* LEADERBOARD PREVIEW */}
          {lb.length > 0 && (
            <FadeIn delay={0.2}>
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Leaderboard
                  </h3>
                  <Link
                    href="/leaderboard"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    View Full Leaderboard
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="space-y-2">
                  {lb.slice(0, 5).map((entry) => {
                    const isCurrentUser = user && entry.username === user.username;
                    return (
                      <div
                        key={entry.userId}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 rounded-xl transition-all",
                          isCurrentUser
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-white/5"
                        )}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                            entry.rank === 1 && "bg-yellow-500/20 text-yellow-400",
                            entry.rank === 2 && "bg-gray-400/20 text-gray-300",
                            entry.rank === 3 && "bg-amber-600/20 text-amber-500",
                            entry.rank > 3 && "bg-white/5 text-muted"
                          )}
                        >
                          {entry.rank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm font-medium truncate", isCurrentUser && "text-primary")}>
                            {entry.name}
                            {isCurrentUser && (
                              <span className="text-xs text-muted ml-1.5">(You)</span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-medium text-yellow-400 shrink-0">
                          <Zap className="w-3.5 h-3.5" />
                          {entry.xp.toLocaleString()}
                        </div>
                        <div className="hidden sm:flex items-center gap-1 text-sm text-muted shrink-0">
                          <Flame className="w-3.5 h-3.5" />
                          {entry.streak}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          )}
        </>
      )}

      <div className="h-8 md:h-0" />
    </div>
  );
}
