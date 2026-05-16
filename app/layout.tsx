import { Cursor } from "@/components/shared/Cursor"
import { Providers } from "@/components/shared/Providers"
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Cortex AI — AI-Powered Code Intelligence Platform",
    template: "%s | Cortex AI",
  },
  description:
    "The AI-native code review & developer intelligence platform. Get instant expert feedback, catch bugs before production, and ship with confidence.",
  keywords: ["AI code review", "developer tools", "code analysis", "AI programming assistant"],
  authors: [{ name: "Cortex AI" }],
  openGraph: {
    title: "Cortex AI — AI-Powered Code Intelligence",
    description: "Catch bugs instantly. Ship better code. Powered by Google GEMINI.",
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Cortex AI",
    description: "AI-Powered Code Intelligence Platform",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="noise">
        <Providers>
          <Cursor />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
