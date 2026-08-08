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
import { githubApi } from "@/lib/api";

export default function GitHubCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [repoUrl, setRepoUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data: any = await githubApi.getStatus();
        const ghStatus = data.status ?? data;
        if (!cancelled) {
          if (ghStatus?.connected) {
            setStatus("success");
            setRepoUrl(ghStatus.repositoryUrl || null);
          } else {
            setStatus("error");
            setErrorMsg("GitHub connection was not established. Please try again.");
          }
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
          setErrorMsg("Failed to verify GitHub connection status.");
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-card glow-blue p-8 max-w-md w-full text-center"
      >
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
          <GitBranch className="w-8 h-8" />
        </div>

        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
            <h1 className="text-xl font-bold">Connecting to GitHub...</h1>
            <p className="text-sm text-muted">Please wait while we verify your connection.</p>
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
              Your GitHub account has been successfully connected.
            </p>
            {repoUrl && (
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline inline-block"
              >
                View your repository
              </a>
            )}
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
              {errorMsg || "Something went wrong while connecting to GitHub."}
            </p>
          </motion.div>
        )}

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
