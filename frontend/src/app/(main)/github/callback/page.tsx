"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  GitBranch,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function GitHubCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    // Simulate OAuth callback processing
    const timer = setTimeout(() => {
      // For demo mode, always show success
      setStatus("success");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-card glow-blue p-8 max-w-md w-full text-center"
      >
        {/* GitHub Icon */}
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
          <GitBranch className="w-8 h-8" />
        </div>

        {/* Status */}
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
            <h1 className="text-xl font-bold">Connecting to GitHub...</h1>
            <p className="text-sm text-muted">Please wait while we complete the connection.</p>
          </div>
        )}

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-xl font-bold">GitHub Connected!</h1>
            <p className="text-sm text-muted">
              GitHub connected in demo mode
              <span className="text-emerald-400 font-medium"> ✓</span>
            </p>
            <p className="text-xs text-muted/60">
              Your solutions will be automatically committed to your GitHub repository.
            </p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-xl font-bold">Connection Failed</h1>
            <p className="text-sm text-muted">
              Something went wrong while connecting to GitHub.
            </p>
          </motion.div>
        )}

        {/* Back button */}
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold btn-gradient text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.01]"
        >
          Back to Dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
