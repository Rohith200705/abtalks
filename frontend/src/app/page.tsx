"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  PenTool,
  Eye,
  Shield,
  TrendingUp,
  Check,
  ArrowRight,
  Code,
  Zap,
  Calendar,
  GitBranch,
  Play,
  ChevronRight,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Reusable animation wrapper                                         */
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
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const features = [
  {
    icon: PenTool,
    title: "Write Code",
    description:
      "Solve daily coding challenges in your preferred language",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: Eye,
    title: "Understand",
    description:
      "Watch your code execute step-by-step with our visualization engine",
    gradient: "from-purple-500 to-pink-400",
  },
  {
    icon: Shield,
    title: "Prove",
    description:
      "Submit solutions and build a verified developer portfolio",
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    icon: TrendingUp,
    title: "Grow",
    description:
      "Track your streak, earn XP, and unlock achievements",
    gradient: "from-amber-500 to-orange-400",
  },
];

const languages = [
  { name: "Python", color: "from-yellow-400 to-blue-500" },
  { name: "JavaScript", color: "from-yellow-300 to-yellow-500" },
  { name: "C++", color: "from-blue-400 to-indigo-600" },
];

const timelineDays = Array.from({ length: 30 }, (_, i) => i + 1);
const completedDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const currentDay = 13;

const stats = [
  { label: "Daily Challenges", icon: Calendar },
  { label: "Multiple Languages", icon: Code },
  { label: "Visual Learning", icon: Eye },
  { label: "GitHub Integration", icon: GitBranch },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden">
        {/* Animated gradient blobs */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]"
            animate={{
              x: [0, 80, -40, 0],
              y: [0, -60, 40, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            style={{ top: "10%", left: "10%" }}
          />
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full bg-secondary/20 blur-[120px]"
            animate={{
              x: [0, -60, 80, 0],
              y: [0, 60, -40, 0],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            style={{ top: "30%", right: "5%" }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px]"
            animate={{
              x: [0, 40, -80, 0],
              y: [0, -80, 60, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ bottom: "10%", left: "30%" }}
          />
        </div>

        <FadeIn>
          {/* Logo */}
          <div className="mb-8">
            <span className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight">
              <span className="gradient-text">AB</span>
              <span className="text-white">Talks</span>
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-3xl">
            Start Your Journey With Us
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-muted max-w-2xl leading-relaxed">
            Master coding through daily challenges. Write code, understand how
            it works, prove your skills, and grow as a developer.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/dashboard"
              className="btn-gradient text-white font-semibold px-8 py-3.5 rounded-xl text-base inline-flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all hover:scale-105"
            >
              Start Your 60-Day Journey
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/challenges"
              className="glass-card glass-card-hover text-white font-semibold px-8 py-3.5 rounded-xl text-base inline-flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              Explore Challenges
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-white/40"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/*  FEATURES  (How It Works)                                    */}
      {/* ============================================================ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                How It{" "}
                <span className="gradient-text">Works</span>
              </h2>
              <p className="mt-4 text-muted text-base sm:text-lg max-w-xl mx-auto">
                A simple four-step process to transform your coding skills
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <FadeIn key={feature.title} delay={i * 0.1}>
                  <div className="glass-card p-6 h-full flex flex-col items-center text-center glass-card-hover transition-all duration-300 group">
                    {/* Icon circle */}
                    <div
                      className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center mb-5",
                        "bg-gradient-to-br",
                        feature.gradient,
                        "shadow-lg group-hover:scale-110 transition-transform duration-300"
                      )}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  JOURNEY  (Timeline)                                         */}
      {/* ============================================================ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Your <span className="gradient-text">60-Day</span> Coding
                Journey
              </h2>
            </div>
          </FadeIn>

          {/* Horizontal scroll timeline */}
          <FadeIn delay={0.1}>
            <div className="overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-3 min-w-max">
                {timelineDays.map((day) => {
                  const isCompleted = completedDays.includes(day);
                  const isCurrent = day === currentDay;
                  return (
                    <div
                      key={day}
                      className={cn(
                        "flex flex-col items-center gap-2 shrink-0"
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold transition-all border",
                          isCompleted &&
                            "bg-primary/20 border-primary text-primary",
                          isCurrent &&
                            "bg-gradient-to-br from-primary to-secondary text-white border-0 shadow-lg shadow-primary/30",
                          !isCompleted &&
                            !isCurrent &&
                            "bg-white/5 border-white/10 text-muted"
                        )}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          day
                        )}
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] text-primary font-medium">
                          Day {day}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>

          {/* Stats row */}
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="glass-card p-4 flex items-center gap-3"
                  >
                    <Icon className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium">{stat.label}</span>
                  </div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SUPPORTED LANGUAGES                                         */}
      {/* ============================================================ */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Write in the Language{" "}
                <span className="gradient-text">You&apos;re Learning</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {languages.map((lang, i) => (
              <FadeIn key={lang.name} delay={i * 0.1}>
                <div className="glass-card p-8 flex flex-col items-center gap-4 glass-card-hover transition-all duration-300 group">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br",
                      lang.color,
                      "shadow-lg group-hover:scale-110 transition-transform duration-300"
                    )}
                  >
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-lg font-semibold">{lang.name}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CODE PREVIEW                                                */}
      {/* ============================================================ */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Practice in a{" "}
                  <span className="gradient-text">Real Editor</span>
                </h2>
                <p className="text-muted text-base sm:text-lg leading-relaxed">
                  Write, run, and visualize your code with instant feedback.
                  Our built-in editor supports multiple languages and provides
                  step-by-step execution visualization.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="glass-card overflow-hidden">
                {/* Editor title bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="ml-2 text-xs text-muted">two_sum.py</span>
                </div>
                {/* Code content */}
                <pre className="p-5 text-sm leading-6 overflow-x-auto font-mono">
                  <code>
                    <span className="text-purple-400">def</span>
                    <span className="text-blue-300"> two_sum</span>
                    <span className="text-white">(nums, target):</span>
                    {"\n"}
                    <span className="text-white">{"    "}</span>
                    <span className="text-gray-500">
                      # Hash map approach
                    </span>
                    {"\n"}
                    <span className="text-white">{"    "}</span>
                    <span className="text-purple-400">hash_map</span>
                    <span className="text-white"> = </span>
                    <span className="text-white">{"{}"}</span>
                    {"\n"}
                    {"\n"}
                    <span className="text-white">{"    "}</span>
                    <span className="text-purple-400">for</span>
                    <span className="text-white"> i, num </span>
                    <span className="text-purple-400">in</span>
                    <span className="text-blue-300"> enumerate</span>
                    <span className="text-white">(nums):</span>
                    {"\n"}
                    <span className="text-white">{"        "}</span>
                    <span className="text-purple-400">if</span>
                    <span className="text-white"> target - num </span>
                    <span className="text-purple-400">in</span>
                    <span className="text-white"> hash_map:</span>
                    {"\n"}
                    <span className="text-white">{"            "}</span>
                    <span className="text-purple-400">return</span>
                    <span className="text-white">
                      {" "}
                      [hash_map[target - num], i]
                    </span>
                    {"\n"}
                    <span className="text-white">{"        "}</span>
                    <span className="text-purple-400">else</span>
                    <span className="text-white">:</span>
                    {"\n"}
                    <span className="text-white">{"            "}</span>
                    <span className="text-white">hash_map[num] = i</span>
                    {"\n"}
                    {"\n"}
                    <span className="text-white">{"    "}</span>
                    <span className="text-purple-400">return</span>
                    <span className="text-white"> </span>
                    <span className="text-gray-500">None</span>
                    {"\n"}
                  </code>
                </pre>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA                                                         */}
      {/* ============================================================ */}
      <section className="py-24 px-4">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center glass-card p-12 sm:p-16 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
              <div className="absolute w-[300px] h-[300px] rounded-full bg-primary/15 blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your{" "}
              <span className="gradient-text">Journey</span>?
            </h2>
            <p className="text-muted text-base sm:text-lg mb-10 max-w-lg mx-auto">
              Join thousands of developers building their skills every day
            </p>
            <Link
              href="/dashboard"
              className="btn-gradient text-white font-semibold px-10 py-4 rounded-xl text-base inline-flex items-center gap-2 shadow-lg shadow-primary/25 transition-all hover:scale-105"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <div className="flex items-center gap-1">
            <span className="font-bold gradient-text">AB</span>
            <span className="font-bold text-white">Talks</span>
          </div>
          <span>&copy; {new Date().getFullYear()} ABTalks. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}