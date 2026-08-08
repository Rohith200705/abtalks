"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { getGreeting, getDifficultyBg } from "@/lib/utils";
import { progressApi, userApi, challengesApi, leaderboardApi, achievementsApi, githubApi } from "@/lib/api";
import type { Progress, Challenge, LeaderboardEntry, Achievement, GitHubStatus } from "@/types";

/* ------------------------------------------------------------------ */
/*  Mock data (fallback when API is unavailable)                       */
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

const mockUser = { name: "Rohith", username: "rohith", email: "", avatar: "", bio: "", college: "", graduationYear: 0, _id: "u1" };

const mockTodayChallenge: Challenge = {
  _id: "1",
  title: "Two Sum",
  difficulty: "easy",
  topics: ["Arrays", "Hash Map"],
  day: 12,
  slug: "two-sum",
  description: "",
  examples: [],
  constraints: [],
  starterCode: { python: "", javascript: "", cpp: "" },
  testCases: [],
  solvedPercentage: 72,
  order: 12,
};

const mockLeaderboard: LeaderboardEntry[] = [
  { userId: "u2", name: "Arjun", username: "arjun", xp: 4200, streak: 15, totalSolved: 15, rank: 1 },
  { userId: "u3", name: "Priya", username: "priya", xp: 3850, streak: 14, totalSolved: 14, rank: 2 },
  { userId: "u4", name: "Vikram", username: "vikram", xp: 3400, streak: 13, totalSolved: 13, rank: 3 },
  { userId: "u5", name: "Sneha", username: "sneha", xp: 3100, streak: 12, totalSolved: 12, rank: 4 },
  { userId: "u1", name: "Rohith", username: "rohith", xp: 2840, streak: 11, totalSolved: 11, rank: 5 },
];

const mockAchievements: Achievement[] = [
  { _id: "a1", userId: "u1", type: "first_steps", title: "First Steps", description: "Solved your first challenge", day: 1, xp: 50, imageUrl: "", unlockedAt: new Date(Date.now() - 11 * 86400000).toISOString() },
  { _id: "a2", userId: "u1", type: "week_warrior", title: "Week Warrior", description: "Maintained a 7-day streak", day: 7, xp: 200, imageUrl: "", unlockedAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  { _id: "a3", userId: "u1", type: "streak_master", title: "Streak Master", description: "10+ day streak", day: 10, xp: 300, imageUrl: "", unlockedAt: new Date(Date.now() - 1 * 86400000).toISOString() },
  { _id: "a4", userId: "u1", type: "double_digits", title: "Double Digits", description: "Solved 10 challenges", day: 10, xp: 250, imageUrl: "", unlockedAt: new Date(Date.now() - 1 * 86400000).toISOString() },
];

const mockRecentActivity = [
  { title: "Solved Minimum Depth of Binary Tree", day: 14, difficulty: "easy", timeAgo: "2 hours ago" },
  { title: "Solved Reverse Linked List", day: 13, difficulty: "easy", timeAgo: "1 day ago" },
  { title: "Solved Valid Parentheses", day: 12, difficulty: "easy", timeAgo: "1 day ago" },
  { title: "Solved Merge Two Sorted Lists", day: 11, difficulty: "easy", timeAgo: "2 days ago" },
  { title: "Solved Maximum Subarray", day: 10, difficulty: "medium", timeAgo: "2 days ago" },
];

const topicProgress = [
  { name: "Arrays", completed: true },
  { name: "Strings", completed: true },
  { name: "Hash Maps", completed: true },
  { name: "Linked Lists", completed: true },
  { name: "Stacks", completed: false },
  { name: "Queues", completed: false },
  { name: "Trees", completed: false },
  { name: "Graphs", completed: false },
  { name: "Sorting", completed: false },
  { name: "Searching", completed: false },
  { name: "Dynamic Programming", completed: false },
];

const achievementIcons: Record<string, React.ReactNode> = {
  first_steps: <Star className="w-5 h-5 text-yellow-400" />,
  week_warrior: <Medal className="w-5 h-5 text-blue-400" />,
  streak_master: <Flame className="w-5 h-5 text-orange-400" />,
  double_digits: <Sparkles className="w-5 h-5 text-purple-400" />,
};

/* ------------------------------------------------------------------ */
/*  Animation wrapper                                                  */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Stat Card                                                          */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function DashboardPage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [user, setUser] = useState(mockUser);
  const [todayChallenge, setTodayChallenge] = useState<Challenge | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [githubStatus, setGithubStatus] = useState<GitHubStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        const [progressRes, userRes, challengeRes, leaderboardRes, achievementsRes, githubRes] = await Promise.allSettled([
          progressApi.get(),
          userApi.getProfile(),
          challengesApi.getAll("limit=1&sort=day"),
          leaderboardApi.get(),
          achievementsApi.getAll(),
          githubApi.getStatus(),
        ]);

        setProgress(
          progressRes.status === "fulfilled" ? (progressRes.value as Progress) : mockProgress
        );
        setUser(
          userRes.status === "fulfilled" ? (userRes.value as typeof mockUser) : mockUser
        );
        setTodayChallenge(
          challengeRes.status === "fulfilled"
            ? ((challengeRes.value as Challenge[])[0] ?? mockTodayChallenge)
            : mockTodayChallenge
        );
        setLeaderboard(
          leaderboardRes.status === "fulfilled"
            ? (leaderboardRes.value as LeaderboardEntry[])
            : mockLeaderboard
        );
        setAchievements(
          achievementsRes.status === "fulfilled"
            ? (achievementsRes.value as Achievement[])
            : mockAchievements
        );
        setGithubStatus(
          githubRes.status === "fulfilled"
            ? (githubRes.value as GitHubStatus)
            : { connected: false }
        );
      } catch {
        setProgress(mockProgress);
        setTodayChallenge(mockTodayChallenge);
        setLeaderboard(mockLeaderboard);
        setAchievements(mockAchievements);
        setGithubStatus({ connected: false });
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const p = progress ?? mockProgress;
  const challenge = todayChallenge ?? mockTodayChallenge;
  const lb = leaderboard.length > 0 ? leaderboard : mockLeaderboard;
  const ach = achievements.length > 0 ? achievements : mockAchievements;

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* ============================================================ */}
      {/*  HEADER  (Greeting + Streak)                                  */}
      {/* ============================================================ */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {getGreeting()}, {user.name} ??
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-amber-400">
                  {p.streak} Day Streak
                </span>
              </div>
            </div>
          </div>
          <div className="text-sm text-muted">
            Day {p.currentDay} of 60
          </div>
        </div>
      </FadeIn>

      {/* ============================================================ */}
      {/*  TODAY'S CHALLENGE                                           */}
      {/* ============================================================ */}
      <FadeIn delay={0.05}>
        <div className="glass-card p-6 sm:p-8 glow-blue relative overflow-hidden">
          {/* Subtle background glow */}
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
              href="/day/12"
              className="btn-gradient text-white font-semibold px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2 shadow-lg shadow-primary/25 transition-all hover:scale-105 shrink-0"
            >
              Continue Challenge
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </FadeIn>

      {/* ============================================================ */}
      {/*  TOPIC PROGRESS                                              */}
      {/* ============================================================ */}
      <FadeIn delay={0.1}>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Topic Progress</h3>
          <div className="flex flex-wrap gap-2.5">
            {topicProgress.map((topic) => (
              <div
                key={topic.name}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border",
                  topic.completed
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-white/5 text-muted border-border"
                )}
              >
                {topic.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-current/30" />
                )}
                {topic.name}
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ============================================================ */}
      {/*  STATS GRID                                                  */}
      {/* ============================================================ */}
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
            value={`${p.totalSolved} challenges`}
            color="bg-emerald-500/10"
          />
          <StatCard
            icon={<Trophy className="w-5 h-5 text-blue-400" />}
            label="Rank"
            value={`#${p.rank}`}
            color="bg-blue-500/10"
          />
          <StatCard
            icon={<Flame className="w-5 h-5 text-orange-400" />}
            label="Streak"
            value={`${p.streak} days`}
            color="bg-orange-500/10"
          />
        </div>
      </FadeIn>

      {/* ============================================================ */}
      {/*  GITHUB + RECENT ACTIVITY                                    */}
      {/* ============================================================ */}
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
                  <p className="text-sm font-medium text-muted">Demo Mode</p>
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
                <button className="glass-card glass-card-hover px-4 py-2.5 rounded-xl text-sm font-medium text-white inline-flex items-center gap-2 transition-all hover:scale-[1.02]">
                  <GitBranch className="w-4 h-4" />
                  Connect GitHub
                </button>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Recent Activity */}
        <FadeIn delay={0.16}>
          <div className="glass-card p-6 h-full">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {mockRecentActivity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0 last:pb-0 first:pt-0"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-sm font-medium truncate">
                      {item.title}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span>Day {item.day}</span>
                      <span>�</span>
                      <span>{item.timeAgo}</span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border shrink-0",
                      getDifficultyBg(item.difficulty)
                    )}
                  >
                    {item.difficulty.charAt(0).toUpperCase() +
                      item.difficulty.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ============================================================ */}
      {/*  ACHIEVEMENTS                                                */}
      {/* ============================================================ */}
      <FadeIn delay={0.18}>
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
            {ach.map((a) => (
              <div
                key={a._id}
                className="glass-card p-5 min-w-[200px] flex flex-col items-center text-center shrink-0 glass-card-hover transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  {achievementIcons[a.type] ?? (
                    <Trophy className="w-5 h-5 text-primary" />
                  )}
                </div>
                <p className="text-sm font-semibold">{a.title}</p>
                <p className="text-xs text-muted mt-1">{a.description}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-amber-400 font-medium">
                  <Zap className="w-3 h-3" />
                  +{a.xp} XP
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ============================================================ */}
      {/*  LEADERBOARD PREVIEW                                         */}
      {/* ============================================================ */}
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
              const isCurrentUser = entry.username === user.username;
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
                  {/* Rank */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                      entry.rank === 1 &&
                        "bg-yellow-500/20 text-yellow-400",
                      entry.rank === 2 &&
                        "bg-gray-400/20 text-gray-300",
                      entry.rank === 3 &&
                        "bg-amber-600/20 text-amber-500",
                      entry.rank > 3 && "bg-white/5 text-muted"
                    )}
                  >
                    {entry.rank}
                  </div>

                  {/* User info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium truncate",
                        isCurrentUser ? "text-primary" : ""
                      )}
                    >
                      {entry.name}
                      {isCurrentUser && (
                        <span className="text-xs text-muted ml-1.5">
                          (You)
                        </span>
                      )}
                    </p>
                  </div>

                  {/* XP */}
                  <div className="flex items-center gap-1 text-sm font-medium text-yellow-400 shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                    {entry.xp.toLocaleString()}
                  </div>

                  {/* Streak */}
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

      {/* Bottom spacer for mobile nav */}
      <div className="h-8 md:h-0" />
    </div>
  );
}