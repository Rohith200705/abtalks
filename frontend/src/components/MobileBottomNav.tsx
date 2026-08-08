"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Code, Map, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/challenges", label: "Challenges", icon: Code },
  { href: "/journey", label: "Journey", icon: Map },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface/80 backdrop-blur-xl border-t border-border pb-6 safe-area-bottom">
      <div className="flex items-center justify-around pt-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted hover:text-white",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isActive && "drop-shadow-[0_0_6px_rgba(59,130,246,0.6)]",
                )}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
