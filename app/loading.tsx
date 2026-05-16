export default function Loading() {
  return (
    <div className="min-h-screen bg-[#04060F] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="w-12 h-12 rounded-full border-2 border-slate-800" />
          <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-slate-500 text-sm font-mono">Loading Cortex AI...</p>
      </div>
    </div>
  )
}
