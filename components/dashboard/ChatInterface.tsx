"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Send, Zap, Bot, User, Copy, Trash2, MessageSquare, Plus } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Chat {
  id: string
  title: string
  updatedAt: string
  _count: { messages: number }
}

const QUICK_PROMPTS = [
  "Explain async/await in JavaScript simply",
  "What is the difference between SQL and NoSQL?",
  "How does JWT authentication work?",
  "Review this code: function foo() { var x = 1; }",
  "Best practices for React performance optimization",
  "Explain Big O notation with examples",
]

function MessageBubble({ msg, index }: { msg: Message; index: number }) {
  const isUser = msg.role === "user"
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(msg.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```|`[^`]+`)/g)
    return parts.map((part, i) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.slice(3, -3).split("\n")
        const lang = lines[0]?.trim()
        const code = lines.slice(1).join("\n")
        return (
          <pre key={i} className="bg-slate-950 border border-slate-700/60 rounded-lg p-3 mt-2 mb-2 overflow-x-auto">
            {lang && <div className="text-xs text-slate-500 font-mono mb-2">{lang}</div>}
            <code className="text-cyan-300 text-xs font-mono leading-relaxed">{code || lines.join("\n")}</code>
          </pre>
        )
      } else if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={i} className="bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>
      }
      // Bold
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g)
      return (
        <span key={i}>
          {boldParts.map((bp, bi) =>
            bp.startsWith("**") && bp.endsWith("**")
              ? <strong key={bi} className="text-white font-semibold">{bp.slice(2, -2)}</strong>
              : <span key={bi}>{bp}</span>
          )}
        </span>
      )
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""} group`}
    >
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
        isUser
          ? "bg-violet-500/20 border border-violet-500/30"
          : "bg-gradient-to-br from-cyan-500 to-violet-600"
      }`}>
        {isUser ? <User className="w-3.5 h-3.5 text-violet-400" /> : <Zap className="w-3.5 h-3.5 text-white" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-violet-500/15 border border-violet-500/20 text-slate-200 rounded-tr-sm"
            : "bg-slate-800/60 border border-slate-700/40 text-slate-300 rounded-tl-sm"
        }`}>
          {renderContent(msg.content)}
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-slate-600 text-[10px]">
            {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <button onClick={copy} className="text-slate-600 hover:text-slate-400 transition-colors">
            <Copy className="w-3 h-3" />
          </button>
          {copied && <span className="text-green-400 text-[10px]">Copied!</span>}
        </div>
      </div>
    </motion.div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center flex-shrink-0">
        <Zap className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-slate-800/60 border border-slate-700/40 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ChatInterface() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey! I'm **Cortex AI** 🚀 — your expert coding assistant.\n\nI can help with:\n- Code review and debugging\n- Explaining concepts clearly\n- Writing functions and algorithms\n- Architecture decisions\n- Best practices and patterns\n\nWhat are you working on today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [chatId, setChatId] = useState<string | undefined>()
  const [chats, setChats] = useState<Chat[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  useEffect(() => {
    fetch("/api/chat").then(r => r.json()).then(d => setChats(d.chats || []))
  }, [])

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput("")

    const userMsg: Message = { role: "user", content: msg, timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, chatId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Chat failed")

      setChatId(data.chatId)
      setMessages((prev) => [...prev, { role: "assistant", content: data.message, timestamp: new Date() }])

      // Refresh chat list
      fetch("/api/chat").then(r => r.json()).then(d => setChats(d.chats || []))
    } catch (err: any) {
      toast({ title: "Failed to send", description: err.message, variant: "destructive" })
      setMessages((prev) => prev.slice(0, -1))
      setInput(msg)
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const newChat = () => {
    setChatId(undefined)
    setMessages([{
      role: "assistant",
      content: "Hey! I'm **Cortex AI** — ready to help! What are you working on?",
      timestamp: new Date(),
    }])
    setSidebarOpen(false)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div className="flex h-[calc(100vh-120px)] gap-4">
      {/* Sidebar — chat history */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-60 glass rounded-2xl border border-slate-700/40 p-3 flex flex-col gap-2 overflow-hidden flex-shrink-0"
          >
            <Button onClick={newChat} variant="outline" size="sm" className="w-full">
              <Plus className="w-3.5 h-3.5" />New Chat
            </Button>
            <div className="text-xs text-slate-600 font-mono px-1 mt-1">HISTORY</div>
            <div className="flex-1 overflow-y-auto space-y-1">
              {chats.map((c) => (
                <button
                  key={c.id}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all truncate ${chatId === c.id ? "bg-slate-800/70 text-white" : ""}`}
                >
                  <div className="truncate">{c.title}</div>
                  <div className="text-slate-600 text-[10px] mt-0.5">{c._count.messages} messages</div>
                </button>
              ))}
              {!chats.length && (
                <p className="text-slate-600 text-xs text-center py-4">No chats yet</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col glass rounded-2xl border border-slate-700/40 overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-800/60 bg-slate-900/30">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-slate-500 hover:text-slate-300">
            <MessageSquare className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-white text-sm font-semibold">Cortex AI</div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Online · Powered by Claude
            </div>
          </div>
          <button onClick={newChat} className="ml-auto text-slate-500 hover:text-slate-300 transition-colors" title="New chat">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} index={i} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div className="px-5 pb-3">
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.slice(0, 3).map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-white hover:border-cyan-500/30 transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-5 pb-5">
          <div className="flex gap-2 items-end bg-slate-900/60 border border-slate-700/50 rounded-xl p-2 focus-within:border-cyan-500/40 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask anything about code... (Enter to send, Shift+Enter for new line)"
              rows={1}
              className="flex-1 bg-transparent text-slate-200 text-sm placeholder:text-slate-600 resize-none focus:outline-none leading-relaxed max-h-32 overflow-y-auto py-1.5 px-2"
              style={{ minHeight: "36px" }}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              size="icon"
              className="flex-shrink-0 w-9 h-9 rounded-lg"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
          <p className="text-slate-700 text-[10px] mt-1.5 text-center">
            Cortex AI can make mistakes. Verify important code independently.
          </p>
        </div>
      </div>
    </div>
  )
}
