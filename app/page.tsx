import { Navbar } from "@/components/landing/Navbar"
import { Hero } from "@/components/landing/Hero"
import { Features } from "@/components/landing/Features"
import { Pricing } from "@/components/landing/Pricing"
import { Testimonials } from "@/components/landing/Testimonials"
import { Footer } from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Demo section - live AI chat preview
function DemoSection() {
  return (
    <section id="demo" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/3 to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto text-center">
        <span className="text-xs font-mono tracking-[4px] uppercase text-cyan-400 mb-4 block">── Live Demo ──</span>
        <h2 className="text-5xl font-black text-white mb-4">See it in action</h2>
        <p className="text-slate-400 text-lg mb-10">Paste any code. Get expert AI review instantly.</p>
        <div className="glass rounded-2xl p-8 text-left border border-cyan-500/15">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <span className="text-slate-500 text-xs font-mono ml-2">cortex-ai — live review</span>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-slate-500">AI Online</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input code */}
            <div>
              <div className="text-xs text-slate-500 font-mono mb-2">INPUT — JavaScript</div>
              <pre className="bg-slate-900/60 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-auto leading-relaxed border border-slate-700/40">
{`async function getUser(req, res) {
  const { id } = req.query;
  const query = \`SELECT * FROM users 
    WHERE id = \${id}\`;  
  const result = await db.query(query);
  if (!result) return res.send(null);
  res.json(result.rows[0]);
}`}
              </pre>
            </div>

            {/* AI Output */}
            <div>
              <div className="text-xs text-slate-500 font-mono mb-2">CORTEX AI REVIEW</div>
              <div className="bg-slate-900/60 rounded-xl p-4 border border-red-500/15 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-xs font-semibold">CRITICAL</span>
                  <span className="text-white text-xs font-semibold">Score: 23/100</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex gap-2 text-red-300">
                    <span>🔴</span><span><strong>SQL Injection (Critical)</strong> — Line 3: Direct string interpolation allows full database compromise.</span>
                  </div>
                  <div className="flex gap-2 text-yellow-300">
                    <span>🟡</span><span><strong>No Auth Check</strong> — Any user can fetch any user's data. Add session validation.</span>
                  </div>
                  <div className="flex gap-2 text-orange-300">
                    <span>🟠</span><span><strong>No Input Validation</strong> — id parameter not validated or sanitized.</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-700/40 text-cyan-300/80">
                    <span>✅ <strong>Fix:</strong> Use parameterized queries: <code className="bg-slate-800 px-1 rounded">WHERE id = $1</code></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button asChild variant="glow" size="lg">
              <Link href="/register">Try It Yourself — It's Free</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// CTA Section
function CTASection() {
  return (
    <section className="py-28 px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="relative max-w-3xl mx-auto">
        <h2 className="text-6xl md:text-7xl font-black tracking-tight text-white mb-6">
          Ready to ship
          <br />
          <span className="gradient-text">perfect code?</span>
        </h2>
        <p className="text-slate-400 text-xl mb-10">
          Join 50,000+ developers using Cortex AI. Free forever. No credit card needed.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="xl" variant="glow">
            <Link href="/register">Start For Free →</Link>
          </Button>
          <Button asChild size="xl" variant="outline">
            <Link href="/login">Sign in to dashboard</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#04060F]">
      <Navbar />
      <Hero />
      <Features />
      <DemoSection />
      <Pricing />
      <Testimonials />
      <CTASection />
      <Footer />
    </main>
  )
}
