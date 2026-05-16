"use client"

import { motion } from "framer-motion"

interface WeeklyChartProps {
  data: number[]
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function WeeklyChart({ data }: WeeklyChartProps) {
  const max = Math.max(...data, 1)

  return (
    <div className="glass rounded-2xl p-5 border border-slate-700/40">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-semibold text-sm">Weekly Activity</h3>
          <p className="text-slate-500 text-xs mt-0.5">Code reviews last 7 days</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-white">{data.reduce((a, b) => a + b, 0)}</div>
          <div className="text-xs text-slate-500">total reviews</div>
        </div>
      </div>

      <div className="flex items-end gap-1.5 h-24">
        {data.map((val, i) => {
          const heightPct = max > 0 ? (val / max) * 100 : 0
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full flex flex-col justify-end" style={{ height: "80px" }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(heightPct, val > 0 ? 8 : 3)}%` }}
                  transition={{ duration: 0.6, delay: i * 0.07, ease: "easeOut" }}
                  className={`w-full rounded-t-sm transition-colors ${
                    val > 0
                      ? "bg-gradient-to-t from-cyan-600 to-cyan-400 group-hover:from-cyan-500 group-hover:to-cyan-300"
                      : "bg-slate-800"
                  }`}
                  style={{ minHeight: "3px" }}
                />
              </div>
              <span className="text-[10px] text-slate-600 font-mono">{DAYS[i]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
