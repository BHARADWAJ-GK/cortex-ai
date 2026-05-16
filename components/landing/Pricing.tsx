"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Check, Zap } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: 0,
    period: "forever",
    desc: "Perfect for solo devs getting started",
    features: ["10 AI code reviews/month", "1 repository", "Basic security scan", "Community support", "Code quality score"],
    cta: "Start free",
    href: "/register",
    featured: false,
  },
  {
    name: "Pro",
    price: 19,
    period: "per month",
    desc: "For serious developers and small teams",
    features: ["Unlimited AI reviews", "25 repositories", "Advanced security scanning", "GitHub/GitLab integration", "Auto documentation", "Team dashboard (5 seats)", "Priority support", "API access"],
    cta: "Start Pro trial",
    href: "/register?plan=pro",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    desc: "For large engineering organizations",
    features: ["Everything in Pro", "Unlimited repositories", "Unlimited seats", "Dedicated AI instance", "SOC 2 compliance", "SSO / SAML", "Custom integrations", "SLA + 24/7 support"],
    cta: "Contact sales →",
    href: "/contact",
    featured: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono tracking-[4px] uppercase text-cyan-400 mb-4 block">── Pricing ──</span>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-slate-400 text-lg">Start free. Upgrade when your team is ready. No surprises.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className={`relative rounded-2xl p-8 ${
                plan.featured
                  ? "bg-gradient-to-b from-cyan-500/10 to-violet-500/10 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 scale-105"
                  : "glass border border-slate-700/50"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-600 text-xs font-bold text-white tracking-wide whitespace-nowrap">
                  <Zap className="w-3 h-3" /> MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <div className="text-xs font-mono tracking-widest uppercase text-slate-500 mb-1">{plan.name}</div>
                <div className="flex items-end gap-1 mb-1">
                  {typeof plan.price === "number" ? (
                    <>
                      <span className="text-5xl font-black text-white">${plan.price}</span>
                      <span className="text-slate-400 text-sm mb-2">/{plan.period}</span>
                    </>
                  ) : (
                    <span className="text-5xl font-black text-white">{plan.price}</span>
                  )}
                </div>
                <p className="text-slate-400 text-sm">{plan.desc}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.featured ? "glow" : "outline"}
                size="lg"
                className="w-full"
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-slate-500 text-sm mt-10"
        >
          All plans include 14-day free trial. No credit card required for Starter.
        </motion.p>
      </div>
    </section>
  )
}
