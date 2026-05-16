import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const userId = session.user.id

    const [reviews, chats, user] = await Promise.all([
      prisma.review.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, language: true, score: true, severity: true, createdAt: true, issueCount: true },
      }),
      prisma.chat.count({ where: { userId } }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { reviewCount: true, plan: true },
      }),
    ])

    const allReviews = await prisma.review.findMany({
      where: { userId },
      select: { score: true, issueCount: true },
    })

    const avgScore =
      allReviews.length > 0
        ? Math.round(allReviews.reduce((s, r) => s + r.score, 0) / allReviews.length)
        : 0

    const totalIssues = allReviews.reduce((s, r) => s + r.issueCount, 0)

    // Weekly reviews for chart (last 7 days)
    const weeklyData = await Promise.all(
      Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        const start = new Date(date.setHours(0, 0, 0, 0))
        const end = new Date(date.setHours(23, 59, 59, 999))
        return prisma.review.count({ where: { userId, createdAt: { gte: start, lte: end } } })
      })
    )

    return NextResponse.json({
      totalReviews: user?.reviewCount || 0,
      totalChats: chats,
      averageScore: avgScore,
      issuesFound: totalIssues,
      recentReviews: reviews,
      weeklyReviews: weeklyData,
      plan: user?.plan || "FREE",
    })
  } catch (error) {
    console.error("[STATS_ERROR]", error)
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 })
  }
}
