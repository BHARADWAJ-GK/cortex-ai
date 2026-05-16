import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#04060F] flex flex-col items-center justify-center text-center px-6">
      <div className="relative mb-8">
        <div className="text-[120px] font-black text-slate-800 leading-none select-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-black gradient-text">404</span>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
      <p className="text-slate-400 max-w-sm mb-8">This page doesn't exist or was moved. Let's get you back on track.</p>
      <div className="flex gap-3">
        <Button asChild><Link href="/">Go home</Link></Button>
        <Button asChild variant="outline"><Link href="/dashboard">Dashboard</Link></Button>
      </div>
    </div>
  )
}
