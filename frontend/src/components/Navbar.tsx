"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/challenges", label: "Challenges" },
  { href: "/journey", label: "Journey" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Profile" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="glass-card rounded-none border-x-0 border-t-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-1 shrink-0">
            <span className="text-2xl font-bold gradient-text">AB</span>
            <span className="text-2xl font-bold text-white">Talks</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted hover:text-white hover:bg-white/5",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile: just the logo is enough (bottom nav handles navigation) */}
          <div className="md:hidden" />
        </div>
      </div>
    </nav>
  );
}
