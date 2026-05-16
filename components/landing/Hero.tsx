"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, GitPullRequest, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef } from "react"

const WORDS = ["Catch Bugs.", "Ship Faster.", "Review Smarter.", "Code Better."]

function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext("2d")!
    let animId: number
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener("resize", onResize)

    interface Particle { x: number; y: number; vx: number; vy: number; r: number; o: number }
    const particles: Particle[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      o: Math.random() * 0.4 + 0.05,
    }))

    let mx = canvas.width / 2, my = canvas.height / 2
    window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY })

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        const dx = p.x - mx, dy = p.y - my, dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100) { p.x += (dx / dist) * 1.2; p.y += (dy / dist) * 1.2 }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,212,255,${p.o})`; ctx.fill()
      })
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 110) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(0,212,255,${0.06 * (1 - d / 110)})`; ctx.lineWidth = 0.5; ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize) }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none z-0" />
}

function ScrambleText({ words }: { words: string[] }) {
  const ref = useRef<HTMLSpanElement>(null)
  const chars = "!<>-_\\/[]{}—=+*^?#✦◈"
  useEffect(() => {
    let idx = 0, isCancelled = false
    const scramble = (target: string) => new Promise<void>((res) => {
      const el = ref.current!
      const orig = el.innerText, maxLen = Math.max(orig.length, target.length)
      let frame = 0, queue: Array<{ from: string; to: string; start: number; end: number; ch?: string }> = []
      for (let i = 0; i < maxLen; i++) {
        const s = Math.floor(Math.random() * 15), e = s + Math.floor(Math.random() * 15)
        queue.push({ from: orig[i] ?? "", to: target[i] ?? "", start: s, end: e })
      }
      const update = () => {
        if (isCancelled) return
        let out = "", done = 0
        queue.forEach((q) => {
          if (frame >= q.end) { done++; out += q.to }
          else if (frame >= q.start) { if (!q.ch || Math.random() < 0.28) q.ch = chars[Math.floor(Math.random() * chars.length)]; out += `<span style="opacity:.35;color:#00D4FF">${q.ch}</span>` }
          else out += q.from
        })
        el.innerHTML = out; frame++
        if (done === queue.length) res()
        else requestAnimationFrame(update)
      }
      requestAnimationFrame(update)
    })
    const cycle = async () => {
      while (!isCancelled) {
        await scramble(words[idx % words.length]); idx++
        await new Promise((r) => setTimeout(r, 2600))
      }
    }
    cycle()
    return () => { isCancelled = true }
  }, [words])
  return <span ref={ref} className="text-cyan-400 text-glow-cyan">{words[0]}</span>
}

const stats = [
  { icon: Zap, label: "Faster Reviews", value: "4x" },
  { icon: Shield, label: "Bugs Caught", value: "98%" },
  { icon: GitPullRequest, label: "PRs Analyzed", value: "2M+" },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden">
      <ParticleCanvas />

      {/* Ambient blobs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-blob pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-violet-500/8 rounded-full blur-3xl animate-blob pointer-events-none" style={{ animationDelay: "3s" }} />

      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/5 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          AI-Powered Code Intelligence Platform
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95] mb-6"
        >
          <span className="text-white">Code Smarter.</span>
          <br />
          <ScrambleText words={WORDS} />
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Cortex AI is the elite code review platform that catches bugs, security vulnerabilities,
          and performance issues — before they reach production. Powered by Google GEMINI.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <Button asChild size="xl" variant="glow" className="group">
            <Link href="/register">
              Start Reviewing Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button asChild size="xl" variant="outline">
            <Link href="#demo">Watch Demo ↓</Link>
          </Button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-10"
        >
          {stats.map(({ icon: Icon, label, value }, i) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Icon className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-left">
                <div className="text-xl font-black text-white">{value}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600 text-xs font-mono tracking-widest"
      >
        <div className="w-px h-10 bg-gradient-to-b from-cyan-500 to-transparent animate-pulse" />
        SCROLL
      </motion.div>
    </section>
  )
}
