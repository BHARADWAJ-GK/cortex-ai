import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create demo user
  const hashedPw = await bcrypt.hash("Demo123!", 12)
  const user = await prisma.user.upsert({
    where: { email: "demo@cortexai.dev" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@cortexai.dev",
      password: hashedPw,
      plan: "PRO",
      bio: "Full-stack developer exploring AI-powered tools.",
    },
  })
  console.log("✅ Demo user:", user.email)

  // Seed sample reviews
  const sampleReviews = [
    {
      language: "javascript",
      code: `function fetchUser(id) { const q = "SELECT * FROM users WHERE id = " + id; db.query(q); }`,
      feedback: "**Critical security issue detected.** This code is vulnerable to SQL injection. An attacker can manipulate the `id` parameter to execute arbitrary SQL commands, potentially exposing or destroying your entire database.\n\n**Fix:** Use parameterized queries:\n```js\nconst q = 'SELECT * FROM users WHERE id = $1';\ndb.query(q, [id]);\n```",
      score: 18,
      issueCount: 3,
      suggestions: 3,
      severity: "CRITICAL",
    },
    {
      language: "typescript",
      code: `const fetchData = async (url: string) => { const res = await fetch(url); return res.json(); }`,
      feedback: "**Good structure** — async/await usage is correct. Missing error handling could cause unhandled promise rejections in production.\n\n**Add try/catch and type safety:**\n```ts\nconst fetchData = async <T>(url: string): Promise<T> => {\n  const res = await fetch(url);\n  if (!res.ok) throw new Error(`HTTP ${res.status}`);\n  return res.json() as Promise<T>;\n};\n```",
      score: 72,
      issueCount: 2,
      suggestions: 2,
      severity: "MEDIUM",
    },
    {
      language: "python",
      code: `def add(a, b):\n    return a + b\n\nresult = add(3, 4)\nprint(result)`,
      feedback: "**Clean, minimal code.** Logic is correct. For production, add type hints and docstrings.\n\n```python\ndef add(a: int | float, b: int | float) -> int | float:\n    \"\"\"Return sum of two numbers.\"\"\"\n    return a + b\n```",
      score: 88,
      issueCount: 0,
      suggestions: 2,
      severity: "LOW",
    },
  ]

  for (const r of sampleReviews) {
    await prisma.review.create({
      data: { userId: user.id, ...(r as any) },
    })
  }
  console.log("✅ Sample reviews created:", sampleReviews.length)

  // Seed sample chat
  const chat = await prisma.chat.create({
    data: {
      userId: user.id,
      title: "How to handle async errors in JavaScript?",
      messages: {
        create: [
          { role: "USER", content: "How do I properly handle async errors in JavaScript?" },
          {
            role: "ASSISTANT",
            content:
              "Great question! There are two main patterns:\n\n**1. try/catch with async/await (recommended):**\n```js\nasync function fetchData() {\n  try {\n    const res = await fetch('/api/data');\n    if (!res.ok) throw new Error('Network response failed');\n    return await res.json();\n  } catch (error) {\n    console.error('Error:', error);\n    // Handle or re-throw\n  }\n}\n```\n\n**2. .catch() chaining:**\n```js\nfetch('/api/data')\n  .then(res => res.json())\n  .catch(err => console.error(err));\n```\n\nThe `try/catch` approach is preferred for readability. Always handle errors — unhandled promise rejections crash Node.js in production!",
          },
        ],
      },
    },
  })
  console.log("✅ Sample chat created:", chat.id)

  await prisma.user.update({
    where: { id: user.id },
    data: { reviewCount: sampleReviews.length, chatCount: 1 },
  })

  console.log("\n🎉 Seed complete!")
  console.log("─────────────────────────────────")
  console.log("Demo login: demo@cortexai.dev")
  console.log("Password:   Demo123!")
  console.log("─────────────────────────────────")
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1) })
  .finally(() => prisma.$disconnect())
