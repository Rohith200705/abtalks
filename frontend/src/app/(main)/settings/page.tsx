"use client";

import { useState, useEffect, useRef } from "react";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  GitBranch,
  Share2,
  Shield,
  Info,
  Save,
  Moon,
  Sun,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { userApi, githubApi, linkedinApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { GitHubStatus, LinkedInStatus } from "@/types";

function FadeIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

function ToggleSwitch({
  enabled,
  onChange,
  label,
  description,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0",
          enabled ? "bg-primary" : "bg-white/10"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200",
            enabled ? "left-[22px]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="text-base font-semibold">{title}</h3>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [college, setCollege] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [streakAlert, setStreakAlert] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [achievementNotifs, setAchievementNotifs] = useState(true);
  const [githubConnected, setGithubConnected] = useState(false);
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setCollege(user.college || "");
    }
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [ghRes, liRes] = await Promise.allSettled([
        githubApi.getStatus(),
        linkedinApi.getStatus(),
      ]);
      if (!cancelled) {
        if (ghRes.status === "fulfilled") {
          const status = (ghRes.value as any).status ?? (ghRes.value as GitHubStatus);
          setGithubConnected(status?.connected ?? false);
        }
        if (liRes.status === "fulfilled") {
          const status = (liRes.value as any).status ?? (liRes.value as LinkedInStatus);
          setLinkedinConnected(status?.connected ?? false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await userApi.updateProfile({ name, bio, college });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch {
      // Silent fail
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-6">
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 glass-card glow-blue px-5 py-3 flex items-center gap-2 shadow-lg"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium">Settings saved successfully!</span>
        </motion.div>
      )}

      <FadeIn>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <SettingsIcon className="w-7 h-7 text-primary" />
            Settings
          </h1>
          <p className="text-muted text-sm">Manage your account and preferences</p>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="glass-card p-6">
          <SectionHeader icon={<User className="w-5 h-5 text-primary" />} title="Profile Settings" />
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted font-medium block mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-white placeholder:text-muted/60 outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-muted font-medium block mb-1.5">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-white placeholder:text-muted/60 outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>
            <div>
              <label className="text-xs text-muted font-medium block mb-1.5">College</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-white placeholder:text-muted/60 outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="glass-card p-6">
          <SectionHeader icon={<Palette className="w-5 h-5 text-purple-400" />} title="Theme" />
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setDarkMode(true)}
              className={cn(
                "glass-card p-4 flex flex-col items-center gap-2 transition-all border-2",
                darkMode ? "border-primary/50 bg-primary/10" : "border-transparent hover:bg-white/5"
              )}
            >
              <Moon className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Dark Mode</span>
              {darkMode && <span className="text-[10px] text-primary font-semibold">ACTIVE</span>}
            </button>
            <button
              onClick={() => setDarkMode(false)}
              className={cn(
                "glass-card p-4 flex flex-col items-center gap-2 transition-all border-2",
                !darkMode ? "border-primary/50 bg-primary/10" : "border-transparent hover:bg-white/5"
              )}
            >
              <Sun className="w-6 h-6 text-yellow-400" />
              <span className="text-sm font-medium">Light Mode</span>
              {!darkMode && <span className="text-[10px] text-primary font-semibold">ACTIVE</span>}
            </button>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="glass-card p-6">
          <SectionHeader icon={<Bell className="w-5 h-5 text-amber-400" />} title="Notifications" />
          <div className="divide-y divide-border">
            <ToggleSwitch enabled={dailyReminder} onChange={setDailyReminder} label="Daily Challenge Reminder" description="Get reminded to solve your daily challenge" />
            <ToggleSwitch enabled={streakAlert} onChange={setStreakAlert} label="Streak Alert" description="Warning before your streak breaks" />
            <ToggleSwitch enabled={weeklyReport} onChange={setWeeklyReport} label="Weekly Progress Report" description="Receive a weekly summary of your progress" />
            <ToggleSwitch enabled={achievementNotifs} onChange={setAchievementNotifs} label="Achievement Notifications" description="Get notified when you unlock achievements" />
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.13}>
        <div className="glass-card p-6">
          <SectionHeader icon={<ExternalLink className="w-5 h-5 text-blue-400" />} title="Connected Accounts" />
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <GitBranch className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">GitHub</p>
                  <p className="text-xs text-muted">{githubConnected ? "Connected" : "Not connected"}</p>
                </div>
              </div>
              <span className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium",
                githubConnected ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-muted border border-border"
              )}>
                {githubConnected ? "Connected" : "Not connected"}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-[#0A66C2]" />
                </div>
                <div>
                  <p className="text-sm font-medium">LinkedIn</p>
                  <p className="text-xs text-muted">{linkedinConnected ? "Connected" : "Not connected"}</p>
                </div>
              </div>
              <span className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium",
                linkedinConnected ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-muted border border-border"
              )}>
                {linkedinConnected ? "Connected" : "Not connected"}
              </span>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.16}>
        <div className="glass-card p-6">
          <SectionHeader icon={<Shield className="w-5 h-5 text-emerald-400" />} title="Data & Privacy" />
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between py-3 border-b border-border hover:bg-white/5 rounded-lg px-2 -mx-2 transition-all">
              <div className="text-left">
                <p className="text-sm font-medium">Export Your Data</p>
                <p className="text-xs text-muted">Download all your submissions and progress</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted" />
            </button>
            <button className="w-full flex items-center justify-between py-3 border-b border-border hover:bg-white/5 rounded-lg px-2 -mx-2 transition-all">
              <div className="text-left">
                <p className="text-sm font-medium">Delete Account</p>
                <p className="text-xs text-muted">Permanently delete your account and data</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted" />
            </button>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.19}>
        <div className="glass-card p-6">
          <SectionHeader icon={<Info className="w-5 h-5 text-blue-400" />} title="About ABTalks" />
          <div className="space-y-2 text-sm text-muted">
            <p>ABTalks is a 60-day coding challenge platform designed for college students to master data structures and algorithms through daily practice.</p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-muted/60">Version 1.0.0</span>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.22}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-xl text-sm font-semibold btn-gradient text-white flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </FadeIn>

      <div className="h-8 md:h-0" />
    </div>
  );
}
