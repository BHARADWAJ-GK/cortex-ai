"use client"

import { motion } from "framer-motion"

const testimonials = [
  { name: "Priya Sharma", role: "Senior SWE @ Stripe", avatar: "PS", color: "#00D4FF", quote: "Cortex AI caught a critical SQL injection vulnerability our entire team missed. Shipped it to prod, would've been a disaster. Now non-negotiable for every PR." },
  { name: "Marcus Chen", role: "CTO @ BuildFast", avatar: "MC", color: "#8B5CF6", quote: "Sprint velocity jumped 40% after deploying Cortex. Junior devs write better code faster. The AI explains why something is wrong, not just that it is." },
  { name: "Aisha Okonkwo", role: "Lead Engineer @ Paystack", avatar: "AO", color: "#F97316", quote: "Code review quality is now consistently senior-level. Cortex has become the standard of truth for our entire engineering org. Worth every cent." },
  { name: "James Rivera", role: "Full Stack @ Nubank", avatar: "JR", color: "#10B981", quote: "Onboarding new devs is 3x faster. They push code, get immediate AI feedback, and learn from it. Like having a senior mentor available 24/7." },
  { name: "Sarah Kim", role: "DevOps Lead @ Vercel", avatar: "SK", color: "#00D4FF", quote: "Auto-documentation alone saves my team 8+ hours per week. The security scanner blocked 3 production incidents last quarter. ROI is insane." },
  { name: "David Okafor", role: "Principal SWE @ Flutterwave", avatar: "DO", color: "#8B5CF6", quote: "I've used Copilot, Tabnine, SonarQube. Nothing comes close. Cortex understands the full context of your codebase. It actually thinks." },
]

export function Testimonials() {
  const firstHalf = testimonials.slice(0, 3)
  const secondHalf = testimonials.slice(3)

  return (
    <section id="testimonials" className="py-28 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-xs font-mono tracking-[4px] uppercase text-cyan-400 mb-4 block">── Loved Globally ──</span>
        <h2 className="text-4xl md:text-5xl font-black text-white">Developers worldwide trust Cortex</h2>
      </motion.div>

      {/* Scrolling rows */}
      {[firstHalf, secondHalf].map((row, ri) => (
        <div key={ri} className={`flex gap-5 mb-5 w-max ${ri === 1 ? "animate-[mq_22s_linear_infinite_reverse]" : "animate-[mq_22s_linear_infinite]"}`}
          style={{ animation: `${ri === 0 ? "scroll-left" : "scroll-right"} 25s linear infinite` }}>
          {[...row, ...row, ...row].map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-80 glass rounded-xl p-5 border border-slate-700/40 hover:border-cyan-500/25 transition-colors group"
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, si) => (
                  <span key={si} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">"{t.quote}"</p>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: `${t.color}22`, border: `1px solid ${t.color}44`, color: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{t.name}</div>
                  <div className="text-slate-500 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      <style jsx>{`
        @keyframes scroll-left { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }
        @keyframes scroll-right { from { transform: translateX(-33.33%); } to { transform: translateX(0); } }
      `}</style>
    </section>
  )
}
