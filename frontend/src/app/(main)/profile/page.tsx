"use client";

import { useState, useEffect, useRef } from "react";
import {
  User,
  MapPin,
  GraduationCap,
  Calendar,
  Trophy,
  Flame,
  Zap,
  CheckCircle2,
  Star,
  Medal,
  Sparkles,
  Award,
  Lock,
  GitBranch,
  Share2,
  Edit3,
  X,
  ChevronRight,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { userApi, progressApi, achievementsApi, githubApi, linkedinApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { User as UserType, Progress, Achievement, GitHubStatus, LinkedInStatus } from "@/types";
import { ProgressBar } from "@/components/ui/ProgressBar";

function FadeIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserType | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [githubStatus, setGithubStatus] = useState<GitHubStatus | null>(null);
  const [linkedinStatus, setLinkedinStatus] = useState<LinkedInStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editCollege, setEditCollege] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [userRes, progressRes, achRes, ghRes, liRes] = await Promise.allSettled([
          userApi.getProfile(),
          progressApi.get(),
          achievementsApi.getAll(),
          githubApi.getStatus(),
          linkedinApi.getStatus(),
        ]);
        if (!cancelled) {
          if (userRes.status === "fulfilled") setUser((userRes.value as any).user ?? userRes.value as UserType);
          if (progressRes.status === "fulfilled") setProgress((progressRes.value as any).progress ?? (progressRes.value as Progress));
          if (achRes.status === "fulfilled") setAchievements((achRes.value as any).achievements ?? (achRes.value as Achievement[]));
          if (ghRes.status === "fulfilled") setGithubStatus((ghRes.value as any).status ?? (ghRes.value as GitHubStatus));
          if (liRes.status === "fulfilled") setLinkedinStatus((liRes.value as any).status ?? (liRes.value as LinkedInStatus));
        }
      } catch {
        if (!cancelled) setError("Failed to load profile data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const p = progress;
  const completionPercent = p ? Math.round((p.completedDays.length / 60) * 100) : 0;
  const displayUser = user ?? authUser;

  const openEdit = () => {
    if (displayUser) {
      setEditName(displayUser.name);
      setEditBio(displayUser.bio || "");
      setEditCollege(displayUser.college || "");
    }
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    try {
      await userApi.updateProfile({ name: editName, bio: editBio, college: editCollege });
      if (displayUser) {
        const updated = { ...displayUser, name: editName, bio: editBio, college: editCollege };
        setUser(updated);
      }
      setShowEditModal(false);
    } catch {
      // Silent fail - user sees old data
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-white/40 text-sm">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      {/* PROFILE HEADER */}
      {displayUser ? (
        <FadeIn>
          <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl sm:text-4xl font-bold shrink-0 ring-4 ring-primary/20">
                {displayUser.name.charAt(0)}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold">{displayUser.name}</h1>
                <p className="text-muted text-sm">@{displayUser.username}</p>
                {displayUser.bio && <p className="text-sm text-white/70 mt-2 max-w-md">{displayUser.bio}</p>}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                  {displayUser.college && (
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                      <GraduationCap className="w-3.5 h-3.5" />
                      {displayUser.college}
                    </span>
                  )}
                  {displayUser.graduationYear > 0 && (
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                      <Calendar className="w-3.5 h-3.5" />
                      Class of {displayUser.graduationYear}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={openEdit}
                className="glass-card px-4 py-2 rounded-xl text-sm font-medium text-muted hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 shrink-0"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </FadeIn>
      ) : error ? (
        <FadeIn>
          <div className="glass-card p-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-400/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load profile</h3>
            <p className="text-sm text-muted">{error}</p>
          </div>
        </FadeIn>
      ) : null}

      {/* STATS OVERVIEW */}
      {p && (
        <FadeIn delay={0.05}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-card p-4 text-center">
              <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-yellow-400">{p.xp.toLocaleString()}</p>
              <p className="text-xs text-muted">Total XP</p>
            </div>
            <div className="glass-card p-4 text-center">
              <Trophy className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-blue-400">#{p.rank}</p>
              <p className="text-xs text-muted">Rank</p>
            </div>
            <div className="glass-card p-4 text-center">
              <Flame className="w-5 h-5 text-orange-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-orange-400">{p.streak}</p>
              <p className="text-xs text-muted">Day Streak</p>
            </div>
            <div className="glass-card p-4 text-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-emerald-400">{p.totalSolved}</p>
              <p className="text-xs text-muted">Challenges Solved</p>
            </div>
          </div>
        </FadeIn>
      )}

      {/* DIFFICULTY BREAKDOWN */}
      {p && (
        <FadeIn delay={0.1}>
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold mb-4">Difficulty Breakdown</h3>
            <div className="space-y-4">
              <ProgressBar
                label="Easy"
                value={(p.easySolved / Math.max(p.totalSolved, 1)) * 100}
                showPercentage
                color="bg-emerald-400"
              />
              <ProgressBar
                label="Medium"
                value={(p.mediumSolved / Math.max(p.totalSolved, 1)) * 100}
                showPercentage
                color="bg-amber-400"
              />
              <ProgressBar
                label="Hard"
                value={(p.hardSolved / Math.max(p.totalSolved, 1)) * 100}
                showPercentage
                color="bg-red-400"
              />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-400">{p.easySolved}</p>
                <p className="text-xs text-muted">Easy</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-amber-400">{p.mediumSolved}</p>
                <p className="text-xs text-muted">Medium</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-red-400">{p.hardSolved}</p>
                <p className="text-xs text-muted">Hard</p>
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      {/* ACHIEVEMENTS */}
      <FadeIn delay={0.15}>
        <div>
          <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Achievements
          </h3>
          {achievements.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <Award className="w-10 h-10 text-muted/30 mx-auto mb-3" />
              <p className="text-sm font-medium mb-1">No achievements yet</p>
              <p className="text-xs text-muted">Complete challenges to earn XP!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {achievements.map((ach) => (
                <motion.div
                  key={ach._id}
                  whileHover={{ scale: 1.03 }}
                  className="glass-card p-4 flex flex-col items-center text-center gap-2 transition-all duration-300 glass-card-hover"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs font-bold">{ach.title}</p>
                  <p className="text-[10px] text-muted leading-tight">{ach.description}</p>
                  <div className="flex items-center gap-1 text-[10px] text-yellow-400 font-medium">
                    <Zap className="w-2.5 h-2.5" />
                    {ach.xp} XP
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </FadeIn>

      {/* CONNECTED SERVICES */}
      <FadeIn delay={0.2}>
        <div>
          <h3 className="text-base font-semibold mb-4">Connected Services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <GitBranch className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">GitHub</p>
                <p className="text-xs text-muted truncate">
                  {githubStatus?.connected ? "Connected as @" + githubStatus.username : "Not connected"}
                </p>
              </div>
              {githubStatus?.connected ? (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Connected
                </span>
              ) : (
                <span className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-muted border border-border">
                  Not connected
                </span>
              )}
            </div>
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Share2 className="w-6 h-6 text-[#0A66C2]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">LinkedIn</p>
                <p className="text-xs text-muted truncate">
                  {linkedinStatus?.connected ? "Connected" : "Not connected"}
                </p>
              </div>
              {linkedinStatus?.connected ? (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Connected
                </span>
              ) : (
                <span className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-muted border border-border">
                  Not connected
                </span>
              )}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* EDIT PROFILE MODAL */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="glass-card glow-blue p-6 max-w-md w-full space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Edit Profile</h2>
                <button onClick={() => setShowEditModal(false)} className="text-muted hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted font-medium block mb-1.5">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-white placeholder:text-muted/60 outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted font-medium block mb-1.5">Bio</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-white placeholder:text-muted/60 outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted font-medium block mb-1.5">College</label>
                  <input
                    type="text"
                    value={editCollege}
                    onChange={(e) => setEditCollege(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-white placeholder:text-muted/60 outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-muted hover:bg-white/10 border border-border transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold btn-gradient text-white"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-8 md:h-0" />
    </div>
  );
}
