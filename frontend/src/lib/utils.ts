import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'easy': return 'text-emerald-400';
    case 'medium': return 'text-amber-400';
    case 'hard': return 'text-red-400';
    default: return 'text-gray-400';
  }
}

export function getDifficultyBg(difficulty: string) {
  switch (difficulty) {
    case 'easy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'hard': return 'bg-red-500/10 text-red-400 border-red-500/20';
    default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function formatTime(ms: number) {
  return `${ms}ms`;
}

export function formatMemory(mb: number) {
  return `${mb} MB`;
}
