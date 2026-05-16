"use client"

import { motion } from "framer-motion"
import { formatRelativeTime, getScoreColor, getSeverityColor } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Code2, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface ReviewCardProps {
  review: {
    id: string
    language: string
    score: number
    issueCount: number
    severity: string
    createdAt: string | Date
  }
  index?: number
  onClick?: () => void
}

const languageColors: Record<string, string> = {
  javascript: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  typescript: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  python: "bg-green-500/10 text-green-400 border-green-500/20",
  java: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  go: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  rust: "bg-red-500/10 text-red-400 border-red-500/20",
  default: "bg-slate-500/10 text-slate-400 border-slate-500/20",
}

export function ReviewCard({ review, index = 0, onClick }: ReviewCardProps) {
  const langColor = languageColors[review.language] || languageColors.default
  const scoreColor = getScoreColor(review.score)
  const severityStyle = getSeverityColor(review.severity)
  const scoreWidth = `${review.score}%`

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      onClick={onClick}
      className="glass rounded-xl p-4 border border-slate-700/40 hover:border-cyan-500/25 transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-cyan-500/5"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center flex-shrink-0 group-hover:border-cyan-500/30 transition-colors">
            <Code2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="min-w-0">
            <div className={`inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-mono font-medium ${langColor}`}>
              {review.language}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${severityStyle}`}>
            <AlertTriangle className="w-2.5 h-2.5" />
            {review.severity}
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-500">Quality Score</span>
          <span className={`text-sm font-black ${scoreColor}`}>{review.score}/100</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: scoreWidth }}
            transition={{ duration: 0.8, delay: index * 0.06 + 0.2, ease: "easeOut" }}
            className={`h-full rounded-full ${
              review.score >= 80 ? "bg-green-400" :
              review.score >= 60 ? "bg-yellow-400" :
              review.score >= 40 ? "bg-orange-400" : "bg-red-400"
            }`}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          {review.issueCount > 0 ? (
            <><AlertTriangle className="w-3 h-3 text-orange-400" />{review.issueCount} issue{review.issueCount !== 1 ? "s" : ""} found</>
          ) : (
            <><CheckCircle className="w-3 h-3 text-green-400" />No issues found</>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <Clock className="w-3 h-3" />
          {formatRelativeTime(review.createdAt)}
        </div>
      </div>
    </motion.div>
  )
}
