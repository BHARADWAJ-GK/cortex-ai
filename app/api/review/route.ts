import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { reviewCode } from "@/lib/ai"
import { reviewSchema } from "@/lib/validations"
import { PLAN_LIMITS } from "@/lib/utils"

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 })
    }

    const body = await req.json()

    // Validate input
    const parsed = reviewSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const { code, language } = parsed.data

    // Get user with plan info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, reviewCount: true },
    })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    // Plan limit check
    const limits = PLAN_LIMITS[user.plan]
    if (user.reviewCount >= limits.reviews) {
      return NextResponse.json(
        { error: `Review limit reached (${limits.reviews}/month). Upgrade to Pro for unlimited reviews.` },
        { status: 429 }
      )
    }

    // Code length check
    if (code.length > limits.codeLength) {
      return NextResponse.json(
        { error: `Code exceeds ${limits.codeLength} character limit for your plan.` },
        { status: 400 }
      )
    }

    // Call AI
    const result = await reviewCode(code, language)

    // Save to database
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        language,
        code,
        feedback: result.feedback,
        score: result.score,
        issueCount: result.issueCount,
        suggestions: result.suggestions,
        severity: result.severity as any,
      },
    })

    // Increment user review count
    await prisma.user.update({
      where: { id: session.user.id },
      data: { reviewCount: { increment: 1 } },
    })

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        ...result,
        createdAt: review.createdAt,
      },
    })
  } catch (error: any) {
    console.error("[REVIEW_ERROR]", error)
    if (error?.status === 529) {
      return NextResponse.json({ error: "AI service is overloaded. Please try again in a moment." }, { status: 503 })
    }
    return NextResponse.json({ error: "Failed to analyze code. Please try again." }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
        select: {
          id: true,
          language: true,
          score: true,
          issueCount: true,
          severity: true,
          createdAt: true,
          feedback: true,
        },
      }),
      prisma.review.count({ where: { userId: session.user.id } }),
    ])

    return NextResponse.json({ reviews, total, page, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    console.error("[REVIEWS_GET_ERROR]", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}
