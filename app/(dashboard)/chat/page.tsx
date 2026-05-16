import { ChatInterface } from "@/components/dashboard/ChatInterface"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "AI Assistant" }

export default function ChatPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-5">
        <h1 className="text-3xl font-black text-white mb-1">AI Assistant</h1>
        <p className="text-slate-400 text-sm">Expert coding help, available 24/7. Powered by Google GEMINI.</p>
      </div>
      <ChatInterface />
    </div>
  )
}
