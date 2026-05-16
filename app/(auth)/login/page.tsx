"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Zap, Eye, EyeOff, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || "/dashboard"
  const { toast } = useToast()

  const [form, setForm] = useState({ email: "", password: "" })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      })

      if (res?.error) {
        toast({ title: "Sign in failed", description: res.error, variant: "destructive" })
      } else {
        toast({ title: "Welcome back! 🚀", variant: "success" as any })
        router.push(from)
        router.refresh()
      }
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#04060F] flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/8 rounded-full blur-3xl animate-blob" style={{ animationDelay: "3s" }} />

        <div className="relative z-10 max-w-sm">
          <div className="glass rounded-2xl p-6 mb-6">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              "Cortex AI saved us from a critical SQL injection vulnerability hours before our Series A demo. I cannot overstate the impact."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-bold">AK</div>
              <div>
                <div className="text-white text-sm font-semibold">Arjun Kumar</div>
                <div className="text-slate-500 text-xs">CTO @ TechStartup</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[["50K+", "Developers"], ["98%", "Accuracy"], ["4x", "Faster"]].map(([v, l]) => (
              <div key={l} className="glass rounded-xl p-3 text-center">
                <div className="text-xl font-black text-cyan-400">{v}</div>
                <div className="text-xs text-slate-500">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Back */}
          <Link href="/" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Cortex<span className="text-cyan-400">AI</span></span>
          </div>

          <h1 className="text-3xl font-black text-white mb-2">Welcome back</h1>
          <p className="text-slate-400 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300">Forgot password?</a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" loading={loading}>
              {loading ? "Signing in..." : "Sign in →"}
            </Button>
          </form>

          {/* Demo account hint */}
          <div className="mt-4 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/15">
            <p className="text-xs text-cyan-400/80 font-mono">
              Demo: demo@cortexai.dev / Demo123!
            </p>
          </div>

          <p className="text-center text-slate-500 text-sm mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
