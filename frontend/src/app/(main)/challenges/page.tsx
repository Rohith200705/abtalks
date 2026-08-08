"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Code,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Zap,
  X,
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { cn, getDifficultyBg } from "@/lib/utils";
import { challengesApi } from "@/lib/api";
import type { Challenge } from "@/types";

/* ------------------------------------------------------------------ */
/*  Mock data (15 challenges � same as seed)                           */
/* ------------------------------------------------------------------ */
const mockChallenges: Challenge[] = [
  { _id: "1", day: 1, title: "Two Sum", slug: "two-sum", difficulty: "easy", topics: ["Arrays", "Hash Map"], description: "", examples: [], constraints: [], starterCode: { python: "", javascript: "", cpp: "" }, testCases: [], solvedPercentage: 82, order: 1 },
  { _id: "2", day: 2, title: "Valid Parentheses", slug: "valid-parentheses", difficulty: "easy", topics: ["Stack", "String"], description: "", examples: [], constraints: [], starterCode: { python: "", javascript: "", cpp: "" }, testCases: [], solvedPercentage: 76, order: 2 },
  { _id: "3", day: 3, title: "Merge Two Sorted Lists", slug: "merge-two-sorted-lists", difficulty: "easy", topics: ["Linked List", "Recursion"], description: "", examples: [], constraints: [], starterCode: { python: "", javascript: "", cpp: "" }, testCases: [], solvedPercentage: 71, order: 3 },
  { _id: "4", day: 4, title: "Best Time to Buy and Sell Stock", slug: "best-time-to-buy-sell-stock", difficulty: "easy", topics: ["Arrays", "DP"], description: "", examples: [], constraints: [], starterCode: { python: "", javascript: "", cpp: "" }, testCases: [], solvedPercentage: 68, order: 4 },
  { _id: "5", day: 5, title: "Maximum Subarray", slug: "maximum-subarray", difficulty: "medium", topics: ["Array", "DP"], description: "", examples: [], constraints: [], starterCode: { python: "", javascript: "", cpp: "" }, testCases: [], solvedPercentage: 55, order: 5 },
  { _id: "6", day: 6, title: "Reverse Linked List", slug: "reverse-linked-list", difficulty: "easy", topics: ["Linked List", "Recursion"], description: "", examples: [], constraints: [], starterCode: { python: "", javascript: "", cpp: "" }, testCases: [], solvedPercentage: 74, order: 6 },
  { _id: "7", day: 7, title: "Contains Duplicate", slug: "contains-duplicate", difficulty: "easy", topics: ["Array", "Hash Set"], description: "", examples: [], constraints: [], starterCode: { python: "", javascript: "", cpp: "" }, testCases: [], solvedPercentage: 78, order: 7 },
  { _id: "8", day: 8, title: "Valid Anagram", slug: "valid-anagram", difficulty: "easy", topics: ["String", "Hash Map"], description: "", examples: [], constraints: [], starterCode: { python: "", javascript: "", cpp: "" }, testCases: [], solvedPercentage: 67, order: 8 },
  { _id: "9", day: 9, title: "Binary Search", slug: "binary-search", difficulty: "easy", topics: ["Array", "Binary Search"], description: "", examples: [], constraints: [], starterCode: { python: "", javascript: "", cpp: "" }, testCases: [], solvedPercentage: 73, order: 9 },
  { _id: "10", day: 10, title: "Maximum Depth of Binary Tree", slug: "maximum-depth-binary-tree", difficulty: "easy", topics: ["Tree", "DFS", "BFS"], description: "", examples: [], constraints: [], starterCode: { python: "", javascript: "", cpp: "" }, testCases: [], solvedPercentage: 70, order: 10 },
  { _id: "11", day: 11, title: "Minimum Depth of Binary Tree", slug: "minimum-depth-binary-tree", difficulty: "easy", topics: ["Tree", "DFS", "BFS"], description: "", examples: [], constraints: [], starterCode: { python: "", javascript: "", cpp: "" }, testCases: [], solvedPercentage: 64, order: 11 },
  { _id: "12", day: 12, title: "Two Sum (Revisited)", slug: "two-sum-revisited", difficulty: "easy", topics: ["Arrays", "Hash Map"], description: "", examples: [], constraints: [], starterCode: { python: "", javascript: "", cpp: "" }, testCases: [], solvedPercentage: 82, order: 12 },
  { _id: "13", day: 13, title: "Longest Substring Without Repeating Characters", slug: "longest-substring-no-repeat", difficulty: "medium", topics: ["Sliding Window", "Hash Map"], description: "", examples: [], constraints: [], starterCode: { python: "", javascript: "", cpp: "" }, testCases: [], solvedPercentage: 42, order: 13 },
  { _id: "14", day: 14, title: "Climbing Stairs", slug: "climbing-stairs", difficulty: "medium", topics: ["DP", "Math"], description: "", examples: [], constraints: [], starterCode: { python: "", javascript: "", cpp: "" }, testCases: [], solvedPercentage: 58, order: 14 },
  { _id: "15", day: 15, title: "LRU Cache", slug: "lru-cache", difficulty: "hard", topics: ["Hash Map", "Linked List", "Design"], description: "", examples: [], constraints: [], starterCode: { python: "", javascript: "", cpp: "" }, testCases: [], solvedPercentage: 31, order: 15 },
];

const difficultyOptions = ["All", "Easy", "Medium", "Hard"];
const languageOptions = ["All", "Python", "JavaScript", "C++"];
const statusOptions = ["All", "Completed", "Unsolved"];
const topicList = ["All", "Arrays", "Hash Map", "Stack", "String", "Linked List", "Tree", "DP", "Sliding Window", "Binary Search", "Design"];

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
/*  Challenge Card                                                     */
/* ------------------------------------------------------------------ */
function ChallengeCard({ challenge, index }: { challenge: Challenge; index: number }) {
  return (
    <FadeIn delay={index * 0.04}>
      <div className="glass-card p-5 flex flex-col gap-3 h-full glass-card-hover transition-all duration-300 group">
        {/* Day badge */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5">
            Day {challenge.day}
          </span>
          <span className="text-xs text-muted flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            {challenge.solvedPercentage}% solved
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors leading-snug">
          {challenge.title}
        </h3>

        {/* Difficulty + topics */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border", getDifficultyBg(challenge.difficulty))}>
            {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
          </span>
          {challenge.topics.slice(0, 2).map((topic) => (
            <span key={topic} className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-white/5 text-muted border border-border">
              {topic}
            </span>
          ))}
          {challenge.topics.length > 2 && (
            <span className="text-[10px] text-muted">+{challenge.topics.length - 2}</span>
          )}
        </div>

        {/* Solved percentage bar */}
        <div className="mt-auto pt-2">
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700" style={{ width: `${challenge.solvedPercentage}%` }} />
          </div>
        </div>

        {/* Action */}
        <Link
          href={`/day/${challenge.day}`}
          className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-white hover:bg-primary/20 hover:text-primary border border-border hover:border-primary/30 transition-all duration-300"
        >
          Practice
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </FadeIn>
  );
}

/* ------------------------------------------------------------------ */
/*  Filter Pill                                                        */
/* ------------------------------------------------------------------ */
function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 whitespace-nowrap",
        active ? "bg-primary/20 text-primary border-primary/30" : "bg-white/5 text-muted border-border hover:bg-white/10 hover:text-white"
      )}
    >
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [topic, setTopic] = useState("All");
  const [language, setLanguage] = useState("All");
  const [status, setStatus] = useState("All");
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data: any = await challengesApi.getAll();
        const list = Array.isArray(data) ? data : data.challenges ?? [];
        if (!cancelled) setChallenges(list.length > 0 ? list : mockChallenges);
      } catch {
        if (!cancelled) setChallenges(mockChallenges);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    let result = [...challenges];
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) => c.title.toLowerCase().includes(q) || c.topics.some((t) => t.toLowerCase().includes(q))
      );
    }
    // Difficulty
    if (difficulty !== "All") {
      result = result.filter((c) => c.difficulty === difficulty.toLowerCase());
    }
    // Topic
    if (topic !== "All") {
      result = result.filter((c) => c.topics.includes(topic));
    }
    // Status (simplified: completed = solvedPercentage >= 70, unsolved = < 70)
    if (status === "Completed") {
      result = result.filter((c) => c.solvedPercentage >= 70);
    } else if (status === "Unsolved") {
      result = result.filter((c) => c.solvedPercentage < 70);
    }
    // Sort by day
    result.sort((a, b) => a.day - b.day);
    return result;
  }, [challenges, search, difficulty, topic, status]);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* ============================================================ */}
      {/*  HEADER                                                       */}
      {/* ============================================================ */}
      <FadeIn>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Challenges</h1>
          <p className="text-muted text-sm">Browse and practice coding challenges</p>
        </div>
      </FadeIn>

      {/* ============================================================ */}
      {/*  SEARCH BAR                                                   */}
      {/* ============================================================ */}
      <FadeIn delay={0.05}>
        <div className="glass-card p-1 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5">
            <Search className="w-4 h-4 text-muted shrink-0" />
            <input
              type="text"
              placeholder="Search challenges or topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder:text-muted/60 outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-muted hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </FadeIn>

      {/* ============================================================ */}
      {/*  FILTER ROW                                                   */}
      {/* ============================================================ */}
      <FadeIn delay={0.08}>
        <div className="space-y-3">
          {/* Difficulty */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted font-medium mr-1">Difficulty:</span>
            {difficultyOptions.map((d) => (
              <FilterPill key={d} label={d} active={difficulty === d} onClick={() => setDifficulty(d)} />
            ))}
          </div>

          {/* Language */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted font-medium mr-1">Language:</span>
            {languageOptions.map((l) => (
              <FilterPill key={l} label={l} active={language === l} onClick={() => setLanguage(l)} />
            ))}
          </div>

          {/* Status */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted font-medium mr-1">Status:</span>
            {statusOptions.map((s) => (
              <FilterPill key={s} label={s} active={status === s} onClick={() => setStatus(s)} />
            ))}
          </div>

          {/* Topic dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted font-medium mr-1">Topic:</span>
            <div className="relative">
              <button
                onClick={() => setShowTopicDropdown(!showTopicDropdown)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                  topic !== "All" ? "bg-primary/20 text-primary border-primary/30" : "bg-white/5 text-muted border-border hover:bg-white/10"
                )}
              >
                {topic}
                <ChevronDown className={cn("w-3 h-3 transition-transform", showTopicDropdown && "rotate-180")} />
              </button>
              <AnimatePresence>
                {showTopicDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-48 glass-card p-2 z-50 max-h-60 overflow-y-auto"
                  >
                    {topicList.map((t) => (
                      <button
                        key={t}
                        onClick={() => { setTopic(t); setShowTopicDropdown(false); }}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all",
                          topic === t ? "bg-primary/20 text-primary" : "text-muted hover:bg-white/5 hover:text-white"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ============================================================ */}
      {/*  RESULTS COUNT                                                */}
      {/* ============================================================ */}
      <FadeIn delay={0.1}>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">
            Showing <span className="text-white font-medium">{filtered.length}</span> challenge{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </FadeIn>

      {/* ============================================================ */}
      {/*  LOADING                                                      */}
      {/* ============================================================ */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card p-5 space-y-3 animate-pulse">
              <div className="h-4 bg-white/5 rounded w-16" />
              <div className="h-5 bg-white/5 rounded w-3/4" />
              <div className="flex gap-2">
                <div className="h-5 bg-white/5 rounded w-16" />
                <div className="h-5 bg-white/5 rounded w-20" />
              </div>
              <div className="h-1 bg-white/5 rounded w-full mt-4" />
              <div className="h-9 bg-white/5 rounded-xl w-full mt-2" />
            </div>
          ))}
        </div>
      ) : /* ============================================================ */
      /*  EMPTY STATE                                                  */
      /* ============================================================ */
      filtered.length === 0 ? (
        <FadeIn>
          <div className="glass-card p-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No challenges found</h3>
            <p className="text-sm text-muted mb-6">Try adjusting your filters or search query</p>
            <button
              onClick={() => { setSearch(""); setDifficulty("All"); setTopic("All"); setLanguage("All"); setStatus("All"); }}
              className="btn-gradient text-white font-semibold px-6 py-2.5 rounded-xl text-sm inline-flex items-center gap-2"
            >
              Clear All Filters
              <X className="w-4 h-4" />
            </button>
          </div>
        </FadeIn>
      ) : /* ============================================================ */
      /*  CHALLENGE GRID                                               */
      /* ============================================================ */
      (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((challenge, i) => (
            <ChallengeCard key={challenge._id} challenge={challenge} index={i} />
          ))}
        </div>
      )}

      {/* Bottom spacer for mobile nav */}
      <div className="h-8 md:h-0" />
    </div>
  );
}
