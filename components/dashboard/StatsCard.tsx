"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: number | string
  suffix?: string
  icon: LucideIcon
  color: "cyan" | "violet" | "green" | "orange"
  description?: string
  delay?: number
  animate?: boolean
}

const colorMap = {
  cyan:   { icon: "text-cyan-400",   bg: "bg-cyan-500/10",   border: "border-cyan-500/20",   glow: "shadow-cyan-500/10" },
  violet: { icon: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", glow: "shadow-violet-500/10" },
  green:  { icon: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/20",  glow: "shadow-green-500/10" },
  orange: { icon: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", glow: "shadow-orange-500/10" },
}

function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start || typeof target !== "number") return
    let startTime: number
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

export function StatsCard({ title, value, suffix = "", icon: Icon, color, description, delay = 0, animate = true }: StatsCardProps) {
  const c = colorMap[color]
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const numValue = typeof value === "number" ? value : 0
  const displayValue = useCountUp(numValue, 1200, visible && animate)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true) }, { threshold: 0.2 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative glass rounded-2xl p-6 border ${c.border} shadow-lg ${c.glow} overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}
    >
      {/* Background glow */}
      <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full ${c.bg} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        {description && (
          <span className="text-xs text-slate-500 text-right max-w-[120px] leading-tight">{description}</span>
        )}
      </div>

      <div className="relative z-10">
        <div className="flex items-end gap-1">
          <span className="text-4xl font-black text-white tracking-tight">
            {animate && typeof value === "number" && visible ? displayValue.toLocaleString() : (typeof value === "number" ? value.toLocaleString() : value)}
          </span>
          {suffix && <span className={`text-xl font-bold ${c.icon} mb-1`}>{suffix}</span>}
        </div>
        <p className="text-slate-400 text-sm mt-1 font-medium">{title}</p>
      </div>
    </motion.div>
  )
}
