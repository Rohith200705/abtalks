"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(name, username, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center px-4 py-8">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[150px] top-1/4 right-1/4" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[130px] bottom-1/4 left-1/4" />
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
          <h1 className="text-2xl font-bold text-center mb-1">Start your journey</h1>
          <p className="text-sm text-muted text-center mb-6">
            Create an account to begin your 60-day coding challenge
          </p>
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted font-medium block mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-white placeholder:text-muted/60 outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-muted font-medium block mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-white placeholder:text-muted/60 outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-muted font-medium block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-sm text-white placeholder:text-muted/60 outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-muted font-medium block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white/5 border border-border text-sm text-white placeholder:text-muted/60 outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold btn-gradient text-white flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="text-sm text-muted text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
