"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(emailOrUsername, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[150px] top-1/4 left-1/4" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[130px] bottom-1/4 right-1/4" />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-5xl font-bold tracking-tight">
              <span className="gradient-text">AB</span>
              <span className="text-white">Talks</span>
            </span>
          </Link>
        </div>
        <div className="glass-card p-8">
          <h1 className="text-2xl font-bold text-center mb-1">Welcome back</h1>
          <p className="text-sm text-muted text-center mb-6">
            Log in to continue your coding journey
          </p>
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted font-medium block mb-1.5">
                Email or Username
              </label>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="Enter your email or username"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-white placeholder:text-muted/60 outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-muted font-medium block mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-white placeholder:text-muted/60 outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold btn-gradient text-white flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
          <p className="text-sm text-muted text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
