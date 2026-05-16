"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Shield, Zap, Brain, FileSearch, GitPullRequest, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Code Analysis",
    desc: "Instant expert-level review of any codebase. Trained on 10M+ repositories, catches what human reviewers miss.",
    color: "cyan",
    code: `// Cortex AI detected:\n⚠️  Race condition in fetchUser()\n✅  Fix: Use mutex lock\n📈  Performance: +34%`,
  },
  {
    icon: Shield,
    title: "Security Vulnerability Scanner",
    desc: "OWASP Top 10, SQL injection, XSS, CSRF, and 200+ security patterns. Zero false production surprises.",
    color: "violet",
  },
  {
    icon: Zap,
    title: "Real-time PR Integration",
    desc: "GitHub/GitLab integration. Every pull request auto-reviewed in under 30 seconds. Blocks bad code from merging.",
    color: "orange",
  },
  {
    icon: FileSearch,
    title: "Auto Documentation",
    desc: "Generates beautiful, accurate docs from your codebase. JSDoc, TypeDoc, Sphinx — whatever you need, automatically.",
    color: "green",
  },
  {
    icon: GitPullRequest,
    title: "Team Code Standards",
    desc: "Define your own rules. AI enforces your team's coding standards across every commit, every PR, every teammate.",
    color: "pink",
  },
  {
    icon: TrendingUp,
    title: "Code Health Dashboard",
    desc: "Track code quality trends over time. See which engineers write the cleanest code. Data-driven tech debt management.",
    color: "cyan",
  },
]

const colorMap: Record<string, string> = {
  cyan: "from-cyan-500 to-cyan-600 border-cyan-500/20 bg-cyan-500/10",
  violet: "from-violet-500 to-violet-600 border-violet-500/20 bg-violet-500/10",
  orange: "from-orange-500 to-orange-600 border-orange-500/20 bg-orange-500/10",
  green: "from-green-500 to-green-600 border-green-500/20 bg-green-500/10",
  pink: "from-pink-500 to-pink-600 border-pink-500/20 bg-pink-500/10",
}

export function Features() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-mono tracking-[4px] uppercase text-cyan-400 mb-4 block">
            ── What We Do ──
          </span>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-5">
            Everything your team needs
            <br />
            <span className="gradient-text">to ship perfect code</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            One platform for code review, security scanning, documentation, and quality metrics.
            Built for teams that care about craft.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon
            const colors = colorMap[feature.color] || colorMap.cyan
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="glass glass-hover rounded-2xl p-6 group relative overflow-hidden"
              >
                {/* Gradient orb on hover */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${colors.split(" ")[0]} ${colors.split(" ")[1]} opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-500 pointer-events-none`} />

                <div className={`w-11 h-11 rounded-xl border ${colors.split(" ").slice(2).join(" ")} flex items-center justify-center mb-5`}>
                  <Icon className={`w-5 h-5 bg-gradient-to-br ${colors.split(" ")[0]} ${colors.split(" ")[1]} bg-clip-text`} style={{ color: "transparent", filter: "none" }} />
                  <Icon className="w-5 h-5 text-current absolute opacity-100" style={{ color: feature.color === "cyan" ? "#22d3ee" : feature.color === "violet" ? "#a78bfa" : feature.color === "orange" ? "#fb923c" : feature.color === "green" ? "#4ade80" : "#f472b6" }} />
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>

                {feature.code && (
                  <pre className="mt-4 text-xs font-mono text-cyan-300/80 bg-slate-900/60 rounded-lg p-3 border border-cyan-500/10 overflow-auto leading-relaxed">
                    {feature.code}
                  </pre>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
