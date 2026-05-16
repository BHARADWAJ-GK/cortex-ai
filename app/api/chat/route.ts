import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { chatWithAI } from "@/lib/ai"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, chatId } = await req.json()
    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Get user plan
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    })

    // Get or create chat
    let chat
    if (chatId) {
      chat = await prisma.chat.findFirst({
        where: { id: chatId, userId: session.user.id },
        include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } },
      })
      if (!chat) return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    } else {
      chat = await prisma.chat.create({
        data: {
          userId: session.user.id,
          title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
          messages: { create: { role: "USER", content: message } },
        },
        include: { messages: true },
      })
    }

    // Add user message if existing chat
    if (chatId) {
      await prisma.message.create({
        data: { chatId: chat.id, role: "USER", content: message },
      })
    }

    // Build message history for AI
    const history = (chat.messages || []).map((m) => ({
      role: m.role === "USER" ? ("user" as const) : ("assistant" as const),
      content: m.content,
    }))

    // If new chat, history already has the user message
    if (chatId) history.push({ role: "user", content: message })

    // Call AI
    const aiResponse = await chatWithAI(history, user?.plan || "FREE")

    // Save AI response
    await prisma.message.create({
      data: { chatId: chat.id, role: "ASSISTANT", content: aiResponse },
    })

    // Update chat title from first message if new
    if (!chatId) {
      await prisma.chat.update({
        where: { id: chat.id },
        data: { updatedAt: new Date() },
      })
    }

    // Increment chat count
    await prisma.user.update({
      where: { id: session.user.id },
      data: { chatCount: { increment: 1 } },
    })

    return NextResponse.json({ success: true, message: aiResponse, chatId: chat.id })
  } catch (error: any) {
    console.error("[CHAT_ERROR]", error)
    return NextResponse.json({ error: "AI response failed. Please try again." }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const chats = await prisma.chat.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 20,
      select: {
        id: true,
        title: true,
        updatedAt: true,
        _count: { select: { messages: true } },
      },
    })

    return NextResponse.json({ chats })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 })
  }
}
