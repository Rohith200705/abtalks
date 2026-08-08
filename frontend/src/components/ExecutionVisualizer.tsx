"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  SkipForward,
  Eye,
  Code2,
  Variable,
  Boxes,
  Zap,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { ExecutionStep } from "@/types";

interface ExecutionVisualizerProps {
  trace: ExecutionStep[];
  code: string;
  language: string;
}

/* ───────────── Array Box Component ───────────── */

function ArrayBox({
  value,
  index,
  isActive,
  pointer,
  highlightColor,
}: {
  value: any;
  index: number;
  isActive?: boolean;
  pointer?: string;
  highlightColor?: string;
}) {
  return (
    <div className="flex flex-col items-center">
      {pointer && (
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-bold text-primary mb-0.5"
        >
          {pointer}
        </motion.span>
      )}
      <motion.div
        layout
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={cn(
          "relative w-12 h-12 rounded-lg flex items-center justify-center text-sm font-mono font-bold border-2 transition-all duration-200",
          isActive
            ? highlightColor === "blue"
              ? "bg-blue-500/20 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/20"
              : highlightColor === "green"
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/20"
                : "bg-primary/20 border-primary text-primary shadow-lg shadow-primary/20"
            : "bg-white/5 border-white/15 text-white/70"
        )}
      >
        {typeof value === "object" ? JSON.stringify(value) : String(value)}
      </motion.div>
      <span className="text-[9px] text-white/30 mt-0.5 font-mono">{index}</span>
    </div>
  );
}

/* ───────────── Variable Inspector ───────────── */

function VariableInspector({
  variables,
  prevVariables,
}: {
  variables: Record<string, any>;
  prevVariables?: Record<string, any>;
}) {
  const entries = Object.entries(variables);
  if (entries.length === 0) {
    return (
      <div className="text-xs text-white/30 italic py-2">
        No variables in scope
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {entries.map(([name, value]) => {
        const isChanged =
          prevVariables &&
          JSON.stringify(prevVariables[name]) !== JSON.stringify(value);
        const isObject = typeof value === "object" && value !== null;

        return (
          <motion.div
            key={name}
            initial={isChanged ? { backgroundColor: "rgba(59, 130, 246, 0.15)" } : false}
            animate={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            transition={{ duration: 1 }}
            className="flex items-baseline gap-2 text-xs py-0.5"
          >
            <span className="font-mono font-semibold text-primary/80 shrink-0">
              {name}
            </span>
            <span className="text-white/30">=</span>
            <span
              className={cn(
                "font-mono break-all",
                isChanged ? "text-amber-400" : "text-white/60"
              )}
            >
              {isObject ? (
                <span className="text-blue-300/70">
                  {Array.isArray(value)
                    ? `[${value.join(", ")}]`
                    : JSON.stringify(value)}
                </span>
              ) : (
                String(value)
              )}
            </span>
            {isChanged && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-[8px] bg-amber-500/20 text-amber-400 px-1 rounded"
              >
                NEW
              </motion.span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ───────────── Structures Panel ───────────── */

function StructuresPanel({
  structures,
  currentStep,
}: {
  structures: Record<string, any>;
  currentStep: ExecutionStep;
}) {
  const entries = Object.entries(structures);

  return (
    <div className="space-y-4">
      {entries.map(([name, data]) => {
        // Handle array/list structures
        if (Array.isArray(data)) {
          const pointers = currentStep.structures?.pointers ?? {};
          return (
            <div key={name}>
              <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                {name}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {data.map((val: any, idx: number) => {
                  const activePointer =
                    Object.entries(pointers).find(
                      ([, v]) => v === idx
                    )?.[0] ?? null;
                  const isActive = !!activePointer;

                  return (
                    <ArrayBox
                      key={idx}
                      value={val}
                      index={idx}
                      isActive={isActive}
                      pointer={activePointer ?? undefined}
                      highlightColor={activePointer === "i" ? "blue" : "green"}
                    />
                  );
                })}
              </div>
            </div>
          );
        }

        // Handle pointer structures
        if (name === "pointers") {
          return null; // Rendered inline with arrays
        }

        // Handle non-array objects
        if (typeof data === "object" && data !== null) {
          return (
            <div key={name}>
              <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                {name}
              </div>
              <div className="bg-black/30 rounded-lg px-3 py-2 border border-white/5">
                <pre className="text-xs text-white/60 font-mono whitespace-pre-wrap">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

/* ───────────── Code Panel ───────────── */

function CodePanel({
  code,
  currentLine,
}: {
  code: string;
  currentLine: number;
}) {
  const codeRef = useRef<HTMLDivElement>(null);
  const lines = code.split("\n");

  useEffect(() => {
    if (codeRef.current) {
      const activeLine = codeRef.current.querySelector(
        "[data-active-line]"
      );
      if (activeLine) {
        activeLine.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  }, [currentLine]);

  return (
    <div
      ref={codeRef}
      className="bg-[#0d1117] rounded-xl border border-white/5 overflow-auto max-h-[400px] lg:max-h-[500px] scrollbar-thin"
    >
      <div className="font-mono text-[12px] leading-5 p-4">
        {lines.map((line, idx) => {
          const lineNumber = idx + 1;
          const isActive = lineNumber === currentLine;

          return (
            <div
              key={idx}
              data-active-line={isActive ? "" : undefined}
              className={cn(
                "flex items-center gap-3 px-2 -mx-2 rounded transition-all duration-150",
                isActive
                  ? "bg-blue-500/10 border-l-2 border-primary"
                  : "border-l-2 border-transparent hover:bg-white/[0.02]"
              )}
            >
              <span
                className={cn(
                  "w-6 text-right shrink-0 select-none",
                  isActive ? "text-primary" : "text-white/20"
                )}
              >
                {lineNumber}
              </span>
              <span
                className={cn(
                  "whitespace-pre",
                  isActive ? "text-white" : "text-white/60"
                )}
              >
                {line || " "}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────── Main Visualizer ───────────── */

export function ExecutionVisualizer({
  trace,
  code,
  language,
}: ExecutionVisualizerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSteps = trace.length;
  const step = trace[currentStep];

  const play = useCallback(() => {
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 500);
  }, [totalSteps]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const goToPrev = useCallback(() => {
    pause();
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, [pause]);

  const goToNext = useCallback(() => {
    pause();
    setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1));
  }, [pause, totalSteps]);

  const skipToEnd = useCallback(() => {
    pause();
    setCurrentStep(totalSteps - 1);
  }, [pause, totalSteps]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Reset when trace changes
  useEffect(() => {
    setCurrentStep(0);
    pause();
  }, [trace, pause]);

  if (!trace || trace.length === 0) {
    return (
      <Card variant="default" padding="lg" className="text-center">
        <Eye className="w-10 h-10 text-white/20 mx-auto mb-3" />
        <p className="text-sm text-white/40 mb-1">No execution trace available</p>
        <p className="text-xs text-white/25">
          Execution visualization is currently available for supported Python
          programs.
        </p>
      </Card>
    );
  }

  const prevVariables =
    currentStep > 0 ? trace[currentStep - 1]?.variables : undefined;

  return (
    <Card variant="default" padding="none" className="overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-white/70">
            Execution Visualizer
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono">
            {language}
          </span>
          {step?.function && (
            <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-mono">
              {step.function}()
            </span>
          )}
        </div>
      </div>

      {/* Content: Two-panel layout */}
      <div className="flex flex-col lg:flex-row">
        {/* Left: Code */}
        <div className="lg:w-1/2 p-4 border-b lg:border-b-0 lg:border-r border-white/5">
          <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Code2 className="w-3 h-3" />
            Source Code
          </div>
          <CodePanel code={code} currentLine={step?.line ?? 1} />
        </div>

        {/* Right: Visualization */}
        <div className="lg:w-1/2 p-4">
          <div className="space-y-4">
            {/* Step Indicator */}
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3 h-3" />
                State
              </div>
              <span className="text-xs text-white/40 font-mono">
                Step {currentStep + 1} / {totalSteps}
              </span>
            </div>

            {/* Expression */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
              >
                {step?.expression && (
                  <div className="rounded-xl bg-primary/5 border border-primary/10 px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <ArrowRight className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-semibold text-primary/60 uppercase">
                        Expression
                      </span>
                    </div>
                    <code className="text-sm text-primary font-mono">
                      {step.expression}
                    </code>
                    {step.value !== undefined && step.value !== null && (
                      <div className="mt-1.5 text-xs text-white/40">
                        Result:{" "}
                        <span className="text-emerald-400 font-mono font-semibold">
                          {typeof step.value === "object"
                            ? JSON.stringify(step.value)
                            : String(step.value)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Variables */}
            <div>
              <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Variable className="w-3 h-3" />
                Variables
              </div>
              <div className="bg-black/30 rounded-xl border border-white/5 px-3 py-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    <VariableInspector
                      variables={step?.variables ?? {}}
                      prevVariables={prevVariables}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Structures (Arrays) */}
            {step?.structures && Object.keys(step.structures).length > 0 && (
              <div>
                <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Boxes className="w-3 h-3" />
                  Data Structures
                </div>
                <div className="bg-black/30 rounded-xl border border-white/5 px-3 py-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      <StructuresPanel
                        structures={step.structures}
                        currentStep={step}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 py-3 border-t border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          {/* Prev */}
          <button
            onClick={goToPrev}
            disabled={currentStep === 0}
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={isPlaying ? pause : play}
            disabled={currentStep >= totalSteps - 1 && !isPlaying}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center font-semibold transition-all border",
              isPlaying
                ? "bg-primary/20 border-primary/40 text-primary hover:bg-primary/30"
                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white",
              currentStep >= totalSteps - 1 && !isPlaying && "opacity-30 cursor-not-allowed"
            )}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            onClick={goToNext}
            disabled={currentStep >= totalSteps - 1}
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Skip to End */}
          <button
            onClick={skipToEnd}
            disabled={currentStep >= totalSteps - 1}
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Progress bar */}
          <div className="flex-1 mx-2">
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{
                  width: `${((currentStep + 1) / totalSteps) * 100}%`,
                }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>

          {/* Step Counter */}
          <span className="text-xs text-white/30 font-mono whitespace-nowrap">
            {currentStep + 1}/{totalSteps}
          </span>
        </div>
      </div>
    </Card>
  );
}