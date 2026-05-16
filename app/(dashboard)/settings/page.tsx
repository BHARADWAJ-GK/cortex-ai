"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { Check, CreditCard, Crown, LogOut, Save, Shield, User, Zap } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"

const PLANS = [
  {
    name: "FREE",
    price: "$0",
    period: "forever",
    features: ["10 reviews/month", "1 repository", "Basic security scan", "Community support"],
    color: "slate",
  },
  {
    name: "PRO",
    price: "$19",
    period: "/month",
    features: ["Unlimited reviews", "25 repositories", "Advanced security scan", "GitHub integration", "Auto docs", "5 team seats", "Priority support"],
    color: "cyan",
    popular: true,
  },
  {
    name: "ENTERPRISE",
    price: "Custom",
    period: "contact us",
    features: ["Everything in Pro", "Unlimited seats", "Dedicated AI", "SSO/SAML", "SLA guarantee", "24/7 support"],
    color: "violet",
  },
]

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "billing">("profile")
  const [form, setForm] = useState({ name: "", bio: "" })
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((d) => {
        setUserData(d.user)
        setForm({ name: d.user?.name || "", bio: d.user?.bio || "" })
      })
  }, [])

  const saveProfile = async () => {
    if (!form.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await update({ name: form.name })
      toast({ title: "Profile saved ✅" })
      setUserData({ ...userData, ...data.user })
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const currentPlan = userData?.plan || "FREE"

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing & Plans", icon: CreditCard },
  ] as const

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-white mb-1">Settings</h1>
        <p className="text-slate-400 text-sm">Manage your account, plan, and preferences.</p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="glass rounded-2xl border border-slate-700/40 p-3 space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "text-slate-500 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}

            <div className="pt-2 border-t border-slate-800/60 mt-2">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
              >
                <LogOut className="w-4 h-4" />Sign out
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-3"
        >
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="glass rounded-2xl border border-slate-700/40 p-6 space-y-6">
              <h2 className="text-white font-bold text-lg">Profile Information</h2>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white text-2xl font-black">
                  {form.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-white font-semibold">{form.name || "Your Name"}</p>
                  <p className="text-slate-500 text-sm">{userData?.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={currentPlan === "PRO" ? "default" : "secondary"} className="text-xs">
                      {currentPlan === "PRO" && <Crown className="w-2.5 h-2.5 mr-1" />}
                      {currentPlan}
                    </Badge>
                    <span className="text-slate-600 text-xs">Member since {userData?.createdAt ? new Date(userData.createdAt).getFullYear() : "2025"}</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    maxLength={50}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" value={userData?.email || ""} disabled className="opacity-50" />
                  <p className="text-xs text-slate-600">Email cannot be changed after registration</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bio">Bio <span className="text-slate-600">(optional)</span></Label>
                  <textarea
                    id="bio"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    maxLength={200}
                    rows={3}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 resize-none focus:outline-none focus:border-cyan-500/60 transition-colors"
                  />
                  <p className="text-xs text-slate-600 text-right">{form.bio.length}/200</p>
                </div>
              </div>

              <Button onClick={saveProfile} loading={loading} className="gap-2">
                <Save className="w-4 h-4" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="glass rounded-2xl border border-slate-700/40 p-6 space-y-6">
              <h2 className="text-white font-bold text-lg">Security</h2>

              <div className="space-y-4">
                {[
                  { label: "Two-Factor Authentication", desc: "Add an extra layer of security", status: "Not enabled", action: "Enable 2FA" },
                  { label: "API Key", desc: `Your personal API key: ${userData?.apiKey?.slice(0, 8)}...`, status: "Active", action: "Regenerate" },
                  { label: "Active Sessions", desc: "Manage where you're signed in", status: "1 active", action: "View all" },
                ].map(({ label, desc, status, action }) => (
                  <div key={label} className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-slate-700/30">
                    <div>
                      <div className="text-white text-sm font-medium">{label}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{desc}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs text-slate-500">{status}</span>
                      <Button variant="outline" size="sm" onClick={() => toast({ title: "Coming soon!", description: "This feature is being built." })}>
                        {action}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                <h3 className="text-red-400 font-semibold text-sm mb-1">Danger Zone</h3>
                <p className="text-slate-400 text-xs mb-3">Permanently delete your account and all data. This cannot be undone.</p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => toast({ title: "Contact support", description: "Email support@cortexai.dev to delete your account." })}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          )}

          {/* BILLING TAB */}
          {activeTab === "billing" && (
            <div className="space-y-4">
              <div className="glass rounded-2xl border border-slate-700/40 p-5">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-white font-bold text-lg">Current Plan</h2>
                  <Badge variant={currentPlan === "PRO" ? "default" : "secondary"}>
                    {currentPlan === "PRO" && <Crown className="w-2.5 h-2.5 mr-1" />}
                    {currentPlan}
                  </Badge>
                </div>
                <p className="text-slate-400 text-sm">
                  {currentPlan === "FREE"
                    ? "You're on the free plan. Upgrade to unlock unlimited reviews."
                    : "You have access to all Pro features. Thank you for subscribing!"}
                </p>
              </div>

              {/* Plan cards */}
              <div className="grid gap-4">
                {PLANS.map((plan) => {
                  const isCurrent = currentPlan === plan.name
                  return (
                    <div
                      key={plan.name}
                      className={`glass rounded-2xl p-5 border transition-all ${
                        isCurrent
                          ? "border-cyan-500/35 bg-cyan-500/5"
                          : "border-slate-700/40 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-bold">{plan.name}</span>
                            {plan.popular && <Badge className="text-[10px]">POPULAR</Badge>}
                            {isCurrent && <Badge variant="success" className="text-[10px]"><Check className="w-2.5 h-2.5 mr-1" />Current</Badge>}
                          </div>
                          <div className="flex items-end gap-1">
                            <span className="text-2xl font-black text-white">{plan.price}</span>
                            <span className="text-slate-500 text-sm mb-0.5">{plan.period}</span>
                          </div>
                        </div>
                        {!isCurrent && (
                          <Button
                            size="sm"
                            variant={plan.name === "PRO" ? "glow" : "outline"}
                            onClick={() => toast({ title: "Payment coming soon!", description: "Stripe integration is being set up." })}
                          >
                            {plan.name === "ENTERPRISE" ? "Contact sales" : `Upgrade to ${plan.name}`}
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {plan.features.map((f) => (
                          <div key={f} className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Zap className="w-3 h-3 text-cyan-500/60 flex-shrink-0" />{f}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
