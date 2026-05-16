"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { getSeverityColor, getScoreColor, LANGUAGES } from "@/lib/utils"
import {
  Code2, Zap, AlertTriangle, CheckCircle, TrendingUp,
  Copy, Trash2, ChevronDown, Lightbulb, Shield, ArrowRight
} from "lucide-react"

const SAMPLE_CODE = `// Paste your code here for an instant AI review!
// Example: This buggy function has multiple issues
async function getUser(req, res) {
  const { id } = req.query;
  // 🔴 SQL Injection vulnerability here!
  const query = \`SELECT * FROM users WHERE id = \${id}\`;
  const result = await db.query(query);
  // 🟡 No null check — crashes if user not found
  res.json(result.rows[0].data);
}`

interface ReviewResult {
  score: number
  severity: string
  summary: string
  issues: Array<{ type: string; severity: string; description: string; fix?: string }>
  improvements: string[]
  feedback: string
}

export default function ReviewPage() {
  const { toast } = useToast()
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [activeTab, setActiveTab] = useState<"summary" | "issues" | "improvements">("summary")

  const handleReview = async () => {
    if (!code.trim() || code.length < 10) {
      toast({ title: "Code too short", description: "Please paste at least 10 characters of code.", variant: "destructive" })
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Review failed")
      setResult(data.review)
      toast({ title: "Review complete! ✅", description: `Quality score: ${data.review.score}/100` })
      setActiveTab("summary")
    } catch (err: any) {
      toast({ title: "Review failed", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    toast({ title: "Copied to clipboard" })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-white mb-1">AI Code Review</h1>
        <p className="text-slate-400 text-sm">Paste any code. Get expert AI analysis in seconds.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left — Code Input */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass rounded-2xl border border-slate-700/40 overflow-hidden">
            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60 bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-slate-500 text-xs font-mono">code-input</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Language selector */}
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="appearance-none bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs rounded-lg pl-3 pr-7 py-1.5 focus:outline-none focus:border-cyan-500/50 cursor-pointer font-mono"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <button onClick={copyCode} disabled={!code} className="text-slate-500 hover:text-slate-300 disabled:opacity-30 transition-colors p-1">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setCode("")} disabled={!code} className="text-slate-500 hover:text-red-400 disabled:opacity-30 transition-colors p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={SAMPLE_CODE}
              className="code-editor w-full h-[420px] p-4 text-sm leading-relaxed resize-none bg-transparent"
              spellCheck={false}
            />

            {/* Bottom bar */}
            <div className="px-4 py-3 border-t border-slate-800/60 flex items-center justify-between bg-slate-900/20">
              <span className="text-slate-600 text-xs font-mono">
                {code.length.toLocaleString()} chars · {code.split("\n").length} lines
              </span>
              <Button
                onClick={handleReview}
                loading={loading}
                disabled={loading || !code.trim()}
                size="sm"
                variant="glow"
              >
                <Zap className="w-3.5 h-3.5" />
                {loading ? "Analyzing..." : "Review with AI"}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Right — Results */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <AnimatePresence mode="wait">
            {/* Loading state */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass rounded-2xl border border-cyan-500/15 h-[504px] flex flex-col items-center justify-center gap-6"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 flex items-center justify-center">
                    <Zap className="w-7 h-7 text-cyan-400 animate-pulse" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold mb-1">AI is analyzing your code...</p>
                  <p className="text-slate-500 text-sm">Checking security, performance, logic &amp; style</p>
                </div>
                <div className="flex flex-col gap-2 w-48">
                  {["Parsing AST...", "Security scan...", "Quality check..."].map((step, i) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.4 }}
                      className="flex items-center gap-2 text-xs text-slate-400"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                      {step}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Empty state */}
            {!loading && !result && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-2xl border border-slate-700/40 h-[504px] flex flex-col items-center justify-center gap-4 text-center p-8"
              >
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Code2 className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-2">Your AI review will appear here</p>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Paste your code on the left, choose the language, and click{" "}
                    <span className="text-cyan-400">"Review with AI"</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full max-w-xs mt-2">
                  {["Security scan", "Bug detection", "Performance", "Best practices"].map((f) => (
                    <div key={f} className="flex items-center gap-1.5 text-xs text-slate-500">
                      <CheckCircle className="w-3 h-3 text-cyan-500/50" />{f}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Results */}
            {!loading && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-2xl border border-slate-700/40 overflow-hidden"
              >
                {/* Score header */}
                <div className="p-5 border-b border-slate-800/60 bg-slate-900/30">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-slate-400 text-xs mb-1">Overall Quality Score</p>
                      <div className="flex items-end gap-2">
                        <span className={`text-5xl font-black ${getScoreColor(result.score)}`}>{result.score}</span>
                        <span className="text-slate-500 text-lg mb-1">/100</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-bold ${getSeverityColor(result.severity)}`}>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {result.severity}
                      </div>
                      <div className="text-xs text-slate-500 mt-1.5">{result.issues.length} issues · {result.improvements.length} suggestions</div>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.score}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${result.score >= 80 ? "bg-gradient-to-r from-green-500 to-green-400" : result.score >= 60 ? "bg-gradient-to-r from-yellow-500 to-yellow-400" : result.score >= 40 ? "bg-gradient-to-r from-orange-500 to-orange-400" : "bg-gradient-to-r from-red-500 to-red-400"}`}
                    />
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800/60">
                  {(["summary", "issues", "improvements"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 text-xs font-semibold capitalize transition-all ${activeTab === tab ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5" : "text-slate-500 hover:text-slate-300"}`}
                    >
                      {tab} {tab === "issues" && result.issues.length > 0 && `(${result.issues.length})`}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="p-4 h-[280px] overflow-y-auto">
                  {activeTab === "summary" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                      <p className="text-slate-300 text-sm leading-relaxed">{result.summary}</p>
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {[
                          { label: "Issues", value: result.issues.length, icon: AlertTriangle, color: "orange" },
                          { label: "Score", value: `${result.score}%`, icon: TrendingUp, color: "cyan" },
                          { label: "Fixes", value: result.improvements.length, icon: Lightbulb, color: "violet" },
                        ].map(({ label, value, icon: Icon, color }) => (
                          <div key={label} className={`rounded-xl p-3 bg-${color}-500/5 border border-${color}-500/15 text-center`}>
                            <Icon className={`w-4 h-4 text-${color}-400 mx-auto mb-1`} />
                            <div className="text-white font-bold text-lg">{value}</div>
                            <div className="text-slate-500 text-xs">{label}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "issues" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                      {result.issues.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-8 text-center">
                          <CheckCircle className="w-8 h-8 text-green-400" />
                          <p className="text-green-400 font-medium">No issues found!</p>
                          <p className="text-slate-500 text-xs">Your code looks clean.</p>
                        </div>
                      ) : result.issues.map((issue, i) => (
                        <div key={i} className={`rounded-xl p-3 border ${getSeverityColor(issue.severity)}`}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <Badge className={getSeverityColor(issue.severity)}>{issue.severity}</Badge>
                            <span className="text-xs font-semibold text-slate-300">{issue.type}</span>
                          </div>
                          <p className="text-slate-300 text-xs leading-relaxed">{issue.description}</p>
                          {issue.fix && (
                            <div className="mt-2 flex items-start gap-1.5">
                              <ArrowRight className="w-3 h-3 text-cyan-400 flex-shrink-0 mt-0.5" />
                              <p className="text-cyan-400/80 text-xs">{issue.fix}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === "improvements" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2.5">
                      {result.improvements.map((imp, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-violet-500/5 border border-violet-500/15">
                          <Lightbulb className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                          <p className="text-slate-300 text-xs leading-relaxed">{imp}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Language quick-select pills */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex flex-wrap gap-2">
          <span className="text-slate-500 text-xs self-center mr-1">Quick select:</span>
          {["javascript", "typescript", "python", "java", "go", "rust", "sql"].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                language === lang
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "bg-slate-800/50 text-slate-500 border border-slate-700/40 hover:text-slate-300 hover:border-slate-600"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
