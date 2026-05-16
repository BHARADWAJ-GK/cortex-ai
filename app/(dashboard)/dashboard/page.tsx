"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { motion } from "framer-motion"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { ReviewCard } from "@/components/dashboard/ReviewCard"
import { WeeklyChart } from "@/components/dashboard/WeeklyChart"
import { Button } from "@/components/ui/button"
import {
  Code2, MessageSquare, TrendingUp, AlertTriangle,
  Zap, ArrowRight, Sparkles
} from "lucide-react"

interface DashboardData {
  totalReviews: number
  totalChats: number
  averageScore: number
  issuesFound: number
  recentReviews: any[]
  weeklyReviews: number[]
  plan: string
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 bg-slate-800 rounded-xl w-64" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-800/60 rounded-2xl" />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-slate-800/60 rounded-2xl" />
        <div className="h-64 bg-slate-800/60 rounded-2xl" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false) })
      .catch(() => { setError("Failed to load dashboard"); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="max-w-6xl mx-auto">
      <LoadingSkeleton />
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="text-red-400 text-4xl">⚠️</div>
      <p className="text-slate-400">{error}</p>
      <Button onClick={() => window.location.reload()} variant="outline" size="sm">Try again</Button>
    </div>
  )

  const name = session?.user?.name?.split(" ")[0] || "Developer"
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-3xl font-black text-white mb-1">
            {greeting}, {name} 👋
          </h1>
          <p className="text-slate-400 text-sm">
            Here's what's happening with your code quality today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/chat"><MessageSquare className="w-4 h-4" />AI Chat</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/review"><Zap className="w-4 h-4" />New Review</Link>
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Reviews"
          value={stats?.totalReviews ?? 0}
          icon={Code2}
          color="cyan"
          delay={0}
        />
        <StatsCard
          title="AI Chats"
          value={stats?.totalChats ?? 0}
          icon={MessageSquare}
          color="violet"
          delay={0.08}
        />
        <StatsCard
          title="Avg Score"
          value={stats?.averageScore ?? 0}
          suffix="%"
          icon={TrendingUp}
          color="green"
          delay={0.16}
        />
        <StatsCard
          title="Issues Found"
          value={stats?.issuesFound ?? 0}
          icon={AlertTriangle}
          color="orange"
          delay={0.24}
        />
      </div>

      {/* Middle row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Reviews */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Recent Reviews</h2>
              <Link href="/review" className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {!stats?.recentReviews?.length ? (
              <div className="glass rounded-2xl p-10 border border-slate-700/40 text-center">
                <Code2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 font-medium mb-2">No reviews yet</p>
                <p className="text-slate-600 text-sm mb-4">Paste any code to get instant AI feedback</p>
                <Button asChild size="sm">
                  <Link href="/review">Start your first review</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentReviews.map((r, i) => (
                  <ReviewCard key={r.id} review={r} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Weekly chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <WeeklyChart data={stats?.weeklyReviews ?? Array(7).fill(0)} />
          </motion.div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
            className="glass rounded-2xl p-5 border border-slate-700/40"
          >
            <h3 className="text-white font-semibold text-sm mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { href: "/review", icon: Code2, label: "Review Code", color: "cyan" },
                { href: "/chat", icon: MessageSquare, label: "Ask AI Assistant", color: "violet" },
                { href: "/settings", icon: Sparkles, label: "Upgrade Plan", color: "orange" },
              ].map(({ href, icon: Icon, label, color }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors group"
                >
                  <div className={`w-8 h-8 rounded-lg bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 text-${color}-400`} />
                  </div>
                  <span className="text-slate-300 text-sm group-hover:text-white transition-colors">{label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 ml-auto group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Plan status */}
          {stats?.plan === "FREE" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl p-5 bg-gradient-to-br from-violet-500/10 to-cyan-500/5 border border-violet-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-white font-semibold text-sm">Upgrade to Pro</span>
              </div>
              <p className="text-slate-400 text-xs mb-4 leading-relaxed">
                Unlimited reviews, 25 repos, advanced security scanning, and more.
              </p>
              <Button asChild size="sm" className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-400 hover:to-cyan-400">
                <Link href="/settings">Upgrade for $19/mo →</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
