"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Eye,
  Send,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick,
  Users,
  Code2,
  AlertTriangle,
} from "lucide-react";
import { cn, formatTime, formatMemory } from "@/lib/utils";
import { challengesApi, codeApi, submissionsApi } from "@/lib/api";
import type { Challenge, CodeRunResult, ExecutionStep } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ExecutionVisualizer } from "@/components/ExecutionVisualizer";
import { CompletionModal } from "@/components/CompletionModal";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] md:h-[500px] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-white/40">Loading editor...</span>
      </div>
    </div>
  ),
});

const languageMap: Record<string, string> = { python: "python", javascript: "javascript", cpp: "cpp" };
type Language = "python" | "javascript" | "cpp";

export default function DayPage() {
  const params = useParams();
  const router = useRouter();
  const dayNumber = Number(params?.day);

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState("");
  const [runLoading, setRunLoading] = useState(false);
  const [vizLoading, setVizLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [runResult, setRunResult] = useState<CodeRunResult | null>(null);
  const [trace, setTrace] = useState<ExecutionStep[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionResult, setCompletionResult] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<"problem" | "results" | "viz">("problem");
  const [isMobile, setIsMobile] = useState(false);
  const [expandedExamples, setExpandedExamples] = useState<number[]>([0, 1]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!dayNumber || isNaN(dayNumber)) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data: any = await challengesApi.getByDay(dayNumber);
        if (!cancelled) setChallenge(data.challenge ?? data);
      } catch {
        if (!cancelled) setError("Failed to load challenge");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [dayNumber]);

  useEffect(() => {
    if (challenge) setCode(challenge.starterCode[language] ?? "");
  }, [challenge, language]);

  const handleRun = useCallback(async () => {
    if (!challenge) return;
    setRunLoading(true);
    setRunResult(null);
    try {
      const result: any = await codeApi.run({ code, language, challengeId: challenge._id });
      setRunResult((result.result ?? result) as CodeRunResult);
    } catch {
      setRunResult(null);
    } finally {
      setRunLoading(false);
      setActiveSection("results");
    }
  }, [code, language, challenge]);

  const handleVisualize = useCallback(async () => {
    if (!challenge) return;
    setVizLoading(true);
    setTrace([]);
    try {
      const result: any = await codeApi.visualize({ code, language, challengeSlug: challenge.slug });
      setTrace(result.trace ?? result.steps ?? (result as ExecutionStep[]));
    } catch {
      setTrace([]);
    } finally {
      setVizLoading(false);
      setActiveSection("viz");
    }
  }, [code, language, challenge]);

  const handleSubmit = useCallback(async () => {
    if (!challenge) return;
    setSubmitLoading(true);
    try {
      const result: any = await submissionsApi.submit({ challengeId: challenge._id, language, code });
      setCompletionResult({
        xpEarned: result.xp?.xpEarned ?? result.xpEarned ?? 0,
        newStreak: result.streak?.current ?? result.streak ?? 0,
        githubStatus: result.github?.status ?? result.githubStatus ?? "disconnected",
        linkedinStatus: result.linkedin?.status ?? result.linkedinStatus ?? "disconnected",
        achievements: result.achievements ?? [],
      });
    } catch {
      setCompletionResult(null);
    } finally {
      setSubmitLoading(false);
      setShowCompletion(true);
    }
  }, [code, language, challenge]);

  const toggleExample = (index: number) => {
    setExpandedExamples((prev) => prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-white/40 text-sm">Loading challenge...</span>
        </motion.div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card variant="glow" padding="lg" className="text-center max-w-md">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold mb-2">Challenge Not Found</h2>
          <p className="text-white/50 text-sm mb-4">
            {error || "Day " + dayNumber + " could not be loaded."}
          </p>
          <Button variant="secondary" onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Badge variant="info" className="text-sm font-bold px-3 py-1">Day {challenge.day}</Badge>
            <Badge variant={challenge.difficulty as "easy" | "medium" | "hard"} className="text-sm">
              {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
            </Badge>
            <span className="text-xs text-white/40 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {challenge.solvedPercentage}% solved
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{challenge.title}</h1>
          <div className="flex flex-wrap gap-2">
            {challenge.topics.map((topic) => (
              <Badge key={topic} variant="default" className="text-xs">{topic}</Badge>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="w-full lg:w-[420px] lg:flex-shrink-0 space-y-4">
            <Card variant="default" padding="md">
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                Problem Statement
              </h2>
              <div className="text-sm text-white/80 leading-relaxed whitespace-pre-line">{challenge.description}</div>
            </Card>

            <Card variant="default" padding="md">
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Examples</h2>
              <div className="space-y-3">
                {challenge.examples.map((example, idx) => (
                  <div key={idx} className="rounded-xl bg-black/30 border border-white/5 overflow-hidden">
                    <button onClick={() => toggleExample(idx)} className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors">
                      <span className="text-xs font-semibold text-white/50">Example {idx + 1}</span>
                      <ChevronRight className={cn("w-4 h-4 text-white/30 transition-transform duration-200", expandedExamples.includes(idx) && "rotate-90")} />
                    </button>
                    <AnimatePresence>
                      {expandedExamples.includes(idx) && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-4 space-y-2">
                            <div>
                              <span className="text-[10px] font-semibold text-white/40 uppercase">Input</span>
                              <pre className="text-xs text-emerald-400 bg-emerald-500/5 rounded-lg px-3 py-2 mt-1 font-mono border border-emerald-500/10">{example.input}</pre>
                            </div>
                            <div>
                              <span className="text-[10px] font-semibold text-white/40 uppercase">Output</span>
                              <pre className="text-xs text-blue-400 bg-blue-500/5 rounded-lg px-3 py-2 mt-1 font-mono border border-blue-500/10">{example.output}</pre>
                            </div>
                            {example.explanation && (
                              <div>
                                <span className="text-[10px] font-semibold text-white/40 uppercase">Explanation</span>
                                <p className="text-xs text-white/60 mt-1 leading-relaxed">{example.explanation}</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </Card>

            <Card variant="default" padding="md">
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Constraints</h2>
              <ul className="space-y-2">
                {challenge.constraints.map((constraint, idx) => (
                  <li key={idx} className="text-xs text-white/60 flex items-start gap-2">
                    <span className="text-primary mt-0.5">{"\u2022"}</span>
                    <code className="font-mono text-white/70 bg-white/5 px-1.5 py-0.5 rounded text-[11px]">{constraint}</code>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="flex-1 min-w-0 space-y-4">
            <Card variant="default" padding="none" className="overflow-hidden">
              <div className="flex items-center border-b border-white/5 bg-white/[0.02]">
                {(["python", "javascript", "cpp"] as Language[]).map((lang) => (
                  <button key={lang} onClick={() => setLanguage(lang)} className={cn("px-5 py-3 text-sm font-medium transition-all duration-200 relative", language === lang ? "text-primary" : "text-white/40 hover:text-white/70")}>
                    {lang === "cpp" ? "C++" : lang.charAt(0).toUpperCase() + lang.slice(1)}
                    {language === lang && (
                      <motion.div layoutId="lang-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                    )}
                  </button>
                ))}
              </div>
              <MonacoEditor
                height={isMobile ? "350px" : "450px"}
                language={languageMap[language] ?? "python"}
                value={code}
                onChange={(val) => setCode(val ?? "")}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: !isMobile },
                  lineNumbers: "on",
                  wordWrap: "on",
                  scrollBeyondLastLine: false,
                  padding: { top: 16, bottom: 16 },
                  fontFamily: "'Geist Mono', 'JetBrains Mono', monospace",
                  roundedSelection: true,
                  cursorBlinking: "smooth",
                  smoothScrolling: true,
                  tabSize: language === "python" ? 4 : 2,
                  automaticLayout: true,
                }}
              />
            </Card>

            <div className="flex gap-3">
              <Button variant="secondary" size="lg" onClick={handleRun} loading={runLoading} className="flex-1">
                <Play className="w-4 h-4" />
                Run
              </Button>
              <Button variant="ghost" size="lg" onClick={handleVisualize} loading={vizLoading} className="flex-1 border border-white/10 hover:border-white/20">
                <Eye className="w-4 h-4" />
                Visualize
              </Button>
              <Button variant="primary" size="lg" onClick={handleSubmit} loading={submitLoading} className="flex-1">
                <Send className="w-4 h-4" />
                Submit
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {activeSection === "results" && runResult && (
                <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                  <TestResultsPanel result={runResult} />
                </motion.div>
              )}
              {activeSection === "results" && !runResult && !runLoading && (
                <motion.div key="no-results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                  <Card variant="default" padding="lg" className="text-center">
                    <p className="text-sm text-white/40">No results yet. Click Run to test your code.</p>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {activeSection === "viz" && (
                <motion.div key="viz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                  {vizLoading ? (
                    <Card variant="default" padding="lg" className="text-center">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-sm text-white/40">Generating execution trace...</p>
                    </Card>
                  ) : trace.length === 0 ? (
                    <Card variant="default" padding="lg" className="text-center">
                      <Eye className="w-8 h-8 text-white/20 mx-auto mb-3" />
                      <p className="text-sm text-white/40">Click Visualize to see execution trace</p>
                    </Card>
                  ) : (
                    <ExecutionVisualizer trace={trace} code={code} language={language} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <CompletionModal
        isOpen={showCompletion}
        onClose={() => setShowCompletion(false)}
        result={completionResult}
        day={challenge.day}
        challengeTitle={challenge.title}
      />
    </div>
  );
}

function TestResultsPanel({ result }: { result: CodeRunResult }) {
  return (
    <Card variant="default" padding="md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className={cn("w-4 h-4", result.status === "accepted" ? "text-emerald-400" : "text-red-400")} />
          Test Results
        </h3>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-white/50">
            <Clock className="w-3.5 h-3.5" />
            {formatTime(result.runtime)}
          </span>
          <span className="flex items-center gap-1 text-xs text-white/50">
            <MemoryStick className="w-3.5 h-3.5" />
            {formatMemory(result.memory)}
          </span>
        </div>
      </div>

      <div className={cn("rounded-xl px-4 py-3 mb-4 flex items-center justify-between", result.passed === result.total ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20")}>
        <div className="flex items-center gap-2">
          {result.passed === result.total ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400" />
          )}
          <span className={cn("font-semibold text-sm", result.passed === result.total ? "text-emerald-400" : "text-red-400")}>
            {result.passed}/{result.total} Test Cases Passed
          </span>
        </div>
        <Badge variant={result.status === "accepted" ? "success" : "warning"}>
          {result.status.replace(/_/g, " ").toUpperCase()}
        </Badge>
      </div>

      <div className="space-y-2">
        {result.testResults.map((tr, idx) => (
          <div key={idx} className={cn("rounded-xl px-4 py-3 border transition-all", tr.passed ? "bg-emerald-500/5 border-emerald-500/10" : "bg-red-500/5 border-red-500/10")}>
            <div className="flex items-center gap-2 mb-2">
              {tr.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
              <span className="text-xs font-semibold text-white/70">Test Case {idx + 1}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div>
                <span className="text-white/40 uppercase font-semibold">Input</span>
                <pre className="text-white/70 bg-black/30 rounded px-2 py-1 mt-1 font-mono">{tr.input}</pre>
              </div>
              <div>
                <span className="text-white/40 uppercase font-semibold">Expected</span>
                <pre className="text-blue-400 bg-black/30 rounded px-2 py-1 mt-1 font-mono">{tr.expected}</pre>
              </div>
              <div>
                <span className="text-white/40 uppercase font-semibold">Actual</span>
                <pre className={cn("bg-black/30 rounded px-2 py-1 mt-1 font-mono", tr.passed ? "text-emerald-400" : "text-red-400")}>{tr.actual}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
