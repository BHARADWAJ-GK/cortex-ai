import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return "just now"
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.substring(0, length) + "..."
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-400"
  if (score >= 60) return "text-yellow-400"
  if (score >= 40) return "text-orange-400"
  return "text-red-400"
}

export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case "critical": return "text-red-400 bg-red-400/10 border-red-400/20"
    case "high": return "text-orange-400 bg-orange-400/10 border-orange-400/20"
    case "medium": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
    case "low": return "text-green-400 bg-green-400/10 border-green-400/20"
    default: return "text-slate-400 bg-slate-400/10 border-slate-400/20"
  }
}

export const LANGUAGES = [
  "javascript", "typescript", "python", "java", "go",
  "rust", "c", "cpp", "csharp", "ruby", "php",
  "swift", "kotlin", "sql", "html", "css", "bash",
]

export const PLAN_LIMITS = {
  FREE: { reviews: 10, chats: 20, codeLength: 2000 },
  PRO: { reviews: 500, chats: 1000, codeLength: 20000 },
  ENTERPRISE: { reviews: Infinity, chats: Infinity, codeLength: 100000 },
}
