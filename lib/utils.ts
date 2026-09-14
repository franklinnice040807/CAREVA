import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function getLevelFromScore(score: number): 'BEGINNER' | 'INTERMEDIATE' | 'JOB_READY' {
  if (score >= 75) return 'JOB_READY';
  if (score >= 50) return 'INTERMEDIATE';
  return 'BEGINNER';
}

export function levelLabel(level: string): string {
  const map: Record<string, string> = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    JOB_READY: 'Job-ready',
  };
  return map[level] || level;
}

export function levelBadgeClass(level: string): string {
  const map: Record<string, string> = {
    BEGINNER: 'badge-beginner',
    INTERMEDIATE: 'badge-intermediate',
    JOB_READY: 'badge-job-ready',
  };
  return map[level] || 'badge bg-slate-100 text-slate-700';
}
